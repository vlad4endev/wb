import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor(private configService: ConfigService) {
    super({
      datasources: {
        db: {
          url: configService.get<string>('DATABASE_URL'),
        },
      },
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  // Helper method to enable RLS for a user
  async enableRLS(userId: string) {
    await this.$executeRaw`SET row_security = on`;
    await this.$executeRaw`SET app.current_user_id = ${userId}`;
  }

  // Helper method to disable RLS
  async disableRLS() {
    await this.$executeRaw`SET row_security = off`;
    await this.$executeRaw`RESET app.current_user_id`;
  }
}
