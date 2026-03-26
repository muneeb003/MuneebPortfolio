import { AdminHeader } from "@/components/admin/AdminHeader";
import { createAdminClient } from "@/lib/supabase/admin";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { DeleteProjectButton } from "./DeleteProjectButton";

async function getProjects() {
  const supabase = createAdminClient();
  const { data } = await supabase.from("projects").select("*").order("order");
  return data ?? [];
}

export default async function ProjectsPage() {
  const projects = await getProjects();

  const statusVariant = {
    published: "success" as const,
    draft: "warning" as const,
    archived: "default" as const,
  };

  return (
    <>
      <AdminHeader title="Projects" />
      <main className="flex-1 p-6">
        <div className="flex justify-between items-center mb-6">
          <span className="text-sm text-zinc-400">{projects.length} project{projects.length !== 1 ? "s" : ""}</span>
          <Link href="/admin/projects/new">
            <Button size="sm">+ New project</Button>
          </Link>
        </div>

        <div className="space-y-2">
          {projects.map((project) => (
            <div
              key={project.id}
              className="flex items-center gap-4 rounded-xl border border-zinc-800 bg-zinc-900 p-4"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-zinc-100 truncate">{project.title}</span>
                  {project.featured && <Badge variant="info">Featured</Badge>}
                  <Badge variant={statusVariant[project.status as keyof typeof statusVariant]}>
                    {project.status}
                  </Badge>
                </div>
                <div className="text-xs text-zinc-500 mt-0.5 truncate">{project.description_short}</div>
              </div>
              <div className="flex gap-2 shrink-0">
                <Link href={`/admin/projects/${project.id}`}>
                  <Button size="sm" variant="secondary">Edit</Button>
                </Link>
                <DeleteProjectButton id={project.id} />
              </div>
            </div>
          ))}

          {projects.length === 0 && (
            <div className="text-center py-16 text-zinc-500">
              No projects yet.{" "}
              <Link href="/admin/projects/new" className="text-indigo-400 hover:underline">
                Create one →
              </Link>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
