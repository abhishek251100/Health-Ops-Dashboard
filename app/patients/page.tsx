import Link from "next/link";

import AppShell from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { prisma } from "@/lib/db";
import { requirePermission } from "@/lib/rbac";

import { createPatient, deletePatient } from "./actions";

export default async function PatientsPage() {
  await requirePermission("patients.read");
  const patients = await prisma.patient.findMany({
    orderBy: [{ lastName: "asc" }, { firstName: "asc" }],
  });

  return (
    <AppShell
      title="Patients"
      actions={
        <Button asChild>
          <Link href="#create-patient">Add patient</Link>
        </Button>
      }
    >
      <Card id="create-patient">
        <CardHeader>
          <CardTitle>New patient</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createPatient} className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstName">First name</Label>
              <Input id="firstName" name="firstName" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last name</Label>
              <Input id="lastName" name="lastName" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Date of birth</Label>
              <Input id="dateOfBirth" name="dateOfBirth" type="date" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <select
                id="gender"
                name="gender"
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="">Select</option>
                <option value="FEMALE">Female</option>
                <option value="MALE">Male</option>
                <option value="NON_BINARY">Non-binary</option>
                <option value="OTHER">Other</option>
                <option value="UNDISCLOSED">Undisclosed</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" name="phone" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="address">Address</Label>
              <Input id="address" name="address" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="emergencyContactName">Emergency contact</Label>
              <Input id="emergencyContactName" name="emergencyContactName" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="emergencyContactPhone">Emergency phone</Label>
              <Input id="emergencyContactPhone" name="emergencyContactPhone" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="insuranceProvider">Insurance provider</Label>
              <Input id="insuranceProvider" name="insuranceProvider" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="insuranceMemberId">Insurance member ID</Label>
              <Input id="insuranceMemberId" name="insuranceMemberId" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="notes">Clinical notes</Label>
              <Input id="notes" name="notes" />
            </div>
            <div className="md:col-span-2 flex justify-end">
              <Button type="submit">Create patient</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>All patients</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {patients.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-muted-foreground">
                    No patients found. Add one above.
                  </TableCell>
                </TableRow>
              ) : (
                patients.map((patient) => (
                  <TableRow key={patient.id}>
                    <TableCell>
                      {patient.firstName} {patient.lastName}
                    </TableCell>
                    <TableCell>{patient.email ?? "—"}</TableCell>
                    <TableCell>{patient.phone ?? "—"}</TableCell>
                    <TableCell className="flex gap-2">
                      <Button asChild variant="secondary" size="sm">
                        <Link href={`/patients/${patient.id}/edit`}>Edit</Link>
                      </Button>
                      <form action={deletePatient.bind(null, patient.id)}>
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
