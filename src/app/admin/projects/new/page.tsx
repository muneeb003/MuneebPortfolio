import { AdminHeader } from "@/components/admin/AdminHeader";
import { ProjectForm } from "@/components/admin/ProjectForm";

export default function NewProjectPage() {
  return (
    <>
      <AdminHeader title="New Project" />
      <main className="flex-1 p-6">
        <ProjectForm />
      </main>
    </>
  );
}
