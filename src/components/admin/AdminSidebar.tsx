"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: "⊞" },
  { href: "/admin/projects", label: "Projects", icon: "◈" },
  { href: "/admin/skills", label: "Skills", icon: "◎" },
  { href: "/admin/about", label: "About & Exp.", icon: "◉" },
  { href: "/admin/currently", label: "Currently", icon: "◐" },
  { href: "/admin/mood", label: "Mood Bar", icon: "♪" },
  { href: "/admin/guestbook", label: "Guestbook", icon: "✉" },
  { href: "/admin/contact", label: "Contact", icon: "📬" },
  { href: "/admin/settings", label: "Settings", icon: "⚙" },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-56 shrink-0 bg-zinc-950 border-r border-zinc-800 flex flex-col min-h-screen">
      <div className="p-5 border-b border-zinc-800">
        <Link href="/" className="text-zinc-400 hover:text-zinc-100 text-xs">
          ← Back to site
        </Link>
        <div className="mt-3 font-bold text-zinc-100 text-lg tracking-tight">
          Admin
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-0.5">
        {navItems.map((item) => {
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                isActive
                  ? "bg-indigo-600/20 text-indigo-400"
                  : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800"
              )}
            >
              <span className="text-base leading-none">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
