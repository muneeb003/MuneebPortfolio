"use client";

import { useEffect, useRef, useState } from "react";

interface Line {
  text: string;
  type: "input" | "output" | "error";
}

const COMMANDS: Record<string, () => string | (() => void)> = {
  whoami: () => "Muneeb — a developer who builds things for the web.",
  help: () => "Available commands: whoami, ls, ls projects, cat resume.pdf, sudo hire muneeb, clear, exit",
  ls: () => "projects/  skills/  about.md  resume.pdf",
  "ls projects": () => "Run `ls` and then explore individual projects on the site.",
  "cat about.md": () => "Scroll up — the about section has everything you need. 😄",
  clear: () => "__CLEAR__",
  exit: () => "__CLOSE__",
};

export function TerminalEgg() {
  const [open, setOpen] = useState(false);
  const [lines, setLines] = useState<Line[]>([
    { text: "Portfolio OS v1.0.0 — type 'help' to get started", type: "output" },
  ]);
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "`" || e.key === "~") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lines]);

  function runCommand(cmd: string) {
    const trimmed = cmd.trim().toLowerCase();
    const newLines: Line[] = [...lines, { text: `$ ${cmd}`, type: "input" }];

    if (trimmed === "") {
      setLines(newLines);
      return;
    }

    if (trimmed === "sudo hire muneeb") {
      newLines.push({ text: "Access granted. Initiating hire sequence... 🎉", type: "output" });
      setLines(newLines);
      import("canvas-confetti").then(({ default: confetti }) => {
        confetti({ particleCount: 200, spread: 120, origin: { y: 0.5 } });
      });
      return;
    }

    if (trimmed === "cat resume.pdf") {
      newLines.push({ text: "Downloading resume...", type: "output" });
      setLines(newLines);
      // trigger download if about.resume_url is available
      const link = document.querySelector<HTMLAnchorElement>('a[href*="resume"]');
      if (link) link.click();
      return;
    }

    const handler = COMMANDS[trimmed];
    if (!handler) {
      newLines.push({ text: `Command not found: ${cmd}. Type 'help' for available commands.`, type: "error" });
      setLines(newLines);
      return;
    }

    const result = handler();
    if (result === "__CLEAR__") { setLines([]); return; }
    if (result === "__CLOSE__") { setOpen(false); return; }
    newLines.push({ text: result as string, type: "output" });
    setLines(newLines);
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      runCommand(input);
      setInput("");
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div
        className="w-full max-w-2xl mx-4 rounded-2xl border border-zinc-700 bg-zinc-950 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Title bar */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-zinc-800 bg-zinc-900">
          <button
            onClick={() => setOpen(false)}
            className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-400 transition-colors"
          />
          <span className="w-3 h-3 rounded-full bg-yellow-500" />
          <span className="w-3 h-3 rounded-full bg-green-500" />
          <span className="ml-3 text-xs text-zinc-500 font-mono">portfolio-os — bash</span>
        </div>

        {/* Output */}
        <div className="h-72 overflow-y-auto p-4 font-mono text-sm space-y-1">
          {lines.map((line, i) => (
            <div
              key={i}
              className={
                line.type === "input"
                  ? "text-indigo-400"
                  : line.type === "error"
                  ? "text-red-400"
                  : "text-zinc-300"
              }
            >
              {line.text}
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="flex items-center gap-2 px-4 py-3 border-t border-zinc-800">
          <span className="text-indigo-400 font-mono text-sm">$</span>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            className="flex-1 bg-transparent font-mono text-sm text-zinc-100 outline-none placeholder:text-zinc-600"
            placeholder="type a command..."
            autoComplete="off"
            spellCheck={false}
          />
        </div>
      </div>
    </div>
  );
}
