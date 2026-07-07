import {
  Body,
  Controller,
  Inject,
  Patch,
  UploadedFile,
  UseInterceptors,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateProfileDto } from './dto/update-profile.dto';
import * as nestjsBetterAuth from '@thallesp/nestjs-better-auth';
import express from 'express';

@Controller('users')
export class UsersController {
  constructor(
    @Inject(UsersService)
    private readonly usersService: UsersService,
  ) {}

  @Patch('/me')
  @UseGuards(nestjsBetterAuth.AuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async update(
    @Req() req: express.Request,
    @nestjsBetterAuth.Session() session: nestjsBetterAuth.UserSession,
    @UploadedFile() file: Express.Multer.File,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return this.usersService.update(req, session, file, updateProfileDto);
  }
}
