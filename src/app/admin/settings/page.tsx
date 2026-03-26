import { AdminHeader } from "@/components/admin/AdminHeader";
import { createAdminClient } from "@/lib/supabase/admin";
import { SiteMetaForm } from "./SiteMetaForm";
import { PasswordForm } from "./PasswordForm";

async function getData() {
  const supabase = createAdminClient();
  const { data } = await supabase.from("site_meta").select("*").eq("id", 1).single();
  return data;
}

export default async function SettingsPage() {
  const meta = await getData();
  return (
    <>
      <AdminHeader title="Settings" />
      <main className="flex-1 p-6 max-w-2xl space-y-8">
        <SiteMetaForm initial={meta} />
        <PasswordForm />
      </main>
    </>
  );
}
