import Link from "next/link";

import SignOutButton from "@/components/layout/sign-out-button";
import { Badge } from "@/components/ui/badge";

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/patients", label: "Patients" },
  { href: "/appointments", label: "Appointments" },
  { href: "/providers", label: "Providers" },
  { href: "/billing", label: "Billing" },
  { href: "/admin", label: "Admin" },
];

type AppShellProps = {
  user: {
    name?: string | null;
    email?: string | null;
    roles: string[];
  };
  children: React.ReactNode;
};

export default function AppShell({ user, children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-muted/40">
      <div className="flex min-h-screen">
        <aside className="hidden w-64 border-r bg-background p-6 lg:block">
          <div className="space-y-6">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Health Ops</p>
              <h1 className="text-xl font-semibold">Operations Suite</h1>
            </div>
            <nav className="space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </aside>
        <div className="flex flex-1 flex-col">
          <header className="border-b bg-background">
            <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-4">
              <div>
                <p className="text-sm text-muted-foreground">Signed in as</p>
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-medium">{user.name ?? "Team member"}</p>
                  {user.roles.map((role) => (
                    <Badge key={role} variant="secondary">
                      {role}
                    </Badge>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
              <SignOutButton />
            </div>
          </header>
          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
