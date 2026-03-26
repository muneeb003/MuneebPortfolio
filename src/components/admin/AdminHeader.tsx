"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/Button";

interface AdminHeaderProps {
  title: string;
}

export function AdminHeader({ title }: AdminHeaderProps) {
  return (
    <header className="h-14 border-b border-zinc-800 bg-zinc-950 flex items-center justify-between px-6 shrink-0">
      <h1 className="font-semibold text-zinc-100">{title}</h1>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => signOut({ callbackUrl: "/admin/login" })}
      >
        Sign out
      </Button>
    </header>
  );
}
