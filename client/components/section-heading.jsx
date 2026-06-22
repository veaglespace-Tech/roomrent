import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function SectionHeading({ eyebrow, title, description }) {
    return (_jsxs("div", { className: "max-w-2xl", children: [_jsx("p", { className: "text-sm font-semibold uppercase tracking-[0.24em] text-green-700", children: eyebrow }), _jsx("h2", { className: "mt-3 text-3xl font-bold leading-tight text-neutral md:text-4xl", children: title }), _jsx("p", { className: "mt-3 text-base leading-7 text-base-content/70", children: description })] }));
}
