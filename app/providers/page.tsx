import Link from "next/link";

import AppShell from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { prisma } from "@/lib/db";
import { requirePermission } from "@/lib/rbac";

import { createProvider, deleteProvider } from "./actions";

export default async function ProvidersPage() {
  await requirePermission("providers.read");
  const providers = await prisma.provider.findMany({
    orderBy: [{ lastName: "asc" }, { firstName: "asc" }],
  });

  return (
    <AppShell
      title="Providers"
      actions={
        <Button asChild>
          <Link href="#create-provider">Add provider</Link>
        </Button>
      }
    >
      <Card id="create-provider">
        <CardHeader>
          <CardTitle>New provider</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createProvider} className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstName">First name</Label>
              <Input id="firstName" name="firstName" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last name</Label>
              <Input id="lastName" name="lastName" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="specialty">Specialty</Label>
              <Input id="specialty" name="specialty" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="npi">NPI</Label>
              <Input id="npi" name="npi" />
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
              <Label htmlFor="availability">Availability</Label>
              <Input id="availability" name="availability" placeholder="Mon-Fri 9am-5pm" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="active">Active</Label>
              <select
                id="active"
                name="active"
                defaultValue="true"
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>
            <div className="md:col-span-2 flex justify-end">
              <Button type="submit">Create provider</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>All providers</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Specialty</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {providers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-muted-foreground">
                    No providers found. Add one above.
                  </TableCell>
                </TableRow>
              ) : (
                providers.map((provider) => (
                  <TableRow key={provider.id}>
                    <TableCell>
                      {provider.firstName} {provider.lastName}
                    </TableCell>
                    <TableCell>{provider.specialty ?? "—"}</TableCell>
                    <TableCell>{provider.email ?? "—"}</TableCell>
                    <TableCell className="flex gap-2">
                      <Button asChild variant="secondary" size="sm">
                        <Link href={`/providers/${provider.id}/edit`}>Edit</Link>
                      </Button>
                      <form action={deleteProvider.bind(null, provider.id)}>
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
