import {
  ForbiddenException,
  Inject,
  Injectable,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { S3Service } from '../storage/s3.service';
import { UserSession } from '@thallesp/nestjs-better-auth';
import { auth } from '@/lib/auth';
import { Request } from 'express';
import { AuthenticatedRequest } from '../../common/types';
import { PrismaService } from '../../prisma.service';
import { publishEvent } from '@/lib/rabbit-connection';
import { GetUsersDto } from './dto/get-users.dto';

@Injectable()
export class UsersService {
  constructor(
    @Inject(S3Service) private readonly s3Service: S3Service,
    @Inject(PrismaService) private prisma: PrismaService,
  ) {}
  private readonly logger = new Logger(UsersService.name);

  async getUsers(req: Request, query: GetUsersDto) {
    const {
      search,
      searchBy = 'name',
      sortBy = 'name',
      sortDirection = 'desc',
      limit,
      offset,
    } = query;
    return await auth.api.listUsers({
      query: {
        searchField: searchBy,
        searchValue: search,
        searchOperator: 'contains',
        sortBy,
        sortDirection,
        limit,
        offset,
      },
      //   searchValue: 'some name',
      //   searchField: 'name',
      //   searchOperator: 'contains',
      //   limit: 100,
      //   offset: 100,
      //   sortBy: 'name',
      //   sortDirection: 'desc',
      //   filterField: 'email',
      //   filterValue: 'hello@example.com',
      //   filterOperator: 'eq',
      // },
      headers: { cookie: req.headers.cookie || '' },
    });
  }

  async update(
    req: Request,
    session: UserSession,
    file?: Express.Multer.File,
    updateProfileDto?: UpdateProfileDto,
  ) {
    const userId = session.user.id;
    const updateData: { name?: string; image?: string } = {};
    if (file) {
      const key = `${userId}-${file.originalname}`;
      updateData.image = await this.s3Service.uploadFile(file, key);
    }

    if (updateProfileDto?.name) {
      updateData.name = updateProfileDto.name;
    }

    return await auth.api.updateUser({
      body: updateData,
      headers: {
        cookie: req.headers.cookie || '',
      },
    });
  }

  async softDelete(
    req: AuthenticatedRequest,
    session: UserSession,
    id: string,
  ) {
    const { user } = session;
    const headers = { cookie: req.headers.cookie || '' };
    const sessionToken = req.session.session.token;

    if (id !== user.id) {
      throw new ForbiddenException('You can only deactivate your own account');
    }

    if (!sessionToken) {
      throw new UnauthorizedException('Session token not found');
    }

    const deletedAt = new Date();
    const formattedDate = new Date().toLocaleString('en-US');

    await auth.api.updateUser({
      body: { deletedAt },
      headers,
    });

    await publishEvent('user_deactivated', {
      email: user.email,
      context: { reactivationDeadline: formattedDate, fullName: user.name },
    });

    return { success: true, formattedDate };
  }

  async updateLastLoginAt(userId: string, loginAt: Date) {
    try {
      return await this.prisma.user.update({
        where: { id: userId },
        data: { lastLoginAt: loginAt },
      });
    } catch (e) {
      this.logger.error(`Failed to update lastLoginAt for user ${userId}`, e);
    }
  }
}
