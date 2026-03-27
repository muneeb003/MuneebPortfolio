"use client";

import { motion } from "framer-motion";
import type { Experience } from "@/types";
import { formatDateRange } from "@/lib/utils";
import { FadeUp, SplitHeading } from "@/components/ui/Animate";

const EASE = [0.22, 1, 0.36, 1] as const;

const ACCENTS = [
  { color: "#6366f1", from: "#6366f1", to: "#8b5cf6", badge: "bg-indigo-500/10 text-indigo-300 border-indigo-500/20",  company: "hover:text-indigo-300"  },
  { color: "#a855f7", from: "#a855f7", to: "#ec4899", badge: "bg-purple-500/10 text-purple-300 border-purple-500/20",  company: "hover:text-purple-300"  },
  { color: "#10b981", from: "#10b981", to: "#06b6d4", badge: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20", company: "hover:text-emerald-300" },
  { color: "#f59e0b", from: "#f59e0b", to: "#ef4444", badge: "bg-amber-500/10 text-amber-300 border-amber-500/20",    company: "hover:text-amber-300"   },
  { color: "#ec4899", from: "#ec4899", to: "#a855f7", badge: "bg-pink-500/10 text-pink-300 border-pink-500/20",       company: "hover:text-pink-300"    },
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
        <span className="text-sm text-zinc-600 font-mono mb-0.5">
          {experience.length} role{experience.length !== 1 ? "s" : ""}
        </span>
      </FadeUp>

      {/* Timeline wrapper */}
      <div className="relative">

        {/* Gradient track line */}
        <div
          className="absolute top-6 bottom-6 w-0.5 rounded-full"
          style={{
            left: "21px",
            background:
              "linear-gradient(to bottom, #6366f1, #a855f7 40%, #10b981 75%, #f59e0b)",
            opacity: 0.35,
          }}
        />

        <div className="space-y-10">
          {experience.map((exp, i) => {
            const accent    = ACCENTS[i % ACCENTS.length];
            const isCurrent = !exp.end_date;

            return (
              <div
                key={exp.id}
                className="flex items-start gap-5"
              >
                {/* ── Stamp dot ── */}
                <div className="relative z-10 shrink-0 flex flex-col items-center" style={{ width: "44px" }}>

                  {/* Pulse ring — current only */}
                  {isCurrent && (
                    <span
                      className="absolute top-0 left-0 w-11 h-11 rounded-full animate-ping"
                      style={{ background: accent.color, opacity: 0.18 }}
                    />
                  )}

                  {/* Numbered circle */}
                  <motion.div
                    initial={{ scale: 0, rotate: -90 }}
                    whileInView={{ scale: 1, rotate: 0 }}
                    viewport={{ once: false }}
                    transition={{
                      type: "spring",
                      stiffness: 220,
                      damping: 16,
                      delay: i * 0.1,
                    }}
                    className="w-11 h-11 rounded-full flex items-center justify-center font-black text-sm tabular-nums select-none"
                    style={{
                      background: `${accent.color}18`,
                      border: `2px solid ${accent.color}`,
                      color: accent.color,
                      boxShadow: `0 0 18px ${accent.color}35`,
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </motion.div>
                </div>

                {/* ── Card ── */}
                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false, margin: "-40px" }}
                  transition={{ duration: 0.7, delay: i * 0.1, ease: EASE }}
                  whileHover={{ y: -5 }}
                  className="flex-1 overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 shadow-xl shadow-black/20"
                >
                  {/* Colored top bar */}
                  <div
                    className="h-1 w-full"
                    style={{
                      background: `linear-gradient(to right, ${accent.from}, ${accent.to})`,
                    }}
                  />

                  <div className="p-5">
                    {/* Role + "Now" badge */}
                    <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-0.5">
                          <h3 className="text-lg font-bold text-zinc-100 leading-snug">
                            {exp.role}
                          </h3>
                          {isCurrent && (
                            <span
                              className="flex items-center gap-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full border"
                              style={{
                                color: accent.color,
                                background: `${accent.color}15`,
                                borderColor: `${accent.color}40`,
                              }}
                            >
                              <span
                                className="w-1.5 h-1.5 rounded-full animate-pulse"
                                style={{ background: accent.color }}
                              />
                              Now
                            </span>
                          )}
                        </div>

                        {/* Company */}
                        <p className="text-sm text-zinc-500">
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
                      </div>

                      {/* Date + duration */}
                      <div className="flex items-center gap-2 shrink-0">
                        <span
                          className={`text-xs font-mono px-2.5 py-1 rounded-full border ${accent.badge}`}
                        >
                          {formatDateRange(exp.start_date, exp.end_date)}
                        </span>
                        <span className="hidden sm:block text-[11px] text-zinc-600 font-mono">
                          · {getDuration(exp.start_date, exp.end_date)}
                        </span>
                      </div>
                    </div>

                    {/* Description */}
                    {exp.description && (
                      <p className="text-sm text-zinc-400 leading-relaxed border-t border-zinc-800 pt-3">
                        {exp.description}
                      </p>
                    )}
                  </div>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
