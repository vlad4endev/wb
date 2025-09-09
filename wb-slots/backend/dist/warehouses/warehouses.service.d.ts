import { PrismaService } from '../prisma/prisma.service';
import { CreateWarehouseDto } from './dto/create-warehouse.dto';
import { UpdateWarehouseDto } from './dto/update-warehouse.dto';
import { WarehousePref } from '@prisma/client';
export declare class WarehousesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(userId: string, createWarehouseDto: CreateWarehouseDto): Promise<WarehousePref>;
    findAll(userId: string): Promise<WarehousePref[]>;
    findOne(id: string, userId: string): Promise<WarehousePref>;
    update(id: string, userId: string, updateWarehouseDto: UpdateWarehouseDto): Promise<WarehousePref>;
    remove(id: string, userId: string): Promise<WarehousePref>;
    toggleActive(id: string, userId: string): Promise<WarehousePref>;
}
