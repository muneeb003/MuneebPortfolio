"use client";

import { useState, useOptimistic } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { guestbookSchema, type GuestbookFormData } from "@/lib/validations/guestbook.schema";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import type { GuestbookEntry } from "@/types";
import { FadeUp, StaggerContainer, StaggerItem, SplitHeading } from "@/components/ui/Animate";

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

export function GuestbookSection({ initialEntries }: { initialEntries: GuestbookEntry[] }) {
  const [entries, setEntries] = useState(initialEntries);
  const [submitted, setSubmitted] = useState(false);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<GuestbookFormData>({
    resolver: zodResolver(guestbookSchema),
  });

  async function onSubmit(data: GuestbookFormData) {
    await fetch("/api/guestbook", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setSubmitted(true);
    reset();
  }

  return (
    <section id="guestbook" className="py-24 px-6 max-w-5xl mx-auto">
      <SplitHeading className="text-3xl font-bold text-zinc-100 mb-3">Guestbook</SplitHeading>
      <FadeUp delay={0.2}>
        <p className="text-zinc-400 mb-10">Leave a note — I read every one.</p>
      </FadeUp>

      {/* Entries grid */}
      <StaggerContainer className="columns-1 sm:columns-2 lg:columns-3 gap-4 mb-12">
        {entries.map((entry) => (
          <StaggerItem key={entry.id}>
          <div
            className="break-inside-avoid mb-4 rounded-2xl border border-zinc-800 bg-zinc-900 p-5"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-bold text-white shrink-0">
                {getInitials(entry.name)}
              </div>
              <div>
                <div className="text-sm font-medium text-zinc-200">{entry.name}</div>
                <div className="text-xs text-zinc-500">
                  {new Date(entry.created_at).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                </div>
              </div>
            </div>
            <p className="text-sm text-zinc-300">{entry.message}</p>
          </div>
          </StaggerItem>
        ))}
      </StaggerContainer>

      {/* Submit form */}
      <FadeUp delay={0.2}>
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 max-w-md">
        {submitted ? (
          <div className="text-center py-4">
            <div className="text-3xl mb-2">🎉</div>
            <p className="text-zinc-300 font-medium">Thanks for signing!</p>
            <p className="text-sm text-zinc-500 mt-1">Your message is pending approval.</p>
            <button
              className="mt-3 text-sm text-indigo-400 hover:underline"
              onClick={() => setSubmitted(false)}
            >
              Sign again
            </button>
          </div>
        ) : (
          <>
            <h3 className="font-semibold text-zinc-100 mb-4">Sign the guestbook</h3>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
              <Input
                label="Your name"
                {...register("name")}
                error={errors.name?.message}
                placeholder="Ada Lovelace"
              />
              <Textarea
                label="Your message (max 280 chars)"
                {...register("message")}
                error={errors.message?.message}
                rows={3}
                placeholder="Love the site!"
              />
              <Button type="submit" loading={isSubmitting}>Sign</Button>
            </form>
          </>
        )}
      </div>
      </FadeUp>
    </section>
  );
}
