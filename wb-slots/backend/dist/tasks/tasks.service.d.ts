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
<<<<<<< Updated upstream
<<<<<<< Updated upstream
        status: import(".prisma/client").$Enums.RunStatus;
        startedAt: Date;
        finishedAt: Date | null;
        taskId: string;
=======
=======
>>>>>>> Stashed changes
        taskId: string;
        status: import(".prisma/client").$Enums.RunStatus;
        startedAt: Date;
        finishedAt: Date | null;
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
    }>;
    getTaskStats(userId: string): Promise<{
        totalTasks: number;
        activeTasks: number;
        completedRuns: number;
        failedRuns: number;
    }>;
}
