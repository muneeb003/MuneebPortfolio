"use client";

import type { Currently } from "@/types";
import { StaggerContainer, StaggerItem, SplitHeading } from "@/components/ui/Animate";

const CARD_META: Record<string, { title: string; pulse?: boolean }> = {
  reading:   { title: "Reading"       },
  building:  { title: "Building", pulse: true },
  listening: { title: "Listening"     },
  obsessed:  { title: "Obsessed with" },
};

export function CurrentlySection({ items }: { items: Currently[] }) {
  if (!items.length) return null;

  const order  = ["reading", "building", "listening", "obsessed"];
  const sorted = [...items].sort((a, b) => order.indexOf(a.card_type) - order.indexOf(b.card_type));

  return (
    <section id="currently" className="py-24 px-6 max-w-5xl mx-auto">
      <SplitHeading className="text-3xl font-bold text-zinc-100 mb-12">Currently</SplitHeading>

      <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {sorted.map((item) => {
          const meta = CARD_META[item.card_type];
          return (
            <StaggerItem key={item.id}>
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5 flex flex-col gap-3 hover:border-zinc-600 hover:-translate-y-1 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-zinc-500 font-medium uppercase tracking-wider">
                    {meta.title}
                  </span>
                  {meta.pulse && (
                    <span className="flex h-2 w-2">
                      <span className="animate-ping absolute h-2 w-2 rounded-full bg-indigo-400 opacity-75" />
                      <span className="relative rounded-full h-2 w-2 bg-indigo-500" />
                    </span>
                  )}
                </div>
                <div className="text-4xl">{item.emoji}</div>
                <div>
                  {item.link_url ? (
                    <a href={item.link_url} target="_blank" rel="noopener noreferrer" className="font-semibold text-zinc-100 hover:text-indigo-400 transition-colors">
                      {item.label}
                    </a>
                  ) : (
                    <span className="font-semibold text-zinc-100">{item.label}</span>
                  )}
                  {item.sublabel && (
                    <p className="text-sm text-zinc-500 mt-0.5">{item.sublabel}</p>
                  )}
                </div>
              </div>
            </StaggerItem>
          );
        })}
      </StaggerContainer>
    </section>
  );
}
