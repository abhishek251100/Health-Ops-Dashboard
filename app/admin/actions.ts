"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { prisma } from "@/lib/db";
import { requirePermission } from "@/lib/rbac";

const userSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
});

export async function createUser(formData: FormData) {
  await requirePermission("admin.manage");
  const payload = userSchema.parse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  const passwordHash = await bcrypt.hash(payload.password, 10);
  await prisma.user.create({
    data: {
      name: payload.name,
      email: payload.email,
      passwordHash,
    },
  });

  revalidatePath("/admin");
}

export async function assignRole(userId: string, formData: FormData) {
  await requirePermission("admin.manage");
  const roleId = String(formData.get("roleId") ?? "");
  if (!roleId) {
    return;
  }

  await prisma.userRole.upsert({
    where: { userId_roleId: { userId, roleId } },
    update: {},
    create: { userId, roleId },
  });

  revalidatePath("/admin");
}

export async function removeRole(userId: string, roleId: string) {
  await requirePermission("admin.manage");
  await prisma.userRole.delete({
    where: { userId_roleId: { userId, roleId } },
  });
  revalidatePath("/admin");
}
