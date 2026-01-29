import Link from "next/link";

import AppShell from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { prisma } from "@/lib/db";
import { formatMoney, formatShortDate } from "@/lib/format";
import { requirePermission } from "@/lib/rbac";

import { createInvoice, createPayment, deleteInvoice, deletePayment } from "./actions";

export default async function BillingPage() {
  await requirePermission("billing.read");

  const [invoices, payments, patients, appointments] = await Promise.all([
    prisma.invoice.findMany({
      include: { patient: true },
      orderBy: { issuedAt: "desc" },
    }),
    prisma.payment.findMany({
      include: { invoice: { include: { patient: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.patient.findMany({ orderBy: [{ lastName: "asc" }, { firstName: "asc" }] }),
    prisma.appointment.findMany({
      include: { patient: true, provider: true },
      orderBy: { scheduledAt: "desc" },
    }),
  ]);

  return (
    <AppShell
      title="Billing"
      actions={
        <Button asChild>
          <Link href="#create-invoice">New invoice</Link>
        </Button>
      }
    >
      <Card id="create-invoice">
        <CardHeader>
          <CardTitle>Create invoice</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createInvoice} className="grid gap-4 md:grid-cols-2">
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
              <Label htmlFor="appointmentId">Appointment (optional)</Label>
              <select
                id="appointmentId"
                name="appointmentId"
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
              <Input id="totalCents" name="totalCents" type="number" min="1" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                name="status"
                defaultValue="DRAFT"
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
              <Input id="dueAt" name="dueAt" type="date" />
            </div>
            <div className="md:col-span-2 flex justify-end">
              <Button type="submit">Create invoice</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Record payment</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createPayment} className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="invoiceId">Invoice</Label>
              <select
                id="invoiceId"
                name="invoiceId"
                required
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="">Select invoice</option>
                {invoices.map((invoice) => (
                  <option key={invoice.id} value={invoice.id}>
                    {invoice.patient.firstName} {invoice.patient.lastName} · {formatMoney(invoice.totalCents)}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="amountCents">Amount (cents)</Label>
              <Input id="amountCents" name="amountCents" type="number" min="1" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="method">Method</Label>
              <select
                id="method"
                name="method"
                defaultValue="CARD"
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="CASH">Cash</option>
                <option value="CARD">Card</option>
                <option value="BANK_TRANSFER">Bank transfer</option>
                <option value="INSURANCE">Insurance</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="paymentStatus">Status</Label>
              <select
                id="paymentStatus"
                name="status"
                defaultValue="COMPLETED"
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="PENDING">Pending</option>
                <option value="COMPLETED">Completed</option>
                <option value="FAILED">Failed</option>
                <option value="REFUNDED">Refunded</option>
              </select>
            </div>
            <div className="md:col-span-2 flex justify-end">
              <Button type="submit">Record payment</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Invoices</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Due</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-muted-foreground">
                    No invoices yet.
                  </TableCell>
                </TableRow>
              ) : (
                invoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell>
                      {invoice.patient.firstName} {invoice.patient.lastName}
                    </TableCell>
                    <TableCell>{invoice.status.replaceAll("_", " ")}</TableCell>
                    <TableCell>{formatMoney(invoice.totalCents)}</TableCell>
                    <TableCell>{formatShortDate(invoice.dueAt)}</TableCell>
                    <TableCell className="flex gap-2">
                      <Button asChild variant="secondary" size="sm">
                        <Link href={`/billing/invoices/${invoice.id}/edit`}>Edit</Link>
                      </Button>
                      <form action={deleteInvoice.bind(null, invoice.id)}>
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

      <Card>
        <CardHeader>
          <CardTitle>Payments</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-muted-foreground">
                    No payments yet.
                  </TableCell>
                </TableRow>
              ) : (
                payments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>
                      {payment.invoice.patient.firstName} {payment.invoice.patient.lastName}
                    </TableCell>
                    <TableCell>{formatMoney(payment.amountCents)}</TableCell>
                    <TableCell>{payment.method.replaceAll("_", " ")}</TableCell>
                    <TableCell>{payment.status.replaceAll("_", " ")}</TableCell>
                    <TableCell>
                      <form action={deletePayment.bind(null, payment.id)}>
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
