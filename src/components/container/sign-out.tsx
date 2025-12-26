"use client";
import { LogOut } from "lucide-react";

import { signOut } from "@/lib/auth/client";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

const SignOut = () => {
  const handleSignOut = async () => {
    await signOut();
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
};

export { SignOut };
