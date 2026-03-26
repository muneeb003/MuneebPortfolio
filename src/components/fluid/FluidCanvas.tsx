"use client";

import { useEffect, useRef } from "react";
import "./fluid.css";

export default function FluidCanvas() {
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const canvas = document.getElementById("fluid") as HTMLCanvasElement | null;
    if (!canvas) return;

    import("./script.js").then(({ initFluid }) => {
      initFluid(canvas);
    });
  }, []);

  return <canvas id="fluid" />;
}
