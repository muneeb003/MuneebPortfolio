import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { MoodBar } from "@/components/layout/MoodBar";
import { ScrollProgress } from "@/components/layout/ScrollProgress";
import { TerminalEgg } from "@/components/easter-eggs/TerminalEgg";
import { createAdminClient } from "@/lib/supabase/admin";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const supabase = createAdminClient();
  const { data } = await supabase.from("site_meta").select("*").eq("id", 1).single();

  return {
    title: data?.site_title ?? "Portfolio",
    description: data?.hero_subheadline ?? "My personal portfolio",
    openGraph: {
      images: data?.og_image_url ? [data.og_image_url] : [],
    },
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const supabase = createAdminClient();
  const { data: mood } = await supabase.from("mood").select("*").eq("id", 1).single();

  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <body className="bg-zinc-950 text-zinc-100">
        <ScrollProgress />
        {mood?.is_visible && <MoodBar text={mood.text} linkUrl={mood.link_url} />}
        {children}
<TerminalEgg />
      </body>
    </html>
  );
}
