import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from '@prisma/client';
export declare class TasksService {
    private prisma;
    constructor(prisma: PrismaService);
    create(userId: string, createTaskDto: CreateTaskDto): Promise<Task>;
    findAll(userId: string): Promise<Task[]>;
    findOne(id: string, userId: string): Promise<Task>;
    update(id: string, userId: string, updateTaskDto: UpdateTaskDto): Promise<Task>;
    remove(id: string, userId: string): Promise<Task>;
    runTask(id: string, userId: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        summary: import("@prisma/client/runtime/library").JsonValue | null;
        status: import(".prisma/client").$Enums.RunStatus;
        startedAt: Date;
        finishedAt: Date | null;
        taskId: string;
    }>;
    getTaskStats(userId: string): Promise<{
        totalTasks: number;
        activeTasks: number;
        completedRuns: number;
        failedRuns: number;
    }>;
}
