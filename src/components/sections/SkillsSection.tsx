"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import type { SkillCategory, Skill } from "@/types";
import { FadeUp, SplitHeading } from "@/components/ui/Animate";

const EASE = [0.22, 1, 0.36, 1] as const;
const KEYS_PER_ROW = [8, 7, 7, 6, 5];
const ROW_STAGGER_PX = 18;

// ── Color utils ───────────────────────────────────────────────────────────────
function parseHex(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  return [parseInt(h.slice(0,2),16), parseInt(h.slice(2,4),16), parseInt(h.slice(4,6),16)];
}
function lighten(hex: string, amt: number) {
  const [r,g,b] = parseHex(hex);
  return `rgb(${Math.min(255,r+amt)},${Math.min(255,g+amt)},${Math.min(255,b+amt)})`;
}
function darken(hex: string, factor: number) {
  const [r,g,b] = parseHex(hex);
  return `rgb(${Math.round(r*factor)},${Math.round(g*factor)},${Math.round(b*factor)})`;
}
function resolveColor(color: string | null): string {
  if (!color) return "#6366f1";
  const h = color.replace("#","");
  if (h.length !== 6) return "#6366f1";
  const [r,g,b] = parseHex(color);
  if ((r*299 + g*587 + b*114)/1000 < 35) return "#6366f1";
  return color;
}

function buildRows(skills: Skill[]): Skill[][] {
  const rows: Skill[][] = [];
  let idx = 0;
  for (const count of KEYS_PER_ROW) {
    if (idx >= skills.length) break;
    rows.push(skills.slice(idx, idx + count));
    idx += count;
  }
  if (idx < skills.length) rows.push(skills.slice(idx));
  return rows;
}

// ── Variants ──────────────────────────────────────────────────────────────────
const capVariants = {
  rest:  { y: 0,   scale: 1,    zIndex: 1  },
  hover: { y: -10, scale: 1.28, zIndex: 30 },
  tap:   { y: 4,   scale: 0.97, zIndex: 30 },
};
const iconVariants  = { rest: { y: 0 }, hover: { y: -6 }, tap: { y: 0 } };
const labelVariants = { rest: { opacity:0, y:4 }, hover: { opacity:1, y:0 }, tap: { opacity:1, y:0 } };

// ── Key ───────────────────────────────────────────────────────────────────────
function Key({ skill }: { skill: Skill }) {
  const [imgError, setImgError] = useState(false);
  const [tapped,   setTapped]   = useState(false);
  const delay = useMemo(() => Math.random() * 0.55, []);

  const color   = resolveColor(skill.color);
  // Front face (visible side wall below keycap)
  const face    = darken(color, 0.52);
  const faceBot = darken(color, 0.38);
  // Top surface: subtle gradient, top slightly lighter
  const surfTop = lighten(color, 28);
  const surfBot = darken(color, 0.90);

  const iconUrl = skill.icon_slug && !imgError
    ? `https://cdn.simpleicons.org/${skill.icon_slug}/ffffff`
    : null;

  const state = tapped ? "tap" : "rest";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: false }}
      transition={{ type: "spring", stiffness: 500, damping: 20, delay }}
      whileHover="hover"
      animate={state}
      onMouseDown={() => setTapped(true)}
      onMouseUp={() => setTapped(false)}
      onMouseLeave={() => setTapped(false)}
      className="relative shrink-0 cursor-pointer select-none"
      style={{ width: 72, height: 82 }}
    >
      {/* Keycap */}
      <motion.div
        variants={capVariants}
        transition={{ type: "spring", stiffness: 380, damping: 24 }}
        className="absolute top-0 inset-x-0 flex flex-col items-center justify-center"
        style={{
          height: 72,
          borderRadius: 7,
          /* Subtle top-to-bottom surface gradient */
          background: `linear-gradient(180deg, ${surfTop} 0%, ${color} 30%, ${surfBot} 100%)`,
          boxShadow: tapped
            ? `
              0 0 0 1px rgba(0,0,0,0.55),
              0 1px 0 ${face},
              0 2px 0 ${faceBot},
              0 3px 6px rgba(0,0,0,0.4),
              inset 0 1px 0 rgba(255,255,255,0.25),
              inset 0 0 10px rgba(0,0,0,0.15)
            `
            : `
              0 0 0 1px rgba(0,0,0,0.55),
              0 4px 0 ${face},
              0 6px 0 ${faceBot},
              0 8px 18px rgba(0,0,0,0.5),
              inset 0 1px 0 rgba(255,255,255,0.35),
              inset 1px 0 0 rgba(255,255,255,0.1),
              inset -1px 0 0 rgba(0,0,0,0.15),
              inset 0 0 14px rgba(0,0,0,0.12)
            `,
          transition: "box-shadow 0.06s ease",
        }}
      >
        {/* Top-left specular glint */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ borderRadius: 7 }}>
          <div style={{
            position: "absolute",
            top: "6%", left: "8%",
            width: "50%", height: "35%",
            background: "radial-gradient(ellipse at 25% 25%, rgba(255,255,255,0.18) 0%, transparent 70%)",
          }} />
        </div>

        {/* Icon */}
        <motion.div
          variants={iconVariants}
          transition={{ type: "spring", stiffness: 340, damping: 22 }}
          className="relative z-10"
        >
          {iconUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={iconUrl} alt={skill.name} width={32} height={32}
              className="object-contain drop-shadow-sm" onError={() => setImgError(true)} draggable={false} />
          ) : (
            <span className="text-base font-black text-white/90 leading-none">
              {skill.name.slice(0,1).toUpperCase()}
            </span>
          )}
        </motion.div>

        {/* Legend — appears on hover */}
        <motion.span
          variants={labelVariants}
          transition={{ duration: 0.14, ease: EASE }}
          className="absolute bottom-1.5 left-0 right-0 text-center pointer-events-none z-10 px-1 truncate"
          style={{ fontSize: 8, fontWeight: 700, color: "rgba(255,255,255,0.82)", letterSpacing: "0.02em" }}
        >
          {skill.name}
        </motion.span>
      </motion.div>
    </motion.div>
  );
}

// ── Section ───────────────────────────────────────────────────────────────────
export function SkillsSection({
  categories,
}: {
  categories: (SkillCategory & { skills: Skill[] })[];
}) {
  const allSkills = categories
    .filter((c) => c.skills?.length)
    .flatMap((c) => c.skills ?? [])
    .sort((a, b) => a.order - b.order);

  if (!allSkills.length) return null;

  const rows = buildRows(allSkills);

  return (
    <section id="skills" className="py-24 px-6 max-w-5xl mx-auto">
      <FadeUp className="mb-14">
        <SplitHeading className="text-3xl font-bold text-zinc-100 mb-2">Skills</SplitHeading>
        <p className="text-sm text-zinc-600">Hover any key.</p>
      </FadeUp>

      <FadeUp>
        <div className="flex justify-center overflow-x-auto pb-12">
          <div className="relative inline-block">

            {/* ── Cast shadow beneath keyboard ── */}
            <div className="absolute pointer-events-none"
              style={{
                bottom: -16, left: "6%", right: "6%", height: 24,
                background: "rgba(0,0,0,0.55)", filter: "blur(20px)", borderRadius: "50%",
              }} />

            {/* ── Top case surface ── */}
            <div style={{
              position: "relative",
              borderRadius: "14px 14px 0 0",
              padding: "18px 20px 20px",
              background: "linear-gradient(180deg, #2e2e34 0%, #26262c 100%)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.10), inset 0 -1px 0 rgba(0,0,0,0.3)",
              borderBottom: "1px solid rgba(0,0,0,0.5)",
            }}>
              {/* Bezel label row */}
              <div className="flex items-center justify-between mb-3 px-0.5">
                <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.18em",
                  textTransform: "uppercase", color: "#444450" }}>
                  MK — 1
                </span>
                <div className="flex gap-1.5">
                  {["#ff5f57","#febc2e","#28c840"].map(c => (
                    <div key={c} style={{ width: 9, height: 9, borderRadius: "50%",
                      background: c, boxShadow: `0 0 6px ${c}55` }} />
                  ))}
                </div>
              </div>

              {/* ── PCB / plate ── */}
              <div style={{
                borderRadius: 10,
                padding: 14,
                background: "#0c0c0f",
                boxShadow: "inset 0 3px 16px rgba(0,0,0,0.95), inset 0 0 0 1px rgba(0,0,0,0.7)",
              }}>
                <div className="flex flex-col gap-2.5">
                  {rows.map((row, rowIdx) => (
                    <div key={rowIdx} className="flex gap-2.5"
                      style={{ marginLeft: rowIdx * ROW_STAGGER_PX }}>
                      {row.map((skill) => (
                        <Key key={skill.id} skill={skill} />
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Front face of case (visible bottom edge) ── */}
            <div style={{
              borderRadius: "0 0 12px 12px",
              height: 20,
              background: "linear-gradient(180deg, #1a1a1f 0%, #141418 100%)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04), 0 4px 0 #0a0a0d, 0 8px 20px rgba(0,0,0,0.6)",
            }} />

            {/* ── Feet / bottom edge ── */}
            <div className="flex justify-between px-6" style={{ marginTop: 4 }}>
              {[0,1].map(i => (
                <div key={i} style={{
                  width: 40, height: 6, borderRadius: "0 0 4px 4px",
                  background: "#0f0f12",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.03)",
                }} />
              ))}
            </div>

          </div>
        </div>
      </FadeUp>
    </section>
  );
}
