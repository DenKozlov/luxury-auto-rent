import { Inject, Injectable, Logger } from '@nestjs/common';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { S3Service } from '../storage/s3.service';
import { UserSession } from '@thallesp/nestjs-better-auth';
import { auth } from '@/lib/auth';
import { Request } from 'express';
import { AuthenticatedRequest } from '../../common/types';
import { PrismaService } from '../../prisma.service';
import { publishEvent } from '@/lib/rabbit-connection';
import { GetUsersDto } from './dto/get-users.dto';
import { type User } from 'better-auth';
import { PermissionGuardService } from '../shared/permissions-guard.service';

@Injectable()
export class UsersService {
  constructor(
    @Inject(S3Service) private readonly s3Service: S3Service,
    @Inject(PrismaService) private prisma: PrismaService,
    @Inject(PermissionGuardService)
    private readonly permissionGuard: PermissionGuardService,
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
        filterField: 'role',
        filterValue: 'superAdmin',
        filterOperator: 'ne',
      },
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

  async softDeleteMe(req: AuthenticatedRequest, user: User) {
    const headers = { cookie: req.headers.cookie || '' };

    const deletedAt = new Date();
    const formattedDate = new Date().toLocaleString('en-US');

    await auth.api.updateUser({
      body: { deletedAt, status: 'DEACTIVATED' },
      headers,
    });

    await publishEvent('user_deactivated', {
      email: user.email,
      context: { reactivationDeadline: formattedDate, fullName: user.name },
    });

    return { success: true, formattedDate };
  }

  async softDeleteUser(req: AuthenticatedRequest, id: string) {
    const headers = { cookie: req.headers.cookie || '' };

    const user = await auth.api.getUser({
      query: {
        id,
      },
      headers,
    });

    if (user.role === 'admin') {
      await this.permissionGuard.assertPermission(
        user.id,
        { invitation: ['deactivate-admin'] },
        'You don`t have permissions to deactivate admin',
      );
    }

    const deletedAt = new Date();
    const formattedDate = new Date().toLocaleString('en-US');

    const updatedUser = await auth.api.adminUpdateUser({
      body: { userId: id, data: { deletedAt, status: 'DEACTIVATED' } },
      headers,
    });

    await auth.api.revokeUserSessions({
      body: {
        userId: id,
      },
      headers,
    });

    await publishEvent('user_deactivated', {
      email: user.email,
      context: { reactivationDeadline: formattedDate, fullName: user.name },
    });

    return { success: true, user: updatedUser };
  }

  async activate(req: AuthenticatedRequest, id: string) {
    const headers = { cookie: req.headers.cookie || '' };

    const user = await auth.api.getUser({
      query: {
        id,
      },
      headers,
    });

    if (user.role === 'admin') {
      await this.permissionGuard.assertPermission(
        user.id,
        { invitation: ['reactivate-admin'] },
        'You don`t have permissions to reactivate admin',
      );
    }

    const updatedUser = await auth.api.adminUpdateUser({
      body: { userId: id, data: { deletedAt: null, status: 'ACTIVE' } },
      headers,
    });

    await publishEvent('user_reactivated', {
      email: user.email,
      context: { fullName: user.name },
    });

    return { success: true, user: updatedUser };
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
