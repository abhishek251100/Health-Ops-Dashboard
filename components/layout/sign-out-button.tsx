"use client";

import { signOut } from "next-auth/react";

import { Button } from "@/components/ui/button";

export default function SignOutButton() {
  return (
    <Button
      type="button"
      variant="ghost"
      onClick={() => signOut({ callbackUrl: "/" })}
    >
      Sign out
    </Button>
  );
}
