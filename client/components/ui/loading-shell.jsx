import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { memo } from "react";
function LoadingBlock({ className }) {
    return _jsx("div", { className: `animate-pulse bg-[rgba(15,23,42,0.08)] ${className}` });
}
export const LoadingShell = memo(function LoadingShell({ compact = false }) {
    return (_jsx("div", { className: "page-shell py-8 md:py-10", children: _jsxs("div", { className: "surface-card overflow-hidden p-6 md:p-8", children: [_jsx(LoadingBlock, { className: "h-4 w-36 rounded-full" }), _jsx(LoadingBlock, { className: "mt-4 h-12 w-full max-w-3xl rounded-[6px]" }), _jsx(LoadingBlock, { className: "mt-3 h-5 w-full max-w-2xl rounded-full" }), _jsx("div", { className: `mt-6 grid gap-4 ${compact ? "md:grid-cols-2" : "md:grid-cols-3"}`, children: Array.from({ length: compact ? 4 : 6 }).map((_, index) => (_jsxs("div", { className: "surface-card overflow-hidden p-4", children: [_jsx(LoadingBlock, { className: "h-44 w-full rounded-[6px]" }), _jsx(LoadingBlock, { className: "mt-4 h-4 w-24 rounded-full" }), _jsx(LoadingBlock, { className: "mt-3 h-5 w-3/4 rounded-full" }), _jsx(LoadingBlock, { className: "mt-2 h-4 w-full rounded-full" })] }, index))) })] }) }));
});
