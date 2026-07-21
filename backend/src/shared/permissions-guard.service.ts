import { auth } from '@/lib/auth';
import { ForbiddenException, Injectable } from '@nestjs/common';

@Injectable()
export class PermissionGuardService {
  constructor() {}

  async assertPermission(
    userId: string,
    permissions: Record<string, string[]>,
    errorMessage = 'You do not have permission to perform this action',
  ): Promise<void> {
    const { success } = await auth.api.userHasPermission({
      body: {
        userId,
        permissions,
      },
    });

    if (!success) {
      throw new ForbiddenException(errorMessage);
    }
  }
}
