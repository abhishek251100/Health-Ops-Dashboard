import { notFound } from "next/navigation";

import AppShell from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { prisma } from "@/lib/db";
import { requirePermission } from "@/lib/rbac";

import { updateProvider } from "../../actions";

export default async function EditProviderPage({ params }: { params: { id: string } }) {
  await requirePermission("providers.write");

  const provider = await prisma.provider.findUnique({ where: { id: params.id } });
  if (!provider) {
    notFound();
  }

  return (
    <AppShell title={`Edit provider: ${provider.firstName} ${provider.lastName}`}>
      <Card>
        <CardHeader>
          <CardTitle>Provider details</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={updateProvider.bind(null, provider.id)} className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstName">First name</Label>
              <Input id="firstName" name="firstName" defaultValue={provider.firstName} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last name</Label>
              <Input id="lastName" name="lastName" defaultValue={provider.lastName} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="specialty">Specialty</Label>
              <Input id="specialty" name="specialty" defaultValue={provider.specialty ?? ""} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="npi">NPI</Label>
              <Input id="npi" name="npi" defaultValue={provider.npi ?? ""} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" defaultValue={provider.email ?? ""} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" name="phone" defaultValue={provider.phone ?? ""} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="availability">Availability</Label>
              <Input id="availability" name="availability" defaultValue={provider.availability ?? ""} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="active">Active</Label>
              <select
                id="active"
                name="active"
                defaultValue={provider.active ? "true" : "false"}
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
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
