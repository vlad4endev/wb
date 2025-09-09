import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from '@prisma/client';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createUserDto: CreateUserDto): Promise<User>;
    findById(id: string): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    findByPhone(phone: string): Promise<User | null>;
    findByEmailOrPhone(email?: string, phone?: string): Promise<User | null>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<User>;
    remove(id: string): Promise<User>;
    getUserTokens(userId: string): Promise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        category: import(".prisma/client").$Enums.TokenCategory;
        tokenEncrypted: string;
        lastUsedAt: Date | null;
    }[]>;
    getUserWarehouses(userId: string): Promise<{
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
}
