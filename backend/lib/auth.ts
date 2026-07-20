import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { createAuthMiddleware, APIError } from 'better-auth/api';
import { prisma } from './prisma';
import { admin as adminPlugin, lastLoginMethod } from 'better-auth/plugins';
import { publishEvent } from './rabbit-connection';
import { ac, admin, superAdmin } from '@/lib/permissions';

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  session: {
    deferSessionRefresh: true,
    expiresIn: 60 * 60 * 24,
  },
  plugins: [
    adminPlugin({
      ac,
      defaultRole: 'user',
      roles: { admin, superAdmin },
    }),
    lastLoginMethod({
      storeInDatabase: true,
    }),
  ],
  database: prismaAdapter(prisma, { provider: 'postgresql' }),
  user: {
    additionalFields: {
      deletedAt: {
        type: 'date',
        required: false,
      },
      lastLoginAt: {
        type: 'date',
        required: false,
      },
      status: {
        type: 'string',
        required: false,
      },
    },
  },
  databaseHooks: {
    session: {
      create: {
        after: async (session) => {
          try {
            await publishEvent('user_login', {
              userId: session.userId,
              loginAt: new Date(),
            });
          } catch (err) {
            console.error('Failed to publish "user_login" event', err);
          }
        },
      },
    },
  },
  hooks: {
    before: createAuthMiddleware(async (ctx: any) => {
      if (!ctx.path.startsWith('/sign-in')) return;
      await Promise.resolve();
      const email: string = ctx.body?.email || ctx.args?.email;

      if (email) {
        const user = await prisma.user.findFirst({
          where: { email },
          select: { deletedAt: true },
        });

        if (user?.deletedAt) {
          throw new APIError('FORBIDDEN', {
            message:
              'Account deactivated. Please contact with our support service.',
          });
        }
      }
    }),
  },
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  trustedOrigins: ['http://localhost:3000', 'http://localhost:3003'],
});
