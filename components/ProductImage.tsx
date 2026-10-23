import Image from "next/image";
import { blurProps, optimizable, type Media } from "@/lib/media";

/** Mahsulot rasmi: shaffof/oq fonli suratlar studiya foniga singib ketadi (multiply) */
export function ProductImage({
  media,
  sizes,
  className = "",
  pad = "p-6",
  eager = false,
}: {
  media: Media;
  sizes: string;
  className?: string;
  pad?: string;
  eager?: boolean;
}) {
  const cover = media.fit === "cover";
  return (
    <div className={`relative overflow-hidden ${cover ? "bg-sunk" : "bg-studio"} ${className}`}>
      <div className={`absolute inset-0 ${cover ? "" : pad}`}>
        <div className="relative size-full">
          <Image
            src={media.src}
            alt={media.alt}
            fill
            sizes={sizes}
            {...blurProps(media.src)}
            unoptimized={!optimizable(media.src)}
            loading={eager ? "eager" : undefined}
            fetchPriority={eager ? "high" : undefined}
            className={`transition-transform duration-700 ease-out group-hover:scale-[1.04] ${
              cover ? "object-cover" : "object-contain mix-blend-multiply"
            }`}
          />
        </div>
      </div>
    </div>
  );
}
