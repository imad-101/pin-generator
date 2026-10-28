import type { SVGProps } from "react";

const base = (props: SVGProps<SVGSVGElement>) => ({
  width: 20,
  height: 20,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  ...props,
});

export const Icon = {
  Sparkles: (p: SVGProps<SVGSVGElement>) => (
    <svg {...base(p)}>
      <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z" />
      <path d="M19 17l.7 2.3L22 20l-2.3.7L19 23l-.7-2.3L16 20l2.3-.7z" />
    </svg>
  ),
  Link: (p: SVGProps<SVGSVGElement>) => (
    <svg {...base(p)}>
      <path d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1" />
      <path d="M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1" />
    </svg>
  ),
  Download: (p: SVGProps<SVGSVGElement>) => (
    <svg {...base(p)}>
      <path d="M12 3v12" />
      <path d="m7 10 5 5 5-5" />
      <path d="M4 21h16" />
    </svg>
  ),
  Edit: (p: SVGProps<SVGSVGElement>) => (
    <svg {...base(p)}>
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" />
    </svg>
  ),
  Shuffle: (p: SVGProps<SVGSVGElement>) => (
    <svg {...base(p)}>
      <path d="M16 3h5v5" />
      <path d="M4 20 21 3" />
      <path d="M21 16v5h-5" />
      <path d="m15 15 6 6" />
      <path d="m4 4 5 5" />
    </svg>
  ),
  Grid: (p: SVGProps<SVGSVGElement>) => (
    <svg {...base(p)}>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  ),
  Layout: (p: SVGProps<SVGSVGElement>) => (
    <svg {...base(p)}>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 12h18" />
      <path d="M12 12v9" />
    </svg>
  ),
  Clock: (p: SVGProps<SVGSVGElement>) => (
    <svg {...base(p)}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  ),
  X: (p: SVGProps<SVGSVGElement>) => (
    <svg {...base(p)}>
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  ),
  Check: (p: SVGProps<SVGSVGElement>) => (
    <svg {...base(p)}>
      <path d="m5 12 5 5L20 7" />
    </svg>
  ),
  Archive: (p: SVGProps<SVGSVGElement>) => (
    <svg {...base(p)}>
      <rect x="3" y="4" width="18" height="5" rx="1" />
      <path d="M5 9v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9" />
      <path d="M10 13h4" />
    </svg>
  ),
  Image: (p: SVGProps<SVGSVGElement>) => (
    <svg {...base(p)}>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="9" cy="9" r="2" />
      <path d="m21 15-5-5L5 21" />
    </svg>
  ),
  Upload: (p: SVGProps<SVGSVGElement>) => (
    <svg {...base(p)}>
      <path d="M12 16V4" />
      <path d="m7 9 5-5 5 5" />
      <path d="M4 20h16" />
    </svg>
  ),
  Pin: (p: SVGProps<SVGSVGElement>) => (
    <svg {...base(p)} fill="currentColor" stroke="none">
      <path d="M12 2a8 8 0 0 0-2.9 15.45l-.6 3.95a.5.5 0 0 0 .8.48L12.5 19H12a8 8 0 0 0 0-16Z" />
    </svg>
  ),
  Spinner: (p: SVGProps<SVGSVGElement>) => (
    <svg {...base(p)} className={`animate-spin ${p.className ?? ""}`}>
      <path d="M21 12a9 9 0 1 1-6.2-8.56" />
    </svg>
  ),
  ArrowRight: (p: SVGProps<SVGSVGElement>) => (
    <svg {...base(p)}>
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  ),
};
