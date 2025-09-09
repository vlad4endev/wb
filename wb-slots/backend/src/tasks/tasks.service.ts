import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task, RunStatus } from '@prisma/client';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createTaskDto: CreateTaskDto): Promise<Task> {
    return this.prisma.task.create({
      data: {
        userId,
        name: createTaskDto.name,
        description: createTaskDto.description,
        scheduleCron: createTaskDto.schedule,
        filters: createTaskDto.filters,
        enabled: createTaskDto.isActive ?? true,
        autoBook: createTaskDto.autoBook ?? false,
        autoBookSupplyId: createTaskDto.autoBookSupplyId,
        retryPolicy: { maxRetries: 3, backoffMs: 5000 }, // Default retry policy
      },
      include: {
        runs: true,
      },
    });
  }

  async findAll(userId: string): Promise<Task[]> {
    return this.prisma.task.findMany({
      where: { userId },
      include: {
        runs: {
          orderBy: { createdAt: 'desc' },
          take: 5, // Last 5 runs
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, userId: string): Promise<Task> {
    const task = await this.prisma.task.findUnique({
      where: { id },
      include: {
        runs: {
          include: {
            logs: true,
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!task) {
      throw new NotFoundException('Задача не найдена');
    }

    if (task.userId !== userId) {
      throw new ForbiddenException('Доступ запрещен');
    }

    return task;
  }

  async update(id: string, userId: string, updateTaskDto: UpdateTaskDto): Promise<Task> {
    const task = await this.prisma.task.findUnique({
      where: { id },
    });

    if (!task) {
      throw new NotFoundException('Задача не найдена');
    }

    if (task.userId !== userId) {
      throw new ForbiddenException('Доступ запрещен');
    }

    return this.prisma.task.update({
      where: { id },
      data: updateTaskDto,
      include: {
        runs: true,
      },
    });
  }

  async remove(id: string, userId: string): Promise<Task> {
    const task = await this.prisma.task.findUnique({
      where: { id },
    });

    if (!task) {
      throw new NotFoundException('Задача не найдена');
    }

    if (task.userId !== userId) {
      throw new ForbiddenException('Доступ запрещен');
    }

    return this.prisma.task.delete({
      where: { id },
    });
  }

  async runTask(id: string, userId: string) {
    const task = await this.findOne(id, userId);

    // Create a new run
    const run = await this.prisma.run.create({
      data: {
        task: {
          connect: { id: id }
        },
        user: {
          connect: { id: userId }
        },
        status: RunStatus.QUEUED,
        startedAt: new Date(),
      },
    });

    // TODO: Add task to queue for processing
    // This would integrate with BullMQ to schedule the actual task execution

    return run;
  }

  async getTaskStats(userId: string) {
    const totalTasks = await this.prisma.task.count({
      where: { userId },
    });

    const activeTasks = await this.prisma.task.count({
      where: { 
        userId,
        // Note: isActive field doesn't exist in the schema, removing this filter
      },
    });

    const completedRuns = await this.prisma.run.count({
      where: {
        task: { userId },
        status: RunStatus.SUCCESS,
      },
    });

    const failedRuns = await this.prisma.run.count({
      where: {
        task: { userId },
        status: RunStatus.FAILED,
      },
    });

    return {
      totalTasks,
      activeTasks,
      completedRuns,
      failedRuns,
    };
  }
}
