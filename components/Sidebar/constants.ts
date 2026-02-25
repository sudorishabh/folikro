// ──────────────────────────────────────────────
// Shared types, constants & helpers for sidebar
// ──────────────────────────────────────────────

export interface UnsplashPhoto {
  id: string;
  urls: { small: string; regular: string; full: string };
  alt_description: string | null;
  user: { name: string; links: { html: string } };
  links: { html: string };
}

// ── Gradient & Solid Presets ──────────────────

export const GRADIENT_PRESETS = [
  {
    id: "gradient-sunset",
    name: "Sunset",
    style: "linear-gradient(135deg, #f97316, #ec4899, #8b5cf6)",
    category: "gradient",
  },
  {
    id: "gradient-ocean",
    name: "Ocean",
    style: "linear-gradient(135deg, #06b6d4, #3b82f6, #6366f1)",
    category: "gradient",
  },
  {
    id: "gradient-forest",
    name: "Forest",
    style: "linear-gradient(135deg, #22c55e, #14b8a6, #0ea5e9)",
    category: "gradient",
  },
  {
    id: "gradient-midnight",
    name: "Midnight",
    style: "linear-gradient(135deg, #1e1b4b, #312e81, #4338ca)",
    category: "gradient",
  },
  {
    id: "gradient-aurora",
    name: "Aurora",
    style: "linear-gradient(135deg, #a855f7, #06b6d4, #22c55e)",
    category: "gradient",
  },
  {
    id: "gradient-peach",
    name: "Peach",
    style: "linear-gradient(135deg, #fbbf24, #f97316, #ef4444)",
    category: "gradient",
  },
  {
    id: "gradient-lavender",
    name: "Lavender",
    style: "linear-gradient(135deg, #c084fc, #818cf8, #93c5fd)",
    category: "gradient",
  },
  {
    id: "gradient-rose",
    name: "Rosé",
    style: "linear-gradient(135deg, #fb7185, #f472b6, #c084fc)",
    category: "gradient",
  },
  {
    id: "gradient-steel",
    name: "Steel",
    style: "linear-gradient(135deg, #374151, #6b7280, #9ca3af)",
    category: "gradient",
  },
  {
    id: "solid-white",
    name: "White",
    style: "#ffffff",
    category: "solid",
  },
  {
    id: "solid-dark",
    name: "Dark",
    style: "#1e1e2e",
    category: "solid",
  },
  {
    id: "solid-slate",
    name: "Slate",
    style: "#334155",
    category: "solid",
  },
] as const;

// ── Shape Pattern Presets ─────────────────────

export const SHAPE_PATTERNS: {
  id: string;
  name: string;
  css: (color: string, opacity: number) => string;
  preview: string;
}[] = [
  {
    id: "dots",
    name: "Dots",
    css: (color, _opacity) =>
      `radial-gradient(circle, ${color} 1px, transparent 1px)`,
    preview:
      "radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1px)",
  },
  {
    id: "grid",
    name: "Grid",
    css: (color) =>
      `linear-gradient(${color} 1px, transparent 1px), linear-gradient(90deg, ${color} 1px, transparent 1px)`,
    preview:
      "linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)",
  },
  {
    id: "diagonal",
    name: "Diagonal Lines",
    css: (color) =>
      `repeating-linear-gradient(45deg, transparent, transparent 10px, ${color} 10px, ${color} 11px)`,
    preview:
      "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.3) 10px, rgba(255,255,255,0.3) 11px)",
  },
  {
    id: "crosshatch",
    name: "Crosshatch",
    css: (color) =>
      `repeating-linear-gradient(45deg, transparent, transparent 10px, ${color} 10px, ${color} 11px), repeating-linear-gradient(-45deg, transparent, transparent 10px, ${color} 10px, ${color} 11px)`,
    preview:
      "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.25) 10px, rgba(255,255,255,0.25) 11px), repeating-linear-gradient(-45deg, transparent, transparent 10px, rgba(255,255,255,0.25) 10px, rgba(255,255,255,0.25) 11px)",
  },
  {
    id: "horizontal-lines",
    name: "Horizontal Lines",
    css: (color) =>
      `repeating-linear-gradient(0deg, transparent, transparent 14px, ${color} 14px, ${color} 15px)`,
    preview:
      "repeating-linear-gradient(0deg, transparent, transparent 14px, rgba(255,255,255,0.3) 14px, rgba(255,255,255,0.3) 15px)",
  },
  {
    id: "vertical-lines",
    name: "Vertical Lines",
    css: (color) =>
      `repeating-linear-gradient(90deg, transparent, transparent 14px, ${color} 14px, ${color} 15px)`,
    preview:
      "repeating-linear-gradient(90deg, transparent, transparent 14px, rgba(255,255,255,0.3) 14px, rgba(255,255,255,0.3) 15px)",
  },
  {
    id: "checkerboard",
    name: "Checkerboard",
    css: (color) =>
      `linear-gradient(45deg, ${color} 25%, transparent 25%, transparent 75%, ${color} 75%), linear-gradient(45deg, ${color} 25%, transparent 25%, transparent 75%, ${color} 75%)`,
    preview:
      "linear-gradient(45deg, rgba(255,255,255,0.2) 25%, transparent 25%, transparent 75%, rgba(255,255,255,0.2) 75%), linear-gradient(45deg, rgba(255,255,255,0.2) 25%, transparent 25%, transparent 75%, rgba(255,255,255,0.2) 75%)",
  },
  {
    id: "zigzag",
    name: "Zigzag",
    css: (color) =>
      `linear-gradient(135deg, ${color} 25%, transparent 25%) -10px 0, linear-gradient(225deg, ${color} 25%, transparent 25%) -10px 0, linear-gradient(315deg, ${color} 25%, transparent 25%), linear-gradient(45deg, ${color} 25%, transparent 25%)`,
    preview:
      "linear-gradient(135deg, rgba(255,255,255,0.2) 25%, transparent 25%) -10px 0, linear-gradient(225deg, rgba(255,255,255,0.2) 25%, transparent 25%) -10px 0, linear-gradient(315deg, rgba(255,255,255,0.2) 25%, transparent 25%), linear-gradient(45deg, rgba(255,255,255,0.2) 25%, transparent 25%)",
  },
  {
    id: "triangles",
    name: "Triangles",
    css: (color) =>
      `linear-gradient(60deg, ${color} 25%, transparent 25.5%, transparent 75%, ${color} 75%), linear-gradient(-60deg, ${color} 25%, transparent 25.5%, transparent 75%, ${color} 75%)`,
    preview:
      "linear-gradient(60deg, rgba(255,255,255,0.2) 25%, transparent 25.5%, transparent 75%, rgba(255,255,255,0.2) 75%), linear-gradient(-60deg, rgba(255,255,255,0.2) 25%, transparent 25.5%, transparent 75%, rgba(255,255,255,0.2) 75%)",
  },
];

// ── Pattern sizing helpers ────────────────────

export function getPatternSize(patternId: string): string {
  switch (patternId) {
    case "dots":
    case "grid":
    case "checkerboard":
    case "zigzag":
      return "20px 20px";
    case "diagonal":
    case "crosshatch":
      return "14px 14px";
    case "horizontal-lines":
      return "100% 15px";
    case "vertical-lines":
      return "15px 100%";
    case "triangles":
      return "30px 30px";
    default:
      return "20px 20px";
  }
}

export function getPatternBackgroundPosition(
  patternId: string,
): string | undefined {
  if (patternId === "checkerboard") return "0 0, 10px 10px";
  return undefined;
}
