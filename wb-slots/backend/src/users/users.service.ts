import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    return this.prisma.user.create({
      data: createUserDto,
    });
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        tokens: true,
        warehousePrefs: true,
        tasks: {
          include: {
            runs: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findByPhone(phone: string): Promise<User | null> {
    if (!phone) return null;
    
    return this.prisma.user.findUnique({
      where: { phone },
    });
  }

  async findByEmailOrPhone(email?: string, phone?: string): Promise<User | null> {
    if (!email && !phone) return null;

    const whereConditions = [];
    if (email) whereConditions.push({ email });
    if (phone) whereConditions.push({ phone });

    return this.prisma.user.findFirst({
      where: {
        OR: whereConditions,
      },
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  async remove(id: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    return this.prisma.user.delete({
      where: { id },
    });
  }

  async getUserTokens(userId: string) {
    return this.prisma.userToken.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getUserWarehouses(userId: string) {
    return this.prisma.warehousePref.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
