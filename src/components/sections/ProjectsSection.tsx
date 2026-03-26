"use client";

import { useState } from "react";
import Image from "next/image";
import type { Project } from "@/types";
import { cn } from "@/lib/utils";
import { FadeUp, StaggerContainer, StaggerItem, SplitHeading } from "@/components/ui/Animate";

export function ProjectsSection({ projects }: { projects: Project[] }) {
  const allTechs = Array.from(new Set(projects.flatMap((p) => p.tech_stack)));
  const [filter, setFilter] = useState<string | null>(null);
  const filtered = filter ? projects.filter((p) => p.tech_stack.includes(filter)) : projects;

  return (
    <section id="projects" className="py-24 px-6 max-w-5xl mx-auto">
      <FadeUp>
        <SplitHeading className="text-3xl font-bold text-zinc-100 mb-3">Projects</SplitHeading>
      </FadeUp>

      <FadeUp delay={0.1}>
        <div className="flex flex-wrap gap-2 mb-10">
          <button
            className={cn(
              "px-3 py-1 rounded-full text-sm transition-colors",
              filter === null ? "bg-indigo-600 text-white" : "border border-zinc-700 text-zinc-400 hover:text-zinc-100"
            )}
            onClick={() => setFilter(null)}
          >
            All
          </button>
          {allTechs.map((tech) => (
            <button
              key={tech}
              className={cn(
                "px-3 py-1 rounded-full text-sm transition-colors",
                filter === tech ? "bg-indigo-600 text-white" : "border border-zinc-700 text-zinc-400 hover:text-zinc-100"
              )}
              onClick={() => setFilter(tech === filter ? null : tech)}
            >
              {tech}
            </button>
          ))}
        </div>
      </FadeUp>

      <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((project) => (
          <StaggerItem key={project.id}>
            <ProjectCard project={project} />
          </StaggerItem>
        ))}
      </StaggerContainer>
    </section>
  );
}

function ProjectCard({ project }: { project: Project }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className="relative h-64 cursor-pointer"
      style={{ perspective: "1000px" }}
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
    >
      <div
        className="relative w-full h-full transition-transform duration-500"
        style={{
          transformStyle: "preserve-3d",
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* Front */}
        <div
          className="absolute inset-0 rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900"
          style={{ backfaceVisibility: "hidden" }}
        >
          {project.cover_image_url ? (
            <Image src={project.cover_image_url} alt={project.title} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover opacity-70" />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/40 to-zinc-900" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-5">
            <h3 className="font-bold text-zinc-100 text-lg">{project.title}</h3>
            <div className="flex flex-wrap gap-1 mt-2">
              {project.tech_stack.slice(0, 3).map((t) => (
                <span key={t} className="text-xs text-zinc-400 bg-zinc-800/80 px-2 py-0.5 rounded">{t}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 rounded-2xl border border-indigo-800 bg-zinc-900 p-5 flex flex-col justify-between"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <div>
            <h3 className="font-bold text-zinc-100 mb-2">{project.title}</h3>
            <p className="text-sm text-zinc-400 line-clamp-4">{project.description_short}</p>
          </div>
          <div className="flex gap-3">
            {project.demo_url && (
              <a href={project.demo_url} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="text-sm text-indigo-400 hover:text-indigo-300">
                Live demo →
              </a>
            )}
            {project.github_url && (
              <a href={project.github_url} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="text-sm text-zinc-400 hover:text-zinc-200">
                GitHub →
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
