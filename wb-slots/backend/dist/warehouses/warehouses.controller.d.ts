import { WarehousesService } from './warehouses.service';
import { CreateWarehouseDto } from './dto/create-warehouse.dto';
import { UpdateWarehouseDto } from './dto/update-warehouse.dto';
export declare class WarehousesController {
    private readonly warehousesService;
    constructor(warehousesService: WarehousesService);
    create(req: any, createWarehouseDto: CreateWarehouseDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        warehouseId: number;
        warehouseName: string;
        enabled: boolean;
        boxAllowed: boolean;
        monopalletAllowed: boolean;
        supersafeAllowed: boolean;
    }>;
    findAll(req: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        warehouseId: number;
        warehouseName: string;
        enabled: boolean;
        boxAllowed: boolean;
        monopalletAllowed: boolean;
        supersafeAllowed: boolean;
    }[]>;
    findOne(id: string, req: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        warehouseId: number;
        warehouseName: string;
        enabled: boolean;
        boxAllowed: boolean;
        monopalletAllowed: boolean;
        supersafeAllowed: boolean;
    }>;
    update(id: string, req: any, updateWarehouseDto: UpdateWarehouseDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        warehouseId: number;
        warehouseName: string;
        enabled: boolean;
        boxAllowed: boolean;
        monopalletAllowed: boolean;
        supersafeAllowed: boolean;
    }>;
    remove(id: string, req: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        warehouseId: number;
        warehouseName: string;
        enabled: boolean;
        boxAllowed: boolean;
        monopalletAllowed: boolean;
        supersafeAllowed: boolean;
    }>;
    toggleActive(id: string, req: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        warehouseId: number;
        warehouseName: string;
        enabled: boolean;
        boxAllowed: boolean;
        monopalletAllowed: boolean;
        supersafeAllowed: boolean;
    }>;
}
