"use client";

import * as React from "react";
import { LogOut } from "lucide-react";

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

import { signOut } from "@/lib/auth/client";

function SignOut() {
  const handleSignOut = async () => {
    await signOut({});
    // Proxy will handle redirect based on authentication status
    // After signOut, session cookie is removed, so proxy will redirect to sign-in
    window.location.reload();
  };

  return (
    <DropdownMenuItem
      onClick={handleSignOut}
      className="text-destructive cursor-pointer"
    >
      <LogOut className="text-current" />
      Log out
    </DropdownMenuItem>
  );
}

export { SignOut };
