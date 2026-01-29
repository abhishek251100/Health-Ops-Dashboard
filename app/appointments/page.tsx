import Link from "next/link";

import AppShell from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { prisma } from "@/lib/db";
import { requirePermission } from "@/lib/rbac";

import { createAppointment, deleteAppointment } from "./actions";

function formatDate(value: Date) {
  return new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short" }).format(value);
}

export default async function AppointmentsPage() {
  await requirePermission("appointments.read");
  const [appointments, patients, providers] = await Promise.all([
    prisma.appointment.findMany({
      include: { patient: true, provider: true },
      orderBy: { scheduledAt: "desc" },
    }),
    prisma.patient.findMany({ orderBy: [{ lastName: "asc" }, { firstName: "asc" }] }),
    prisma.provider.findMany({ orderBy: [{ lastName: "asc" }, { firstName: "asc" }] }),
  ]);

  return (
    <AppShell
      title="Appointments"
      actions={
        <Button asChild>
          <Link href="#create-appointment">Schedule appointment</Link>
        </Button>
      }
    >
      <Card id="create-appointment">
        <CardHeader>
          <CardTitle>New appointment</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createAppointment} className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="patientId">Patient</Label>
              <select
                id="patientId"
                name="patientId"
                required
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="">Select patient</option>
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
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="">Select provider</option>
                {providers.map((provider) => (
                  <option key={provider.id} value={provider.id}>
                    {provider.firstName} {provider.lastName}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="scheduledAt">Scheduled time</Label>
              <Input id="scheduledAt" name="scheduledAt" type="datetime-local" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                name="status"
                defaultValue="SCHEDULED"
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
              <Input id="reason" name="reason" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="notes">Notes</Label>
              <Input id="notes" name="notes" />
            </div>
            <div className="md:col-span-2 flex justify-end">
              <Button type="submit">Create appointment</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>All appointments</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient</TableHead>
                <TableHead>Provider</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Scheduled</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {appointments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-muted-foreground">
                    No appointments found. Add one above.
                  </TableCell>
                </TableRow>
              ) : (
                appointments.map((appointment) => (
                  <TableRow key={appointment.id}>
                    <TableCell>
                      {appointment.patient.firstName} {appointment.patient.lastName}
                    </TableCell>
                    <TableCell>
                      {appointment.provider.firstName} {appointment.provider.lastName}
                    </TableCell>
                    <TableCell>{appointment.status.replaceAll("_", " ")}</TableCell>
                    <TableCell>{formatDate(appointment.scheduledAt)}</TableCell>
                    <TableCell className="flex gap-2">
                      <Button asChild variant="secondary" size="sm">
                        <Link href={`/appointments/${appointment.id}/edit`}>Edit</Link>
                      </Button>
                      <form action={deleteAppointment.bind(null, appointment.id)}>
                        <Button type="submit" variant="outline" size="sm">
                          Delete
                        </Button>
                      </form>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </AppShell>
  );
}
