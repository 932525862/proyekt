"use client";

import { useState } from "react";
import { Icon } from "@/components/Icon";
import { field, label } from "./ui";

/** Rasm: joriy ko'rinish + fayl yuklash / URL kiritish / o'chirish + joylashuv (contain/cover) */
export function ImageField({ current, fit, canUpload }: { current: string | null; fit: "contain" | "cover"; canUpload: boolean }) {
  const [preview, setPreview] = useState<string | null>(current);
  const [mode, setMode] = useState<"contain" | "cover">(fit);
  const [removed, setRemoved] = useState(false);

  return (
    <div className="grid gap-4 sm:grid-cols-[180px_1fr]">
      <div
        className={`relative grid aspect-[4/3] place-items-center overflow-hidden rounded-md border border-line ${mode === "cover" ? "bg-sunk" : "bg-studio"}`}
      >
        {preview && !removed ? (
          // eslint-disable-next-line @next/next/no-img-element -- lokal ko'rinish (blob: URL)
          <img src={preview} alt="" className={`absolute inset-0 size-full ${mode === "cover" ? "object-cover" : "object-contain p-3 mix-blend-multiply"}`} />
        ) : (
          <span className="flex flex-col items-center gap-1 text-xs text-muted">
            <Icon name="imagePlus" className="size-7" strokeWidth={1.25} /> Rasm yo&apos;q
          </span>
        )}
      </div>
      <div className="grid content-start gap-3">
        {canUpload && (
          <label className={label}>
            Yangi rasm yuklash (JPG, PNG, WebP — 8 MB gacha)
            <input
              type="file"
              name="imageFile"
              accept="image/*"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) {
                  setPreview(URL.createObjectURL(f));
                  setRemoved(false);
                }
              }}
              className="text-sm file:mr-3 file:rounded-md file:border-0 file:bg-accent file:px-3 file:py-2 file:text-sm file:font-semibold file:text-accent-ink"
            />
          </label>
        )}
        <label className={label}>
          yoki rasm manzili (URL)
          <input
            name="imageUrl"
            defaultValue={current ?? ""}
            placeholder="/images/products/... yoki https://..."
            onBlur={(e) => e.target.value && setPreview(e.target.value)}
            className={field}
          />
        </label>
        <div className="flex flex-wrap items-center gap-4">
          <label className="flex items-center gap-2 text-sm">
            Joylashuv:
            <select name="imageFit" value={mode} onChange={(e) => setMode(e.target.value as "contain" | "cover")} className="rounded-md border border-line bg-card px-2 py-1 text-sm">
              <option value="contain">Butun mahsulot (oq fon)</option>
              <option value="cover">To&apos;liq to&apos;ldirish (surat)</option>
            </select>
          </label>
          {current && (
            <label className="flex items-center gap-2 text-sm text-red-700">
              <input type="checkbox" name="imageRemove" checked={removed} onChange={(e) => setRemoved(e.target.checked)} /> Rasmni olib tashlash
            </label>
          )}
        </div>
      </div>
    </div>
  );
}
