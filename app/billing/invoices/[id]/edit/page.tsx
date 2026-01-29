import { notFound } from "next/navigation";

import AppShell from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { prisma } from "@/lib/db";
import { requirePermission } from "@/lib/rbac";

import { updateInvoice } from "../../../actions";

export default async function EditInvoicePage({ params }: { params: { id: string } }) {
  await requirePermission("billing.write");

  const [invoice, patients, appointments] = await Promise.all([
    prisma.invoice.findUnique({ where: { id: params.id } }),
    prisma.patient.findMany({ orderBy: [{ lastName: "asc" }, { firstName: "asc" }] }),
    prisma.appointment.findMany({
      include: { patient: true, provider: true },
      orderBy: { scheduledAt: "desc" },
    }),
  ]);

  if (!invoice) {
    notFound();
  }

  return (
    <AppShell title="Edit invoice">
      <Card>
        <CardHeader>
          <CardTitle>Invoice details</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={updateInvoice.bind(null, invoice.id)} className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="patientId">Patient</Label>
              <select
                id="patientId"
                name="patientId"
                required
                defaultValue={invoice.patientId}
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              >
                {patients.map((patient) => (
                  <option key={patient.id} value={patient.id}>
                    {patient.firstName} {patient.lastName}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="appointmentId">Appointment</Label>
              <select
                id="appointmentId"
                name="appointmentId"
                defaultValue={invoice.appointmentId ?? ""}
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="">No appointment</option>
                {appointments.map((appointment) => (
                  <option key={appointment.id} value={appointment.id}>
                    {appointment.patient.firstName} {appointment.patient.lastName} ·{" "}
                    {appointment.provider.firstName} {appointment.provider.lastName}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="totalCents">Total (cents)</Label>
              <Input id="totalCents" name="totalCents" type="number" min="1" defaultValue={invoice.totalCents} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                name="status"
                defaultValue={invoice.status}
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="DRAFT">Draft</option>
                <option value="SENT">Sent</option>
                <option value="PARTIALLY_PAID">Partially paid</option>
                <option value="PAID">Paid</option>
                <option value="OVERDUE">Overdue</option>
                <option value="VOID">Void</option>
              </select>
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="dueAt">Due date</Label>
              <Input
                id="dueAt"
                name="dueAt"
                type="date"
                defaultValue={invoice.dueAt ? invoice.dueAt.toISOString().slice(0, 10) : ""}
              />
            </div>
            <div className="md:col-span-2 flex justify-end">
              <Button type="submit">Save changes</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </AppShell>
  );
}
