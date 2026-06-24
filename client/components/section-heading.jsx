import React from "react";

export function SectionHeading({ eyebrow, title, description }) {
  return (
    <div className="max-w-3xl space-y-3">
      {eyebrow && (
        <p className="text-xs font-bold uppercase tracking-[0.24em] text-indigo-400">
          {eyebrow}
        </p>
      )}
      <div className="relative">
        <h2 className="text-3xl font-extrabold leading-tight text-white md:text-4xl font-heading tracking-tight">
          {title}
        </h2>
        {/* Sleek Underline Accent Bar */}
        <div className="mt-4 h-[3px] w-12 rounded-full bg-gradient-to-r from-indigo-500 to-purple-400" />
      </div>
      {description && (
        <p className="text-sm md:text-base leading-relaxed text-[var(--rf-muted)] pt-1">
          {description}
        </p>
      )}
    </div>
  );
}
