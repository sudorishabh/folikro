import React, { ChangeEvent } from "react";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { BackgroundSettings } from "@/redux/dashboardSlice";

interface BackgroundSettingsPanelProps {
  background: BackgroundSettings;
  onUpdate: (updates: Partial<BackgroundSettings>) => void;
  onReset: () => void;
  onImageUpload: (e: ChangeEvent<HTMLInputElement>) => void;
  onImageRemove: () => void;
  panelTitle: string;
  widgetTitle?: string;
  onTitleChange?: (title: string) => void;
}

export const BackgroundSettingsPanel: React.FC<
  BackgroundSettingsPanelProps
> = ({
  background,
  onUpdate,
  onReset,
  onImageUpload,
  onImageRemove,
  panelTitle,
  widgetTitle,
  onTitleChange,
}) => (
  <div className='space-y-4'>
    <h4 className='font-semibold text-white text-sm'>{panelTitle}</h4>

    {/* Widget Title Input (only for widgets) */}
    {onTitleChange !== undefined && (
      <div className='space-y-2'>
        <Label className='text-slate-300 text-xs'>Widget Title</Label>
        <Input
          type='text'
          placeholder='Enter widget title...'
          value={widgetTitle || ""}
          onChange={(e) => onTitleChange(e.target.value)}
          className='text-sm bg-slate-800 border-slate-600 text-white placeholder:text-slate-500'
        />
      </div>
    )}

    {/* Image Upload */}
    <div className='space-y-2'>
      <Label className='text-slate-300 text-xs'>Background Image</Label>
      <div className='flex gap-2'>
        <Input
          type='file'
          accept='image/*'
          onChange={onImageUpload}
          className='text-xs bg-slate-800 border-slate-600 text-white file:bg-slate-700 file:text-white file:border-0 file:rounded file:px-2 file:py-1'
        />
        {background.imageUrl && (
          <Button
            variant='destructive'
            size='sm'
            onClick={onImageRemove}
            className='h-8 w-8 p-0 text-xs shrink-0'>
            ✕
          </Button>
        )}
      </div>
      {background.imageUrl && (
        <div className='w-full h-16 rounded overflow-hidden'>
          <img
            src={background.imageUrl}
            alt='Preview'
            className='w-full h-full object-cover'
          />
        </div>
      )}
    </div>

    {/* Opacity Slider */}
    <div className='space-y-2'>
      <div className='flex justify-between'>
        <Label className='text-slate-300 text-xs'>Opacity</Label>
        <span className='text-slate-400 text-xs'>{background.opacity}%</span>
      </div>
      <Slider
        value={[background.opacity]}
        onValueChange={([value]) => onUpdate({ opacity: value })}
        min={0}
        max={100}
        step={1}
        className='w-full'
      />
    </div>

    {/* Blur Slider */}
    <div className='space-y-2'>
      <div className='flex justify-between'>
        <Label className='text-slate-300 text-xs'>Blur</Label>
        <span className='text-slate-400 text-xs'>{background.blur}px</span>
      </div>
      <Slider
        value={[background.blur]}
        onValueChange={([value]) => onUpdate({ blur: value })}
        min={0}
        max={20}
        step={1}
        className='w-full'
      />
    </div>

    {/* Border Width Slider */}
    <div className='space-y-2'>
      <div className='flex justify-between'>
        <Label className='text-slate-300 text-xs'>Border Width</Label>
        <span className='text-slate-400 text-xs'>
          {background.borderWidth}px
        </span>
      </div>
      <Slider
        value={[background.borderWidth]}
        onValueChange={([value]) => onUpdate({ borderWidth: value })}
        min={0}
        max={10}
        step={1}
        className='w-full'
      />
    </div>

    {/* Border Color */}
    <div className='space-y-2'>
      <Label className='text-slate-300 text-xs'>Border Color</Label>
      <div className='flex gap-2 items-center'>
        <input
          type='color'
          value={background.borderColor}
          onChange={(e) => onUpdate({ borderColor: e.target.value })}
          className='w-10 h-8 rounded cursor-pointer border-0 p-0 overflow-hidden'
        />
        <Input
          value={background.borderColor}
          onChange={(e) => onUpdate({ borderColor: e.target.value })}
          className='flex-1 bg-slate-800 border-slate-600 text-white text-xs'
        />
      </div>
    </div>

    {/* Border Radius Slider */}
    <div className='space-y-2'>
      <div className='flex justify-between'>
        <Label className='text-slate-300 text-xs'>Rounded Corners</Label>
        <span className='text-slate-400 text-xs'>
          {background.borderRadius}px
        </span>
      </div>
      <Slider
        value={[background.borderRadius]}
        onValueChange={([value]) => onUpdate({ borderRadius: value })}
        min={0}
        max={100}
        step={1}
        className='w-full'
      />
    </div>
    {/* Reset Button */}
    <Button
      variant='outline'
      size='sm'
      onClick={onReset}
      className='w-full text-xs bg-slate-800 border-slate-600 text-white hover:bg-slate-700'>
      Reset to Default
    </Button>
  </div>
);
