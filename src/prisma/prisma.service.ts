import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  async exists<Model extends { count: any }>(
    model: Model,
    args: Parameters<Model['count']>[0],
  ) {
    const count = await model.count(args);
    return Boolean(count);
  }
}
