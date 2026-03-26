"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactSchema, type ContactFormData } from "@/lib/validations/contact.schema";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import type { About } from "@/types";
import { SlideLeft, SlideRight, SplitHeading } from "@/components/ui/Animate";

export function ContactSection({ about }: { about: About }) {
  const [sent, setSent] = useState(false);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  async function onSubmit(data: ContactFormData) {
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      setSent(true);
      reset();

      // Confetti burst
      import("canvas-confetti").then(({ default: confetti }) => {
        confetti({ particleCount: 120, spread: 80, origin: { y: 0.7 } });
      });
    }
  }

  return (
    <section id="contact" className="py-24 px-6 max-w-5xl mx-auto">
      <div className="grid md:grid-cols-2 gap-16">
        <SlideLeft>
        <div>
          <SplitHeading className="text-3xl font-bold text-zinc-100 mb-4">Get in touch</SplitHeading>
          <p className="text-zinc-400 mb-6">
            Have a project in mind or just want to chat? My inbox is always open.
          </p>
          <div className="space-y-3">
            {about.email && (
              <a href={`mailto:${about.email}`} className="flex items-center gap-2 text-zinc-400 hover:text-zinc-100 transition-colors">
                <span>✉</span>
                <span>{about.email}</span>
              </a>
            )}
            {about.linkedin_url && (
              <a href={about.linkedin_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-zinc-400 hover:text-zinc-100 transition-colors">
                <span>🔗</span>
                <span>LinkedIn</span>
              </a>
            )}
            {about.github_url && (
              <a href={about.github_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-zinc-400 hover:text-zinc-100 transition-colors">
                <span>🐙</span>
                <span>GitHub</span>
              </a>
            )}
          </div>
        </div>
        </SlideLeft>

        <SlideRight delay={0.15}>
        <div>
          {sent ? (
            <div className="flex flex-col items-center justify-center h-full py-12 text-center">
              <div className="text-5xl mb-4">🎉</div>
              <p className="text-xl font-semibold text-zinc-100">Message sent!</p>
              <p className="text-zinc-400 mt-2">I'll get back to you soon.</p>
              <button
                className="mt-4 text-sm text-indigo-400 hover:underline"
                onClick={() => setSent(false)}
              >
                Send another
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input label="Name" {...register("name")} error={errors.name?.message} />
                <Input label="Email" type="email" {...register("email")} error={errors.email?.message} />
              </div>
              <Input label="Subject" {...register("subject")} error={errors.subject?.message} />
              <Textarea label="Message" {...register("message")} error={errors.message?.message} rows={5} />
              <Button type="submit" loading={isSubmitting}>Send message</Button>
            </form>
          )}
        </div>
        </SlideRight>
      </div>
    </section>
  );
}
