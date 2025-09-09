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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let UsersService = class UsersService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createUserDto) {
        return this.prisma.user.create({
            data: createUserDto,
        });
    }
    async findById(id) {
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
            throw new common_1.NotFoundException('Пользователь не найден');
        }
        return user;
    }
    async findByEmail(email) {
        return this.prisma.user.findUnique({
            where: { email },
        });
    }
    async findByPhone(phone) {
        if (!phone)
            return null;
        return this.prisma.user.findUnique({
            where: { phone },
        });
    }
    async findByEmailOrPhone(email, phone) {
        if (!email && !phone)
            return null;
        const whereConditions = [];
        if (email)
            whereConditions.push({ email });
        if (phone)
            whereConditions.push({ phone });
        return this.prisma.user.findFirst({
            where: {
                OR: whereConditions,
            },
        });
    }
    async update(id, updateUserDto) {
        const user = await this.prisma.user.findUnique({
            where: { id },
        });
        if (!user) {
            throw new common_1.NotFoundException('Пользователь не найден');
        }
        return this.prisma.user.update({
            where: { id },
            data: updateUserDto,
        });
    }
    async remove(id) {
        const user = await this.prisma.user.findUnique({
            where: { id },
        });
        if (!user) {
            throw new common_1.NotFoundException('Пользователь не найден');
        }
        return this.prisma.user.delete({
            where: { id },
        });
    }
    async getUserTokens(userId) {
        return this.prisma.userToken.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
    }
    async getUserWarehouses(userId) {
        return this.prisma.warehousePref.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersService);
//# sourceMappingURL=users.service.js.map