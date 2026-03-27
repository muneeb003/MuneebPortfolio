"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "#about",      label: "About"      },
  { href: "#experience", label: "Experience" },
  { href: "#skills",     label: "Skills"     },
  { href: "#projects",   label: "Projects"   },
  { href: "#contact",    label: "Contact"    },
];

export function Navbar() {
  const [scrolled, setScrolled]       = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [menuOpen, setMenuOpen]       = useState(false);

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

  // Close menu on resize to desktop
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 640) setMenuOpen(false); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <>
      <nav className={cn(
        "fixed top-1 left-0 right-0 z-40 flex justify-center transition-all duration-300",
        scrolled ? "mt-1" : "mt-4"
      )}>
        {/* Desktop pill */}
        <div className={cn(
          "hidden sm:flex items-center gap-1 rounded-full border px-3 py-1.5 text-sm transition-all duration-300",
          scrolled
            ? "border-zinc-700 bg-zinc-900/90 backdrop-blur-md shadow-lg"
            : "border-transparent bg-transparent"
        )}>
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

        {/* Mobile hamburger */}
        <div className={cn(
          "sm:hidden flex items-center justify-between w-[calc(100%-2rem)] rounded-2xl border px-4 py-2.5 transition-all duration-300",
          scrolled || menuOpen
            ? "border-zinc-700 bg-zinc-900/95 backdrop-blur-md shadow-lg"
            : "border-transparent bg-transparent"
        )}>
          <span className="text-sm font-semibold text-zinc-300">Muneeb</span>
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="flex flex-col gap-1.5 w-6 h-6 items-center justify-center"
            aria-label="Toggle menu"
          >
            <span className={cn("block w-5 h-0.5 bg-zinc-400 rounded-full transition-all duration-300",
              menuOpen && "rotate-45 translate-y-2")} />
            <span className={cn("block w-5 h-0.5 bg-zinc-400 rounded-full transition-all duration-300",
              menuOpen && "opacity-0")} />
            <span className={cn("block w-5 h-0.5 bg-zinc-400 rounded-full transition-all duration-300",
              menuOpen && "-rotate-45 -translate-y-2")} />
          </button>
        </div>
      </nav>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="sm:hidden fixed inset-x-0 top-[4.5rem] z-30 mx-4">
          <div className="rounded-2xl border border-zinc-700 bg-zinc-900/97 backdrop-blur-md shadow-xl overflow-hidden">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={cn(
                  "block px-5 py-3.5 text-sm border-b border-zinc-800 last:border-0 transition-colors",
                  activeSection === link.href.slice(1)
                    ? "text-indigo-400 bg-indigo-500/5"
                    : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50"
                )}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
