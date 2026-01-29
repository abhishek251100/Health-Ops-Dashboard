import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import AppShell from "@/components/app-shell";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/rbac";

function formatDate(value: Date) {
  return new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short" }).format(value);
}

export default async function DashboardPage() {
  await requireAuth();

  const [patients, providers, appointments, invoices, upcomingAppointments, recentInvoices, auditLogs] =
    await Promise.all([
      prisma.patient.count(),
      prisma.provider.count(),
      prisma.appointment.count(),
      prisma.invoice.count(),
      prisma.appointment.findMany({
        where: { scheduledAt: { gte: new Date() } },
        include: { patient: true, provider: true },
        orderBy: { scheduledAt: "asc" },
        take: 5,
      }),
      prisma.invoice.findMany({
        include: { patient: true },
        orderBy: { issuedAt: "desc" },
        take: 5,
      }),
      prisma.auditLog.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
    ]);

  return (
    <AppShell title="Dashboard overview">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">Patients</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">{patients}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">Providers</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">{providers}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">Appointments</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">{appointments}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">Invoices</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">{invoices}</CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Upcoming appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient</TableHead>
                  <TableHead>Provider</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {upcomingAppointments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-muted-foreground">
                      No upcoming appointments.
                    </TableCell>
                  </TableRow>
                ) : (
                  upcomingAppointments.map((appointment) => (
                    <TableRow key={appointment.id}>
                      <TableCell>
                        {appointment.patient.firstName} {appointment.patient.lastName}
                      </TableCell>
                      <TableCell>
                        {appointment.provider.firstName} {appointment.provider.lastName}
                      </TableCell>
                      <TableCell>{formatDate(appointment.scheduledAt)}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent invoices</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Issued</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentInvoices.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-muted-foreground">
                      No invoices created yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  recentInvoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell>
                        {invoice.patient.firstName} {invoice.patient.lastName}
                      </TableCell>
                      <TableCell>{invoice.status.replaceAll("_", " ")}</TableCell>
                      <TableCell>{formatDate(invoice.issuedAt)}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent activity</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Action</TableHead>
                <TableHead>Entity</TableHead>
                <TableHead>Timestamp</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {auditLogs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-muted-foreground">
                    No audit activity yet.
                  </TableCell>
                </TableRow>
              ) : (
                auditLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>{log.action}</TableCell>
                    <TableCell>{log.entityType}</TableCell>
                    <TableCell>{formatDate(log.createdAt)}</TableCell>
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
