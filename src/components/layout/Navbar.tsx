"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#projects", label: "Projects" },
  { href: "#currently", label: "Currently" },
  { href: "#guestbook", label: "Guestbook" },
  { href: "#contact", label: "Contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 50);

      const sections = NAV_LINKS.map((l) => l.href.slice(1));
      for (const id of [...sections].reverse()) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 100) {
          setActiveSection(id);
          return;
        }
      }
      setActiveSection("");
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-1 left-0 right-0 z-40 flex justify-center transition-all duration-300",
        scrolled ? "mt-1" : "mt-4"
      )}
    >
      <div
        className={cn(
          "flex items-center gap-1 rounded-full border px-3 py-1.5 text-sm transition-all duration-300",
          scrolled
            ? "border-zinc-700 bg-zinc-900/90 backdrop-blur-md shadow-lg"
            : "border-transparent bg-transparent"
        )}
      >
        {NAV_LINKS.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className={cn(
              "px-3 py-1 rounded-full transition-colors",
              activeSection === link.href.slice(1)
                ? "text-zinc-100 bg-zinc-800"
                : "text-zinc-400 hover:text-zinc-100"
            )}
          >
            {link.label}
          </a>
        ))}
      </div>
    </nav>
  );
}
