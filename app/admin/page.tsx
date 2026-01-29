import AppShell from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { prisma } from "@/lib/db";
import { requirePermission } from "@/lib/rbac";

import { assignRole, createUser, removeRole } from "./actions";

export default async function AdminPage() {
  await requirePermission("admin.manage");

  const [users, roles] = await Promise.all([
    prisma.user.findMany({
      include: { roles: { include: { role: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.role.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <AppShell title="Admin">
      <Card>
        <CardHeader>
          <CardTitle>Create user</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createUser} className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Full name</Label>
              <Input id="name" name="name" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Temporary password</Label>
              <Input id="password" name="password" type="password" minLength={8} required />
            </div>
            <div className="md:col-span-2 flex justify-end">
              <Button type="submit">Create user</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>User access</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Roles</TableHead>
                <TableHead>Assign role</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-muted-foreground">
                    No users yet.
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.name ?? "—"}</TableCell>
                    <TableCell>{user.email ?? "—"}</TableCell>
                    <TableCell className="space-y-2">
                      {user.roles.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No roles assigned.</p>
                      ) : (
                        user.roles.map((role) => (
                          <div key={role.roleId} className="flex items-center gap-2">
                            <span>{role.role.name}</span>
                            <form action={removeRole.bind(null, user.id, role.roleId)}>
                              <Button type="submit" variant="outline" size="sm">
                                Remove
                              </Button>
                            </form>
                          </div>
                        ))
                      )}
                    </TableCell>
                    <TableCell>
                      <form action={assignRole.bind(null, user.id)} className="flex items-center gap-2">
                        <select
                          name="roleId"
                          className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
                        >
                          <option value="">Select role</option>
                          {roles.map((role) => (
                            <option key={role.id} value={role.id}>
                              {role.name}
                            </option>
                          ))}
                        </select>
                        <Button type="submit" variant="secondary" size="sm">
                          Assign
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
