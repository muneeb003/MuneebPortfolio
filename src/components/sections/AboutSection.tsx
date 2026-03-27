"use client";

import Image from "next/image";
import { useState, useEffect, useRef, KeyboardEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { About } from "@/types";
import { FadeUp, SplitHeading } from "@/components/ui/Animate";

// ── Types ─────────────────────────────────────────────────────────────────────
type ChatMsg = { id: number; from: "bot" | "user"; text: string };

const QUICK_REPLIES = [
  "What's your stack? ⚡",
  "Are you available? 🟢",
  "Show me your projects 🚀",
  "Tell me a joke 😄",
];

const INITIAL_MESSAGE: ChatMsg = {
  id: 0,
  from: "bot",
  text: "Hey! 👋 I'm Muneeb. Ask me anything about my work, skills, or just say hi!",
};

// ── Typing indicator ──────────────────────────────────────────────────────────
function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 4, scale: 0.92 }}
      className="flex items-center gap-1 bg-zinc-800 rounded-2xl rounded-bl-sm px-4 py-3 w-fit"
    >
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          animate={{ y: [0, -4, 0] }}
          transition={{
            duration: 0.55,
            repeat: Infinity,
            delay: i * 0.14,
            ease: "easeInOut",
          }}
          className="w-1.5 h-1.5 rounded-full bg-zinc-400 block"
        />
      ))}
    </motion.div>
  );
}

// ── Chat window ───────────────────────────────────────────────────────────────
function ChatWindow({ about }: { about: About }) {
  const [messages, setMessages] = useState<ChatMsg[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [showQuick, setShowQuick] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const nextId = useRef(1);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  const sendUserMsg = async (text: string) => {
    if (!text.trim() || disabled) return;
    setShowQuick(false);
    setDisabled(true);
    setInput("");

    const userMsg: ChatMsg = {
      id: nextId.current++,
      from: "user",
      text: text.trim(),
    };
    setMessages((m) => [...m, userMsg]);
    setTyping(true);

    try {
      // Build history for Claude — skip the hardcoded greeting (id 0)
      const history = [...messages, userMsg]
        .filter((m) => m.id !== 0)
        .map((m) => ({
          role: m.from === "user" ? "user" : "assistant",
          content: m.text,
        }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
      });

      if (!res.ok || !res.body) throw new Error("API error");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      const botId = nextId.current++;

      setTyping(false);
      setMessages((m) => [...m, { id: botId, from: "bot", text: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        setMessages((m) =>
          m.map((msg) =>
            msg.id === botId ? { ...msg, text: msg.text + chunk } : msg,
          ),
        );
      }
    } catch {
      setTyping(false);
      setMessages((m) => [
        ...m,
        {
          id: nextId.current++,
          from: "bot",
          text: "Something went wrong on my end 😅 Try the Contact section to reach me directly!",
        },
      ]);
    } finally {
      setDisabled(false);
      inputRef.current?.focus();
    }
  };

  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") void sendUserMsg(input);
  };

  const now = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="flex flex-col rounded-[2rem] border border-zinc-700/60 bg-zinc-900 overflow-hidden shadow-2xl h-[460px] sm:h-[520px]">
      {/* Status bar */}
      <div className="flex items-center justify-between px-6 pt-4 pb-1 text-[11px] text-zinc-500 font-medium select-none">
        <span>{now}</span>
        <div className="flex items-center gap-1.5">
          <span>●●●</span>
          <span>WiFi</span>
          <span>🔋</span>
        </div>
      </div>

      {/* Contact header */}
      <div className="flex items-center gap-3 px-5 py-3 border-b border-zinc-800">
        <div className="relative w-9 h-9 rounded-full overflow-hidden bg-zinc-800 shrink-0">
          {about.avatar_url && (
            <Image
              src={about.avatar_url}
              alt="Muneeb"
              fill
              sizes="36px"
              className="object-cover"
            />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-zinc-100 leading-none">
            Muneeb
          </p>
          <p className="text-xs text-emerald-400 mt-0.5 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
            online
          </p>
        </div>
        <span className="text-zinc-600 text-xs bg-zinc-800 px-2 py-1 rounded-full">
          chatbot
        </span>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-4 space-y-2"
        style={{ scrollbarWidth: "none" }}
      >
        <p className="text-center text-[10px] text-zinc-600 mb-3 select-none">
          Today
        </p>

        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 280, damping: 24 }}
              className={`flex items-end gap-2 ${msg.from === "user" ? "flex-row-reverse" : ""}`}
            >
              {/* Avatar — only for bot */}
              {msg.from === "bot" && (
                <div className="relative w-6 h-6 rounded-full overflow-hidden bg-zinc-800 shrink-0 mb-0.5">
                  {about.avatar_url && (
                    <Image
                      src={about.avatar_url}
                      alt=""
                      fill
                      sizes="24px"
                      className="object-cover"
                    />
                  )}
                </div>
              )}

              <div
                className={`text-sm rounded-2xl px-4 py-2.5 max-w-[78%] leading-snug ${
                  msg.from === "bot"
                    ? "bg-zinc-800 text-zinc-100 rounded-bl-sm"
                    : "bg-indigo-600 text-white rounded-br-sm"
                }`}
              >
                {msg.text}
              </div>
            </motion.div>
          ))}

          {typing && (
            <motion.div key="typing" className="flex items-end gap-2">
              <div className="relative w-6 h-6 rounded-full overflow-hidden bg-zinc-800 shrink-0">
                {about.avatar_url && (
                  <Image
                    src={about.avatar_url}
                    alt=""
                    fill
                    sizes="24px"
                    className="object-cover"
                  />
                )}
              </div>
              <TypingIndicator />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Quick replies */}
        <AnimatePresence>
          {showQuick && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="flex flex-wrap gap-2 pt-2"
            >
              {QUICK_REPLIES.map((q) => (
                <button
                  key={q}
                  onClick={() => void sendUserMsg(q)}
                  className="text-xs text-indigo-300 border border-indigo-500/30 bg-indigo-500/10 hover:bg-indigo-500/20 rounded-full px-3 py-1.5 transition-colors cursor-pointer"
                >
                  {q}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Input bar */}
      <div className="flex items-center gap-2 px-4 py-3 border-t border-zinc-800">
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKey}
          disabled={disabled}
          placeholder="Ask me anything..."
          className="flex-1 bg-zinc-800 rounded-full px-4 py-2 text-sm text-zinc-100 placeholder-zinc-600 outline-none focus:ring-1 focus:ring-indigo-500/40 transition-all disabled:opacity-50"
        />
        <motion.button
          onClick={() => void sendUserMsg(input)}
          disabled={disabled || !input.trim()}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          className="w-9 h-9 flex items-center justify-center rounded-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shrink-0"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </motion.button>
      </div>
    </div>
  );
}

// ── Stat counter ──────────────────────────────────────────────────────────────
function StatCounter({ end, suffix = "" }: { end: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !started.current) {
          started.current = true;
          const t0 = performance.now();
          const tick = (now: number) => {
            const t = Math.min((now - t0) / 1400, 1);
            setCount(Math.round((1 - Math.pow(1 - t, 3)) * end));
            if (t < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
        if (!e.isIntersecting) {
          started.current = false;
          setCount(0);
        }
      },
      { threshold: 0.6 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [end]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}

const SOCIAL_META: Record<
  string,
  { icon: string; color: string; border: string; desc: string }
> = {
  GitHub: {
    icon: "⌥",
    color: "hover:bg-zinc-700/60",
    border: "hover:border-zinc-500",
    desc: "See my work",
  },
  LinkedIn: {
    icon: "💼",
    color: "hover:bg-sky-500/10",
    border: "hover:border-sky-500/40",
    desc: "Let's connect",
  },
  Twitter: {
    icon: "𝕏",
    color: "hover:bg-zinc-700/60",
    border: "hover:border-zinc-500",
    desc: "Say hi",
  },
  Email: {
    icon: "✉",
    color: "hover:bg-indigo-500/10",
    border: "hover:border-indigo-500/40",
    desc: "Drop a message",
  },
};

// ── Main section ──────────────────────────────────────────────────────────────
interface AboutSectionProps {
  about: About;
}

export function AboutSection({ about }: AboutSectionProps) {
  const socials = [
    { href: about.github_url, label: "GitHub" },
    { href: about.linkedin_url, label: "LinkedIn" },
    { href: about.twitter_url, label: "Twitter" },
    { href: about.email ? `mailto:${about.email}` : null, label: "Email" },
  ].filter((s) => s.href);

  return (
    <section id="about" className="py-24 px-6 max-w-5xl mx-auto">
      <FadeUp className="mb-12">
        <SplitHeading className="text-3xl font-bold text-zinc-100">
          About me
        </SplitHeading>
      </FadeUp>

      <div className="grid lg:grid-cols-[1.1fr_1fr] gap-8 lg:gap-10 items-start">
        {/* ── Chat window ── */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <ChatWindow about={about} />
        </motion.div>

        {/* ── Right: business card ── */}
        <motion.div
          initial={{ opacity: 0, x: 30, rotateY: 8 }}
          whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
          viewport={{ once: false, margin: "-80px" }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          style={{ perspective: "1000px" }}
        >
          <motion.div
            whileHover={{
              y: -4,
              boxShadow:
                "0 24px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(99,102,241,0.2)",
            }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="relative h-[460px] sm:h-[520px] rounded-3xl overflow-hidden flex flex-col justify-between p-5 sm:p-7"
            style={{
              background:
                "linear-gradient(145deg, #18181b 0%, #0f0f11 50%, #18181b 100%)",
              boxShadow:
                "0 12px 40px rgba(0,0,0,0.4), 0 0 0 1px rgba(63,63,70,0.5)",
            }}
          >
            {/* Corner glow */}
            <div
              className="absolute -top-16 -right-16 w-48 h-48 rounded-full pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle, rgba(99,102,241,0.15), transparent 70%)",
              }}
            />
            <div
              className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle, rgba(139,92,246,0.1), transparent 70%)",
              }}
            />

            {/* Watermark letter */}
            <div className="absolute right-5 top-1/2 -translate-y-1/2 text-[80px] sm:text-[160px] font-bold text-zinc-800/30 select-none pointer-events-none leading-none">
              M
            </div>

            {/* Top row — monogram + status */}
            <div className="flex items-start justify-between relative z-10">
              <div className="w-11 h-11 rounded-xl bg-indigo-600 flex items-center justify-center shrink-0 shadow-lg shadow-indigo-500/20">
                <span className="text-white font-bold text-lg leading-none">
                  M
                </span>
              </div>
              <span className="flex items-center gap-1.5 text-[11px] font-medium text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Available
              </span>
            </div>

            {/* Name + role */}
            <div className="relative z-10">
              <h3 className="text-4xl font-bold text-zinc-100 leading-none tracking-tight">
                Muneeb
              </h3>
              <p className="text-indigo-400 font-medium mt-2 text-sm">
                Full Stack Developer
              </p>
              {about.bio_short && (
                <p className="text-xs text-zinc-500 mt-3 leading-relaxed max-w-[220px]">
                  {about.bio_short}
                </p>
              )}
            </div>

            {/* Divider */}
            <div className="relative z-10 h-px bg-gradient-to-r from-zinc-700 via-zinc-600/50 to-transparent" />

            {/* Stats */}
            <div className="relative z-10 flex gap-8">
              {[
                {
                  end: 3,
                  suffix: "+",
                  label: "Years exp",
                  accent: "text-indigo-400",
                },
                {
                  end: 20,
                  suffix: "+",
                  label: "Projects shipped",
                  accent: "text-purple-400",
                },
              ].map(({ end, suffix, label, accent }) => (
                <div key={label}>
                  <p className="text-3xl font-bold text-zinc-100 leading-none tabular-nums">
                    <StatCounter end={end} />
                    <span className={accent}>{suffix}</span>
                  </p>
                  <p className="text-[10px] text-zinc-600 mt-1.5 uppercase tracking-wider">
                    {label}
                  </p>
                </div>
              ))}
            </div>

            {/* Contact row */}
            <div className="relative z-10 space-y-1.5">
              {about.location_label && (
                <p className="text-xs text-zinc-500 flex items-center gap-2">
                  <span className="text-zinc-600">📍</span>
                  {about.location_label}
                </p>
              )}
              {about.email && (
                <p className="text-xs text-zinc-500 flex items-center gap-2">
                  <span className="text-zinc-600">✉</span>
                  {about.email}
                </p>
              )}
            </div>

            {/* Bottom row — socials + domain */}
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex gap-2">
                {socials.map((s) => {
                  const meta = SOCIAL_META[s.label] ?? {
                    icon: "→",
                    color: "",
                    border: "",
                    desc: "",
                  };
                  return (
                    <motion.a
                      key={s.label}
                      href={s.href!}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={s.label}
                      whileHover={{ scale: 1.15, y: -2 }}
                      whileTap={{ scale: 0.92 }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 15,
                      }}
                      className="w-9 h-9 flex items-center justify-center rounded-xl bg-zinc-800 hover:bg-indigo-600 border border-zinc-700/50 hover:border-indigo-500 text-zinc-400 hover:text-white transition-all text-sm"
                    >
                      {meta.icon}
                    </motion.a>
                  );
                })}
              </div>
              <span className="text-[10px] text-zinc-700 font-mono">
                muneeb.dev
              </span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
