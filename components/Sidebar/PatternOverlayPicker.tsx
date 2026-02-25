"use client";

import { X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  SHAPE_PATTERNS,
  getPatternSize,
  getPatternBackgroundPosition,
} from "./constants";

interface PatternOverlayPickerProps {
  selectedPattern: string;
  patternColor: string;
  patternOpacity: number;
  onSelectPattern: (id: string) => void;
  onUpdateColor: (color: string) => void;
  onUpdateOpacity: (opacity: number) => void;
}

export default function PatternOverlayPicker({
  selectedPattern,
  patternColor,
  patternOpacity,
  onSelectPattern,
  onUpdateColor,
  onUpdateOpacity,
}: PatternOverlayPickerProps) {
  return (
    <div className='flex flex-col gap-5'>
      {/* Pattern grid */}
      <div>
        <h4 className='text-[11px] font-medium text-neutral-500 uppercase tracking-wider mb-3'>
          Shape Overlays
        </h4>
        <div className='grid grid-cols-3 gap-1.5'>
          {/* None option */}
          <button
            onClick={() => onSelectPattern("")}
            className={`group relative aspect-square rounded-lg overflow-hidden border transition-all duration-200 active:scale-[0.97] ${
              !selectedPattern
                ? "border-white/30 ring-1 ring-white/10"
                : "border-neutral-800/60 hover:border-neutral-600"
            }`}
            title='None'>
            <div className='w-full h-full bg-neutral-800 flex items-center justify-center'>
              <X className='h-4 w-4 text-neutral-600' />
            </div>
            <div className='absolute inset-x-0 bottom-0 bg-linear-to-t from-black/50 to-transparent p-1.5'>
              <span className='text-[10px] font-medium text-white/80'>
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
                className={`group relative aspect-square rounded-lg overflow-hidden border transition-all duration-200 active:scale-[0.97] ${
                  isSelected
                    ? "border-white/30 ring-1 ring-white/10"
                    : "border-neutral-800/60 hover:border-neutral-600"
                }`}
                title={pattern.name}>
                <div
                  className='w-full h-full bg-neutral-700'
                  style={{
                    backgroundImage: pattern.preview,
                    backgroundSize: getPatternSize(pattern.id),
                    backgroundPosition: getPatternBackgroundPosition(
                      pattern.id,
                    ),
                  }}
                />
                <div className='absolute inset-x-0 bottom-0 bg-linear-to-t from-black/50 to-transparent p-1.5'>
                  <span className='text-[10px] font-medium text-white/80'>
                    {pattern.name}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Controls */}
      {selectedPattern && (
        <div className='space-y-4 pt-1'>
          {/* Pattern Color */}
          <div className='flex justify-between items-center'>
            <Label className='text-neutral-400 text-xs font-medium'>
              Color
            </Label>
            <div className='flex items-center gap-2'>
              <input
                type='color'
                value={patternColor}
                onChange={(e) => onUpdateColor(e.target.value)}
                className='w-7 h-7 rounded-md border border-neutral-700 cursor-pointer bg-transparent [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:rounded-lg [&::-webkit-color-swatch]:border-none'
              />
              <span className='text-[10px] font-mono text-neutral-600'>
                {patternColor}
              </span>
            </div>
          </div>

          {/* Pattern Opacity */}
          <div className='space-y-2'>
            <div className='flex justify-between items-center'>
              <Label className='text-neutral-400 text-xs font-medium'>
                Opacity
              </Label>
              <span className='text-[11px] font-mono text-neutral-500 bg-neutral-800 px-2 py-0.5 rounded'>
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
        </div>
      )}
    </div>
  );
}
