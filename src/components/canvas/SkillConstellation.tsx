"use client";

import { useEffect, useRef } from "react";
import type { SkillCategory, Skill } from "@/types";

interface Node {
  skill: Skill;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
}

// Replace black/near-black colors with a visible fallback
function resolveColor(color: string | null): string {
  if (!color) return "#6366f1";
  const hex = color.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness < 40 ? "#a5b4fc" : color;
}

export function SkillConstellation({
  categories,
}: {
  categories: (SkillCategory & { skills: Skill[] })[];
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const allSkills = categories.flatMap((c) => c.skills ?? []);
    if (!allSkills.length) return;

    let nodes: Node[] = [];
    let mouse = { x: -999, y: -999 };

    function initNodes() {
      nodes = allSkills.map((skill) => ({
        skill,
        x: Math.random() * canvas!.width,
        y: Math.random() * canvas!.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: 5 + skill.proficiency * 3,
        color: resolveColor(skill.color),
      }));
    }

    // Use ResizeObserver so we get the real dimensions after layout
    const ro = new ResizeObserver(() => {
      const { width, height } = canvas!.getBoundingClientRect();
      canvas!.width = width * devicePixelRatio;
      canvas!.height = height * devicePixelRatio;
      ctx.scale(devicePixelRatio, devicePixelRatio);
      initNodes();
    });
    ro.observe(canvas);

    canvas.addEventListener("mousemove", (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });
    canvas.addEventListener("mouseleave", () => {
      mouse = { x: -999, y: -999 };
    });

    function draw() {
      if (!canvas || !ctx) return;
      const w = canvas.width / devicePixelRatio;
      const h = canvas.height / devicePixelRatio;
      ctx.clearRect(0, 0, w, h);

      // Connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 160) {
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(99,102,241,${(1 - dist / 160) * 0.3})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      // Nodes
      for (const node of nodes) {
        const dx = node.x - mouse.x;
        const dy = node.y - mouse.y;
        const hovered = Math.sqrt(dx * dx + dy * dy) < node.radius + 16;

        // Glow on hover
        if (hovered) {
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.radius + 8, 0, Math.PI * 2);
          ctx.fillStyle = node.color + "33";
          ctx.fill();
        }

        // Node circle
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = node.color;
        ctx.globalAlpha = hovered ? 1 : 0.75;
        ctx.fill();
        ctx.globalAlpha = 1;

        // Label — always visible, brighter on hover
        ctx.font = `${hovered ? "bold " : ""}11px ui-monospace, monospace`;
        ctx.fillStyle = hovered ? "#ffffff" : "rgba(250,250,250,0.55)";
        ctx.textAlign = "center";
        ctx.fillText(node.skill.name, node.x, node.y - node.radius - 5);

        // Physics
        node.x += node.vx;
        node.y += node.vy;
        if (node.x < node.radius || node.x > w - node.radius) node.vx *= -1;
        if (node.y < node.radius || node.y > h - node.radius) node.vy *= -1;
      }

      animRef.current = requestAnimationFrame(draw);
    }

    draw();

    return () => {
      cancelAnimationFrame(animRef.current);
      ro.disconnect();
    };
  }, [categories]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      style={{ cursor: "crosshair" }}
    />
  );
}
