"use client";

import dynamic from "next/dynamic";
import type { About } from "@/types";
import { FadeUp, SplitHeading } from "@/components/ui/Animate";

const MapboxMap = dynamic(() => import("./LeafletMap"), { ssr: false });

export function MapSection({ about }: { about: About }) {
  if (!about.location_lat || !about.location_lng) return null;

  return (
    <section id="map" className="py-24 px-6 max-w-5xl mx-auto">
      <SplitHeading className="text-3xl font-bold text-zinc-100 mb-3">Where I am</SplitHeading>
      <FadeUp delay={0.15}>
        {about.location_label && (
          <p className="text-zinc-400 mb-8">📍 {about.location_label}</p>
        )}
      </FadeUp>
      <FadeUp delay={0.15}>
        <div className="w-full h-48 sm:h-64 md:h-80 rounded-2xl overflow-hidden border border-zinc-800">
          <MapboxMap lat={about.location_lat} lng={about.location_lng} label={about.location_label ?? ""} />
        </div>
      </FadeUp>
    </section>
  );
}
