import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, phone, password, name } = registerDto;

    // Check if user already exists
    const existingUser = await this.usersService.findByEmailOrPhone(email, phone);
    if (existingUser) {
      if (existingUser.email === email) {
        throw new ConflictException('Пользователь с таким email уже существует');
      }
      if (phone && existingUser.phone === phone) {
        throw new ConflictException('Пользователь с таким телефоном уже существует');
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await this.usersService.create({
      email,
      phone,
      passwordHash: hashedPassword,
      name,
    });

    // Generate JWT token
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

  async login(loginDto: LoginDto) {
    const { email, phone, password } = loginDto;
    
    // Find user by email or phone
    const user = await this.usersService.findByEmailOrPhone(email, phone);
    if (!user) {
      throw new UnauthorizedException('Неверные учетные данные');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Неверные учетные данные');
    }

    // Generate JWT token
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

  async validateUser(email: string, phone: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmailOrPhone(email, phone);
    if (user && await bcrypt.compare(password, user.passwordHash)) {
      const { passwordHash, ...result } = user;
      return result;
    }
    return null;
  }

  async getProfile(userId: string) {
    return this.usersService.findById(userId);
  }
}
