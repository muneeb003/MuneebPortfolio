"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { projectSchema, type ProjectFormData } from "@/lib/validations/project.schema";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { ImageUploader } from "./ImageUploader";
import { slugify } from "@/lib/utils";
import type { Project } from "@/types";

interface ProjectFormProps {
  initial?: Project;
}

export function ProjectForm({ initial }: ProjectFormProps) {
  const router = useRouter();
  const [coverUrl, setCoverUrl] = useState(initial?.cover_image_url ?? "");
  const [techInput, setTechInput] = useState("");
  const [techStack, setTechStack] = useState<string[]>(initial?.tech_stack ?? []);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: initial?.title ?? "",
      slug: initial?.slug ?? "",
      description_short: initial?.description_short ?? "",
      description_long: initial?.description_long ?? "",
      demo_url: initial?.demo_url ?? "",
      github_url: initial?.github_url ?? "",
      status: initial?.status ?? "draft",
      featured: initial?.featured ?? false,
      order: initial?.order ?? 0,
      tech_stack: initial?.tech_stack ?? [],
    },
  });

  const title = watch("title");

  function handleTitleBlur() {
    if (!initial && title && !watch("slug")) {
      setValue("slug", slugify(title));
    }
  }

  function addTech() {
    const tag = techInput.trim();
    if (tag && !techStack.includes(tag)) {
      const updated = [...techStack, tag];
      setTechStack(updated);
      setValue("tech_stack", updated);
    }
    setTechInput("");
  }

  function removeTech(tag: string) {
    const updated = techStack.filter((t) => t !== tag);
    setTechStack(updated);
    setValue("tech_stack", updated);
  }

  async function onSubmit(data: ProjectFormData) {
    const payload = { ...data, cover_image_url: coverUrl, tech_stack: techStack };
    const url = initial ? `/api/projects/${initial.id}` : "/api/projects";
    const method = initial ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      router.push("/admin/projects");
      router.refresh();
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 max-w-2xl">
      <ImageUploader value={coverUrl} onChange={setCoverUrl} bucket="project-covers" label="Cover image" />

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Title"
          {...register("title")}
          error={errors.title?.message}
          onBlur={handleTitleBlur}
        />
        <Input
          label="Slug"
          {...register("slug")}
          error={errors.slug?.message}
          placeholder="my-project"
        />
      </div>

      <Input
        label="Short description (card summary)"
        {...register("description_short")}
        error={errors.description_short?.message}
      />

      <Textarea
        label="Long description (markdown)"
        {...register("description_long")}
        rows={8}
      />

      <div className="grid grid-cols-2 gap-4">
        <Input label="Demo URL" {...register("demo_url")} placeholder="https://..." />
        <Input label="GitHub URL" {...register("github_url")} placeholder="https://github.com/..." />
      </div>

      <div>
        <span className="text-sm font-medium text-zinc-300 block mb-1">Tech stack</span>
        <div className="flex flex-wrap gap-1 mb-2">
          {techStack.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 rounded-full bg-zinc-800 px-2 py-0.5 text-xs text-zinc-300"
            >
              {tag}
              <button type="button" onClick={() => removeTech(tag)} className="text-zinc-500 hover:text-zinc-100">×</button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            placeholder="e.g. TypeScript"
            value={techInput}
            onChange={(e) => setTechInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTech(); } }}
          />
          <Button type="button" variant="secondary" size="sm" onClick={addTech}>Add</Button>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div>
          <label className="text-sm font-medium text-zinc-300 block mb-1">Status</label>
          <select
            {...register("status")}
            className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 focus:border-indigo-500 focus:outline-none"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" {...register("featured")} className="w-4 h-4 rounded accent-indigo-600" />
          <span className="text-sm text-zinc-300">Featured</span>
        </label>
        <Input
          label="Order"
          type="number"
          {...register("order", { valueAsNumber: true })}
          className="w-24"
        />
      </div>

      <Button type="submit" loading={isSubmitting}>
        {initial ? "Save changes" : "Create project"}
      </Button>
    </form>
  );
}
