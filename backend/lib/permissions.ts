import { createAccessControl } from 'better-auth/plugins/access';
import { adminAc, defaultStatements } from 'better-auth/plugins/admin/access';

const statement = {
  ...defaultStatements,
  invitation: ['list', 'send', 'revoke', 'resend', 'send-admin'],
  employee: ['list', 'activate', 'deactivate', 'deactivate-admin'],
} as const;

export const ac = createAccessControl(statement);

export const admin = ac.newRole({
  invitation: ['list', 'send', 'revoke', 'resend'],
  employee: ['list', 'activate', 'deactivate'],
  ...adminAc.statements,
});

export const superAdmin = ac.newRole({
  invitation: [...admin.statements.invitation, 'send-admin'],
  employee: [...admin.statements.employee, 'deactivate-admin'],
  ...adminAc.statements,
});
