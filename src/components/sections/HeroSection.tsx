"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
  useMotionTemplate,
} from "framer-motion";
import type { SiteMeta, About } from "@/types";

const FluidCanvas = dynamic(() => import("@/components/fluid/FluidCanvas"), { ssr: false });

const GREETINGS = [
  { word: "Hey",        lang: "English"    },
  { word: "Hola",       lang: "Spanish"    },
  { word: "Bonjour",    lang: "French"     },
  { word: "Ciao",       lang: "Italian"    },
  { word: "Hallo",      lang: "German"     },
  { word: "Olá",        lang: "Portuguese" },
  { word: "مرحبا",      lang: "Arabic"     },
  { word: "ہیلو",       lang: "Urdu"       },
  { word: "नमस्ते",     lang: "Hindi"      },
  { word: "やあ",        lang: "Japanese"   },
  { word: "안녕",        lang: "Korean"     },
  { word: "你好",        lang: "Chinese"    },
  { word: "Привет",     lang: "Russian"    },
  { word: "Merhaba",    lang: "Turkish"    },
  { word: "Hoi",        lang: "Dutch"      },
];

function GreetingCycler() {
  const [index, setIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const full = GREETINGS[index].word + "!";

    if (!deleting && displayed.length < full.length) {
      const t = setTimeout(() => setDisplayed(full.slice(0, displayed.length + 1)), 160);
      return () => clearTimeout(t);
    }
    if (!deleting && displayed.length === full.length) {
      const t = setTimeout(() => setDeleting(true), 1800);
      return () => clearTimeout(t);
    }
    if (deleting && displayed.length > 0) {
      const t = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 100);
      return () => clearTimeout(t);
    }
    if (deleting && displayed.length === 0) {
      setDeleting(false);
      setIndex((i) => (i + 1) % GREETINGS.length);
    }
  }, [displayed, deleting, index]);

  return (
    <div className="h-8 flex items-center justify-center mb-3">
      <span className="text-2xl font-light text-zinc-100">
        {displayed}
        <span
          className="inline-block w-[2px] h-8 bg-white ml-1 align-middle"
          style={{ animation: "blink 1s step-start infinite" }}
        />
      </span>
    </div>
  );
}

// ── 3-D cursor-aware avatar ──────────────────────────────────────────────────
function AvatarLens({ src }: { src: string }) {
  const ref = useRef<HTMLDivElement>(null);

  const mX   = useMotionValue(0); // −1 → 1  (left-right look)
  const mY   = useMotionValue(0); // −1 → 1  (up-down look)
  const prox = useMotionValue(0); // 0 far  → 1 close

  // Heavy, inertial spring — feels like a real head turning
  const headCfg = { stiffness: 52, damping: 16, mass: 2.4 };
  const sMX   = useSpring(mX,   headCfg);
  const sMY   = useSpring(mY,   headCfg);
  const sProx = useSpring(prox, { stiffness: 45, damping: 14 });

  // 3-D rotation (max ±22° horizontal, ±16° vertical)
  const rotateY = useTransform(sMX, [-1, 1], [-22, 22]);
  const rotateX = useTransform(sMY, [-1, 1], [16, -16]);
  const scale   = useTransform(sProx, [0, 1], [1, 1.05]);

  // Shadow shifts opposite to tilt — sells the 3-D depth
  const shadowX   = useTransform(sMX,   [-1, 1], [28,  -28]);
  const shadowY   = useTransform(sMY,   [-1, 1], [-22,  22]);
  const shadowBlur = useTransform(sProx, [0, 1],  [60,   90]);
  const boxShadow  = useMotionTemplate`${shadowX}px ${shadowY}px ${shadowBlur}px rgba(0,0,0,0.28), 0 0 80px rgba(99,102,241,0.10)`;

  // Specular sheen moves to the lit face
  const shineX = useTransform(sMX, [-1, 1], [82, 18]);
  const shineY = useTransform(sMY, [-1, 1], [82, 18]);
  const sheen  = useMotionTemplate`radial-gradient(circle at ${shineX}% ${shineY}%, rgba(255,255,255,0.06) 0%, transparent 60%)`;

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const el = ref.current;
      if (!el) return;
      const rect  = el.getBoundingClientRect();
      const cx    = rect.left + rect.width  / 2;
      const cy    = rect.top  + rect.height / 2;
      const dx    = e.clientX - cx;
      const dy    = e.clientY - cy;
      const dist  = Math.hypot(dx, dy);
      const MAX   = 620;

      // Direction × capped-distance — avatar "looks" further as cursor moves away,
      // levels off at MAX. This mirrors how eyes/head actually track.
      const t = Math.min(dist, MAX) / MAX;
      const angle = Math.atan2(dy, dx);
      mX.set(Math.cos(angle) * t);
      mY.set(Math.sin(angle) * t);

      // Glow brightens when cursor is within ~300 px
      prox.set(Math.max(0, 1 - dist / 300));
    };

    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [mX, mY, prox]);

  return (
    <div style={{ perspective: "1100px" }} className="relative w-40 h-40 sm:w-48 sm:h-48 mx-auto">
      <motion.div
        ref={ref}
        style={{ rotateX, rotateY, scale, transformStyle: "preserve-3d", boxShadow }}
        className="relative w-full h-full rounded-3xl overflow-hidden"
      >
        <Image src={src} alt="Avatar" fill sizes="240px" className="object-cover" priority />

        {/* Specular light layer */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{ background: sheen }}
        />
      </motion.div>
    </div>
  );
}

interface HeroSectionProps {
  meta: SiteMeta;
  about: About;
}

export function HeroSection({ meta, about }: HeroSectionProps) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y       = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section ref={ref} id="hero" className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Fluid canvas background */}
      <div className="absolute inset-0 z-0">
        <FluidCanvas />
      </div>

      {/* Overlay for text readability */}
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-zinc-950/40 via-transparent to-zinc-950/80" />

      {/* Hero content */}
      <motion.div style={{ y, opacity }} className="relative z-20 text-center px-6 max-w-3xl">
        <GreetingCycler />

        <h1 className="text-4xl sm:text-5xl font-bold text-zinc-100 leading-tight mb-4">
          {meta.hero_headline}
        </h1>

        {/* Avatar — below the name, before the subheadline */}
        {about.avatar_url && (
          <div className="mb-4">
            <AvatarLens src={about.avatar_url} />
          </div>
        )}

        <p className="text-base sm:text-lg text-zinc-300 mb-6">
          {meta.hero_subheadline}
        </p>

        <div className="flex items-center justify-center gap-4">
          <a
            href={meta.hero_cta_url}
            className="rounded-full bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 font-medium transition-colors"
          >
            {meta.hero_cta_label}
          </a>
          {about.resume_url && (
            <a
              href={about.resume_url}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-zinc-600 hover:border-zinc-400 text-zinc-300 hover:text-zinc-100 px-8 py-3 font-medium transition-colors"
            >
              Resume ↓
            </a>
          )}
        </div>
      </motion.div>

      {/* Scroll hint */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2">
        <span className="text-xs text-zinc-500">scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-zinc-500 to-transparent" />
      </div>
    </section>
  );
}
