import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import SignOutButton from "@/components/sign-out-button";
import { getServerAuthSession } from "@/lib/auth";

const NAV_LINKS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/patients", label: "Patients" },
  { href: "/appointments", label: "Appointments" },
  { href: "/providers", label: "Providers" },
  { href: "/billing", label: "Billing" },
  { href: "/admin", label: "Admin" },
];

export default async function AppShell({
  title,
  children,
  actions,
}: {
  title: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}) {
  const session = await getServerAuthSession();

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="border-b bg-background">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="space-y-1">
            <Link href="/dashboard" className="text-lg font-semibold">
              Health Ops
            </Link>
            <p className="text-xs text-muted-foreground">Operational visibility for care teams</p>
          </div>
          <div className="flex items-center gap-3">
            {session?.user?.email ? <Badge variant="secondary">{session.user.email}</Badge> : null}
            <SignOutButton />
          </div>
        </div>
      </header>

      <nav className="border-b bg-background">
        <div className="mx-auto flex max-w-6xl flex-wrap gap-3 px-6 py-3 text-sm text-muted-foreground">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-foreground">
              {link.label}
            </Link>
          ))}
        </div>
      </nav>

      <main className="mx-auto max-w-6xl space-y-6 px-6 py-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl font-semibold">{title}</h1>
          {actions}
        </div>
        {children}
      </main>
    </div>
  );
}
