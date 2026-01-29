import { notFound } from "next/navigation";

import AppShell from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { prisma } from "@/lib/db";
import { requirePermission } from "@/lib/rbac";

import { updatePatient } from "../../actions";

export default async function EditPatientPage({ params }: { params: { id: string } }) {
  await requirePermission("patients.write");

  const patient = await prisma.patient.findUnique({ where: { id: params.id } });
  if (!patient) {
    notFound();
  }

  return (
    <AppShell title={`Edit patient: ${patient.firstName} ${patient.lastName}`}>
      <Card>
        <CardHeader>
          <CardTitle>Patient details</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={updatePatient.bind(null, patient.id)} className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstName">First name</Label>
              <Input id="firstName" name="firstName" defaultValue={patient.firstName} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last name</Label>
              <Input id="lastName" name="lastName" defaultValue={patient.lastName} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Date of birth</Label>
              <Input
                id="dateOfBirth"
                name="dateOfBirth"
                type="date"
                defaultValue={patient.dateOfBirth ? patient.dateOfBirth.toISOString().slice(0, 10) : ""}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <select
                id="gender"
                name="gender"
                defaultValue={patient.gender ?? ""}
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
              <Input id="email" name="email" type="email" defaultValue={patient.email ?? ""} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" name="phone" defaultValue={patient.phone ?? ""} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="address">Address</Label>
              <Input id="address" name="address" defaultValue={patient.address ?? ""} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="emergencyContactName">Emergency contact</Label>
              <Input id="emergencyContactName" name="emergencyContactName" defaultValue={patient.emergencyContactName ?? ""} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="emergencyContactPhone">Emergency phone</Label>
              <Input id="emergencyContactPhone" name="emergencyContactPhone" defaultValue={patient.emergencyContactPhone ?? ""} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="insuranceProvider">Insurance provider</Label>
              <Input id="insuranceProvider" name="insuranceProvider" defaultValue={patient.insuranceProvider ?? ""} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="insuranceMemberId">Insurance member ID</Label>
              <Input id="insuranceMemberId" name="insuranceMemberId" defaultValue={patient.insuranceMemberId ?? ""} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="notes">Clinical notes</Label>
              <Input id="notes" name="notes" defaultValue={patient.notes ?? ""} />
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
