import { AdminHeader } from "@/components/admin/AdminHeader";
import { createAdminClient } from "@/lib/supabase/admin";
import { ContactTable } from "./ContactTable";

async function getData() {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("contact_submissions")
    .select("*")
    .order("created_at", { ascending: false });
  return data ?? [];
}

export default async function ContactPage() {
  const submissions = await getData();
  return (
    <>
      <AdminHeader title="Contact Submissions" />
      <main className="flex-1 p-6">
        <ContactTable initialData={submissions} />
      </main>
    </>
  );
}
