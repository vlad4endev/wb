"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TasksService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let TasksService = class TasksService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userId, createTaskDto) {
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
                retryPolicy: { maxRetries: 3, backoffMs: 5000 },
            },
            include: {
                runs: true,
            },
        });
    }
    async findAll(userId) {
        return this.prisma.task.findMany({
            where: { userId },
            include: {
                runs: {
                    orderBy: { createdAt: 'desc' },
                    take: 5,
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findOne(id, userId) {
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
            throw new common_1.NotFoundException('Задача не найдена');
        }
        if (task.userId !== userId) {
            throw new common_1.ForbiddenException('Доступ запрещен');
        }
        return task;
    }
    async update(id, userId, updateTaskDto) {
        const task = await this.prisma.task.findUnique({
            where: { id },
        });
        if (!task) {
            throw new common_1.NotFoundException('Задача не найдена');
        }
        if (task.userId !== userId) {
            throw new common_1.ForbiddenException('Доступ запрещен');
        }
        return this.prisma.task.update({
            where: { id },
            data: updateTaskDto,
            include: {
                runs: true,
            },
        });
    }
    async remove(id, userId) {
        const task = await this.prisma.task.findUnique({
            where: { id },
        });
        if (!task) {
            throw new common_1.NotFoundException('Задача не найдена');
        }
        if (task.userId !== userId) {
            throw new common_1.ForbiddenException('Доступ запрещен');
        }
        return this.prisma.task.delete({
            where: { id },
        });
    }
    async runTask(id, userId) {
        const task = await this.findOne(id, userId);
        const run = await this.prisma.run.create({
            data: {
                task: {
                    connect: { id: id }
                },
                user: {
                    connect: { id: userId }
                },
                status: client_1.RunStatus.QUEUED,
                startedAt: new Date(),
            },
        });
        return run;
    }
    async getTaskStats(userId) {
        const totalTasks = await this.prisma.task.count({
            where: { userId },
        });
        const activeTasks = await this.prisma.task.count({
            where: {
                userId,
            },
        });
        const completedRuns = await this.prisma.run.count({
            where: {
                task: { userId },
                status: client_1.RunStatus.SUCCESS,
            },
        });
        const failedRuns = await this.prisma.run.count({
            where: {
                task: { userId },
                status: client_1.RunStatus.FAILED,
            },
        });
        return {
            totalTasks,
            activeTasks,
            completedRuns,
            failedRuns,
        };
    }
};
exports.TasksService = TasksService;
exports.TasksService = TasksService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TasksService);
//# sourceMappingURL=tasks.service.js.map