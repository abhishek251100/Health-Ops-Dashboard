"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { prisma } from "@/lib/db";
import { requirePermission } from "@/lib/rbac";

const providerSchema = z.object({
  firstName: z.string().min(1, "First name is required."),
  lastName: z.string().min(1, "Last name is required."),
  specialty: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  npi: z.string().optional(),
  availability: z.string().optional(),
  active: z.string().optional(),
});

export async function createProvider(formData: FormData) {
  await requirePermission("providers.write");
  const payload = providerSchema.parse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    specialty: formData.get("specialty"),
    phone: formData.get("phone"),
    email: formData.get("email") || undefined,
    npi: formData.get("npi"),
    availability: formData.get("availability"),
    active: formData.get("active"),
  });

  await prisma.provider.create({
    data: {
      ...payload,
      email: payload.email || null,
      active: payload.active !== "false",
    },
  });

  revalidatePath("/providers");
}

export async function updateProvider(id: string, formData: FormData) {
  await requirePermission("providers.write");
  const payload = providerSchema.parse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    specialty: formData.get("specialty"),
    phone: formData.get("phone"),
    email: formData.get("email") || undefined,
    npi: formData.get("npi"),
    availability: formData.get("availability"),
    active: formData.get("active"),
  });

  await prisma.provider.update({
    where: { id },
    data: {
      ...payload,
      email: payload.email || null,
      active: payload.active !== "false",
    },
  });

  revalidatePath("/providers");
}

export async function deleteProvider(id: string) {
  await requirePermission("providers.write");
  await prisma.provider.delete({ where: { id } });
  revalidatePath("/providers");
}
