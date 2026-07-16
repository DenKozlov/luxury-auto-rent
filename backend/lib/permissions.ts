import { createAccessControl } from 'better-auth/plugins/access';
import { adminAc, defaultStatements } from 'better-auth/plugins/admin/access';

const statement = {
  ...defaultStatements,
  invitation: ['send', 'revoke', 'resend'],
  employee: ['list', 'activate', 'deactivate'],
} as const;

export const ac = createAccessControl(statement);

export const admin = ac.newRole({
  invitation: ['send', 'revoke', 'resend'],
  employee: ['list', 'activate', 'deactivate'],
  ...adminAc.statements,
});
