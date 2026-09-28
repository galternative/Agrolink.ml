import React from "react";
import { Reveal } from "@/components/Reveal";

export const SectionHeader = ({ label, title, subtitle, align = "center", light = false }) => (
  <Reveal className={`max-w-2xl ${align === "center" ? "mx-auto text-center" : ""} mb-10 sm:mb-14`}>
    {label && (
      <p className={`text-xs tracking-[0.22em] font-bold mb-3 ${light ? "text-[#5DBB32]" : "text-[#1F8A3B]"}`}>
        {label}
      </p>
    )}
    <h2 className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${light ? "text-white" : "text-[#17231D]"}`}>
      {title}
    </h2>
    {subtitle && (
      <p className={`mt-4 text-base leading-relaxed ${light ? "text-white/70" : "text-[#66736B]"}`}>{subtitle}</p>
    )}
  </Reveal>
);
