"use client";

import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import type { Currently } from "@/types";

const CARD_LABELS: Record<string, string> = {
  reading: "📖 Currently Reading",
  building: "🛠️ Currently Building",
  listening: "🎧 Currently Listening",
  obsessed: "✨ Currently Obsessed With",
};

export function CurrentlyEditor({ initialItems }: { initialItems: Currently[] }) {
  const [items, setItems] = useState(initialItems);
  const [saved, setSaved] = useState<Record<string, boolean>>({});

  async function save(item: Currently) {
    await fetch(`/api/currently/${item.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        label: item.label,
        sublabel: item.sublabel,
        link_url: item.link_url,
        emoji: item.emoji,
      }),
    });
    setSaved((prev) => ({ ...prev, [item.id]: true }));
    setTimeout(() => setSaved((prev) => ({ ...prev, [item.id]: false })), 2000);
  }

  function update(id: string, field: keyof Currently, value: string) {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, [field]: value } : i)));
  }

  const order = ["reading", "building", "listening", "obsessed"];
  const sorted = [...items].sort((a, b) => order.indexOf(a.card_type) - order.indexOf(b.card_type));

  return (
    <div className="space-y-4">
      {sorted.map((item) => (
        <div key={item.id} className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
          <h3 className="text-sm font-semibold text-zinc-300 mb-4">{CARD_LABELS[item.card_type]}</h3>
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Emoji"
              value={item.emoji}
              onChange={(e) => update(item.id, "emoji", e.target.value)}
            />
            <Input
              label="Label"
              value={item.label}
              onChange={(e) => update(item.id, "label", e.target.value)}
              placeholder="Title / name"
            />
            <Input
              label="Sublabel"
              value={item.sublabel ?? ""}
              onChange={(e) => update(item.id, "sublabel", e.target.value)}
              placeholder="Author, artist, etc."
            />
            <Input
              label="Link URL"
              value={item.link_url ?? ""}
              onChange={(e) => update(item.id, "link_url", e.target.value)}
              placeholder="https://..."
            />
          </div>
          <div className="flex items-center gap-3 mt-3">
            <Button size="sm" onClick={() => save(item)}>Save</Button>
            {saved[item.id] && <span className="text-xs text-green-400">Saved!</span>}
          </div>
        </div>
      ))}
    </div>
  );
}
