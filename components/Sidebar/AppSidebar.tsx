"use client";
import * as React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import {
  updateBackground,
  resetBackground,
  updateWidgetBackground,
  updateWidget,
  defaultBackground,
  BackgroundSettings,
} from "@/redux/dashboardSlice";
import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import {
  Search,
  Shuffle,
  X,
  CheckCircle2,
  Loader2,
  ImageIcon,
  Sparkles,
  Sun,
  Droplets,
  Grid3X3,
  ChevronRight,
  RotateCcw,
  Upload,
  Palette,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

// ──────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────
interface UnsplashPhoto {
  id: string;
  urls: { small: string; regular: string; full: string };
  alt_description: string | null;
  user: { name: string; links: { html: string } };
  links: { html: string };
}

// ──────────────────────────────────────────────
// Unsplash Image Picker (used inside dialog)
// ──────────────────────────────────────────────
function UnsplashPicker({
  onSelect,
  currentUrl,
}: {
  onSelect: (url: string) => void;
  currentUrl: string;
}) {
  const [photos, setPhotos] = useState<UnsplashPhoto[]>([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [mode, setMode] = useState<"random" | "search">("random");
  const [contentType, setContentType] = useState<"images" | "illustrations">(
    "images",
  );
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const contentTypeRef = useRef(contentType);
  contentTypeRef.current = contentType;

  // Build the actual search query based on content type
  const buildQuery = useCallback(
    (baseQuery: string, type: "images" | "illustrations") => {
      if (type === "illustrations") {
        return baseQuery ? `${baseQuery} illustration` : "illustration";
      }
      return baseQuery;
    },
    [],
  );

  const fetchPhotos = useCallback(
    async (
      searchQuery: string,
      pageNum: number,
      isRandom: boolean,
      replace: boolean,
      type: "images" | "illustrations" = "images",
    ) => {
      setLoading(true);
      try {
        let url = "/api/unsplash";
        if (isRandom && type === "images") {
          // For images, random mode fetches truly random photos
          url += "?random=true";
        } else if (isRandom && type === "illustrations") {
          // For illustrations, search with "illustration" as the query
          url += `?q=${encodeURIComponent("illustration")}&page=1`;
        } else if (searchQuery) {
          url += `?q=${encodeURIComponent(searchQuery)}&page=${pageNum}`;
        } else {
          url += `?page=${pageNum}`;
        }
        const res = await fetch(url);
        const data = await res.json();
        const fetched: UnsplashPhoto[] = data.photos ?? [];
        setPhotos((prev) => (replace ? fetched : [...prev, ...fetched]));
        setHasMore(fetched.length === 20);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    fetchPhotos("", 1, true, true, "images");
  }, [fetchPhotos]);

  // When content type changes, re-fetch
  const handleContentTypeChange = (type: "images" | "illustrations") => {
    setContentType(type);
    setPage(1);
    if (inputValue.trim()) {
      // Re-search with the new type
      const newQuery = buildQuery(inputValue.trim(), type);
      setQuery(newQuery);
      setMode("search");
      fetchPhotos(newQuery, 1, false, true, type);
    } else {
      // Random mode
      setMode("random");
      setQuery("");
      fetchPhotos("", 1, true, true, type);
    }
  };

  const handleSearch = (val: string) => {
    setInputValue(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const type = contentTypeRef.current;
      if (val.trim()) {
        const newQuery = buildQuery(val.trim(), type);
        setMode("search");
        setQuery(newQuery);
        setPage(1);
        fetchPhotos(newQuery, 1, false, true, type);
      } else {
        setMode("random");
        setQuery("");
        setPage(1);
        fetchPhotos("", 1, true, true, type);
      }
    }, 500);
  };

  const clearSearch = () => {
    setInputValue("");
    setMode("random");
    setQuery("");
    setPage(1);
    fetchPhotos("", 1, true, true, contentType);
  };

  const handleShuffle = () => {
    setInputValue("");
    setMode("random");
    setQuery("");
    setPage(1);
    fetchPhotos("", 1, true, true, contentType);
  };

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchPhotos(query, nextPage, false, false, contentType);
  };

  return (
    <div className='flex flex-col gap-3'>
      {/* Content type toggle: Images / Illustrations */}
      <div className='flex items-center rounded-xl bg-slate-900/60 border border-slate-700/60 p-1 gap-1'>
        <button
          onClick={() => handleContentTypeChange("images")}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-medium transition-all duration-200 ${
            contentType === "images"
              ? "bg-violet-500/20 text-violet-300 shadow-sm"
              : "text-slate-500 hover:text-slate-300"
          }`}>
          <ImageIcon className='h-3.5 w-3.5' />
          Images
        </button>
        <button
          onClick={() => handleContentTypeChange("illustrations")}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-medium transition-all duration-200 ${
            contentType === "illustrations"
              ? "bg-violet-500/20 text-violet-300 shadow-sm"
              : "text-slate-500 hover:text-slate-300"
          }`}>
          <Sparkles className='h-3.5 w-3.5' />
          Illustrations
        </button>
      </div>

      {/* Search bar */}
      <div className='relative flex items-center gap-2'>
        <div className='relative flex-1'>
          <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500 pointer-events-none' />
          <input
            type='text'
            value={inputValue}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder={
              contentType === "illustrations"
                ? "Search illustrations…"
                : "Search Unsplash…"
            }
            className='w-full pl-9 pr-8 py-2.5 text-xs bg-slate-900/60 border border-slate-700/60 rounded-xl text-slate-200 placeholder-slate-500 outline-none focus:border-violet-500/60 focus:ring-1 focus:ring-violet-500/20 transition-all'
          />
          {inputValue && (
            <button
              onClick={clearSearch}
              className='absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors'>
              <X className='h-3.5 w-3.5' />
            </button>
          )}
        </div>
        <button
          onClick={handleShuffle}
          title='Random photos'
          className='shrink-0 p-2.5 rounded-xl bg-slate-900/60 border border-slate-700/60 text-slate-400 hover:text-white hover:border-violet-500/40 hover:bg-slate-800/80 transition-all active:scale-95'>
          <Shuffle className='h-4 w-4' />
        </button>
      </div>

      {/* Mode label */}
      <div className='flex items-center gap-1.5'>
        <div className='h-px flex-1 bg-slate-800' />
        <span className='text-[10px] font-semibold uppercase tracking-widest text-slate-500'>
          {mode === "random"
            ? contentType === "illustrations"
              ? "Illustrations"
              : "Random Picks"
            : `Results for "${inputValue}"`}
        </span>
        <div className='h-px flex-1 bg-slate-800' />
      </div>

      {/* Grid */}
      {loading && photos.length === 0 ? (
        <div className='flex flex-col items-center justify-center py-14 gap-3'>
          <Loader2 className='h-6 w-6 text-violet-400 animate-spin' />
          <span className='text-xs text-slate-500'>Loading photos…</span>
        </div>
      ) : photos.length === 0 ? (
        <div className='flex flex-col items-center justify-center py-14 gap-3'>
          <ImageIcon className='h-8 w-8 text-slate-700' />
          <span className='text-xs text-slate-500'>No photos found</span>
        </div>
      ) : (
        <>
          <div className='grid grid-cols-3 gap-2'>
            {photos.map((photo) => {
              const isSelected = currentUrl === photo.urls.regular;
              return (
                <button
                  key={photo.id}
                  onClick={() => onSelect(photo.urls.regular)}
                  className='group relative aspect-square rounded-xl overflow-hidden border border-slate-800/80 hover:border-violet-500/60 transition-all duration-300 shadow-lg hover:shadow-violet-500/10 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500'
                  title={photo.alt_description ?? photo.user.name}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photo.urls.small}
                    alt={photo.alt_description ?? "Unsplash photo"}
                    className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-500'
                    loading='lazy'
                  />
                  <div className='absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-2'>
                    <span className='text-[9px] font-medium text-white/80 truncate'>
                      {photo.user.name}
                    </span>
                  </div>
                  {isSelected && (
                    <div className='absolute inset-0 bg-violet-500/20 flex items-center justify-center ring-2 ring-inset ring-violet-400'>
                      <div className='bg-violet-500 rounded-full p-1 shadow-lg ring-2 ring-white/20'>
                        <CheckCircle2 className='h-4 w-4 text-white' />
                      </div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {hasMore && (
            <Button
              variant='outline'
              size='sm'
              onClick={loadMore}
              disabled={loading}
              className='w-full text-xs bg-slate-900/40 border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-white transition-all rounded-xl'>
              {loading ? (
                <Loader2 className='h-3.5 w-3.5 animate-spin mr-1.5' />
              ) : null}
              Load more
            </Button>
          )}

          <p className='text-center text-[9px] text-slate-600'>
            Photos by{" "}
            <a
              href='https://unsplash.com'
              target='_blank'
              rel='noopener noreferrer'
              className='text-slate-500 hover:text-slate-300 underline underline-offset-2 transition-colors'>
              Unsplash
            </a>
          </p>
        </>
      )}

      {currentUrl && (
        <Button
          variant='outline'
          className='w-full text-xs bg-slate-900/40 border-slate-800 text-slate-400 hover:bg-red-900/30 hover:text-red-400 hover:border-red-800/60 transition-all rounded-xl'
          onClick={() => onSelect("")}>
          Remove Background
        </Button>
      )}
    </div>
  );
}

// ──────────────────────────────────────────────
// Gradient Shade Presets (now inside Image dialog)
// ──────────────────────────────────────────────
const GRADIENT_PRESETS = [
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
];

function GradientShadesPicker({
  onSelect,
  currentBg,
}: {
  onSelect: (style: string) => void;
  currentBg: string;
}) {
  const gradients = GRADIENT_PRESETS.filter((p) => p.category === "gradient");
  const solids = GRADIENT_PRESETS.filter((p) => p.category === "solid");

  return (
    <div className='flex flex-col gap-5'>
      {/* Gradients */}
      <div>
        <h4 className='text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3'>
          Gradients
        </h4>
        <div className='grid grid-cols-3 gap-2'>
          {gradients.map((preset) => {
            const isSelected = currentBg === preset.style;
            return (
              <button
                key={preset.id}
                onClick={() => onSelect(preset.style)}
                className='group relative aspect-square rounded-xl overflow-hidden border border-slate-800/80 hover:border-violet-500/50 transition-all duration-300 active:scale-95'
                title={preset.name}>
                <div
                  className='w-full h-full'
                  style={{ background: preset.style }}
                />
                <div className='absolute inset-x-0 bottom-0 bg-linear-to-t from-black/60 to-transparent p-1.5'>
                  <span className='text-[10px] font-medium text-white/90'>
                    {preset.name}
                  </span>
                </div>
                {isSelected && (
                  <div className='absolute inset-0 bg-violet-500/20 flex items-center justify-center ring-2 ring-inset ring-violet-400'>
                    <div className='bg-violet-500 rounded-full p-1 shadow-lg'>
                      <CheckCircle2 className='h-4 w-4 text-white' />
                    </div>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Solid Colors */}
      <div>
        <h4 className='text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3'>
          Solid Colors
        </h4>
        <div className='grid grid-cols-3 gap-2'>
          {solids.map((preset) => {
            const isSelected = currentBg === preset.style;
            return (
              <button
                key={preset.id}
                onClick={() => onSelect(preset.style)}
                className='group relative aspect-square rounded-xl overflow-hidden border border-slate-800/80 hover:border-violet-500/50 transition-all duration-300 active:scale-95'
                title={preset.name}>
                <div
                  className='w-full h-full'
                  style={{ background: preset.style }}
                />
                <div className='absolute inset-x-0 bottom-0 bg-linear-to-t from-black/60 to-transparent p-1.5'>
                  <span className='text-[10px] font-medium text-white/90'>
                    {preset.name}
                  </span>
                </div>
                {isSelected && (
                  <div className='absolute inset-0 bg-violet-500/20 flex items-center justify-center ring-2 ring-inset ring-violet-400'>
                    <div className='bg-violet-500 rounded-full p-1 shadow-lg'>
                      <CheckCircle2 className='h-4 w-4 text-white' />
                    </div>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Custom color picker */}
      <div>
        <h4 className='text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3'>
          Custom Color
        </h4>
        <div className='flex items-center gap-3'>
          <div className='relative'>
            <input
              type='color'
              value={
                currentBg.startsWith("#") && currentBg.length <= 7
                  ? currentBg
                  : "#6366f1"
              }
              onChange={(e) => onSelect(e.target.value)}
              className='w-10 h-10 rounded-xl border-2 border-slate-700 cursor-pointer bg-transparent [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:rounded-lg [&::-webkit-color-swatch]:border-none'
            />
          </div>
          <span className='text-xs text-slate-400'>
            Pick any color you like
          </span>
        </div>
      </div>

      {currentBg && (
        <Button
          variant='outline'
          className='w-full text-xs bg-slate-900/40 border-slate-800 text-slate-400 hover:bg-red-900/30 hover:text-red-400 hover:border-red-800/60 transition-all rounded-xl'
          onClick={() => onSelect("")}>
          Remove Background
        </Button>
      )}
    </div>
  );
}

// ──────────────────────────────────────────────
// Shape Pattern Presets (overlays on backgrounds)
// ──────────────────────────────────────────────
export const SHAPE_PATTERNS: {
  id: string;
  name: string;
  css: (color: string, opacity: number) => string;
  preview: string; // CSS for preview thumbnail
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

// Pattern size definitions for each pattern
function getPatternSize(patternId: string): string {
  switch (patternId) {
    case "dots":
      return "20px 20px";
    case "grid":
      return "20px 20px";
    case "diagonal":
      return "14px 14px";
    case "crosshatch":
      return "14px 14px";
    case "horizontal-lines":
      return "100% 15px";
    case "vertical-lines":
      return "15px 100%";
    case "checkerboard":
      return "20px 20px";
    case "zigzag":
      return "20px 20px";
    case "triangles":
      return "30px 30px";
    default:
      return "20px 20px";
  }
}

function getPatternBackgroundPosition(patternId: string): string | undefined {
  if (patternId === "checkerboard") return "0 0, 10px 10px";
  return undefined;
}

function PatternOverlayPicker({
  selectedPattern,
  patternColor,
  patternOpacity,
  onSelectPattern,
  onUpdateColor,
  onUpdateOpacity,
}: {
  selectedPattern: string;
  patternColor: string;
  patternOpacity: number;
  onSelectPattern: (id: string) => void;
  onUpdateColor: (color: string) => void;
  onUpdateOpacity: (opacity: number) => void;
}) {
  return (
    <div className='flex flex-col gap-5'>
      {/* Pattern grid */}
      <div>
        <h4 className='text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3'>
          Shape Overlays
        </h4>
        <div className='grid grid-cols-3 gap-2'>
          {/* None option */}
          <button
            onClick={() => onSelectPattern("")}
            className={`group relative aspect-square rounded-xl overflow-hidden border transition-all duration-300 active:scale-95 ${
              !selectedPattern
                ? "border-violet-500 ring-2 ring-violet-500/30"
                : "border-slate-800/80 hover:border-violet-500/50"
            }`}
            title='None'>
            <div className='w-full h-full bg-slate-800 flex items-center justify-center'>
              <X className='h-5 w-5 text-slate-500' />
            </div>
            <div className='absolute inset-x-0 bottom-0 bg-linear-to-t from-black/60 to-transparent p-1.5'>
              <span className='text-[10px] font-medium text-white/90'>
                None
              </span>
            </div>
          </button>

          {SHAPE_PATTERNS.map((pattern) => {
            const isSelected = selectedPattern === pattern.id;
            return (
              <button
                key={pattern.id}
                onClick={() => onSelectPattern(pattern.id)}
                className={`group relative aspect-square rounded-xl overflow-hidden border transition-all duration-300 active:scale-95 ${
                  isSelected
                    ? "border-violet-500 ring-2 ring-violet-500/30"
                    : "border-slate-800/80 hover:border-violet-500/50"
                }`}
                title={pattern.name}>
                <div
                  className='w-full h-full bg-slate-700'
                  style={{
                    backgroundImage: pattern.preview,
                    backgroundSize: getPatternSize(pattern.id),
                    backgroundPosition: getPatternBackgroundPosition(
                      pattern.id,
                    ),
                  }}
                />
                <div className='absolute inset-x-0 bottom-0 bg-linear-to-t from-black/60 to-transparent p-1.5'>
                  <span className='text-[10px] font-medium text-white/90'>
                    {pattern.name}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Controls (shown when a pattern is selected) */}
      {selectedPattern && (
        <>
          <div className='space-y-3'>
            <div className='flex justify-between items-center'>
              <Label className='text-slate-300 text-xs font-medium'>
                Pattern Color
              </Label>
              <div className='flex items-center gap-2'>
                <input
                  type='color'
                  value={patternColor}
                  onChange={(e) => onUpdateColor(e.target.value)}
                  className='w-7 h-7 rounded-lg border border-slate-700 cursor-pointer bg-transparent [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:rounded-md [&::-webkit-color-swatch]:border-none'
                />
                <span className='text-[10px] font-mono text-slate-500'>
                  {patternColor}
                </span>
              </div>
            </div>
          </div>

          <div className='space-y-3'>
            <div className='flex justify-between items-center'>
              <Label className='text-slate-300 text-xs font-medium'>
                Pattern Opacity
              </Label>
              <span className='text-xs font-mono text-violet-400 bg-violet-500/10 px-2 py-0.5 rounded-md'>
                {patternOpacity}%
              </span>
            </div>
            <Slider
              value={[patternOpacity]}
              onValueChange={([value]) => onUpdateOpacity(value)}
              min={5}
              max={100}
              step={1}
              className='w-full'
            />
          </div>
        </>
      )}
    </div>
  );
}

// ──────────────────────────────────────────────
// Shadows & Blur Panel
// ──────────────────────────────────────────────
function ShadowsBlurPanel({
  background,
  onUpdate,
  onReset,
}: {
  background: BackgroundSettings;
  onUpdate: (updates: Partial<BackgroundSettings>) => void;
  onReset: () => void;
}) {
  const isImageBg =
    background.imageUrl.startsWith("http") ||
    background.imageUrl.startsWith("data:");

  return (
    <div className='flex flex-col gap-6'>
      {/* Opacity */}
      <div className='space-y-3'>
        <div className='flex justify-between items-center'>
          <Label className='text-slate-300 text-xs font-medium flex items-center gap-2'>
            <Sun className='h-3.5 w-3.5 text-amber-400' />
            Opacity
          </Label>
          <span className='text-xs font-mono text-violet-400 bg-violet-500/10 px-2 py-0.5 rounded-md'>
            {background.opacity}%
          </span>
        </div>
        <Slider
          value={[background.opacity]}
          onValueChange={([value]) => onUpdate({ opacity: value })}
          min={0}
          max={100}
          step={1}
          className='w-full'
        />
        <p className='text-[10px] text-slate-600'>
          Controls the transparency of the background
        </p>
      </div>

      {/* Blur */}
      <div className='space-y-3'>
        <div className='flex justify-between items-center'>
          <Label className='text-slate-300 text-xs font-medium flex items-center gap-2'>
            <Droplets className='h-3.5 w-3.5 text-blue-400' />
            Blur Effect
          </Label>
          <span className='text-xs font-mono text-violet-400 bg-violet-500/10 px-2 py-0.5 rounded-md'>
            {background.blur}px
          </span>
        </div>
        <Slider
          value={[background.blur]}
          onValueChange={([value]) => onUpdate({ blur: value })}
          min={0}
          max={20}
          step={1}
          className='w-full'
        />
        <p className='text-[10px] text-slate-600'>
          Apply a gaussian blur to the background
        </p>
      </div>

      {/* Preview */}
      {background.imageUrl && (
        <div className='space-y-2'>
          <Label className='text-slate-300 text-xs font-medium'>Preview</Label>
          <div className='relative aspect-video rounded-xl overflow-hidden border border-slate-800'>
            {isImageBg ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={background.imageUrl}
                alt='Preview'
                className='w-full h-full object-cover'
                style={{
                  opacity: background.opacity / 100,
                  filter: `blur(${background.blur}px)`,
                }}
              />
            ) : (
              <div
                className='w-full h-full'
                style={{
                  background: background.imageUrl,
                  opacity: background.opacity / 100,
                  filter: `blur(${background.blur}px)`,
                }}
              />
            )}
          </div>
        </div>
      )}

      {/* Reset */}
      <Button
        variant='outline'
        size='sm'
        onClick={onReset}
        className='w-full text-xs bg-slate-900/40 border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-white transition-all rounded-xl gap-2'>
        <RotateCcw className='h-3 w-3' />
        Reset to Default
      </Button>
    </div>
  );
}

// ──────────────────────────────────────────────
// Option Card
// ──────────────────────────────────────────────
function OptionCard({
  icon: Icon,
  title,
  description,
  accentColor,
  onClick,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  accentColor: string;
  onClick: () => void;
}) {
  const colorMap: Record<
    string,
    { bg: string; border: string; text: string; iconBg: string; shadow: string }
  > = {
    violet: {
      bg: "hover:bg-violet-500/5",
      border: "hover:border-violet-500/40",
      text: "text-violet-400",
      iconBg: "bg-violet-500/10",
      shadow: "hover:shadow-violet-500/5",
    },
    amber: {
      bg: "hover:bg-amber-500/5",
      border: "hover:border-amber-500/40",
      text: "text-amber-400",
      iconBg: "bg-amber-500/10",
      shadow: "hover:shadow-amber-500/5",
    },
    blue: {
      bg: "hover:bg-blue-500/5",
      border: "hover:border-blue-500/40",
      text: "text-blue-400",
      iconBg: "bg-blue-500/10",
      shadow: "hover:shadow-blue-500/5",
    },
  };

  const colors = colorMap[accentColor] ?? colorMap.violet;

  return (
    <button
      onClick={onClick}
      className={`group w-full flex items-center gap-4 p-4 rounded-2xl border border-slate-800/80 bg-slate-900/30 ${colors.bg} ${colors.border} ${colors.shadow} transition-all duration-300 hover:shadow-lg active:scale-[0.98]`}>
      <div
        className={`shrink-0 w-11 h-11 rounded-xl ${colors.iconBg} flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}>
        <Icon className={`h-5 w-5 ${colors.text}`} />
      </div>
      <div className='flex-1 text-left'>
        <h4 className='text-sm font-semibold text-slate-200 group-hover:text-white transition-colors'>
          {title}
        </h4>
        <p className='text-[11px] text-slate-500 mt-0.5 leading-snug'>
          {description}
        </p>
      </div>
      <ChevronRight className='h-4 w-4 text-slate-600 group-hover:text-slate-400 group-hover:translate-x-0.5 transition-all duration-300' />
    </button>
  );
}

// ──────────────────────────────────────────────
// Main Sidebar
// ──────────────────────────────────────────────
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { activeSidebar } = useSelector((state: RootState) => state.sidebar);
  const { background, widgets, selectedWidgetId } = useSelector(
    (state: RootState) => state.dashboard,
  );
  const dispatch = useDispatch();

  const selectedWidget = widgets.find((w) => w.id === selectedWidgetId);

  // Dialog states
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [patternDialogOpen, setPatternDialogOpen] = useState(false);
  const [effectsDialogOpen, setEffectsDialogOpen] = useState(false);

  // Track which target we're editing
  const target =
    activeSidebar === "widget-settings" && selectedWidget
      ? "widget"
      : "dashboard";

  const currentBackground =
    target === "widget" && selectedWidget
      ? selectedWidget.background
      : background;

  // Unified update handler
  const handleUpdate = (updates: Partial<BackgroundSettings>) => {
    if (target === "widget" && selectedWidget) {
      dispatch(updateWidgetBackground({ id: selectedWidget.id, updates }));
    } else {
      dispatch(updateBackground(updates));
    }
  };

  const handleReset = () => {
    if (target === "widget" && selectedWidget) {
      dispatch(
        updateWidgetBackground({
          id: selectedWidget.id,
          updates: defaultBackground,
        }),
      );
    } else {
      dispatch(resetBackground());
    }
  };

  const handleImageSelect = (url: string) => {
    handleUpdate({ imageUrl: url });
  };

  const handleGradientSelect = (style: string) => {
    handleUpdate({ imageUrl: style });
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageUrl = event.target?.result as string;
        handleUpdate({ imageUrl });
      };
      reader.readAsDataURL(file);
    }
  };

  const getTitle = () => {
    if (activeSidebar === "background") return "Dashboard";
    if (activeSidebar === "widget-settings") return "Widget";
    return "Settings";
  };

  const getSubtitle = () => {
    if (activeSidebar === "background")
      return "Customize your dashboard appearance";
    if (activeSidebar === "widget-settings" && selectedWidget)
      return `Editing: ${selectedWidget.title || "Untitled Widget"}`;
    return "";
  };

  const isImageBg =
    currentBackground.imageUrl.startsWith("http") ||
    currentBackground.imageUrl.startsWith("data:");

  return (
    <>
      <Sidebar
        variant='inset'
        {...props}>
        <SidebarHeader className='p-5 border-b border-slate-800/60'>
          <div className='flex items-center gap-3'>
            <div className='w-8 h-8 rounded-lg bg-linear-to-br from-violet-500 to-blue-500 flex items-center justify-center shadow-lg shadow-violet-500/20'>
              <Sparkles className='h-4 w-4 text-white' />
            </div>
            <div>
              <h2 className='text-base font-bold text-white tracking-tight'>
                {getTitle()}
              </h2>
              <p className='text-[11px] text-slate-500 mt-0.5'>
                {getSubtitle()}
              </p>
            </div>
          </div>
        </SidebarHeader>

        <SidebarContent className='p-4'>
          {/* Widget Title (only for widget settings) */}
          {activeSidebar === "widget-settings" && selectedWidget && (
            <div className='mb-5 space-y-2'>
              <Label className='text-slate-400 text-xs font-medium'>
                Widget Title
              </Label>
              <input
                type='text'
                placeholder='Enter widget title...'
                value={selectedWidget.title || ""}
                onChange={(e) =>
                  dispatch(
                    updateWidget({
                      id: selectedWidget.id,
                      updates: { title: e.target.value },
                    }),
                  )
                }
                className='w-full px-3 py-2 text-sm bg-slate-900/60 border border-slate-700/60 rounded-xl text-slate-200 placeholder-slate-600 outline-none focus:border-violet-500/60 focus:ring-1 focus:ring-violet-500/20 transition-all'
              />
            </div>
          )}

          {/* Option Cards */}
          {(activeSidebar === "background" ||
            activeSidebar === "widget-settings") && (
            <div className='flex flex-col gap-3'>
              {/* Current Preview */}
              {currentBackground.imageUrl && (
                <div className='mb-2'>
                  <div className='relative aspect-video rounded-xl overflow-hidden border border-slate-800/80 shadow-lg'>
                    {isImageBg ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={currentBackground.imageUrl}
                        alt='Current background'
                        className='w-full h-full object-cover'
                        style={{
                          opacity: currentBackground.opacity / 100,
                          filter: `blur(${currentBackground.blur}px)`,
                        }}
                      />
                    ) : (
                      <div
                        className='w-full h-full'
                        style={{
                          background: currentBackground.imageUrl,
                          opacity: currentBackground.opacity / 100,
                          filter: `blur(${currentBackground.blur}px)`,
                        }}
                      />
                    )}
                    {/* Pattern overlay on preview */}
                    {currentBackground.pattern &&
                      (() => {
                        const patternDef = SHAPE_PATTERNS.find(
                          (p) => p.id === currentBackground.pattern,
                        );
                        if (!patternDef) return null;
                        const hex = currentBackground.patternColor;
                        const alpha = currentBackground.patternOpacity / 100;
                        const r = parseInt(hex.slice(1, 3), 16);
                        const g = parseInt(hex.slice(3, 5), 16);
                        const b = parseInt(hex.slice(5, 7), 16);
                        const rgba = `rgba(${r},${g},${b},${alpha})`;
                        return (
                          <div
                            className='absolute inset-0'
                            style={{
                              backgroundImage: patternDef.css(rgba, alpha),
                              backgroundSize: getPatternSize(patternDef.id),
                              backgroundPosition: getPatternBackgroundPosition(
                                patternDef.id,
                              ),
                            }}
                          />
                        );
                      })()}
                    <div className='absolute inset-0 bg-linear-to-t from-black/40 to-transparent' />
                    <span className='absolute bottom-2 left-2 text-[10px] font-medium text-white/70'>
                      Current Background
                    </span>
                  </div>
                </div>
              )}

              <OptionCard
                icon={ImageIcon}
                title='Choose Image'
                description='Photos, gradients & solid colors'
                accentColor='violet'
                onClick={() => setImageDialogOpen(true)}
              />

              <OptionCard
                icon={Grid3X3}
                title='Patterns'
                description='Add shape overlays like dots, grids & lines'
                accentColor='amber'
                onClick={() => setPatternDialogOpen(true)}
              />

              <OptionCard
                icon={Droplets}
                title='Shadows & Blur'
                description='Adjust opacity, blur effects & shadows'
                accentColor='blue'
                onClick={() => setEffectsDialogOpen(true)}
              />

              {/* Quick reset */}
              {(currentBackground.imageUrl || currentBackground.pattern) && (
                <Button
                  variant='outline'
                  size='sm'
                  onClick={handleReset}
                  className='w-full mt-2 text-xs bg-slate-900/30 border-slate-800 text-slate-500 hover:bg-red-900/20 hover:text-red-400 hover:border-red-800/50 transition-all rounded-xl gap-2'>
                  <RotateCcw className='h-3 w-3' />
                  Reset Background
                </Button>
              )}
            </div>
          )}
        </SidebarContent>
      </Sidebar>

      {/* ─── Image & Gradient Shades Dialog ─── */}
      <Dialog
        open={imageDialogOpen}
        onOpenChange={setImageDialogOpen}>
        <DialogContent className='sm:max-w-xl max-h-[85vh] overflow-y-auto bg-slate-950 border-slate-800'>
          <DialogHeader>
            <DialogTitle className='flex items-center gap-2 text-white'>
              <div className='w-7 h-7 rounded-lg bg-violet-500/10 flex items-center justify-center'>
                <ImageIcon className='h-4 w-4 text-violet-400' />
              </div>
              Choose Background
            </DialogTitle>
            <DialogDescription className='text-slate-500'>
              Pick a photo, gradient shade, or upload your own image.
            </DialogDescription>
          </DialogHeader>

          <Tabs
            defaultValue='photos'
            className='w-full'>
            <TabsList className='w-full'>
              <TabsTrigger
                value='photos'
                className='text-xs gap-1.5 flex-1'>
                <ImageIcon className='h-3.5 w-3.5' />
                Photos
              </TabsTrigger>
              <TabsTrigger
                value='gradients'
                className='text-xs gap-1.5 flex-1'>
                <Palette className='h-3.5 w-3.5' />
                Gradient Shades
              </TabsTrigger>
            </TabsList>

            <TabsContent
              value='photos'
              className='pt-4'>
              {/* Upload own image */}
              <div className='mb-3'>
                <label className='flex items-center gap-3 p-3 rounded-xl border border-dashed border-slate-700 hover:border-violet-500/40 bg-slate-900/30 hover:bg-violet-500/5 cursor-pointer transition-all group'>
                  <div className='w-9 h-9 rounded-lg bg-slate-800 group-hover:bg-violet-500/10 flex items-center justify-center transition-colors'>
                    <Upload className='h-4 w-4 text-slate-400 group-hover:text-violet-400 transition-colors' />
                  </div>
                  <div>
                    <span className='text-xs font-medium text-slate-300 group-hover:text-white transition-colors'>
                      Upload from device
                    </span>
                    <p className='text-[10px] text-slate-600'>JPG, PNG, WEBP</p>
                  </div>
                  <input
                    type='file'
                    accept='image/*'
                    onChange={handleImageUpload}
                    className='hidden'
                  />
                </label>
              </div>

              <UnsplashPicker
                currentUrl={currentBackground.imageUrl ?? ""}
                onSelect={handleImageSelect}
              />
            </TabsContent>

            <TabsContent
              value='gradients'
              className='pt-4'>
              <GradientShadesPicker
                currentBg={currentBackground.imageUrl ?? ""}
                onSelect={handleGradientSelect}
              />
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* ─── Pattern Overlay Dialog ─── */}
      <Dialog
        open={patternDialogOpen}
        onOpenChange={setPatternDialogOpen}>
        <DialogContent className='sm:max-w-md max-h-[85vh] overflow-y-auto bg-slate-950 border-slate-800'>
          <DialogHeader>
            <DialogTitle className='flex items-center gap-2 text-white'>
              <div className='w-7 h-7 rounded-lg bg-amber-500/10 flex items-center justify-center'>
                <Grid3X3 className='h-4 w-4 text-amber-400' />
              </div>
              Patterns
            </DialogTitle>
            <DialogDescription className='text-slate-500'>
              Add shape overlays on top of your background. These patterns layer
              over images and solid colors.
            </DialogDescription>
          </DialogHeader>

          <PatternOverlayPicker
            selectedPattern={currentBackground.pattern}
            patternColor={currentBackground.patternColor}
            patternOpacity={currentBackground.patternOpacity}
            onSelectPattern={(id) => handleUpdate({ pattern: id })}
            onUpdateColor={(color) => handleUpdate({ patternColor: color })}
            onUpdateOpacity={(opacity) =>
              handleUpdate({ patternOpacity: opacity })
            }
          />
        </DialogContent>
      </Dialog>

      {/* ─── Effects Dialog ─── */}
      <Dialog
        open={effectsDialogOpen}
        onOpenChange={setEffectsDialogOpen}>
        <DialogContent className='sm:max-w-md bg-slate-950 border-slate-800'>
          <DialogHeader>
            <DialogTitle className='flex items-center gap-2 text-white'>
              <div className='w-7 h-7 rounded-lg bg-blue-500/10 flex items-center justify-center'>
                <Droplets className='h-4 w-4 text-blue-400' />
              </div>
              Shadows & Blur
            </DialogTitle>
            <DialogDescription className='text-slate-500'>
              Fine-tune opacity, blur effects, and shadow settings.
            </DialogDescription>
          </DialogHeader>

          <ShadowsBlurPanel
            background={currentBackground}
            onUpdate={handleUpdate}
            onReset={handleReset}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
