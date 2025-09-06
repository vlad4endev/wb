import { TaskScheduler } from '@/lib/scheduler';
import { scanSlotsWorker, bookSlotWorker, notifyWorker } from '@/lib/queue';

console.log('Starting WB Slots workers...');

// Initialize scheduler
const scheduler = TaskScheduler.getInstance();

// Start scheduler
scheduler.start().catch(console.error);

// Log worker status
console.log('Workers started:');
console.log('- Scan slots worker');
console.log('- Book slot worker');
console.log('- Notify worker');
console.log('- Task scheduler');

// Keep the process alive
process.on('SIGINT', async () => {
  console.log('Shutting down workers...');
  await scheduler.stop();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('Shutting down workers...');
  await scheduler.stop();
  process.exit(0);
});
