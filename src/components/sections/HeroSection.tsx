"use client";

import dynamic from "next/dynamic";
import { useEffect, useState, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
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
    <div className="h-10 flex items-center justify-center mb-4">
      <span className="text-3xl font-light text-zinc-100">
        {displayed}
        <span className="inline-block w-[2px] h-8 bg-white ml-1 align-middle" style={{ animation: "blink 1s step-start infinite" }} />
      </span>
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
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
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
        <h1 className="text-5xl sm:text-7xl font-bold text-zinc-100 leading-tight mb-4">
          {meta.hero_headline}
        </h1>
        <p className="text-xl sm:text-2xl text-zinc-300 mb-8">
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
