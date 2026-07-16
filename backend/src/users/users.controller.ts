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
import { AllowAnonymous, Session } from '@thallesp/nestjs-better-auth';
import type { UserSession } from '@thallesp/nestjs-better-auth';
import express from 'express';
import * as types from '../../common/types';
import { EventPattern, Payload } from '@nestjs/microservices';
import { GetUsersDto } from './dto/get-users.dto';

@Controller('users')
export class UsersController {
  constructor(
    @Inject(UsersService)
    private readonly usersService: UsersService,
  ) {}

  @Get()
  @AllowAnonymous()
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

  @Post(':id/deactivate')
  async deactivateUser(
    @Req() req: types.AuthenticatedRequest,
    @Param('id') id: string,
    @Session() session: UserSession,
  ) {
    return await this.usersService.softDelete(req, session, id);
  }

  @EventPattern('user_login')
  async handleUpdateLastLogin(
    @Payload() payload: { userId: string; loginAt: Date },
  ) {
    await this.usersService.updateLastLoginAt(payload.userId, payload.loginAt);
  }
}
