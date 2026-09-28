"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  className?: string;
  /** Zaobljeni okvir s sjenom (za split layout) ili puni bleed */
  framed?: boolean;
};

/**
 * Brend animacija (5,5 s, bez zvuka, savršena petlja).
 * - autoplay + muted + loop + playsInline (radi i na iOS-u)
 * - poštuje prefers-reduced-motion (tada prikazuje statični poster)
 * - poster = prvi kadar, pa nema "skoka" pri učitavanju
 */
export default function VideoHero({ className = "", framed = true }: Props) {
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
        framed ? "rounded-2xl shadow-[0_30px_60px_-30px_rgba(11,37,64,0.45)] ring-1 ring-white/60" : ""
      } ${className}`}
    >
      <video
        ref={ref}
        className="block h-full w-full max-w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster="/video/ftv-intro-poster.jpg"
        aria-label="Animacija logotipa Radio-televizije Federacije BiH"
      >
        <source src="/video/ftv-intro.webm" type="video/webm" />
        <source src="/video/ftv-intro.mp4" type="video/mp4" />
      </video>
    </div>
  );
}
