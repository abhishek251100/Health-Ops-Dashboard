import "dotenv/config";

import { PrismaClient, AppointmentStatus, InvoiceStatus, PaymentMethod, PaymentStatus, Gender } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const PERMISSIONS = [
  { key: "patients.read", description: "View patients" },
  { key: "patients.write", description: "Create/update patients" },
  { key: "appointments.read", description: "View appointments" },
  { key: "appointments.write", description: "Create/update appointments" },
  { key: "providers.read", description: "View providers" },
  { key: "providers.write", description: "Create/update providers" },
  { key: "billing.read", description: "View billing" },
  { key: "billing.write", description: "Create/update billing" },
  { key: "admin.manage", description: "Manage users and roles" },
];

async function main() {
  const permissions = await Promise.all(
    PERMISSIONS.map((permission) =>
      prisma.permission.upsert({
        where: { key: permission.key },
        update: { description: permission.description },
        create: permission,
      })
    )
  );

  const adminRole = await prisma.role.upsert({
    where: { name: "admin" },
    update: {},
    create: {
      name: "admin",
      description: "Full system access",
      permissions: {
        create: permissions.map((permission) => ({
          permission: { connect: { id: permission.id } },
        })),
      },
    },
  });

  const staffRole = await prisma.role.upsert({
    where: { name: "staff" },
    update: {},
    create: {
      name: "staff",
      description: "Clinical staff access",
      permissions: {
        create: permissions
          .filter((permission) => !permission.key.startsWith("admin"))
          .map((permission) => ({
            permission: { connect: { id: permission.id } },
          })),
      },
    },
  });

  const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? "Admin123!";
  const adminPasswordHash = await bcrypt.hash(adminPassword, 10);

  const adminUser = await prisma.user.upsert({
    where: { email: "admin@healthops.local" },
    update: {
      name: "Health Ops Admin",
      passwordHash: adminPasswordHash,
    },
    create: {
      name: "Health Ops Admin",
      email: "admin@healthops.local",
      passwordHash: adminPasswordHash,
      roles: { create: [{ role: { connect: { id: adminRole.id } } }] },
    },
  });

  const provider = await prisma.provider.create({
    data: {
      firstName: "Maya",
      lastName: "Singh",
      specialty: "Cardiology",
      email: "maya.singh@healthops.local",
      phone: "+1-555-0101",
      availability: "Mon-Fri 9am-5pm",
    },
  });

  const patient = await prisma.patient.create({
    data: {
      firstName: "Jordan",
      lastName: "Lee",
      gender: Gender.NON_BINARY,
      dateOfBirth: new Date("1986-04-12"),
      email: "jordan.lee@healthops.local",
      phone: "+1-555-0123",
      address: "123 Harbor Ave, Seattle, WA",
      emergencyContactName: "Casey Lee",
      emergencyContactPhone: "+1-555-0999",
      insuranceProvider: "Blue Harbor",
      insuranceMemberId: "BH-2048821",
      notes: "Hypertension follow-up in Q2.",
    },
  });

  const appointment = await prisma.appointment.create({
    data: {
      patientId: patient.id,
      providerId: provider.id,
      scheduledAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
      status: AppointmentStatus.CONFIRMED,
      reason: "Routine follow-up",
    },
  });

  const invoice = await prisma.invoice.create({
    data: {
      patientId: patient.id,
      appointmentId: appointment.id,
      status: InvoiceStatus.SENT,
      totalCents: 18000,
      dueAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
    },
  });

  await prisma.payment.create({
    data: {
      invoiceId: invoice.id,
      amountCents: 18000,
      method: PaymentMethod.CARD,
      status: PaymentStatus.COMPLETED,
      paidAt: new Date(),
    },
  });

  await prisma.auditLog.create({
    data: {
      actorId: adminUser.id,
      action: "seed.complete",
      entityType: "system",
      metadata: { message: "Seed data loaded." },
    },
  });

  await prisma.file.create({
    data: {
      patientId: patient.id,
      uploadedById: adminUser.id,
      filename: "intake-form.pdf",
      mimeType: "application/pdf",
      sizeBytes: 24532,
      url: "https://example.com/files/intake-form.pdf",
    },
  });

  await prisma.user.update({
    where: { id: adminUser.id },
    data: { roles: { create: [{ role: { connect: { id: staffRole.id } } }] } },
  });

  const [userCount, patientCount, providerCount, appointmentCount, invoiceCount, paymentCount] =
    await Promise.all([
      prisma.user.count(),
      prisma.patient.count(),
      prisma.provider.count(),
      prisma.appointment.count(),
      prisma.invoice.count(),
      prisma.payment.count(),
    ]);

  console.log("Seed complete.");
  console.log({
    users: userCount,
    patients: patientCount,
    providers: providerCount,
    appointments: appointmentCount,
    invoices: invoiceCount,
    payments: paymentCount,
  });
}

main()
  .catch(async (error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
