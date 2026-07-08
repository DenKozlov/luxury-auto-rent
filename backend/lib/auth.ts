import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { createAuthMiddleware, APIError } from 'better-auth/api';
import { prisma } from './prisma';

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  session: {
    deferSessionRefresh: true,
    expiresIn: 60 * 60 * 24,
  },
  database: prismaAdapter(prisma, { provider: 'postgresql' }),
  user: {
    additionalFields: {
      deletedAt: {
        type: 'date',
        required: false,
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
