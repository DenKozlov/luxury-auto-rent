import {
  ForbiddenException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { S3Service } from '../storage/s3.service';
import { UserSession } from '@thallesp/nestjs-better-auth';
import { auth } from '@/lib/auth';
import { Request } from 'express';
import { AuthenticatedRequest } from '../common/types';

@Injectable()
export class UsersService {
  constructor(@Inject(S3Service) private readonly s3Service: S3Service) {}

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
    const headers = { cookie: req.headers.cookie || '' };
    const sessionToken = req.session.session.token;

    if (id !== session.user.id) {
      throw new ForbiddenException('You can only deactivate your own account');
    }

    if (!sessionToken) {
      throw new UnauthorizedException('Session token not found');
    }

    const deletedAt = new Date();

    await auth.api.updateUser({
      body: { deletedAt },
      headers,
    });

    return { success: true, deletedAt };
  }
}
