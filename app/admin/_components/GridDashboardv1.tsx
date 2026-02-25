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

type WidgetBackground = {
  imageUrl: string;
  opacity: number;
  blur: number;
};

type Widget = {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  background: WidgetBackground;
};

const defaultBackground: WidgetBackground = {
  imageUrl: "",
  opacity: 100,
  blur: 0,
};

const initialWidgets: Widget[] = [
  { id: "a", x: 0, y: 0, w: 4, h: 2, background: { ...defaultBackground } },
  { id: "b", x: 4, y: 0, w: 4, h: 3, background: { ...defaultBackground } },
  { id: "c", x: 8, y: 0, w: 4, h: 3, background: { ...defaultBackground } },
  { id: "d", x: 11, y: 0, w: 4, h: 3, background: { ...defaultBackground } },
  { id: "4", x: 14, y: 0, w: 4, h: 3, background: { ...defaultBackground } },
];

const GridDashboard: React.FC = () => {
  const gridRef = useRef<HTMLDivElement | null>(null);
  const gridInstance = useRef<GridStack | null>(null);

  const [widgets, setWidgets] = useState<Widget[]>(initialWidgets);

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
      gridRef.current,
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
        }),
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

    // Add to React state
    setWidgets((w) => [...w, newWidget]);

    // Add to GridStack instance to make it draggable
    // We need to wait for React to render the new element first
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

  // Update widget background
  const updateWidgetBackground = (
    id: string,
    updates: Partial<WidgetBackground>,
  ) => {
    setWidgets((prev) =>
      prev.map((w) =>
        w.id === id ? { ...w, background: { ...w.background, ...updates } } : w,
      ),
    );
  };

  // Handle image upload
  const handleImageUpload = (id: string, e: ChangeEvent<HTMLInputElement>) => {
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

  // Remove background image
  const removeBackgroundImage = (id: string) => {
    updateWidgetBackground(id, { imageUrl: "" });
  };

  return (
    <div>
      <button
        onClick={addWidget}
        className='mb-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'>
        ➕ Add Widget
      </button>

      <div
        className='grid-stack'
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
                background: w.background.imageUrl ? "transparent" : "#1e293b",
              }}>
              {/* Background Image Layer */}
              {w.background.imageUrl && (
                <div
                  className='absolute inset-0 bg-cover bg-center'
                  style={{
                    backgroundImage: `url(${w.background.imageUrl})`,
                    opacity: w.background.opacity / 100,
                    filter: `blur(${w.background.blur}px)`,
                  }}
                />
              )}

              {/* Dark overlay for better text readability */}
              {w.background.imageUrl && (
                <div className='absolute inset-0 bg-black/30' />
              )}

              {/* Widget Content */}
              <div
                className='relative z-10 flex justify-between items-start h-full p-3'
                style={{ color: "white" }}>
                <span className='font-medium'>Widget {w.id}</span>
                <div className='flex gap-1'>
                  {/* Background Settings Popover */}
                  <Popover>
                    <PopoverTrigger asChild>
                      <button
                        className='p-1.5 rounded-md hover:bg-white/20 transition-colors'
                        title='Background Settings'>
                        🎨
                      </button>
                    </PopoverTrigger>
                    <PopoverContent
                      className='w-80 bg-slate-900 border-slate-700'
                      side='left'>
                      <div className='space-y-4'>
                        <h4 className='font-semibold text-white text-sm'>
                          Background Settings
                        </h4>

                        {/* Image Upload */}
                        <div className='space-y-2'>
                          <Label className='text-slate-300 text-xs'>
                            Background Image
                          </Label>
                          <div className='flex gap-2'>
                            <Input
                              type='file'
                              accept='image/*'
                              onChange={(e) => handleImageUpload(w.id, e)}
                              className='text-xs bg-slate-800 border-slate-600 text-white file:bg-slate-700 file:text-white file:border-0 file:rounded file:px-2 file:py-1'
                            />
                            {w.background.imageUrl && (
                              <Button
                                variant='destructive'
                                size='sm'
                                onClick={() => removeBackgroundImage(w.id)}
                                className='text-xs shrink-0'>
                                ✕
                              </Button>
                            )}
                          </div>
                          {w.background.imageUrl && (
                            <div className='w-full h-16 rounded overflow-hidden'>
                              <img
                                src={w.background.imageUrl}
                                alt='Preview'
                                className='w-full h-full object-cover'
                              />
                            </div>
                          )}
                        </div>

                        {/* Opacity Slider */}
                        <div className='space-y-2'>
                          <div className='flex justify-between'>
                            <Label className='text-slate-300 text-xs'>
                              Opacity
                            </Label>
                            <span className='text-slate-400 text-xs'>
                              {w.background.opacity}%
                            </span>
                          </div>
                          <Slider
                            value={[w.background.opacity]}
                            onValueChange={([value]) =>
                              updateWidgetBackground(w.id, { opacity: value })
                            }
                            min={0}
                            max={100}
                            step={1}
                            className='w-full'
                          />
                        </div>

                        {/* Blur Slider */}
                        <div className='space-y-2'>
                          <div className='flex justify-between'>
                            <Label className='text-slate-300 text-xs'>
                              Blur
                            </Label>
                            <span className='text-slate-400 text-xs'>
                              {w.background.blur}px
                            </span>
                          </div>
                          <Slider
                            value={[w.background.blur]}
                            onValueChange={([value]) =>
                              updateWidgetBackground(w.id, { blur: value })
                            }
                            min={0}
                            max={20}
                            step={1}
                            className='w-full'
                          />
                        </div>

                        {/* Reset Button */}
                        <Button
                          variant='outline'
                          size='sm'
                          onClick={() =>
                            updateWidgetBackground(w.id, {
                              ...defaultBackground,
                            })
                          }
                          className='w-full text-xs bg-slate-800 border-slate-600 text-white hover:bg-slate-700'>
                          Reset to Default
                        </Button>
                      </div>
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
