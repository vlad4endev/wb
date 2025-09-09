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
exports.WarehousesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let WarehousesService = class WarehousesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userId, createWarehouseDto) {
        return this.prisma.warehousePref.create({
            data: {
                userId,
                warehouseId: createWarehouseDto.warehouseId,
                warehouseName: createWarehouseDto.warehouseName,
                enabled: createWarehouseDto.enabled ?? true,
                boxAllowed: createWarehouseDto.boxAllowed ?? true,
                monopalletAllowed: createWarehouseDto.monopalletAllowed ?? true,
                supersafeAllowed: createWarehouseDto.supersafeAllowed ?? true,
            },
        });
    }
    async findAll(userId) {
        return this.prisma.warehousePref.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findOne(id, userId) {
        const warehouse = await this.prisma.warehousePref.findUnique({
            where: { id },
        });
        if (!warehouse) {
            throw new common_1.NotFoundException('Склад не найден');
        }
        if (warehouse.userId !== userId) {
            throw new common_1.ForbiddenException('Доступ запрещен');
        }
        return warehouse;
    }
    async update(id, userId, updateWarehouseDto) {
        const warehouse = await this.prisma.warehousePref.findUnique({
            where: { id },
        });
        if (!warehouse) {
            throw new common_1.NotFoundException('Склад не найден');
        }
        if (warehouse.userId !== userId) {
            throw new common_1.ForbiddenException('Доступ запрещен');
        }
        return this.prisma.warehousePref.update({
            where: { id },
            data: {
                warehouseId: updateWarehouseDto.warehouseId,
                warehouseName: updateWarehouseDto.warehouseName,
                enabled: updateWarehouseDto.enabled,
                boxAllowed: updateWarehouseDto.boxAllowed,
                monopalletAllowed: updateWarehouseDto.monopalletAllowed,
                supersafeAllowed: updateWarehouseDto.supersafeAllowed,
            },
        });
    }
    async remove(id, userId) {
        const warehouse = await this.prisma.warehousePref.findUnique({
            where: { id },
        });
        if (!warehouse) {
            throw new common_1.NotFoundException('Склад не найден');
        }
        if (warehouse.userId !== userId) {
            throw new common_1.ForbiddenException('Доступ запрещен');
        }
        return this.prisma.warehousePref.delete({
            where: { id },
        });
    }
    async toggleActive(id, userId) {
        const warehouse = await this.findOne(id, userId);
        return this.prisma.warehousePref.update({
            where: { id },
            data: {
                enabled: !warehouse.enabled,
            },
        });
    }
};
exports.WarehousesService = WarehousesService;
exports.WarehousesService = WarehousesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], WarehousesService);
//# sourceMappingURL=warehouses.service.js.map