"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { ImageUploader } from "@/components/admin/ImageUploader";
import type { About } from "@/types";

export function AboutForm({ initialData }: { initialData: About | null }) {
  const [saved, setSaved] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(initialData?.avatar_url ?? "");

  const { register, handleSubmit, formState: { isSubmitting } } = useForm({
    defaultValues: {
      bio_short: initialData?.bio_short ?? "",
      bio_long: initialData?.bio_long ?? "",
      resume_url: initialData?.resume_url ?? "",
      github_url: initialData?.github_url ?? "",
      linkedin_url: initialData?.linkedin_url ?? "",
      twitter_url: initialData?.twitter_url ?? "",
      email: initialData?.email ?? "",
      location_label: initialData?.location_label ?? "",
      location_lat: initialData?.location_lat ?? "",
      location_lng: initialData?.location_lng ?? "",
    },
  });

  async function onSubmit(data: Record<string, unknown>) {
    await fetch("/api/about", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, avatar_url: avatarUrl }),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <section className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
      <h2 className="text-base font-semibold text-zinc-100 mb-5">About</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <ImageUploader value={avatarUrl} onChange={setAvatarUrl} bucket="avatars" label="Avatar" />
        <Input label="Short bio (tagline)" {...register("bio_short")} placeholder="I build things for the web." />
        <Textarea label="Long bio (markdown)" {...register("bio_long")} rows={6} placeholder="Tell your story..." />
        <div className="grid grid-cols-2 gap-4">
          <Input label="GitHub URL" {...register("github_url")} placeholder="https://github.com/..." />
          <Input label="LinkedIn URL" {...register("linkedin_url")} placeholder="https://linkedin.com/in/..." />
          <Input label="Twitter URL" {...register("twitter_url")} placeholder="https://twitter.com/..." />
          <Input label="Email" {...register("email")} placeholder="hello@example.com" />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <Input label="Location label" {...register("location_label")} placeholder="Karachi, Pakistan" />
          <Input label="Latitude" type="number" step="any" {...register("location_lat")} placeholder="24.8607" />
          <Input label="Longitude" type="number" step="any" {...register("location_lng")} placeholder="67.0011" />
        </div>
        <Input label="Resume URL (PDF)" {...register("resume_url")} placeholder="https://..." />

        <div className="flex items-center gap-3">
          <Button type="submit" loading={isSubmitting}>Save changes</Button>
          {saved && <span className="text-sm text-green-400">Saved!</span>}
        </div>
      </form>
    </section>
  );
}
