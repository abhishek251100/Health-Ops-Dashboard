import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-6">
      <Card className="w-full max-w-2xl">
        <CardContent className="py-12 text-center space-y-6">
          <div className="space-y-3">
            <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">Health Ops</p>
            <h1 className="text-4xl font-semibold tracking-tight">Operational command center</h1>
            <p className="text-muted-foreground">
              Monitor care delivery, staff capacity, scheduling, and billing from a single view.
            </p>
            <p className="text-sm text-muted-foreground">Demo login: admin@healthops.local / Admin123!</p>
          </div>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <Button asChild>
              <Link href="/signin">Sign in</Link>
            </Button>
            <Button asChild variant="secondary">
              <Link href="/dashboard">Go to dashboard</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
