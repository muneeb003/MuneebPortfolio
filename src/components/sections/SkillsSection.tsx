"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import type { SkillCategory, Skill } from "@/types";
import { SplitHeading } from "@/components/ui/Animate";

function isDark(hex: string) {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 < 50;
}

function resolveColor(color: string | null) {
  if (!color || isDark(color)) return "#6366f1";
  return color;
}

const LEVEL_LABELS: Record<number, string> = {
  1: "Learning",
  2: "Familiar",
  3: "Comfortable",
  4: "Proficient",
  5: "Expert",
};

function SkillBar({
  skill,
  delay,
  inView,
}: {
  skill: Skill;
  delay: number;
  inView: boolean;
}) {
  const color = resolveColor(skill.color);
  const pct = skill.proficiency * 20;

  const [count, setCount] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [shimmer, setShimmer] = useState(false);
  const [fillKey, setFillKey] = useState(0); // bump to re-trigger fill
  const rafRef = useRef(0);

  const runFill = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    setCount(0);
    setShimmer(false);

    const startTime = performance.now();
    const duration = 650;

    function tick(now: number) {
      const elapsed = now - startTime;
      const t = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setCount(Math.round(eased * pct));
      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setCount(pct);
        setShimmer(true);
        setTimeout(() => setShimmer(false), 800);
      }
    }

    rafRef.current = requestAnimationFrame(tick);
  }, [pct]);

  // Trigger fill when scrolled into view
  useEffect(() => {
    if (!inView) return;
    const t = setTimeout(runFill, delay);
    return () => {
      clearTimeout(t);
      cancelAnimationFrame(rafRef.current);
    };
  }, [inView, delay, fillKey, runFill]);

  // Click: burst and refill
  const handleClick = () => {
    setCount(0);
    setFillKey((k) => k + 1);
  };

  return (
    <div
      className="group cursor-pointer"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(14px)",
        transition: `opacity 0.4s ease ${delay}ms, transform 0.4s ease ${delay}ms`,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={handleClick}
    >
      {/* Label row */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span
            className="w-2 h-2 rounded-full flex-shrink-0"
            style={{
              backgroundColor: color,
              boxShadow: hovered ? `0 0 8px ${color}` : "none",
              transform: hovered ? "scale(1.6)" : "scale(1)",
              transition: "transform 0.2s, box-shadow 0.2s",
            }}
          />
          <span className="text-sm font-medium text-zinc-200 group-hover:text-white transition-colors">
            {skill.name}
          </span>
        </div>

        {/* Flips between % and label on hover */}
        <span
          className="text-xs font-mono tabular-nums transition-all duration-200"
          style={{ color: hovered ? color : "rgb(113 113 122)" }}
        >
          {hovered ? LEVEL_LABELS[skill.proficiency] : `${count}%`}
        </span>
      </div>

      {/* Bar */}
      <div className="relative h-[3px] bg-zinc-800 rounded-full overflow-hidden">
        <div
          className={shimmer ? "skill-shimmer" : ""}
          style={{
            position: "absolute",
            inset: 0,
            width: `${count}%`,
            backgroundColor: color,
            borderRadius: 9999,
            boxShadow: hovered ? `0 0 12px ${color}99` : "none",
            // Spring overshoot easing on the fill
            transition: `width 0.65s cubic-bezier(0.34,1.4,0.64,1), box-shadow 0.3s`,
          }}
        />
      </div>
    </div>
  );
}

function CategoryColumn({
  category,
  baseDelay,
}: {
  category: SkillCategory & { skills: Skill[] };
  baseDelay: number;
}) {
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setInView(true); },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const sorted = [...(category.skills ?? [])].sort((a, b) => a.order - b.order);

  return (
    <div ref={ref} className="flex flex-col gap-5">
      <div
        className="flex items-center gap-3"
        style={{
          opacity: inView ? 1 : 0,
          transition: `opacity 0.4s ease ${baseDelay}ms`,
        }}
      >
        <span className="text-xs font-mono tracking-widest uppercase text-zinc-500">
          {category.name}
        </span>
        <div className="flex-1 h-px bg-zinc-800" />
        <span className="text-xs text-zinc-600">{sorted.length}</span>
      </div>

      <div className="flex flex-col gap-5">
        {sorted.map((skill, i) => (
          <SkillBar
            key={skill.id}
            skill={skill}
            inView={inView}
            delay={baseDelay + 80 + i * 70}
          />
        ))}
      </div>
    </div>
  );
}

export function SkillsSection({
  categories,
}: {
  categories: (SkillCategory & { skills: Skill[] })[];
}) {
  const filled = categories.filter((c) => c.skills?.length);
  if (!filled.length) return null;

  return (
    <section id="skills" className="py-24 px-6 max-w-5xl mx-auto">
      <SplitHeading className="text-3xl font-bold text-zinc-100 mb-3">Skills</SplitHeading>
      <p className="text-zinc-400 mb-14">
        Hover a skill to see the level — click to replay.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {filled.map((cat, i) => (
          <CategoryColumn key={cat.id} category={cat} baseDelay={i * 120} />
        ))}
      </div>
    </section>
  );
}
