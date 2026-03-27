"use client";

import { motion } from "framer-motion";
import type { Experience } from "@/types";
import { formatDateRange } from "@/lib/utils";
import { FadeUp, SplitHeading } from "@/components/ui/Animate";

const EASE = [0.22, 1, 0.36, 1] as const;

const ACCENTS = [
  { dot: "#6366f1", badge: "bg-indigo-500/10 text-indigo-300 border-indigo-500/25",  company: "hover:text-indigo-400"  },
  { dot: "#a855f7", badge: "bg-purple-500/10 text-purple-300 border-purple-500/25",  company: "hover:text-purple-400"  },
  { dot: "#10b981", badge: "bg-emerald-500/10 text-emerald-300 border-emerald-500/25", company: "hover:text-emerald-400" },
  { dot: "#f59e0b", badge: "bg-amber-500/10 text-amber-300 border-amber-500/25",    company: "hover:text-amber-400"   },
  { dot: "#ec4899", badge: "bg-pink-500/10 text-pink-300 border-pink-500/25",       company: "hover:text-pink-400"    },
] as const;

function getDuration(start: string, end: string | null): string {
  const s = new Date(start);
  const e = end ? new Date(end) : new Date();
  const months =
    (e.getFullYear() - s.getFullYear()) * 12 + (e.getMonth() - s.getMonth());
  const yrs = Math.floor(months / 12);
  const mos = months % 12;
  if (yrs === 0) return `${mos}mo`;
  if (mos === 0) return `${yrs}yr`;
  return `${yrs}yr ${mos}mo`;
}

interface ExperienceSectionProps {
  experience: Experience[];
}

export function ExperienceSection({ experience }: ExperienceSectionProps) {
  if (!experience.length) return null;

  return (
    <section id="experience" className="py-24 px-6 max-w-5xl mx-auto">
      <FadeUp className="mb-14 flex items-end gap-3">
        <SplitHeading className="text-3xl font-bold text-zinc-100">
          Experience
        </SplitHeading>
        <span className="text-sm text-zinc-600 font-mono mb-0.5 tabular-nums">
          {experience.length} role{experience.length !== 1 ? "s" : ""}
        </span>
      </FadeUp>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical track */}
        <div
          className="absolute top-0 bottom-0 w-px"
          style={{
            left: "22px",
            background:
              "linear-gradient(to bottom, transparent, #3f3f46 8%, #3f3f46 92%, transparent)",
          }}
        />

        <div className="space-y-10">
          {experience.map((exp, i) => {
            const accent    = ACCENTS[i % ACCENTS.length];
            const isCurrent = !exp.end_date;

            return (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false, margin: "-60px" }}
                transition={{ duration: 0.55, delay: i * 0.08, ease: EASE }}
                className="flex gap-6 items-start"
              >
                {/* ── Dot column ── */}
                <div className="relative z-10 shrink-0 w-11 flex justify-center mt-5">
                  {/* Ping ring — current only */}
                  {isCurrent && (
                    <span
                      className="absolute w-7 h-7 rounded-full animate-ping opacity-30"
                      style={{ background: accent.dot }}
                    />
                  )}
                  {/* Outer halo */}
                  <motion.span
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: false }}
                    transition={{ type: "spring", stiffness: 320, damping: 18, delay: i * 0.1 }}
                    className="relative w-5 h-5 rounded-full border-4 border-zinc-950 flex items-center justify-center"
                    style={{ background: accent.dot, boxShadow: `0 0 12px ${accent.dot}60` }}
                  />
                </div>

                {/* ── Card ── */}
                <div className="flex-1 pb-2">
                  <motion.div
                    whileHover={{ y: -3, x: 3 }}
                    transition={{ type: "spring", stiffness: 280, damping: 20 }}
                    className="relative overflow-hidden rounded-2xl bg-zinc-900/70 border border-zinc-800 hover:border-zinc-700 transition-colors pl-5 pr-6 py-5"
                    style={{ borderLeft: `3px solid ${accent.dot}` }}
                  >
                    {/* Ordinal watermark */}
                    <div
                      className="absolute -right-3 -top-1 text-[88px] font-black leading-none pointer-events-none select-none tabular-nums"
                      style={{ color: accent.dot, opacity: 0.07 }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </div>

                    {/* Content */}
                    <div className="relative z-10">
                      {/* Meta row: date + duration + now badge */}
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <span
                          className={`text-xs font-mono px-2.5 py-1 rounded-full border ${accent.badge}`}
                        >
                          {formatDateRange(exp.start_date, exp.end_date)}
                        </span>

                        <span className="text-[11px] text-zinc-600 font-mono">
                          · {getDuration(exp.start_date, exp.end_date)}
                        </span>

                        {isCurrent && (
                          <span className="flex items-center gap-1.5 text-[10px] font-semibold text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-2 py-0.5 rounded-full">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                            Now
                          </span>
                        )}
                      </div>

                      {/* Role */}
                      <h3 className="text-lg font-bold text-zinc-100 leading-snug">
                        {exp.role}
                      </h3>

                      {/* Company */}
                      <p className="text-sm text-zinc-500 mt-0.5">
                        {exp.company_url ? (
                          <a
                            href={exp.company_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`transition-colors ${accent.company}`}
                          >
                            {exp.company} ↗
                          </a>
                        ) : (
                          exp.company
                        )}
                      </p>

                      {/* Description */}
                      {exp.description && (
                        <p className="text-sm text-zinc-400 mt-3 leading-relaxed">
                          {exp.description}
                        </p>
                      )}
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
