import { Queue, Worker, Job, QueueOptions, WorkerOptions } from 'bullmq';
import { Redis } from 'ioredis';
import { prisma } from './prisma';
import { WBClientFactory } from './wb-client';
import { decrypt } from './encryption';
import { LogLevel, RunStatus } from '@prisma/client';

// Redis connection
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

// Queue names
export const QUEUE_NAMES = {
  SCAN_SLOTS: 'scan-slots',
  BOOK_SLOT: 'book-slot',
  NOTIFY: 'notify',
} as const;

// Job data interfaces
export interface ScanSlotsJobData {
  taskId: string;
  userId: string;
  runId: string;
}

export interface BookSlotJobData {
  taskId: string;
  userId: string;
  runId: string;
  slotData: {
    warehouseId: number;
    date: string;
    coefficient: number;
  };
}

export interface NotifyJobData {
  userId: string;
  type: 'slot_found' | 'slot_booked' | 'task_failed' | 'task_completed';
  data: any;
}

// Queue options
const queueOptions: QueueOptions = {
  connection: redis,
  defaultJobOptions: {
    removeOnComplete: 100,
    removeOnFail: 50,
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000,
    },
  },
};

// Worker options
const workerOptions: WorkerOptions = {
  connection: redis,
  concurrency: 5,
};

// Create queues
export const scanSlotsQueue = new Queue<ScanSlotsJobData>(QUEUE_NAMES.SCAN_SLOTS, queueOptions);
export const bookSlotQueue = new Queue<BookSlotJobData>(QUEUE_NAMES.BOOK_SLOT, queueOptions);
export const notifyQueue = new Queue<NotifyJobData>(QUEUE_NAMES.NOTIFY, queueOptions);

// Scan slots worker
export const scanSlotsWorker = new Worker<ScanSlotsJobData>(
  QUEUE_NAMES.SCAN_SLOTS,
  async (job: Job<ScanSlotsJobData>) => {
    const { taskId, userId, runId } = job.data;
    
    try {
      // Update run status to running
      await prisma.run.update({
        where: { id: runId },
        data: { status: 'RUNNING' },
      });

      // Log start
      await logRunMessage(runId, 'INFO', 'Starting slot scan', { taskId, userId });

      // Get task details
      const task = await prisma.task.findUnique({
        where: { id: taskId },
        include: { user: true },
      });

      if (!task) {
        throw new Error('Task not found');
      }

      // Get user's supplies token
      const suppliesToken = await prisma.userToken.findFirst({
        where: {
          userId,
          category: 'SUPPLIES',
          isActive: true,
        },
      });

      if (!suppliesToken) {
        throw new Error('No active supplies token found');
      }

      // Decrypt token
      const decryptedToken = decrypt(suppliesToken.tokenEncrypted);

      // Create WB client
      const wbClient = WBClientFactory.createSuppliesClient(decryptedToken);

      // Parse task filters
      const filters = task.filters as any;
      const { warehouseIds, boxTypeIds, dates, coefficientAllowed, allowUnload } = filters;

      // Search for available slots
      const availableSlots = await wbClient.searchAvailableSlots(
        warehouseIds,
        boxTypeIds,
        dates?.from || new Date().toISOString(),
        dates?.to || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        Math.min(...coefficientAllowed),
        allowUnload
      );

      await logRunMessage(runId, 'INFO', `Found ${availableSlots.length} available slots`, {
        slots: availableSlots,
      });

      // Update task with found slots
      const summary = {
        foundSlots: availableSlots.length,
        slots: availableSlots,
        scannedAt: new Date().toISOString(),
      };

      await prisma.run.update({
        where: { id: runId },
        data: {
          status: 'SUCCESS',
          finishedAt: new Date(),
          summary,
        },
      });

      // If auto-book is enabled and slots found, queue booking jobs
      if (task.autoBook && availableSlots.length > 0) {
        for (const slot of availableSlots) {
          await bookSlotQueue.add('book-slot', {
            taskId,
            userId,
            runId,
            slotData: {
              warehouseId: slot.warehouseId,
              date: slot.date,
              coefficient: slot.coefficient,
            },
          });
        }
      }

      // Send notification if slots found
      if (availableSlots.length > 0) {
        await notifyQueue.add('notify', {
          userId,
          type: 'slot_found',
          data: {
            taskId,
            taskName: task.name,
            slotsCount: availableSlots.length,
            slots: availableSlots,
          },
        });
      }

      await logRunMessage(runId, 'INFO', 'Slot scan completed successfully', summary);

    } catch (error) {
      console.error('Scan slots job error:', error);
      
      await logRunMessage(runId, 'ERROR', 'Slot scan failed', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });

      await prisma.run.update({
        where: { id: runId },
        data: {
          status: 'FAILED',
          finishedAt: new Date(),
          summary: {
            error: error instanceof Error ? error.message : 'Unknown error',
            failedAt: new Date().toISOString(),
          },
        },
      });

      // Send failure notification
      await notifyQueue.add('notify', {
        userId,
        type: 'task_failed',
        data: {
          taskId,
          error: error instanceof Error ? error.message : 'Unknown error',
        },
      });

      throw error;
    }
  },
  workerOptions
);

// Book slot worker
export const bookSlotWorker = new Worker<BookSlotJobData>(
  QUEUE_NAMES.BOOK_SLOT,
  async (job: Job<BookSlotJobData>) => {
    const { taskId, userId, runId, slotData } = job.data;
    
    try {
      await logRunMessage(runId, 'INFO', 'Starting slot booking', { slotData });

      // For now, we can only log the slot booking attempt
      // In the future, this would integrate with WB's booking API or UI automation
      
      await logRunMessage(runId, 'WARN', 'Slot booking not implemented yet - would book slot', {
        slotData,
        note: 'This would integrate with WB booking API or UI automation',
      });

      // TODO: Implement actual slot booking when WB provides the API
      // or implement UI automation fallback

      await logRunMessage(runId, 'INFO', 'Slot booking completed (simulated)', { slotData });

    } catch (error) {
      console.error('Book slot job error:', error);
      
      await logRunMessage(runId, 'ERROR', 'Slot booking failed', {
        error: error instanceof Error ? error.message : 'Unknown error',
        slotData,
      });

      throw error;
    }
  },
  workerOptions
);

// Notify worker
export const notifyWorker = new Worker<NotifyJobData>(
  QUEUE_NAMES.NOTIFY,
  async (job: Job<NotifyJobData>) => {
    const { userId, type, data } = job.data;
    
    try {
      // Get user's notification channels
      const channels = await prisma.notificationChannel.findMany({
        where: {
          userId,
          enabled: true,
        },
      });

      if (channels.length === 0) {
        console.log(`No notification channels configured for user ${userId}`);
        return;
      }

      // Send notifications through all enabled channels
      for (const channel of channels) {
        try {
          await sendNotification(channel, type, data);
        } catch (error) {
          console.error(`Failed to send notification via ${channel.type}:`, error);
        }
      }

    } catch (error) {
      console.error('Notify job error:', error);
      throw error;
    }
  },
  workerOptions
);

// Helper function to log run messages
async function logRunMessage(
  runId: string,
  level: LogLevel,
  message: string,
  meta?: any
): Promise<void> {
  await prisma.runLog.create({
    data: {
      runId,
      level,
      message,
      meta: meta ? JSON.stringify(meta) : null,
    },
  });
}

// Helper function to send notifications
async function sendNotification(
  channel: any,
  type: string,
  data: any
): Promise<void> {
  const config = channel.config as any;

  switch (channel.type) {
    case 'EMAIL':
      // TODO: Implement email notification
      console.log(`Email notification to ${config.email}: ${type}`, data);
      break;
    
    case 'TELEGRAM':
      // TODO: Implement Telegram notification
      console.log(`Telegram notification to ${config.chatId}: ${type}`, data);
      break;
    
    case 'WEBHOOK':
      // TODO: Implement webhook notification
      console.log(`Webhook notification to ${config.url}: ${type}`, data);
      break;
    
    default:
      console.log(`Unknown notification type: ${channel.type}`);
  }
}

// Error handlers
scanSlotsWorker.on('error', (error) => {
  console.error('Scan slots worker error:', error);
});

bookSlotWorker.on('error', (error) => {
  console.error('Book slot worker error:', error);
});

notifyWorker.on('error', (error) => {
  console.error('Notify worker error:', error);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down workers...');
  await scanSlotsWorker.close();
  await bookSlotWorker.close();
  await notifyWorker.close();
  await redis.quit();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('Shutting down workers...');
  await scanSlotsWorker.close();
  await bookSlotWorker.close();
  await notifyWorker.close();
  await redis.quit();
  process.exit(0);
});
