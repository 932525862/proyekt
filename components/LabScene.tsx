"use client";

import type * as Three from "three";
import { useEffect, useRef } from "react";

type Variant = "molecule" | "spectrum";

/**
 * 3D sahna (three.js, kechiktirib yuklanadi).
 * molecule — kofein molekulasining shar-tayoqcha modeli;
 * spectrum — LC-MS ma'lumotlarining 3D yuzasi (vaqt × m/z × intensivlik).
 */
export function LabScene({ variant, className = "" }: { variant: Variant; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = ref.current;
    if (!host) return;
    let disposed = false;
    let cleanup = () => {};

    import("three").then((THREE) => {
      if (disposed) return;
      const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "low-power" });
      renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      host.appendChild(renderer.domElement);
      renderer.domElement.style.cssText = "width:100%;height:100%;display:block";

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
      const root = new THREE.Group();
      scene.add(root);
      const disposables: { dispose(): void }[] = [];
      const track = <T extends { dispose(): void }>(x: T) => (disposables.push(x), x);

      let update: (t: number) => void;

      if (variant === "molecule") {
        camera.position.set(0, 0, 17);
        scene.add(new THREE.AmbientLight(0xb8c7ff, 0.55));
        const key = new THREE.DirectionalLight(0xffffff, 2.2);
        key.position.set(4, 6, 8);
        scene.add(key);
        const rim = new THREE.PointLight(0x3b82f6, 40, 30);
        rim.position.set(-6, -3, -4);
        scene.add(rim);

        const mol = buildCaffeine(THREE, track);
        root.add(mol);

        // Atrofdagi zarrachalar buluti
        const n = 420;
        const pos = new Float32Array(n * 3);
        for (let i = 0; i < n; i++) {
          const r = 5.5 + Math.random() * 3.5;
          const th = Math.random() * Math.PI * 2;
          const ph = Math.acos(2 * Math.random() - 1);
          pos.set([r * Math.sin(ph) * Math.cos(th), r * Math.sin(ph) * Math.sin(th) * 0.6, r * Math.cos(ph)], i * 3);
        }
        const pg = track(new THREE.BufferGeometry());
        pg.setAttribute("position", new THREE.BufferAttribute(pos, 3));
        const dust = new THREE.Points(pg, track(new THREE.PointsMaterial({ color: 0x7fa6ff, size: 0.045, transparent: true, opacity: 0.7 })));
        root.add(dust);

        // Orbital halqalar
        const rings = [5.2, 6.4].map((r, i) => {
          const ring = new THREE.Mesh(
            track(new THREE.TorusGeometry(r, 0.008, 8, 160)),
            track(new THREE.MeshBasicMaterial({ color: i ? 0x22d3ee : 0x3b82f6, transparent: true, opacity: 0.35 })),
          );
          ring.rotation.set(Math.PI / 2.4, i * 0.6, 0);
          root.add(ring);
          return ring;
        });

        update = (t) => {
          mol.rotation.y = t * 0.25;
          mol.rotation.x = Math.sin(t * 0.3) * 0.25;
          dust.rotation.y = -t * 0.03;
          rings[0].rotation.z = t * 0.12;
          rings[1].rotation.z = -t * 0.08;
        };
      } else {
        camera.position.set(0, 5.2, 10.5);
        camera.lookAt(0, 0.4, 0);
        // Har bir qator — bitta xromatogramma (m/z kesimi), birgalikda 3D "waterfall" yuzasi
        const W = 12, D = 7, ROWS = 36, COLS = 180;
        const peaks = Array.from({ length: 16 }, (_, i) => ({
          x: -W / 2 + 0.8 + ((i * 0.618 + 0.1) % 1) * (W - 1.6),
          z: -D / 2 + 0.5 + ((i * 0.37 + 0.2) % 1) * (D - 1),
          h: 0.5 + ((i * 0.57) % 1) * 2.3,
          s: 0.08 + ((i * 0.31) % 1) * 0.16,
          ph: i * 1.7,
        }));
        const low = new THREE.Color(0x1e3a5f), mid = new THREE.Color(0x3b82f6), high = new THREE.Color(0x67e8f9);
        const c = new THREE.Color();
        const lineMat = track(new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.9 }));
        const rows = Array.from({ length: ROWS }, (_, r) => {
          const z = -D / 2 + (r / (ROWS - 1)) * D;
          const g = track(new THREE.BufferGeometry());
          const pos = new Float32Array(COLS * 3);
          for (let i = 0; i < COLS; i++) pos.set([-W / 2 + (i / (COLS - 1)) * W, 0, z], i * 3);
          g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
          g.setAttribute("color", new THREE.BufferAttribute(new Float32Array(COLS * 3), 3));
          root.add(new THREE.Line(g, lineMat));
          return { g, z };
        });
        // Asos to'ri
        const grid = new THREE.GridHelper(W, 24, 0x1e3a5f, 0x1e3a5f);
        (grid.material as Three.Material).transparent = true;
        (grid.material as Three.Material).opacity = 0.35;
        grid.scale.z = D / W;
        root.add(grid);
        track(grid.geometry);
        track(grid.material as Three.Material);

        update = (t) => {
          for (const { g, z } of rows) {
            const pos = g.attributes.position as Three.BufferAttribute;
            const col = g.attributes.color as Three.BufferAttribute;
            for (let i = 0; i < COLS; i++) {
              const x = pos.getX(i);
              let y = 0.02 * Math.sin(x * 9 + z * 3 + t * 2);
              for (const pk of peaks) {
                const dx = x - pk.x, dz = z - pk.z;
                y += pk.h * (0.75 + 0.25 * Math.sin(t * 1.1 + pk.ph)) * Math.exp(-(dx * dx) / (2 * pk.s * pk.s) - (dz * dz) / 0.9);
              }
              pos.setY(i, Math.max(y, 0));
              const k = Math.min(y / 1.8, 1);
              if (k < 0.5) c.copy(low).lerp(mid, k * 2);
              else c.copy(mid).lerp(high, (k - 0.5) * 2);
              col.setXYZ(i, c.r, c.g, c.b);
            }
            pos.needsUpdate = true;
            col.needsUpdate = true;
          }
          root.rotation.y = Math.sin(t * 0.15) * 0.3;
        };
      }

      // Sichqoncha bo'yicha parallaks
      const target = { x: 0, y: 0 };
      const onMove = (e: PointerEvent) => {
        const r = host.getBoundingClientRect();
        target.x = ((e.clientX - r.left) / r.width - 0.5) * 0.5;
        target.y = ((e.clientY - r.top) / r.height - 0.5) * 0.3;
      };
      window.addEventListener("pointermove", onMove, { passive: true });

      const resize = () => {
        const { width, height } = host.getBoundingClientRect();
        if (!width || !height) return;
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
      };
      const ro = new ResizeObserver(resize);
      ro.observe(host);
      resize();

      let visible = true;
      const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
      io.observe(host);

      const clock = new THREE.Clock();
      const frame = () => {
        if (visible) {
          const t = clock.getElapsedTime();
          update(reduce ? 2 : t);
          root.rotation.x += (target.y - root.rotation.x) * 0.04;
          if (variant === "molecule") root.rotation.y += (target.x - root.rotation.y) * 0.04;
          renderer.render(scene, camera);
        }
      };
      if (reduce) frame();
      else renderer.setAnimationLoop(frame);
      host.dataset.ready = "true";

      cleanup = () => {
        renderer.setAnimationLoop(null);
        window.removeEventListener("pointermove", onMove);
        ro.disconnect();
        io.disconnect();
        disposables.forEach((d) => d.dispose());
        scene.traverse((o) => {
          const m = o as Three.Mesh;
          if (m.geometry) m.geometry.dispose();
        });
        renderer.dispose();
        renderer.domElement.remove();
      };
    });

    return () => {
      disposed = true;
      cleanup();
    };
  }, [variant]);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={`opacity-0 transition-opacity duration-1000 data-[ready=true]:opacity-100 ${className}`}
    />
  );
}

/** Kofein (C8H10N4O2): purin halqasi + metil guruhlari, yengil 3D burilish bilan */
function buildCaffeine(THREE: typeof import("three"), track: <T extends { dispose(): void }>(x: T) => T) {
  type V = [number, number, number];
  const atoms: { p: V; el: "C" | "N" | "O" | "H" }[] = [];
  const bonds: [number, number, number][] = [];
  const add = (p: V, el: (typeof atoms)[number]["el"]) => atoms.push({ p, el }) - 1;
  const polar = (cx: number, cy: number, r: number, deg: number): V => [cx + r * Math.cos((deg * Math.PI) / 180), cy + r * Math.sin((deg * Math.PI) / 180), 0];
  const out = (a: number, dist: number, deg: number): V => {
    const [x, y] = atoms[a].p;
    return polar(x, y, dist, deg);
  };

  const s = 1.4;
  // Olti a'zoli halqa
  const C6 = add(polar(0, 0, s, 90), "C");
  const N1 = add(polar(0, 0, s, 150), "N");
  const C2 = add(polar(0, 0, s, 210), "C");
  const N3 = add(polar(0, 0, s, 270), "N");
  const C4 = add(polar(0, 0, s, 330), "C");
  const C5 = add(polar(0, 0, s, 30), "C");
  // Besh a'zoli halqa (C4–C5 qirrasi umumiy)
  const pcx = s * Math.cos(Math.PI / 6) + s / (2 * Math.tan(Math.PI / 5));
  const pr = s / (2 * Math.sin(Math.PI / 5));
  const N7 = add(polar(pcx, 0, pr, 108), "N");
  const C8 = add(polar(pcx, 0, pr, 0), "C");
  const N9 = add(polar(pcx, 0, pr, -108), "N");
  const ring: [number, number, number][] = [
    [C6, N1, 1], [N1, C2, 1], [C2, N3, 1], [N3, C4, 1], [C4, C5, 2], [C5, C6, 1],
    [C5, N7, 1], [N7, C8, 1], [C8, N9, 2], [N9, C4, 1],
  ];
  bonds.push(...ring);
  // Karbonil kislorodlari
  bonds.push([C6, add(out(C6, 1.25, 90), "O"), 2]);
  bonds.push([C2, add(out(C2, 1.25, 210), "O"), 2]);
  // Metil guruhlari (3D vodorodlar bilan)
  for (const [n, deg] of [[N1, 150], [N3, 270], [N7, 90]] as const) {
    const m = add(out(n, 1.47, deg), "C");
    bonds.push([n, m, 1]);
    for (let k = 0; k < 3; k++) {
      const [x, y] = atoms[m].p;
      const a = ((deg + (k - 1) * 110) * Math.PI) / 180;
      const h = add([x + 0.75 * Math.cos(a), y + 0.75 * Math.sin(a), (k - 1) * 0.85 + 0.3], "H");
      bonds.push([m, h, 1]);
    }
  }
  bonds.push([C8, add(out(C8, 1.05, 0), "H"), 1]);

  const group = new THREE.Group();
  const sphere = track(new THREE.SphereGeometry(1, 40, 28));
  const style = {
    C: { color: 0x9fb0c4, r: 0.36 },
    N: { color: 0x3b82f6, r: 0.36 },
    O: { color: 0xef4444, r: 0.38 },
    H: { color: 0xeef3f8, r: 0.2 },
  };
  const mats = Object.fromEntries(
    Object.entries(style).map(([el, st]) => [
      el,
      track(new THREE.MeshPhysicalMaterial({ color: st.color, roughness: 0.25, metalness: 0.15, clearcoat: 1, clearcoatRoughness: 0.15 })),
    ]),
  );
  for (const a of atoms) {
    const m = new THREE.Mesh(sphere, mats[a.el]);
    m.position.set(...a.p);
    m.scale.setScalar(style[a.el].r);
    group.add(m);
  }
  const cyl = track(new THREE.CylinderGeometry(0.075, 0.075, 1, 14));
  const bondMat = track(new THREE.MeshStandardMaterial({ color: 0xc9d4e2, roughness: 0.35, metalness: 0.4 }));
  const up = new THREE.Vector3(0, 1, 0);
  for (const [a, b, order] of bonds) {
    const pa = new THREE.Vector3(...atoms[a].p), pb = new THREE.Vector3(...atoms[b].p);
    const dir = pb.clone().sub(pa);
    const len = dir.length();
    const q = new THREE.Quaternion().setFromUnitVectors(up, dir.clone().normalize());
    const side = new THREE.Vector3(0, 0, 1).cross(dir).normalize().multiplyScalar(0.11);
    const offsets = order === 2 ? [side, side.clone().negate()] : [new THREE.Vector3()];
    for (const o of offsets) {
      const m = new THREE.Mesh(cyl, bondMat);
      m.position.copy(pa).add(pb).multiplyScalar(0.5).add(o);
      m.quaternion.copy(q);
      m.scale.set(1, len, 1);
      group.add(m);
    }
  }
  // Molekulani markazga keltiramiz
  const box = new THREE.Box3().setFromObject(group);
  group.position.sub(box.getCenter(new THREE.Vector3()));
  const wrap = new THREE.Group();
  wrap.add(group);
  wrap.scale.setScalar(1.1);
  return wrap;
}
