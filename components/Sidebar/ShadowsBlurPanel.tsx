"use client";

import { Sun, Droplets, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { BackgroundSettings } from "@/redux/dashboardSlice";

interface ShadowsBlurPanelProps {
  background: BackgroundSettings;
  onUpdate: (updates: Partial<BackgroundSettings>) => void;
  onReset: () => void;
}

export default function ShadowsBlurPanel({
  background,
  onUpdate,
  onReset,
}: ShadowsBlurPanelProps) {
  const isImageBg =
    background.imageUrl.startsWith("http") ||
    background.imageUrl.startsWith("data:");

  return (
    <div className='flex flex-col gap-5'>
      {/* Opacity */}
      <div className='space-y-2.5'>
        <div className='flex justify-between items-center'>
          <Label className='text-neutral-400 text-xs font-medium flex items-center gap-2'>
            <Sun className='h-3.5 w-3.5 text-amber-500/70' />
            Opacity
          </Label>
          <span className='text-[11px] font-mono text-neutral-500 bg-neutral-800 px-2 py-0.5 rounded'>
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
        <p className='text-[10px] text-neutral-600'>
          Controls the transparency of the background
        </p>
      </div>

      {/* Blur */}
      <div className='space-y-2.5'>
        <div className='flex justify-between items-center'>
          <Label className='text-neutral-400 text-xs font-medium flex items-center gap-2'>
            <Droplets className='h-3.5 w-3.5 text-blue-500/70' />
            Blur
          </Label>
          <span className='text-[11px] font-mono text-neutral-500 bg-neutral-800 px-2 py-0.5 rounded'>
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
        <p className='text-[10px] text-neutral-600'>
          Apply a gaussian blur to the background
        </p>
      </div>

      {/* Preview */}
      {background.imageUrl && (
        <div className='space-y-2'>
          <Label className='text-neutral-400 text-xs font-medium'>
            Preview
          </Label>
          <div className='relative aspect-video rounded-lg overflow-hidden border border-neutral-800'>
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
        className='w-full text-xs bg-neutral-900/40 border-neutral-800 text-neutral-500 hover:bg-neutral-800 hover:text-white transition-all rounded-lg gap-2'>
        <RotateCcw className='h-3 w-3' />
        Reset to Default
      </Button>
    </div>
  );
}
