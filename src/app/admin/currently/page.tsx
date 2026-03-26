import { AdminHeader } from "@/components/admin/AdminHeader";
import { createAdminClient } from "@/lib/supabase/admin";
import { CurrentlyEditor } from "./CurrentlyEditor";

async function getData() {
  const supabase = createAdminClient();
  const { data } = await supabase.from("currently").select("*");
  return data ?? [];
}

export default async function CurrentlyPage() {
  const items = await getData();
  return (
    <>
      <AdminHeader title="Currently" />
      <main className="flex-1 p-6 max-w-2xl">
        <CurrentlyEditor initialItems={items} />
      </main>
    </>
  );
}
