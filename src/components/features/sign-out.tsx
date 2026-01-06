"use client";

import * as React from "react";
import { LogOut } from "lucide-react";

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

import { signOut } from "@/lib/auth/client";

/**
 * Sign out button component
 *
 * Renders a dropdown menu item that signs out the user.
 * Calls Better Auth signOut and reloads the page.
 *
 * @returns DropdownMenuItem component for sign out action
 */
function SignOut() {
  const handleSignOut = async () => {
    await signOut({});
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
