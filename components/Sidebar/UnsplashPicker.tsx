"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Search,
  Shuffle,
  X,
  CheckCircle2,
  Loader2,
  ImageIcon,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { UnsplashPhoto } from "./constants";

interface UnsplashPickerProps {
  onSelect: (url: string) => void;
  currentUrl: string;
}

export default function UnsplashPicker({
  onSelect,
  currentUrl,
}: UnsplashPickerProps) {
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
          url += "?random=true";
        } else if (isRandom && type === "illustrations") {
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

  const handleContentTypeChange = (type: "images" | "illustrations") => {
    setContentType(type);
    setPage(1);
    if (inputValue.trim()) {
      const newQuery = buildQuery(inputValue.trim(), type);
      setQuery(newQuery);
      setMode("search");
      fetchPhotos(newQuery, 1, false, true, type);
    } else {
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
      {/* Content type toggle */}
      <div className='flex items-center rounded-lg bg-neutral-900/70 p-0.5 gap-0.5'>
        <button
          onClick={() => handleContentTypeChange("images")}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-md text-xs font-medium transition-all duration-200 ${
            contentType === "images"
              ? "bg-neutral-800 text-white shadow-sm"
              : "text-neutral-500 hover:text-neutral-300"
          }`}>
          <ImageIcon className='h-3.5 w-3.5' />
          Images
        </button>
        <button
          onClick={() => handleContentTypeChange("illustrations")}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-md text-xs font-medium transition-all duration-200 ${
            contentType === "illustrations"
              ? "bg-neutral-800 text-white shadow-sm"
              : "text-neutral-500 hover:text-neutral-300"
          }`}>
          <Sparkles className='h-3.5 w-3.5' />
          Illustrations
        </button>
      </div>

      {/* Search bar */}
      <div className='relative flex items-center gap-2'>
        <div className='relative flex-1'>
          <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-500 pointer-events-none' />
          <input
            type='text'
            value={inputValue}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder={
              contentType === "illustrations"
                ? "Search illustrations…"
                : "Search photos…"
            }
            className='w-full pl-9 pr-8 py-2.5 text-xs bg-neutral-900/70 border border-neutral-800 rounded-lg text-neutral-200 placeholder-neutral-600 outline-none focus:border-neutral-600 focus:bg-neutral-900 transition-all'
          />
          {inputValue && (
            <button
              onClick={clearSearch}
              className='absolute right-2 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300 transition-colors'>
              <X className='h-3.5 w-3.5' />
            </button>
          )}
        </div>
        <button
          onClick={handleShuffle}
          title='Random photos'
          className='shrink-0 p-2.5 rounded-lg bg-neutral-900/70 border border-neutral-800 text-neutral-500 hover:text-white hover:bg-neutral-800 transition-all active:scale-95'>
          <Shuffle className='h-4 w-4' />
        </button>
      </div>

      {/* Mode indicator */}
      <div className='flex items-center gap-2 px-1'>
        <div className='h-px flex-1 bg-neutral-800/60' />
        <span className='text-[10px] font-medium uppercase tracking-wider text-neutral-600'>
          {mode === "random"
            ? contentType === "illustrations"
              ? "Illustrations"
              : "Random Picks"
            : `"${inputValue}"`}
        </span>
        <div className='h-px flex-1 bg-neutral-800/60' />
      </div>

      {/* Photo grid */}
      {loading && photos.length === 0 ? (
        <div className='flex flex-col items-center justify-center py-14 gap-3'>
          <Loader2 className='h-5 w-5 text-neutral-500 animate-spin' />
          <span className='text-xs text-neutral-600'>Loading…</span>
        </div>
      ) : photos.length === 0 ? (
        <div className='flex flex-col items-center justify-center py-14 gap-3'>
          <ImageIcon className='h-7 w-7 text-neutral-700' />
          <span className='text-xs text-neutral-600'>No photos found</span>
        </div>
      ) : (
        <>
          <div className='grid grid-cols-3 gap-1.5'>
            {photos.map((photo) => {
              const isSelected = currentUrl === photo.urls.regular;
              return (
                <button
                  key={photo.id}
                  onClick={() => onSelect(photo.urls.regular)}
                  className='group relative aspect-square rounded-lg overflow-hidden border border-neutral-800/60 hover:border-neutral-600 transition-all duration-200 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20'
                  title={photo.alt_description ?? photo.user.name}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photo.urls.small}
                    alt={photo.alt_description ?? "Unsplash photo"}
                    className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-500'
                    loading='lazy'
                  />
                  <div className='absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end p-1.5'>
                    <span className='text-[9px] font-medium text-white/80 truncate'>
                      {photo.user.name}
                    </span>
                  </div>
                  {isSelected && (
                    <div className='absolute inset-0 bg-white/10 flex items-center justify-center ring-2 ring-inset ring-white/60'>
                      <div className='bg-white rounded-full p-0.5 shadow-lg'>
                        <CheckCircle2 className='h-3.5 w-3.5 text-neutral-900' />
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
              className='w-full text-xs bg-neutral-900/40 border-neutral-800 text-neutral-500 hover:bg-neutral-800 hover:text-white transition-all rounded-lg'>
              {loading ? (
                <Loader2 className='h-3.5 w-3.5 animate-spin mr-1.5' />
              ) : null}
              Load more
            </Button>
          )}

          <p className='text-center text-[9px] text-neutral-600'>
            Photos by{" "}
            <a
              href='https://unsplash.com'
              target='_blank'
              rel='noopener noreferrer'
              className='text-neutral-500 hover:text-neutral-300 underline underline-offset-2 transition-colors'>
              Unsplash
            </a>
          </p>
        </>
      )}

      {currentUrl && (
        <Button
          variant='outline'
          className='w-full text-xs bg-neutral-900/40 border-neutral-800 text-neutral-500 hover:bg-red-950/40 hover:text-red-400 hover:border-red-900/60 transition-all rounded-lg'
          onClick={() => onSelect("")}>
          Remove Background
        </Button>
      )}
    </div>
  );
}
