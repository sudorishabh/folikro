"use client";
import React, { useEffect, useRef, useState, ChangeEvent } from "react";
import { GridStack, GridStackNode } from "gridstack";
import "gridstack/dist/gridstack.min.css";
import { Slider } from "@/components/ui/slider";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type BackgroundSettings = {
  imageUrl: string;
  opacity: number;
  blur: number;
  borderWidth: number;
  borderColor: string;
  borderRadius: number;
};

type Widget = {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  background: BackgroundSettings;
};

const defaultBackground: BackgroundSettings = {
  imageUrl: "",
  opacity: 100,
  blur: 0,
  borderWidth: 0,
  borderColor: "#3b82f6",
  borderRadius: 8,
};

const initialWidgets: Widget[] = [
  { id: "a", x: 0, y: 0, w: 4, h: 2, background: { ...defaultBackground } },
  { id: "b", x: 4, y: 0, w: 4, h: 3, background: { ...defaultBackground } },
  { id: "c", x: 8, y: 0, w: 4, h: 3, background: { ...defaultBackground } },
  { id: "d", x: 11, y: 0, w: 4, h: 3, background: { ...defaultBackground } },
  { id: "4", x: 14, y: 0, w: 4, h: 3, background: { ...defaultBackground } },
];

// Reusable Background Settings Panel Component
const BackgroundSettingsPanel: React.FC<{
  background: BackgroundSettings;
  onUpdate: (updates: Partial<BackgroundSettings>) => void;
  onReset: () => void;
  onImageUpload: (e: ChangeEvent<HTMLInputElement>) => void;
  onImageRemove: () => void;
  title: string;
}> = ({
  background,
  onUpdate,
  onReset,
  onImageUpload,
  onImageRemove,
  title,
}) => (
  <div className='space-y-4'>
    <h4 className='font-semibold text-white text-sm'>{title}</h4>

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
            className='text-xs shrink-0'>
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
          className='w-10 h-8 rounded cursor-pointer border-0'
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
        max={50}
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

const GridDashboard: React.FC = () => {
  const gridRef = useRef<HTMLDivElement | null>(null);
  const gridInstance = useRef<GridStack | null>(null);

  const [widgets, setWidgets] = useState<Widget[]>(initialWidgets);
  const [dashboardBackground, setDashboardBackground] =
    useState<BackgroundSettings>(defaultBackground);

  // Initialize GridStack ONCE
  useEffect(() => {
    if (!gridRef.current) return;

    const grid = GridStack.init(
      {
        cellHeight: 80,
        margin: 8,
        float: true,
        columnOpts: { breakpoints: [{ w: 768, c: 1 }] },
      },
      gridRef.current
    );

    gridInstance.current = grid;

    // Sync GridStack → React state
    grid.on("change", (_, items: GridStackNode[]) => {
      setWidgets((prev) =>
        prev.map((w) => {
          const updated = items.find((i) => i.id === w.id);
          return updated
            ? {
                ...w,
                x: updated.x ?? w.x,
                y: updated.y ?? w.y,
                w: updated.w ?? w.w,
                h: updated.h ?? w.h,
              }
            : w;
        })
      );
    });

    return () => {
      grid.destroy(false);
      gridInstance.current = null;
    };
  }, []);

  // Add widget dynamically
  const addWidget = () => {
    if (!gridInstance.current) return;

    const newWidget: Widget = {
      id: Date.now().toString(),
      x: 0,
      y: 0,
      w: 3,
      h: 2,
      background: { ...defaultBackground },
    };

    setWidgets((w) => [...w, newWidget]);

    setTimeout(() => {
      const element = document.querySelector(`[gs-id="${newWidget.id}"]`);
      if (element && gridInstance.current) {
        gridInstance.current.makeWidget(element as HTMLElement);
      }
    }, 0);
  };

  // Remove widget
  const removeWidget = (id: string) => {
    setWidgets((w) => w.filter((widget) => widget.id !== id));
  };

  // Update dashboard background
  const updateDashboardBackground = (updates: Partial<BackgroundSettings>) => {
    setDashboardBackground((prev) => ({ ...prev, ...updates }));
  };

  // Update widget background
  const updateWidgetBackground = (
    id: string,
    updates: Partial<BackgroundSettings>
  ) => {
    setWidgets((prev) =>
      prev.map((w) =>
        w.id === id ? { ...w, background: { ...w.background, ...updates } } : w
      )
    );
  };

  // Handle dashboard image upload
  const handleDashboardImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageUrl = event.target?.result as string;
        updateDashboardBackground({ imageUrl });
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle widget image upload
  const handleWidgetImageUpload = (
    id: string,
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageUrl = event.target?.result as string;
        updateWidgetBackground(id, { imageUrl });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div
      className='relative min-h-[600px] p-4 overflow-hidden'
      style={{
        borderWidth: dashboardBackground.borderWidth,
        borderStyle: dashboardBackground.borderWidth > 0 ? "solid" : "none",
        borderColor: dashboardBackground.borderColor,
        borderRadius: dashboardBackground.borderRadius,
        background: dashboardBackground.imageUrl ? "transparent" : "#0f172a",
      }}>
      {/* Dashboard Background Image Layer */}
      {dashboardBackground.imageUrl && (
        <div
          className='absolute inset-0 bg-cover bg-center'
          style={{
            backgroundImage: `url(${dashboardBackground.imageUrl})`,
            opacity: dashboardBackground.opacity / 100,
            filter: `blur(${dashboardBackground.blur}px)`,
            borderRadius: dashboardBackground.borderRadius,
          }}
        />
      )}

      {/* Dark overlay for dashboard */}
      {dashboardBackground.imageUrl && (
        <div
          className='absolute inset-0 bg-black/30'
          style={{ borderRadius: dashboardBackground.borderRadius }}
        />
      )}

      {/* Controls Bar */}
      <div className='relative z-10 flex gap-2 mb-4'>
        <button
          onClick={addWidget}
          className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'>
          ➕ Add Widget
        </button>

        {/* Dashboard Background Settings */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant='outline'
              className='bg-slate-800/80 border-slate-600 text-white hover:bg-slate-700'>
              🎨 Dashboard Background
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className='w-80 bg-slate-900 border-slate-700'
            side='bottom'
            align='start'>
            <BackgroundSettingsPanel
              background={dashboardBackground}
              onUpdate={updateDashboardBackground}
              onReset={() => setDashboardBackground({ ...defaultBackground })}
              onImageUpload={handleDashboardImageUpload}
              onImageRemove={() => updateDashboardBackground({ imageUrl: "" })}
              title='Dashboard Background'
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Grid Container */}
      <div
        className='grid-stack relative z-10'
        ref={gridRef}>
        {widgets.map((w) => (
          <div
            key={w.id}
            className='grid-stack-item'
            gs-id={w.id}
            gs-x={w.x}
            gs-y={w.y}
            gs-w={w.w}
            gs-h={w.h}>
            <div
              className='grid-stack-item-content relative overflow-hidden'
              style={{
                borderWidth: w.background.borderWidth,
                borderStyle: w.background.borderWidth > 0 ? "solid" : "none",
                borderColor: w.background.borderColor,
                borderRadius: w.background.borderRadius,
                background: w.background.imageUrl ? "transparent" : "#1e293b",
              }}>
              {/* Widget Background Image Layer */}
              {w.background.imageUrl && (
                <div
                  className='absolute inset-0 bg-cover bg-center'
                  style={{
                    backgroundImage: `url(${w.background.imageUrl})`,
                    opacity: w.background.opacity / 100,
                    filter: `blur(${w.background.blur}px)`,
                    borderRadius: w.background.borderRadius,
                  }}
                />
              )}

              {/* Dark overlay for widget */}
              {w.background.imageUrl && (
                <div
                  className='absolute inset-0 bg-black/30'
                  style={{ borderRadius: w.background.borderRadius }}
                />
              )}

              {/* Widget Content */}
              <div
                className='relative z-10 flex justify-between items-start h-full p-3'
                style={{ color: "white" }}>
                <span className='font-medium'>Widget {w.id}</span>
                <div className='flex gap-1'>
                  {/* Widget Background Settings */}
                  <Popover>
                    <PopoverTrigger asChild>
                      <button
                        className='p-1.5 rounded-md hover:bg-white/20 transition-colors'
                        title='Widget Background Settings'>
                        🎨
                      </button>
                    </PopoverTrigger>
                    <PopoverContent
                      className='w-80 bg-slate-900 border-slate-700'
                      side='left'>
                      <BackgroundSettingsPanel
                        background={w.background}
                        onUpdate={(updates) =>
                          updateWidgetBackground(w.id, updates)
                        }
                        onReset={() =>
                          updateWidgetBackground(w.id, { ...defaultBackground })
                        }
                        onImageUpload={(e) => handleWidgetImageUpload(w.id, e)}
                        onImageRemove={() =>
                          updateWidgetBackground(w.id, { imageUrl: "" })
                        }
                        title='Widget Background'
                      />
                    </PopoverContent>
                  </Popover>

                  {/* Remove Widget Button */}
                  <button
                    onClick={() => removeWidget(w.id)}
                    className='p-1.5 rounded-md hover:bg-red-500/50 transition-colors'
                    title='Remove Widget'>
                    ✖
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GridDashboard;
