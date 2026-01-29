import { notFound } from "next/navigation";

import AppShell from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { prisma } from "@/lib/db";
import { requirePermission } from "@/lib/rbac";

import { updateAppointment } from "../../actions";

export default async function EditAppointmentPage({ params }: { params: { id: string } }) {
  await requirePermission("appointments.write");

  const [appointment, patients, providers] = await Promise.all([
    prisma.appointment.findUnique({
      where: { id: params.id },
    }),
    prisma.patient.findMany({ orderBy: [{ lastName: "asc" }, { firstName: "asc" }] }),
    prisma.provider.findMany({ orderBy: [{ lastName: "asc" }, { firstName: "asc" }] }),
  ]);

  if (!appointment) {
    notFound();
  }

  return (
    <AppShell title="Edit appointment">
      <Card>
        <CardHeader>
          <CardTitle>Appointment details</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={updateAppointment.bind(null, appointment.id)} className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="patientId">Patient</Label>
              <select
                id="patientId"
                name="patientId"
                required
                defaultValue={appointment.patientId}
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
              <Label htmlFor="providerId">Provider</Label>
              <select
                id="providerId"
                name="providerId"
                required
                defaultValue={appointment.providerId}
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              >
                {providers.map((provider) => (
                  <option key={provider.id} value={provider.id}>
                    {provider.firstName} {provider.lastName}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="scheduledAt">Scheduled time</Label>
              <Input
                id="scheduledAt"
                name="scheduledAt"
                type="datetime-local"
                defaultValue={new Date(appointment.scheduledAt).toISOString().slice(0, 16)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                name="status"
                defaultValue={appointment.status}
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="SCHEDULED">Scheduled</option>
                <option value="CONFIRMED">Confirmed</option>
                <option value="IN_PROGRESS">In progress</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
                <option value="NO_SHOW">No show</option>
              </select>
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="reason">Reason</Label>
              <Input id="reason" name="reason" defaultValue={appointment.reason ?? ""} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="notes">Notes</Label>
              <Input id="notes" name="notes" defaultValue={appointment.notes ?? ""} />
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
