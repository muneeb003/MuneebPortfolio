import type { ThingILove } from "@/types";

export function ThingsILoveTicker({ items }: { items: ThingILove[] }) {
  if (!items.length) return null;

  // Duplicate for seamless loop
  const doubled = [...items, ...items];

  return (
    <div className="py-6 border-y border-zinc-800 overflow-hidden select-none">
      <div className="flex animate-marquee whitespace-nowrap">
        {doubled.map((item, i) => (
          <span key={i} className="inline-flex items-center gap-2 mx-6 text-sm text-zinc-500">
            <span className="text-base">{item.emoji}</span>
            <span>{item.label}</span>
            <span className="text-zinc-700">·</span>
          </span>
        ))}
      </div>
    </div>
  );
}
