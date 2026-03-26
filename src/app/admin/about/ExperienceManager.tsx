"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { formatDateRange } from "@/lib/utils";
import type { Experience } from "@/types";

export function ExperienceManager({ initialData }: { initialData: Experience[] }) {
  const router = useRouter();
  const [items, setItems] = useState(initialData);
  const [editing, setEditing] = useState<Experience | null>(null);
  const [adding, setAdding] = useState(false);

  async function deleteItem(id: string) {
    await fetch(`/api/experience/${id}`, { method: "DELETE" });
    setItems((prev) => prev.filter((e) => e.id !== id));
  }

  function handleSaved(updated: Experience) {
    setItems((prev) =>
      editing
        ? prev.map((e) => (e.id === updated.id ? updated : e))
        : [...prev, updated]
    );
    setEditing(null);
    setAdding(false);
    router.refresh();
  }

  return (
    <section className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-base font-semibold text-zinc-100">Experience</h2>
        <Button size="sm" onClick={() => setAdding(true)}>Add role</Button>
      </div>

      <div className="space-y-3">
        {items.map((exp) => (
          <div key={exp.id} className="flex items-start justify-between gap-3 rounded-lg border border-zinc-700 p-4">
            <div>
              <div className="font-medium text-zinc-100">{exp.role}</div>
              <div className="text-sm text-zinc-400">{exp.company} · {formatDateRange(exp.start_date, exp.end_date)}</div>
            </div>
            <div className="flex gap-2 shrink-0">
              <Button size="sm" variant="ghost" onClick={() => setEditing(exp)}>Edit</Button>
              <Button size="sm" variant="danger" onClick={() => deleteItem(exp.id)}>Delete</Button>
            </div>
          </div>
        ))}
      </div>

      {(adding || editing) && (
        <ExperienceForm
          initial={editing ?? undefined}
          onSaved={handleSaved}
          onCancel={() => { setEditing(null); setAdding(false); }}
        />
      )}
    </section>
  );
}

function ExperienceForm({
  initial,
  onSaved,
  onCancel,
}: {
  initial?: Experience;
  onSaved: (exp: Experience) => void;
  onCancel: () => void;
}) {
  const { register, handleSubmit, formState: { isSubmitting } } = useForm({
    defaultValues: {
      company: initial?.company ?? "",
      role: initial?.role ?? "",
      start_date: initial?.start_date ?? "",
      end_date: initial?.end_date ?? "",
      description: initial?.description ?? "",
      company_url: initial?.company_url ?? "",
      order: initial?.order ?? 0,
    },
  });

  async function onSubmit(data: Record<string, unknown>) {
    const payload = { ...data, end_date: data.end_date || null };
    const url = initial ? `/api/experience/${initial.id}` : "/api/experience";
    const method = initial ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const json = await res.json();
    onSaved(json);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-3 border-t border-zinc-700 pt-4">
      <div className="grid grid-cols-2 gap-3">
        <Input label="Company" {...register("company")} required />
        <Input label="Role / Title" {...register("role")} required />
        <Input label="Start date" type="date" {...register("start_date")} required />
        <Input label="End date (blank = Present)" type="date" {...register("end_date")} />
        <Input label="Company URL" {...register("company_url")} />
        <Input label="Order" type="number" {...register("order", { valueAsNumber: true })} />
      </div>
      <Textarea label="Description (markdown)" {...register("description")} rows={3} />
      <div className="flex gap-2">
        <Button type="submit" loading={isSubmitting}>{initial ? "Update" : "Add"}</Button>
        <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
      </div>
    </form>
  );
}
