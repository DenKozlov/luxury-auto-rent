import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class TestingService {
  constructor(@Inject(PrismaService) private prisma: PrismaService) {}

  async resetTestDatabase() {
    await this.prisma.session.deleteMany({});
    await this.prisma.account.deleteMany({});
    await this.prisma.verification.deleteMany({});
    await this.prisma.user.deleteMany({});

    return {
      success: true,
    };
  }
}
