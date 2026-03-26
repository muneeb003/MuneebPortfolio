"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import type { Mood } from "@/types";

export function MoodEditor({ initial }: { initial: Mood | null }) {
  const [saved, setSaved] = useState(false);
  const { register, handleSubmit, watch, formState: { isSubmitting } } = useForm({
    defaultValues: {
      text: initial?.text ?? "",
      link_url: initial?.link_url ?? "",
      is_visible: initial?.is_visible ?? false,
    },
  });

  const isVisible = watch("is_visible");

  async function onSubmit(data: { text: string; link_url: string; is_visible: boolean }) {
    await fetch("/api/mood", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
      <p className="text-sm text-zinc-400 mb-5">
        The mood bar is a persistent strip at the top of the site. Great for sharing what you&apos;re listening to, thinking about, or working on.
      </p>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Text"
          {...register("text")}
          placeholder="Currently vibing to: Tame Impala"
        />
        <Input
          label="Link URL (optional)"
          {...register("link_url")}
          placeholder="https://open.spotify.com/..."
        />
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            {...register("is_visible")}
            className="w-4 h-4 rounded accent-indigo-600"
          />
          <span className="text-sm text-zinc-300">
            {isVisible ? "Visible on site" : "Hidden from site"}
          </span>
        </label>
        <div className="flex items-center gap-3">
          <Button type="submit" loading={isSubmitting}>Save</Button>
          {saved && <span className="text-sm text-green-400">Saved!</span>}
        </div>
      </form>
    </div>
  );
}
