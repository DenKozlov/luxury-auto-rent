import {
  Body,
  Controller,
  Inject,
  Patch,
  UploadedFile,
  UseInterceptors,
  Req,
  Post,
  Param,
  Get,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Session } from '@thallesp/nestjs-better-auth';
import type { UserSession } from '@thallesp/nestjs-better-auth';
import express from 'express';
import { type AuthenticatedRequest } from '../../common/types';
import { EventPattern, Payload } from '@nestjs/microservices';
import { GetUsersDto } from './dto/get-users.dto';
import { CurrentUser } from '@/auth/decorators/user.decorator';
import { type User } from 'better-auth';
import { RequirePermission } from '@/auth/decorators/require-permission.decorator';

@Controller('users')
export class UsersController {
  constructor(
    @Inject(UsersService)
    private readonly usersService: UsersService,
  ) {}

  @Get()
  @RequirePermission('employee', 'list')
  async getUsers(@Req() req: express.Request, @Query() query: GetUsersDto) {
    return this.usersService.getUsers(req, query);
  }

  @Patch('/me')
  @UseInterceptors(FileInterceptor('file'))
  async update(
    @Req() req: express.Request,
    @Session() session: UserSession,
    @UploadedFile() file: Express.Multer.File,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return this.usersService.update(req, session, file, updateProfileDto);
  }

  @Post('me/deactivate')
  async deactivate(
    @Req() req: AuthenticatedRequest,
    @CurrentUser() user: User,
  ) {
    return await this.usersService.softDeleteMe(req, user);
  }

  @Post(':id/deactivate')
  @RequirePermission('employee', 'deactivate')
  async deactivateUser(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
  ) {
    return await this.usersService.softDeleteUser(req, id);
  }

  @Patch(':id/reactivate')
  async activateUser(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
  ) {
    return await this.usersService.activate(req, id);
  }

  @EventPattern('user_login')
  async handleUpdateLastLogin(
    @Payload() payload: { userId: string; loginAt: Date },
  ) {
    await this.usersService.updateLastLoginAt(payload.userId, payload.loginAt);
  }
}
