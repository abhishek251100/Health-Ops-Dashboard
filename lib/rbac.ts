import { redirect } from "next/navigation";

import { getServerAuthSession } from "@/lib/auth";

export async function requireAuth() {
  const session = await getServerAuthSession();
  if (!session?.user?.id) {
    redirect("/signin");
  }
  return session;
}

export async function requireRole(role: string) {
  const session = await requireAuth();
  if (!session.user.roles.includes(role)) {
    redirect("/unauthorized");
  }
  return session;
}

export async function requirePermission(permission: string) {
  const session = await requireAuth();
  if (!session.user.permissions.includes(permission)) {
    redirect("/unauthorized");
  }
  return session;
}
