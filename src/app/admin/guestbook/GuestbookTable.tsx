"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import type { GuestbookEntry } from "@/types";

export function GuestbookTable({ initialData }: { initialData: GuestbookEntry[] }) {
  const [items, setItems] = useState(initialData);

  async function updateStatus(id: string, status: "approved" | "rejected") {
    await fetch(`/api/guestbook/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, status } : i)));
  }

  async function deleteEntry(id: string) {
    await fetch(`/api/guestbook/${id}`, { method: "DELETE" });
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  const pending = items.filter((i) => i.status === "pending");
  const approved = items.filter((i) => i.status === "approved");

  const statusVariant = {
    pending: "warning" as const,
    approved: "success" as const,
    rejected: "danger" as const,
  };

  function renderEntry(entry: GuestbookEntry) {
    return (
      <div key={entry.id} className="flex items-start justify-between gap-4 rounded-xl border border-zinc-800 bg-zinc-900 p-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-zinc-100">{entry.name}</span>
            <Badge variant={statusVariant[entry.status]}>{entry.status}</Badge>
            <span className="text-xs text-zinc-500">{new Date(entry.created_at).toLocaleDateString()}</span>
          </div>
          <p className="text-sm text-zinc-300">{entry.message}</p>
        </div>
        <div className="flex gap-2 shrink-0">
          {entry.status === "pending" && (
            <>
              <Button size="sm" onClick={() => updateStatus(entry.id, "approved")}>Approve</Button>
              <Button size="sm" variant="ghost" onClick={() => updateStatus(entry.id, "rejected")}>Reject</Button>
            </>
          )}
          {entry.status === "approved" && (
            <Button size="sm" variant="ghost" onClick={() => updateStatus(entry.id, "rejected")}>Reject</Button>
          )}
          <Button size="sm" variant="danger" onClick={() => deleteEntry(entry.id)}>Delete</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-sm font-semibold text-zinc-300 mb-3">
          Pending ({pending.length})
        </h2>
        {pending.length === 0 ? (
          <p className="text-sm text-zinc-500">Nothing pending.</p>
        ) : (
          <div className="space-y-2">{pending.map(renderEntry)}</div>
        )}
      </section>

      <section>
        <h2 className="text-sm font-semibold text-zinc-300 mb-3">
          Approved ({approved.length})
        </h2>
        {approved.length === 0 ? (
          <p className="text-sm text-zinc-500">No approved entries.</p>
        ) : (
          <div className="space-y-2">{approved.map(renderEntry)}</div>
        )}
      </section>
    </div>
  );
}
