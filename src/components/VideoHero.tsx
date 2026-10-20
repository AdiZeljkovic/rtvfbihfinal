"use client";

import { useEffect, useRef, useState } from "react";
import { preload } from "react-dom";

/** Brend animacije u public/video/ (svaka ima .webm, .mp4 i -poster.webp) */
export const VIDEA = {
  /** Brend animacija FTV (naslovna) */
  intro: { ime: "ftv-intro", opis: "Animacija logotipa Radio-televizije Federacije BiH" },
  /** Jubilarna animacija „F25 godina“ (stranica Televizija) */
  jubilej: { ime: "ftv-25-godina", opis: "Animacija jubilarnog logotipa 25 godina Federalne televizije" },
} as const;

type Props = {
  className?: string;
  /** Klase za sam <video> element (npr. object-position, scale) */
  videoClassName?: string;
  /** Zaobljeni okvir s sjenom ili puni bleed */
  framed?: boolean;
  /** Koja animacija (zadano: brend animacija s naslovne) */
  video?: keyof typeof VIDEA;
};

/**
 * Brend animacija (5,5 s, bez zvuka, savršena petlja).
 * - autoplay + muted + loop + playsInline (radi i na iOS-u)
 * - poštuje prefers-reduced-motion (tada prikazuje statični poster)
 * - poster = prvi kadar, pa nema "skoka" pri učitavanju
 */
export default function VideoHero({ className = "", videoClassName = "", framed = true, video = "intro" }: Props) {
  const { ime, opis } = VIDEA[video];
  const poster = `/video/${ime}-poster.webp`;
  // poster je prvo što se vidi (LCP): traži se odmah. U klijentskoj komponenti, pa ga
  // ne povuče prefetch naslovne s drugih stranica (kao što bi hint iz server komponente)
  preload(poster, { as: "image", fetchPriority: "high" });
  const ref = useRef<HTMLVideoElement>(null);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduced(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (reduced) {
      v.pause();
    } else {
      v.play().catch(() => {
        /* autoplay može biti blokiran – poster ostaje vidljiv */
      });
    }
  }, [reduced]);

  return (
    <div
      className={`relative min-w-0 overflow-hidden ${
        framed ? "rounded-3xl shadow-[0_30px_60px_-30px_rgba(11,37,64,0.45)] ring-1 ring-white/60" : ""
      } ${className}`}
    >
      <video
        ref={ref}
        className={`block h-full w-full max-w-full object-cover ${videoClassName}`}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster={poster}
        aria-label={opis}
      >
        <source src={`/video/${ime}.webm`} type="video/webm" />
        <source src={`/video/${ime}.mp4`} type="video/mp4" />
      </video>
    </div>
  );
}
