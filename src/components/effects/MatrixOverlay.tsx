"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface MatrixOverlayProps {
  active: boolean;
}

const CHARSET = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEF";

export function MatrixOverlay({ active }: MatrixOverlayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!active) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId = 0;
    let columns = 0;
    let drops: number[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const fontSize = 14;
      columns = Math.floor(canvas.width / fontSize);
      drops = Array.from({ length: columns }, () => Math.random() * -50);
    };

    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      ctx.fillStyle = "rgba(0, 8, 0, 0.12)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "#39ff14";
      ctx.font = "14px monospace";

      for (let i = 0; i < columns; i++) {
        const char = CHARSET[Math.floor(Math.random() * CHARSET.length)];
        const x = i * 14;
        const y = drops[i] * 14;

        ctx.fillText(char, x, y);

        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i] += 1;
      }

      animationId = requestAnimationFrame(draw);
    };

    animationId = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationId);
    };
  }, [active]);

  return (
    <div
      className={cn(
        "pointer-events-none fixed inset-0 z-[9997] transition-opacity duration-700",
        active ? "opacity-100" : "opacity-0",
      )}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      <div
        className={cn(
          "absolute inset-0 bg-[#001a00]/30 transition-opacity duration-700",
          active ? "opacity-100" : "opacity-0",
        )}
      />
    </div>
  );
}
