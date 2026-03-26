"use client";

import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { About, Experience } from "@/types";
import { formatDateRange } from "@/lib/utils";
import { FadeUp, SlideLeft, SlideRight, StaggerContainer, StaggerItem, SplitHeading, Parallax } from "@/components/ui/Animate";

interface AboutSectionProps {
  about: About;
  experience: Experience[];
}

export function AboutSection({ about, experience }: AboutSectionProps) {
  const socials = [
    { href: about.github_url,                        label: "GitHub"   },
    { href: about.linkedin_url,                      label: "LinkedIn" },
    { href: about.twitter_url,                       label: "Twitter"  },
    { href: about.email ? `mailto:${about.email}` : null, label: "Email" },
  ].filter((s) => s.href);

  return (
    <section id="about" className="py-24 px-6 max-w-5xl mx-auto">
      <div className="grid md:grid-cols-2 gap-16 items-start">

        {/* Avatar + socials */}
        <SlideLeft>
          <div className="flex flex-col items-center md:items-start gap-6">
            {about.avatar_url && (
              <Parallax speed={0.2}>
                <div className="relative w-48 h-48 rounded-2xl overflow-hidden ring-2 ring-zinc-700">
                  <Image src={about.avatar_url} alt="Avatar" fill sizes="192px" className="object-cover" />
                </div>
              </Parallax>
            )}
            <div>
              <div className="flex flex-wrap gap-3">
                {socials.map((s) => (
                  <a
                    key={s.label}
                    href={s.href!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-zinc-400 hover:text-zinc-100 border border-zinc-700 hover:border-zinc-500 px-3 py-1 rounded-full transition-colors"
                  >
                    {s.label}
                  </a>
                ))}
              </div>
              {about.location_label && (
                <p className="text-sm text-zinc-500 mt-3">📍 {about.location_label}</p>
              )}
            </div>
          </div>
        </SlideLeft>

        {/* Bio */}
        <SlideRight delay={0.1}>
          <SplitHeading className="text-3xl font-bold text-zinc-100 mb-2">About me</SplitHeading>
          {about.bio_short && (
            <p className="text-indigo-400 text-lg mb-4">{about.bio_short}</p>
          )}
          <div className="prose prose-invert prose-zinc max-w-none text-zinc-300">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{about.bio_long}</ReactMarkdown>
          </div>
        </SlideRight>
      </div>

      {/* Experience timeline */}
      {experience.length > 0 && (
        <div className="mt-20">
          <FadeUp>
            <h3 className="text-xl font-bold text-zinc-100 mb-8">Experience</h3>
          </FadeUp>
          <StaggerContainer className="relative pl-6 border-l border-zinc-800 space-y-8">
            {experience.map((exp) => (
              <StaggerItem key={exp.id}>
                <div className="relative">
                  <span className="absolute -left-[29px] top-1 w-3 h-3 rounded-full bg-indigo-500 ring-4 ring-zinc-950" />
                  <div className="text-xs text-zinc-500 mb-1 font-mono">
                    {formatDateRange(exp.start_date, exp.end_date)}
                  </div>
                  <div className="font-semibold text-zinc-100">{exp.role}</div>
                  <div className="text-sm text-zinc-400">
                    {exp.company_url ? (
                      <a href={exp.company_url} target="_blank" rel="noopener noreferrer" className="hover:text-zinc-200">
                        {exp.company}
                      </a>
                    ) : exp.company}
                  </div>
                  {exp.description && (
                    <p className="text-sm text-zinc-400 mt-2">{exp.description}</p>
                  )}
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      )}
    </section>
  );
}
