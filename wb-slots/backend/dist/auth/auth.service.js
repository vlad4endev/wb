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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const bcrypt = require("bcryptjs");
const users_service_1 = require("../users/users.service");
let AuthService = class AuthService {
    constructor(usersService, jwtService, configService) {
        this.usersService = usersService;
        this.jwtService = jwtService;
        this.configService = configService;
    }
    async register(registerDto) {
        const { email, phone, password, name } = registerDto;
        const existingUser = await this.usersService.findByEmailOrPhone(email, phone);
        if (existingUser) {
            if (existingUser.email === email) {
                throw new common_1.ConflictException('Пользователь с таким email уже существует');
            }
            if (phone && existingUser.phone === phone) {
                throw new common_1.ConflictException('Пользователь с таким телефоном уже существует');
            }
        }
        const hashedPassword = await bcrypt.hash(password, 12);
        const user = await this.usersService.create({
            email,
            phone,
            passwordHash: hashedPassword,
            name,
        });
        const payload = {
            sub: user.id,
            email: user.email,
            phone: user.phone,
            role: user.role
        };
        const token = this.jwtService.sign(payload);
        return {
            user: {
                id: user.id,
                email: user.email,
                phone: user.phone,
                name: user.name,
                role: user.role,
            },
            token,
        };
    }
    async login(loginDto) {
        const { email, phone, password } = loginDto;
        const user = await this.usersService.findByEmailOrPhone(email, phone);
        if (!user) {
            throw new common_1.UnauthorizedException('Неверные учетные данные');
        }
        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Неверные учетные данные');
        }
        const payload = {
            sub: user.id,
            email: user.email,
            phone: user.phone,
            role: user.role
        };
        const token = this.jwtService.sign(payload);
        return {
            user: {
                id: user.id,
                email: user.email,
                phone: user.phone,
                name: user.name,
                role: user.role,
            },
            token,
        };
    }
    async validateUser(email, phone, password) {
        const user = await this.usersService.findByEmailOrPhone(email, phone);
        if (user && await bcrypt.compare(password, user.passwordHash)) {
            const { passwordHash, ...result } = user;
            return result;
        }
        return null;
    }
    async getProfile(userId) {
        return this.usersService.findById(userId);
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map