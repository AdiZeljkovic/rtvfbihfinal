"use client";

import { useEffect, useRef } from "react";

/** Naslov koji dobije fokus čim se stranica otvori (čitač ekrana ga odmah pročita) */
export default function Fokus({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLHeadingElement>(null);
  useEffect(() => ref.current?.focus(), []);
  return (
    <h1 ref={ref} tabIndex={-1} className={`outline-none ${className ?? ""}`}>
      {children}
    </h1>
  );
}
