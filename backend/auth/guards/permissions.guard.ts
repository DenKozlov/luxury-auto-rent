import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {
  PERMISSION_KEY,
  RequiredPermission,
} from '@/auth/decorators/require-permission.decorator';
import { auth } from '@/lib/auth';
import { fromNodeHeaders } from 'better-auth/node';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(@Inject(Reflector) private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const required = this.reflector.get<RequiredPermission>(
      PERMISSION_KEY,
      context.getHandler(),
    );

    if (!required) return true;

    const req = context.switchToHttp().getRequest();

    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });
    if (!session) {
      throw new UnauthorizedException();
    }

    const { success } = await auth.api.userHasPermission({
      body: {
        userId: session.user.id,
        permissions: { [required.resource]: [required.action] },
      },
    });

    if (!success) {
      throw new ForbiddenException(
        `You don't have permissions: ${required.resource}:${required.action}`,
      );
    }

    req.session = session;
    return true;
  }
}
