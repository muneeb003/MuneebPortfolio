import { AdminHeader } from "@/components/admin/AdminHeader";
import { createAdminClient } from "@/lib/supabase/admin";
import { AboutForm } from "./AboutForm";
import { ExperienceManager } from "./ExperienceManager";

async function getData() {
  const supabase = createAdminClient();
  const [{ data: about }, { data: experience }] = await Promise.all([
    supabase.from("about").select("*").eq("id", 1).single(),
    supabase.from("experience").select("*").order("order"),
  ]);
  return { about, experience: experience ?? [] };
}

export default async function AboutPage() {
  const { about, experience } = await getData();

  return (
    <>
      <AdminHeader title="About & Experience" />
      <main className="flex-1 p-6 space-y-8 max-w-3xl">
        <AboutForm initialData={about} />
        <ExperienceManager initialData={experience} />
      </main>
    </>
  );
}
