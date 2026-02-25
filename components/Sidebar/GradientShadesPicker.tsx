"use client";

import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GRADIENT_PRESETS } from "./constants";

interface GradientShadesPickerProps {
  onSelect: (style: string) => void;
  currentBg: string;
}

export default function GradientShadesPicker({
  onSelect,
  currentBg,
}: GradientShadesPickerProps) {
  const gradients = GRADIENT_PRESETS.filter((p) => p.category === "gradient");
  const solids = GRADIENT_PRESETS.filter((p) => p.category === "solid");

  return (
    <div className='flex flex-col gap-5'>
      {/* Gradients */}
      <div>
        <h4 className='text-[11px] font-medium text-neutral-500 uppercase tracking-wider mb-3'>
          Gradients
        </h4>
        <div className='grid grid-cols-3 gap-1.5'>
          {gradients.map((preset) => {
            const isSelected = currentBg === preset.style;
            return (
              <button
                key={preset.id}
                onClick={() => onSelect(preset.style)}
                className='group relative aspect-square rounded-lg overflow-hidden border border-neutral-800/60 hover:border-neutral-600 transition-all duration-200 active:scale-[0.97]'
                title={preset.name}>
                <div
                  className='w-full h-full'
                  style={{ background: preset.style }}
                />
                <div className='absolute inset-x-0 bottom-0 bg-linear-to-t from-black/50 to-transparent p-1.5'>
                  <span className='text-[10px] font-medium text-white/90'>
                    {preset.name}
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
      </div>

      {/* Solid Colors */}
      <div>
        <h4 className='text-[11px] font-medium text-neutral-500 uppercase tracking-wider mb-3'>
          Solid Colors
        </h4>
        <div className='grid grid-cols-3 gap-1.5'>
          {solids.map((preset) => {
            const isSelected = currentBg === preset.style;
            return (
              <button
                key={preset.id}
                onClick={() => onSelect(preset.style)}
                className='group relative aspect-square rounded-lg overflow-hidden border border-neutral-800/60 hover:border-neutral-600 transition-all duration-200 active:scale-[0.97]'
                title={preset.name}>
                <div
                  className='w-full h-full'
                  style={{ background: preset.style }}
                />
                <div className='absolute inset-x-0 bottom-0 bg-linear-to-t from-black/50 to-transparent p-1.5'>
                  <span className='text-[10px] font-medium text-white/90'>
                    {preset.name}
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
      </div>

      {/* Custom color picker */}
      <div>
        <h4 className='text-[11px] font-medium text-neutral-500 uppercase tracking-wider mb-3'>
          Custom Color
        </h4>
        <div className='flex items-center gap-3'>
          <input
            type='color'
            value={
              currentBg.startsWith("#") && currentBg.length <= 7
                ? currentBg
                : "#6366f1"
            }
            onChange={(e) => onSelect(e.target.value)}
            className='w-9 h-9 rounded-lg border border-neutral-700 cursor-pointer bg-transparent [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:rounded-md [&::-webkit-color-swatch]:border-none'
          />
          <span className='text-xs text-neutral-500'>Pick any color</span>
        </div>
      </div>

      {currentBg && (
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
