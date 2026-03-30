import Groq from "groq-sdk";
import { chatLimiter, getIP, checkRateLimit } from "@/lib/ratelimit";

let _groq: Groq | null = null;
function getGroq() {
  if (!_groq) _groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  return _groq;
}

// ── Local fallback (used when API key is missing / rate-limited) ──────────────
const FALLBACK_RESPONSES: { keywords: string[]; reply: string }[] = [
  {
    keywords: ["hi", "hey", "hello", "sup", "yo", "hiya"],
    reply:
      "Hey! 👋 Good to see you. Ask me anything — about my work, stack, or just vibe.",
  },
  {
    keywords: ["who", "about you", "yourself", "introduce"],
    reply:
      "I'm Muneeb — full-stack dev from Islamabad 🇵🇰. 3+ years in, 20+ projects shipped.",
  },
  {
    keywords: ["skill", "tech", "stack", "tools", "language", "framework"],
    reply:
      "Daily drivers: Next.js, TypeScript, React, Supabase, Tailwind, PostgreSQL, Node.js ⚡",
  },
  {
    keywords: ["project", "built", "build", "portfolio", "work"],
    reply:
      "20+ shipped so far. Scroll down to the Projects section to see the highlights 🚀",
  },
  {
    keywords: ["hire", "available", "freelance", "contract", "job"],
    reply:
      "Yes, open to work! 🟢 Freelance, contract, or full-time — hit me via the Contact section.",
  },
  {
    keywords: ["contact", "reach", "email", "dm"],
    reply:
      "Email or LinkedIn — both linked on this page. Usually reply within 24hrs 📬",
  },
  {
    keywords: ["location", "where", "based", "islamabad", "pakistan"],
    reply:
      "Islamabad, Pakistan 🇵🇰 — UTC+5. Work with teams across any timezone.",
  },
  {
    keywords: ["hobby", "hobbies", "fun", "interest"],
    reply:
      "Music 🎵, UI rabbit holes, and occasionally touching grass. Mostly coding though.",
  },
  {
    keywords: ["experience", "years", "how long"],
    reply:
      "3+ years professionally. Started vanilla JS, now fully TypeScript-brained 😄",
  },
  {
    keywords: ["tabs", "spaces", "indent"],
    reply: "Tabs. Every time. Non-negotiable 🔥",
  },
  {
    keywords: ["joke", "funny", "laugh"],
    reply:
      "Why do programmers prefer dark mode? Because light attracts bugs 🐛",
  },
  {
    keywords: ["next", "nextjs"],
    reply:
      "Next.js is home base — App Router, RSC, server actions. This portfolio runs on it ⚡",
  },
  {
    keywords: ["supabase", "database", "postgres"],
    reply:
      "Supabase is my go-to — Postgres under the hood, real-time, auth, storage 🔥",
  },
  {
    keywords: ["design", "ui", "ux", "figma", "tailwind"],
    reply:
      "Design matters a lot. Every pixel counts — probably obvious from this site 😅",
  },
  {
    keywords: ["how are you", "you good", "doing"],
    reply: "Doing great, thanks for asking! How can I help? 😄",
  },
];

function localFallback(input: string): string {
  const lower = input.toLowerCase();
  for (const { keywords, reply } of FALLBACK_RESPONSES) {
    if (keywords.some((k) => lower.includes(k))) return reply;
  }
  return "Good question! Best answered in person — check the Contact section below 📬";
}

const SYSTEM_PROMPT = `You are Muneeb, a full-stack developer chatting with visitors on your personal portfolio website. Keep it real, casual, and fun.

## Who you are
- Full-stack dev, 3+ years experience, based in Islamabad, Pakistan 🇵🇰 (UTC+5)
- Stack: Next.js, TypeScript, React, Supabase, Tailwind CSS, PostgreSQL, Node.js, Framer Motion
- Shipped 20+ projects — SaaS tools, portfolios, web apps
- Open to freelance, contract, or full-time opportunities
- Night owl. UI geek. Tabs > spaces, not debatable.
- Loves music, building things that look and feel great, and occasionally touching grass

## Rules
- Respond as Muneeb in first person — casual, friendly, a little witty
- Keep replies SHORT: 1-3 sentences max. This is a chat, not an essay.
- Keep the chat human
- Use emojis occasionally, naturally — not on every sentence
- If asked about specific projects → tell them to check the Projects section below
- If asked about contact / hiring → point to the Contact section or LinkedIn/email on this page
- If asked something totally off-topic → give a short fun response, gently redirect back
- Never make up projects, client names, or specific details not listed here`;

export async function POST(req: Request) {
  if (!process.env.GROQ_API_KEY) {
    return new Response("API key not configured", { status: 500 });
  }

  const limited = await checkRateLimit(chatLimiter, getIP(req));
  if (limited) return limited;

  const { messages } = (await req.json()) as {
    messages: { role: "user" | "assistant"; content: string }[];
  };

  const readable = new ReadableStream({
    async start(controller) {
      try {
        const stream = await getGroq().chat.completions.create({
          model: "llama-3.3-70b-versatile", // free, 128k context, very capable
          max_tokens: 1024,
          temperature: 0.75,
          stream: true,
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            ...messages.slice(-30),
          ],
        });

        for await (const chunk of stream) {
          const text = chunk.choices[0]?.delta?.content ?? "";
          if (text) controller.enqueue(new TextEncoder().encode(text));
        }
      } catch (err) {
        console.error(
          "[/api/chat] falling back to local responses:",
          (err as Error).message,
        );
        const lastUserMsg =
          messages.findLast((m) => m.role === "user")?.content ?? "";
        controller.enqueue(
          new TextEncoder().encode(localFallback(lastUserMsg)),
        );
      } finally {
        controller.close();
      }
    },
  });

  return new Response(readable, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
