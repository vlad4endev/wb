import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateWarehouseDto } from './dto/create-warehouse.dto';
import { UpdateWarehouseDto } from './dto/update-warehouse.dto';
import { WarehousePref } from '@prisma/client';

@Injectable()
export class WarehousesService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createWarehouseDto: CreateWarehouseDto): Promise<WarehousePref> {
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

  async findAll(userId: string): Promise<WarehousePref[]> {
    return this.prisma.warehousePref.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, userId: string): Promise<WarehousePref> {
    const warehouse = await this.prisma.warehousePref.findUnique({
      where: { id },
    });

    if (!warehouse) {
      throw new NotFoundException('Склад не найден');
    }

    if (warehouse.userId !== userId) {
      throw new ForbiddenException('Доступ запрещен');
    }

    return warehouse;
  }

  async update(id: string, userId: string, updateWarehouseDto: UpdateWarehouseDto): Promise<WarehousePref> {
    const warehouse = await this.prisma.warehousePref.findUnique({
      where: { id },
    });

    if (!warehouse) {
      throw new NotFoundException('Склад не найден');
    }

    if (warehouse.userId !== userId) {
      throw new ForbiddenException('Доступ запрещен');
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

  async remove(id: string, userId: string): Promise<WarehousePref> {
    const warehouse = await this.prisma.warehousePref.findUnique({
      where: { id },
    });

    if (!warehouse) {
      throw new NotFoundException('Склад не найден');
    }

    if (warehouse.userId !== userId) {
      throw new ForbiddenException('Доступ запрещен');
    }

    return this.prisma.warehousePref.delete({
      where: { id },
    });
  }

  async toggleActive(id: string, userId: string): Promise<WarehousePref> {
    const warehouse = await this.findOne(id, userId);

    return this.prisma.warehousePref.update({
      where: { id },
      data: {
        enabled: !warehouse.enabled,
      },
    });
  }
}
