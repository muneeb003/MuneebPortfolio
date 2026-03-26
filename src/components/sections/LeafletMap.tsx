"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

interface MapboxMapProps {
  lat: number;
  lng: number;
  label: string;
}

export default function MapboxMap({ lat, lng }: MapboxMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    mapboxgl.accessToken = TOKEN;

    const map = new mapboxgl.Map({
      container: mapRef.current,
      center: [lng, lat],
      zoom: 9,
      attributionControl: false,
    });

    const el = document.createElement("div");
    el.style.backgroundImage = "url('https://i.postimg.cc/90p4DPC7/emoji-png.png')";
    el.style.width = "50px";
    el.style.height = "50px";
    el.style.backgroundSize = "cover";
    el.style.borderRadius = "50%";

    map.on("load", () => {
      new mapboxgl.Marker(el).setLngLat([lng, lat]).addTo(map);
    });

    return () => map.remove();
  }, [lat, lng]);

  return <div ref={mapRef} style={{ width: "100%", height: "100%", position: "relative" }} />;
}
