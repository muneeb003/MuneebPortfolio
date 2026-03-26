import { AdminHeader } from "@/components/admin/AdminHeader";
import { createAdminClient } from "@/lib/supabase/admin";
import { MoodEditor } from "./MoodEditor";

async function getData() {
  const supabase = createAdminClient();
  const { data } = await supabase.from("mood").select("*").eq("id", 1).single();
  return data;
}

export default async function MoodPage() {
  const mood = await getData();
  return (
    <>
      <AdminHeader title="Mood Bar" />
      <main className="flex-1 p-6 max-w-lg">
        <MoodEditor initial={mood} />
      </main>
    </>
  );
}
