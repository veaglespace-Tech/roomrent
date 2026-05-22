interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  description: string;
}

export function SectionHeading({ eyebrow, title, description }: SectionHeadingProps) {
  return (
    <div className="max-w-2xl">
      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">{eyebrow}</p>
      <h2 className="mt-3 text-3xl font-bold text-neutral md:text-4xl">{title}</h2>
      <p className="mt-3 text-base text-base-content/70">{description}</p>
    </div>
  );
}

