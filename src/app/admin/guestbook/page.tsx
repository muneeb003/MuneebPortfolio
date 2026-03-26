import { AdminHeader } from "@/components/admin/AdminHeader";
import { createAdminClient } from "@/lib/supabase/admin";
import { GuestbookTable } from "./GuestbookTable";

async function getData() {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("guestbook")
    .select("*")
    .order("created_at", { ascending: false });
  return data ?? [];
}

export default async function GuestbookPage() {
  const entries = await getData();
  return (
    <>
      <AdminHeader title="Guestbook" />
      <main className="flex-1 p-6">
        <GuestbookTable initialData={entries} />
      </main>
    </>
  );
}
