"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import type { Project } from "@/types";
import { SplitHeading } from "@/components/ui/Animate";

const EASE = [0.22, 1, 0.36, 1] as const;

function IconExternalLink() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}
function IconGitHub() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58 0-.28-.01-1.03-.02-2.03-3.34.73-4.04-1.61-4.04-1.61-.54-1.38-1.33-1.74-1.33-1.74-1.09-.74.08-.73.08-.73 1.2.09 1.84 1.24 1.84 1.24 1.07 1.83 2.8 1.3 3.49 1 .11-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.14-.3-.54-1.52.1-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 3-.4c1.02.005 2.04.14 3 .4 2.28-1.55 3.29-1.23 3.29-1.23.64 1.66.24 2.88.12 3.18.77.84 1.23 1.91 1.23 3.22 0 4.61-2.81 5.63-5.48 5.92.43.37.81 1.1.81 2.22 0 1.6-.01 2.9-.01 3.29 0 .32.21.7.83.58C20.57 21.8 24 17.3 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

// ── Left sticky preview panel ──────────────────────────────────────────────────
function PreviewPanel({
  project,
  index,
  total,
  rightRef,
}: {
  project: Project;
  index: number;
  total: number;
  rightRef: React.RefObject<HTMLDivElement>;
}) {
  const { scrollYProgress } = useScroll({
    target: rightRef,
    offset: ["start start", "end end"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], ["-4%", "4%"]);

  return (
    <div className="sticky top-0 h-screen flex flex-col justify-center gap-4">
      <AnimatePresence mode="wait">
        <motion.div
          key={project.id}
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.97 }}
          transition={{ duration: 0.4, ease: EASE }}
          className="relative w-full rounded-2xl bg-zinc-900 border border-zinc-800/60"
          style={{ aspectRatio: "16/9", boxShadow: "0 24px 60px rgba(0,0,0,0.5)" }}
        >
          {project.cover_image_url ? (
            <motion.div className="absolute inset-0" style={{ y: imageY }}>
              <Image
                src={project.cover_image_url}
                alt={project.title}
                fill
                sizes="(max-width: 1024px) 0px, 50vw"
                className="object-contain"
                priority
              />
            </motion.div>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/30 via-zinc-900 to-zinc-950 flex items-center justify-center">
              <span className="text-zinc-700 text-sm font-mono">no preview</span>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Counter + progress */}
      <div className="flex items-center gap-2 px-1">
        <span className="text-[11px] font-bold text-zinc-600 font-mono shrink-0">
          {index + 1} / {total}
        </span>
        {Array.from({ length: total }).map((_, i) => (
          <motion.div
            key={i}
            animate={{
              width: i === index ? 28 : 6,
              background: i === index ? "#6366f1" : i < index ? "#52525b" : "#27272a",
            }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="h-1 rounded-full"
          />
        ))}
        <span className="ml-auto text-[10px] text-zinc-600 font-mono">
          {Math.round(((index + 1) / total) * 100)}%
        </span>
      </div>
    </div>
  );
}

// ── Right-side project entry ───────────────────────────────────────────────────
function ProjectEntry({
  project,
  index,
  onInView,
}: {
  project: Project;
  index: number;
  onInView: (i: number) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) onInView(index); },
      { threshold: 0.45 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [index, onInView]);

  const stagger = {
    container: { animate: { transition: { staggerChildren: 0.07 } } },
    item: {
      initial: { opacity: 0, y: 22 },
      animate: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE } },
    },
  };

  return (
    <motion.div
      ref={ref}
      className="min-h-[60vh] sm:min-h-[88vh] flex items-center py-12 sm:py-20 border-b border-zinc-800/40 last:border-0"
    >
      {/* Mobile image */}
      <div className="lg:hidden relative w-full overflow-hidden rounded-2xl bg-zinc-900 border border-zinc-800/60 mb-8"
        style={{ aspectRatio: "16/9", boxShadow: "0 8px 30px rgba(0,0,0,0.4)" }}>
        {project.cover_image_url ? (
          <Image src={project.cover_image_url} alt={project.title} fill sizes="100vw" className="object-cover object-center" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/30 to-zinc-900" />
        )}
      </div>

      <motion.div
        className="w-full space-y-6"
        initial="initial"
        whileInView="animate"
        viewport={{ once: false, margin: "-20% 0px -20% 0px" }}
        variants={stagger.container}
      >
        {/* Index + featured */}
        <motion.div variants={stagger.item} className="flex items-center gap-3">
          <span className="text-xs font-black text-zinc-600 font-mono tabular-nums">
            {String(index + 1).padStart(2, "0")}
          </span>
          {project.featured && (
            <span className="text-[9px] font-bold uppercase tracking-widest text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-full">
              Featured
            </span>
          )}
        </motion.div>

        {/* Title */}
        <motion.h3
          variants={stagger.item}
          className="text-2xl sm:text-3xl lg:text-4xl font-bold text-zinc-100 leading-tight tracking-tight"
        >
          {project.title}
        </motion.h3>

        {/* Description */}
        <motion.p variants={stagger.item} className="text-base text-zinc-400 leading-relaxed max-w-sm">
          {project.description_short}
        </motion.p>

        {/* Long description */}
        {project.description_long && (
          <motion.p variants={stagger.item} className="text-sm text-zinc-500 leading-relaxed max-w-sm">
            {project.description_long}
          </motion.p>
        )}

        {/* Tech stack */}
        <motion.div variants={stagger.item} className="flex flex-wrap gap-2">
          {project.tech_stack.map((t) => (
            <span key={t} className="text-xs text-zinc-400 bg-zinc-800/80 border border-zinc-700/50 px-3 py-1 rounded-full">
              {t}
            </span>
          ))}
        </motion.div>

        {/* Buttons */}
        <motion.div variants={stagger.item} className="flex flex-wrap gap-3 pt-2">
          {project.demo_url && (
            <motion.a
              href={project.demo_url}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.04, y: -1 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              className="flex items-center gap-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 px-5 py-2.5 rounded-xl transition-colors"
            >
              <IconExternalLink /> Live Demo
            </motion.a>
          )}
          {project.github_url && (
            <motion.a
              href={project.github_url}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.04, y: -1 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              className="flex items-center gap-2 text-sm font-semibold text-zinc-300 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 px-5 py-2.5 rounded-xl transition-colors"
            >
              <IconGitHub /> View Code
            </motion.a>
          )}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

// ── Section ────────────────────────────────────────────────────────────────────
export function ProjectsSection({ projects }: { projects: Project[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const rightRef = useRef<HTMLDivElement>(null);
  const onInView = useCallback((i: number) => setActiveIndex(i), []);

  if (!projects.length) return null;

  const active = projects[activeIndex];

  return (
    <section id="projects" className="py-24 px-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          <SplitHeading className="text-3xl font-bold text-zinc-100 mb-2">Projects</SplitHeading>
          <p className="text-sm text-zinc-600">{projects.length} things built so far. Scroll to explore.</p>
        </motion.div>
      </div>

      {/* ── Mobile cards ── */}
      <div className="lg:hidden space-y-4">
        {projects.map((project, i) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: "-40px" }}
            transition={{ duration: 0.45, delay: i * 0.05, ease: EASE }}
            className="rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900"
          >
            {/* Image */}
            <div className="relative w-full bg-zinc-800" style={{ aspectRatio: "16/9" }}>
              {project.cover_image_url ? (
                <Image src={project.cover_image_url} alt={project.title} fill sizes="100vw" className="object-contain" />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/30 to-zinc-900" />
              )}
            </div>
            {/* Content */}
            <div className="p-4 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-bold text-zinc-100 text-base leading-snug">{project.title}</h3>
                {project.featured && (
                  <span className="shrink-0 text-[9px] font-bold uppercase tracking-widest text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-full">
                    Featured
                  </span>
                )}
              </div>
              <p className="text-xs text-zinc-500 leading-relaxed line-clamp-2">{project.description_short}</p>
              <div className="flex flex-wrap gap-1.5">
                {project.tech_stack.slice(0, 5).map((t) => (
                  <span key={t} className="text-[10px] text-zinc-500 bg-zinc-800 border border-zinc-700/50 px-2 py-0.5 rounded-full">{t}</span>
                ))}
              </div>
              <div className="flex gap-2 pt-1">
                {project.demo_url && (
                  <a href={project.demo_url} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 px-3 py-2 rounded-xl transition-colors">
                    <IconExternalLink /> Demo
                  </a>
                )}
                {project.github_url && (
                  <a href={project.github_url} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs font-semibold text-zinc-300 bg-zinc-800 border border-zinc-700 px-3 py-2 rounded-xl transition-colors">
                    <IconGitHub /> Code
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ── Desktop sticky layout ── */}
      <div className="hidden lg:grid lg:grid-cols-2 lg:gap-20">
        <div>
          <PreviewPanel
            project={active}
            index={activeIndex}
            total={projects.length}
            rightRef={rightRef as React.RefObject<HTMLDivElement>}
          />
        </div>
        <div ref={rightRef}>
          {projects.map((project, i) => (
            <ProjectEntry
              key={project.id}
              project={project}
              index={i}
              onInView={onInView}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
