"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import type { SiteMeta } from "@/types";

export function SiteMetaForm({ initial }: { initial: SiteMeta | null }) {
  const [saved, setSaved] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      site_title: initial?.site_title ?? "",
      hero_headline: initial?.hero_headline ?? "",
      hero_subheadline: initial?.hero_subheadline ?? "",
      hero_cta_label: initial?.hero_cta_label ?? "",
      hero_cta_url: initial?.hero_cta_url ?? "",
    },
  });

  async function onSubmit(data: Record<string, string>) {
    await fetch("/api/site-meta", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <section className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
      <h2 className="text-base font-semibold text-zinc-100 mb-5">
        Site Settings
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input label="Site title (browser tab)" {...register("site_title")} />
        <Input
          label="Hero headline"
          {...register("hero_headline")}
          placeholder="I'm Muneeb."
        />
        <Input
          label="Hero sub-headline"
          {...register("hero_subheadline")}
          placeholder="I build things for the web."
        />
        <div className="grid grid-cols-2 gap-4">
          <Input label="CTA button label" {...register("hero_cta_label")} />
          <Input label="CTA button URL" {...register("hero_cta_url")} />
        </div>
        <div className="flex items-center gap-3">
          <Button type="submit" loading={isSubmitting}>
            Save
          </Button>
          {saved && <span className="text-sm text-green-400">Saved!</span>}
        </div>
      </form>
    </section>
  );
}
