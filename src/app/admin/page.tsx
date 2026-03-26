import { AdminHeader } from "@/components/admin/AdminHeader";

export const dynamic = "force-dynamic";
import { createAdminClient } from "@/lib/supabase/admin";
import Link from "next/link";

async function getDashboardStats() {
  const supabase = createAdminClient();

  const [
    { count: unreadContacts },
    { count: pendingGuestbook },
    { count: projectCount },
  ] = await Promise.all([
    supabase.from("contact_submissions").select("*", { count: "exact", head: true }).eq("is_read", false),
    supabase.from("guestbook").select("*", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("projects").select("*", { count: "exact", head: true }),
  ]);

  return { unreadContacts, pendingGuestbook, projectCount };
}

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();

  const cards = [
    { href: "/admin/projects", label: "Projects", value: stats.projectCount ?? 0, icon: "◈", color: "text-indigo-400" },
    { href: "/admin/contact", label: "Unread Messages", value: stats.unreadContacts ?? 0, icon: "📬", color: "text-yellow-400" },
    { href: "/admin/guestbook", label: "Pending Guestbook", value: stats.pendingGuestbook ?? 0, icon: "✉", color: "text-green-400" },
  ];

  return (
    <>
      <AdminHeader title="Dashboard" />
      <main className="flex-1 p-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {cards.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="rounded-xl border border-zinc-800 bg-zinc-900 p-5 hover:border-zinc-600 transition-colors"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xl">{card.icon}</span>
                <span className={`text-3xl font-bold ${card.color}`}>{card.value}</span>
              </div>
              <div className="text-sm text-zinc-400">{card.label}</div>
            </Link>
          ))}
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
          <h2 className="text-sm font-semibold text-zinc-300 mb-4">Quick actions</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { href: "/admin/projects/new", label: "New project" },
              { href: "/admin/about", label: "Edit about" },
              { href: "/admin/mood", label: "Update mood" },
              { href: "/admin/currently", label: "Update currently" },
            ].map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className="text-center rounded-lg border border-zinc-700 px-3 py-2 text-sm text-zinc-400 hover:text-zinc-100 hover:border-zinc-500 transition-colors"
              >
                {action.label}
              </Link>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
