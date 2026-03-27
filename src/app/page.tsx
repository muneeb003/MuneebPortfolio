import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/sections/HeroSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { ExperienceSection } from "@/components/sections/ExperienceSection";
import { SkillsSection } from "@/components/sections/SkillsSection";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { MapSection } from "@/components/sections/MapSection";
import { ContactSection } from "@/components/sections/ContactSection";

async function getPageData() {
  const supabase = createAdminClient();

  const [
    { data: meta },
    { data: about },
    { data: experience },
    { data: categories },
    { data: projects },
  ] = await Promise.all([
    supabase.from("site_meta").select("*").eq("id", 1).single(),
    supabase.from("about").select("*").eq("id", 1).single(),
    supabase.from("experience").select("*").order("order"),
    supabase.from("skill_categories").select("*, skills(*)").order("order"),
    supabase.from("projects").select("*").eq("status", "published").order("order"),
  ]);

  return {
    meta,
    about,
    experience: experience ?? [],
    categories: categories ?? [],
    projects: projects ?? [],
  };
}

export default async function HomePage() {
  const { meta, about, experience, categories, projects } =
    await getPageData();

  if (!meta || !about) {
    return (
      <div className="min-h-screen flex items-center justify-center text-zinc-500">
        Setting up... Please seed the database first.
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <main>
        <HeroSection meta={meta} about={about} />
        <AboutSection about={about} />
        <ExperienceSection experience={experience} />
        <SkillsSection categories={categories} />
        <ProjectsSection projects={projects} />
        <MapSection about={about} />
        <ContactSection about={about} />
      </main>
      <Footer />
    </>
  );
}
