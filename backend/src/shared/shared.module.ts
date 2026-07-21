import { Global, Module } from '@nestjs/common';
import { PermissionGuardService } from '@/src/shared/permissions-guard.service';

@Global()
@Module({
  providers: [PermissionGuardService],
  exports: [PermissionGuardService],
})
export class SharedModule {}
