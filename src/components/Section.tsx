import type { ReactNode } from "react";

type SectionProps = {
  id?: string;
  eyebrow?: string;
  title?: string;
  lead?: string;
  children: ReactNode;
  tone?: "white" | "mist" | "navy";
  className?: string;
  /** Poravnanje naslova */
  align?: "left" | "center";
};

export default function Section({
  id,
  eyebrow,
  title,
  lead,
  children,
  tone = "white",
  className = "",
  align = "left",
}: SectionProps) {
  const bg =
    tone === "mist"
      ? "bg-sky-mist"
      : tone === "navy"
        ? "bg-navy text-white"
        : "bg-white";
  const titleColor = tone === "navy" ? "text-white" : "text-navy";
  const leadColor = tone === "navy" ? "text-white/75" : "text-muted";
  const eyebrowColor = tone === "navy" ? "text-sky" : "";

  return (
    <section id={id} className={`${bg} py-16 sm:py-20 ${className}`}>
      <div className="container-x">
        {(eyebrow || title || lead) && (
          <div
            className={`mb-10 max-w-2xl ${
              align === "center" ? "mx-auto text-center" : ""
            }`}
          >
            {eyebrow && <p className={`eyebrow ${eyebrowColor}`}>{eyebrow}</p>}
            {title && (
              <h2
                className={`mt-2 text-2xl font-bold sm:text-3xl md:text-[2.1rem] ${titleColor}`}
              >
                {title}
              </h2>
            )}
            {lead && (
              <p className={`mt-3 text-base leading-relaxed sm:text-lg ${leadColor}`}>
                {lead}
              </p>
            )}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}
