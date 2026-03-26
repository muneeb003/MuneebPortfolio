"use client";

import dynamic from "next/dynamic";
import Link from "next/link";

const FluidCanvas = dynamic(() => import("@/components/fluid/FluidCanvas"), { ssr: false });

export default function NotFound() {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Fluid canvas background */}
      <div className="absolute inset-0 z-0">
        <FluidCanvas />
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 z-10 bg-zinc-950/60" />

      {/* Content */}
      <div className="relative z-20 text-center px-6">
        <p className="text-7xl mb-4">🌌</p>
        <h1 className="text-5xl font-bold text-zinc-100 mb-3">404</h1>
        <p className="text-xl text-zinc-300 mb-2">You found the void.</p>
        <p className="text-zinc-500 mb-8">Drag to make it pretty.</p>
        <Link
          href="/"
          className="inline-block rounded-full bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 font-medium transition-colors"
        >
          Go home →
        </Link>
      </div>
    </div>
  );
}
