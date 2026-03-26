import { AdminHeader } from "@/components/admin/AdminHeader";
import { createAdminClient } from "@/lib/supabase/admin";
import { SkillsManager } from "./SkillsManager";

async function getData() {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("skill_categories")
    .select("*, skills(*)")
    .order("order", { ascending: true });
  return data ?? [];
}

export default async function SkillsPage() {
  const categories = await getData();
  return (
    <>
      <AdminHeader title="Skills" />
      <main className="flex-1 p-6 max-w-3xl">
        <SkillsManager initialCategories={categories} />
      </main>
    </>
  );
}
