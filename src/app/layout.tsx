import type { Metadata } from "next";
import { Bricolage_Grotesque, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { MoodBar } from "@/components/layout/MoodBar";
import { ScrollProgress } from "@/components/layout/ScrollProgress";
import { TerminalEgg } from "@/components/easter-eggs/TerminalEgg";
import { createAdminClient } from "@/lib/supabase/admin";

const bricolage = Bricolage_Grotesque({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
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
    <html lang="en" className={`${bricolage.variable} ${inter.variable} ${jetbrainsMono.variable} antialiased`}>
      <body className="bg-zinc-950 text-zinc-100">
        <ScrollProgress />
        {mood?.is_visible && <MoodBar text={mood.text} linkUrl={mood.link_url} />}
        {children}
<TerminalEgg />
      </body>
    </html>
  );
}
