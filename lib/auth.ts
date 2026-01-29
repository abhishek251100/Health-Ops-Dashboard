import bcrypt from "bcryptjs";
import { PrismaAdapter } from "@auth/prisma-adapter";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { getServerSession } from "next-auth";
import { z } from "zod";

import { prisma } from "@/lib/db";

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = credentialsSchema.safeParse(credentials);
        if (!parsed.success) {
          return null;
        }

        const { email, password } = parsed.data;
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user?.passwordHash) {
          return null;
        }

        const isValid = await bcrypt.compare(password, user.passwordHash);
        if (!isValid) {
          return null;
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user?.id) {
        const roles = await prisma.userRole.findMany({
          where: { userId: user.id },
          include: { role: { include: { permissions: { include: { permission: true } } } } },
        });

        type RoleEntry = (typeof roles)[number];

        token.sub = user.id;
        token.roles = roles.map((role: RoleEntry) => role.role.name);
        token.permissions = roles.flatMap((role: RoleEntry) =>
          role.role.permissions.map(
            (permission: RoleEntry["role"]["permissions"][number]) => permission.permission.key
          )
        );
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user && token?.sub) {
        session.user.id = token.sub;
        session.user.roles = (token.roles as string[]) ?? [];
        session.user.permissions = (token.permissions as string[]) ?? [];
      }

      return session;
    },
  },
  pages: {
    signIn: "/signin",
  },
};

export const getServerAuthSession = () => getServerSession(authOptions);
