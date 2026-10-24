"use client";

import { useEffect, useRef } from "react";

type Node = { x: number; y: number; vx: number; vy: number; r: number; c: string };

const COLORS = ["91,155,255", "34,211,238", "59,130,246"];
const LINK = 150;

/** Orqa fon: sekin siljiydigan oltiburchak "atomlar" va ularni bog'lovchi chiziqlar */
export function MoleculeNetwork({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

    let w = 0;
    let h = 0;
    let nodes: Node[] = [];
    let raf = 0;
    let visible = true;

    const setup = () => {
      const { width, height } = canvas.getBoundingClientRect();
      if (!width || !height) return;
      const dpr = Math.min(devicePixelRatio, 1.5);
      w = width;
      h = height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round(Math.min(240, (w * h) / 6000));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.28,
        vy: (Math.random() - 0.5) * 0.28,
        r: 5 + Math.random() * 7,
        c: COLORS[Math.floor(Math.random() * COLORS.length)],
      }));
    };

    const hex = (n: Node) => {
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const a = (Math.PI / 3) * i + Math.PI / 6;
        ctx.lineTo(n.x + n.r * Math.cos(a), n.y + n.r * Math.sin(a));
      }
      ctx.closePath();
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const d = Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y);
          if (d > LINK) continue;
          ctx.strokeStyle = `rgba(${nodes[i].c},${(1 - d / LINK) * 0.55})`;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.stroke();
        }
      }
      for (const n of nodes) {
        ctx.fillStyle = `rgba(${n.c},0.7)`;
        ctx.strokeStyle = `rgba(${n.c},1)`;
        ctx.lineWidth = 2.5;
        hex(n);
        ctx.fill();
        ctx.stroke();
      }
    };

    const step = () => {
      raf = requestAnimationFrame(step);
      if (!visible) return;
      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < -10 || n.x > w + 10) n.vx *= -1;
        if (n.y < -10 || n.y > h + 10) n.vy *= -1;
      }
      draw();
    };

    setup();
    draw();
    if (!reduce) raf = requestAnimationFrame(step);

    const ro = new ResizeObserver(() => {
      setup();
      draw();
    });
    ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(canvas);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
    };
  }, []);

  return <canvas ref={ref} aria-hidden="true" className={`size-full ${className}`} />;
}
