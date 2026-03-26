"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import type { ContactSubmission } from "@/types";

export function ContactTable({ initialData }: { initialData: ContactSubmission[] }) {
  const [items, setItems] = useState(initialData);
  const [expanded, setExpanded] = useState<string | null>(null);

  async function markRead(id: string) {
    await fetch(`/api/contact/submissions/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_read: true }),
    });
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, is_read: true } : i)));
  }

  const unread = items.filter((i) => !i.is_read).length;

  return (
    <div>
      <p className="text-sm text-zinc-400 mb-4">
        {unread} unread · {items.length} total
      </p>
      <div className="space-y-2">
        {items.map((item) => (
          <div
            key={item.id}
            className={`rounded-xl border bg-zinc-900 ${item.is_read ? "border-zinc-800" : "border-indigo-800"}`}
          >
            <button
              className="w-full text-left px-5 py-4 flex items-center justify-between gap-4"
              onClick={() => setExpanded(expanded === item.id ? null : item.id)}
            >
              <div className="flex items-center gap-3 min-w-0">
                {!item.is_read && <span className="w-2 h-2 rounded-full bg-indigo-400 shrink-0" />}
                <span className="font-medium text-zinc-100 truncate">{item.name}</span>
                <span className="text-zinc-500 text-sm truncate hidden sm:block">{item.subject}</span>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-xs text-zinc-500">
                  {new Date(item.created_at).toLocaleDateString()}
                </span>
                {item.is_read ? (
                  <Badge variant="default">Read</Badge>
                ) : (
                  <Badge variant="info">New</Badge>
                )}
                <span className="text-zinc-500">{expanded === item.id ? "▲" : "▼"}</span>
              </div>
            </button>

            {expanded === item.id && (
              <div className="px-5 pb-5 border-t border-zinc-800 pt-4 space-y-3">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div><span className="text-zinc-500">Email: </span><span className="text-zinc-200">{item.email}</span></div>
                  <div><span className="text-zinc-500">Subject: </span><span className="text-zinc-200">{item.subject}</span></div>
                </div>
                <p className="text-sm text-zinc-300 whitespace-pre-wrap">{item.message}</p>
                {!item.is_read && (
                  <Button size="sm" variant="secondary" onClick={() => markRead(item.id)}>
                    Mark as read
                  </Button>
                )}
              </div>
            )}
          </div>
        ))}

        {items.length === 0 && (
          <div className="text-center py-16 text-zinc-500">No submissions yet.</div>
        )}
      </div>
    </div>
  );
}
