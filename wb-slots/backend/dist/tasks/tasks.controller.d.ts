import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
export declare class TasksController {
    private readonly tasksService;
    constructor(tasksService: TasksService);
    create(req: any, createTaskDto: CreateTaskDto): Promise<{
        description: string | null;
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        enabled: boolean;
        filters: import("@prisma/client/runtime/library").JsonValue;
        autoBook: boolean;
        autoBookSupplyId: string | null;
        scheduleCron: string | null;
        retryPolicy: import("@prisma/client/runtime/library").JsonValue;
        priority: number;
    }>;
    findAll(req: any): Promise<{
        description: string | null;
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        enabled: boolean;
        filters: import("@prisma/client/runtime/library").JsonValue;
        autoBook: boolean;
        autoBookSupplyId: string | null;
        scheduleCron: string | null;
        retryPolicy: import("@prisma/client/runtime/library").JsonValue;
        priority: number;
    }[]>;
    getStats(req: any): Promise<{
        totalTasks: number;
        activeTasks: number;
        completedRuns: number;
        failedRuns: number;
    }>;
    findOne(id: string, req: any): Promise<{
        description: string | null;
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        enabled: boolean;
        filters: import("@prisma/client/runtime/library").JsonValue;
        autoBook: boolean;
        autoBookSupplyId: string | null;
        scheduleCron: string | null;
        retryPolicy: import("@prisma/client/runtime/library").JsonValue;
        priority: number;
    }>;
    update(id: string, req: any, updateTaskDto: UpdateTaskDto): Promise<{
        description: string | null;
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        enabled: boolean;
        filters: import("@prisma/client/runtime/library").JsonValue;
        autoBook: boolean;
        autoBookSupplyId: string | null;
        scheduleCron: string | null;
        retryPolicy: import("@prisma/client/runtime/library").JsonValue;
        priority: number;
    }>;
    remove(id: string, req: any): Promise<{
        description: string | null;
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        enabled: boolean;
        filters: import("@prisma/client/runtime/library").JsonValue;
        autoBook: boolean;
        autoBookSupplyId: string | null;
        scheduleCron: string | null;
        retryPolicy: import("@prisma/client/runtime/library").JsonValue;
        priority: number;
    }>;
    runTask(id: string, req: any): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        summary: import("@prisma/client/runtime/library").JsonValue | null;
<<<<<<< Updated upstream
        status: import(".prisma/client").$Enums.RunStatus;
        startedAt: Date;
        finishedAt: Date | null;
        taskId: string;
=======
        taskId: string;
        status: import(".prisma/client").$Enums.RunStatus;
        startedAt: Date;
        finishedAt: Date | null;
>>>>>>> Stashed changes
    }>;
}
