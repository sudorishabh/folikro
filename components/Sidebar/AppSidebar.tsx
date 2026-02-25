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
import { ChangeEvent, useState } from "react";
import {
  ImageIcon,
  Grid3X3,
  Droplets,
  ChevronRight,
  RotateCcw,
  Upload,
  Palette,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

// Sub-components
import UnsplashPicker from "./UnsplashPicker";
import GradientShadesPicker from "./GradientShadesPicker";
import PatternOverlayPicker from "./PatternOverlayPicker";
import ShadowsBlurPanel from "./ShadowsBlurPanel";
import {
  SHAPE_PATTERNS,
  getPatternSize,
  getPatternBackgroundPosition,
} from "./constants";

// Re-export for external consumers (app/admin/page.tsx)
export { SHAPE_PATTERNS } from "./constants";

// ──────────────────────────────────────────────
// Option Row — minimal, clean list-style item
// ──────────────────────────────────────────────
function OptionRow({
  icon: Icon,
  label,
  hint,
  onClick,
}: {
  icon: React.ElementType;
  label: string;
  hint?: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className='group w-full flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-neutral-800/60 transition-colors duration-150 active:scale-[0.99]'>
      <div className='shrink-0 w-8 h-8 rounded-md bg-neutral-800/80 flex items-center justify-center transition-colors duration-150 group-hover:bg-neutral-700/80'>
        <Icon className='h-4 w-4 text-neutral-400 group-hover:text-neutral-200 transition-colors' />
      </div>
      <div className='flex-1 text-left min-w-0'>
        <span className='text-[13px] font-medium text-neutral-300 group-hover:text-white transition-colors'>
          {label}
        </span>
        {hint && (
          <p className='text-[11px] text-neutral-600 leading-tight mt-0.5 truncate'>
            {hint}
          </p>
        )}
      </div>
      <ChevronRight className='h-3.5 w-3.5 text-neutral-700 group-hover:text-neutral-500 transition-colors' />
    </button>
  );
}

// ──────────────────────────────────────────────
// Background Preview thumbnail
// ──────────────────────────────────────────────
function BackgroundPreview({ background }: { background: BackgroundSettings }) {
  const isImageBg =
    background.imageUrl.startsWith("http") ||
    background.imageUrl.startsWith("data:");

  if (!background.imageUrl) return null;

  return (
    <div className='relative aspect-video rounded-lg overflow-hidden border border-neutral-800/60'>
      {isImageBg ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={background.imageUrl}
          alt='Current background'
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
      {/* Pattern overlay */}
      {background.pattern &&
        (() => {
          const patternDef = SHAPE_PATTERNS.find(
            (p) => p.id === background.pattern,
          );
          if (!patternDef) return null;
          const hex = background.patternColor;
          const alpha = background.patternOpacity / 100;
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
                backgroundPosition: getPatternBackgroundPosition(patternDef.id),
              }}
            />
          );
        })()}
      <div className='absolute inset-0 bg-linear-to-t from-black/30 to-transparent' />
      <span className='absolute bottom-1.5 left-2 text-[10px] font-medium text-white/60'>
        Preview
      </span>
    </div>
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

  // Target (dashboard or widget)
  const target =
    activeSidebar === "widget-settings" && selectedWidget
      ? "widget"
      : "dashboard";

  const currentBackground =
    target === "widget" && selectedWidget
      ? selectedWidget.background
      : background;

  // Handlers
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

  const handleImageSelect = (url: string) => handleUpdate({ imageUrl: url });
  const handleGradientSelect = (style: string) =>
    handleUpdate({ imageUrl: style });

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

  const title = activeSidebar === "widget-settings" ? "Widget" : "Background";
  const subtitle =
    activeSidebar === "widget-settings" && selectedWidget
      ? selectedWidget.title || "Untitled"
      : "Customize appearance";

  return (
    <>
      <Sidebar
        variant='inset'
        {...props}>
        {/* ── Header ── */}
        <SidebarHeader className='px-4 py-4 border-b border-neutral-800/40'>
          <div className='flex items-center gap-2.5'>
            <div className='w-7 h-7 rounded-md bg-neutral-800 flex items-center justify-center'>
              <Layers className='h-3.5 w-3.5 text-neutral-400' />
            </div>
            <div className='min-w-0'>
              <h2 className='text-sm font-semibold text-neutral-200 leading-tight'>
                {title}
              </h2>
              <p className='text-[11px] text-neutral-600 truncate'>
                {subtitle}
              </p>
            </div>
          </div>
        </SidebarHeader>

        {/* ── Content ── */}
        <SidebarContent className='px-3 py-3'>
          {(activeSidebar === "background" ||
            activeSidebar === "widget-settings") && (
            <div className='flex flex-col gap-2'>
              {/* Widget title field */}
              {activeSidebar === "widget-settings" && selectedWidget && (
                <div className='px-1 pb-2 mb-1 border-b border-neutral-800/40'>
                  <label className='text-[11px] font-medium text-neutral-500 block mb-1.5'>
                    Title
                  </label>
                  <input
                    type='text'
                    placeholder='Widget title…'
                    value={selectedWidget.title || ""}
                    onChange={(e) =>
                      dispatch(
                        updateWidget({
                          id: selectedWidget.id,
                          updates: { title: e.target.value },
                        }),
                      )
                    }
                    className='w-full px-3 py-2 text-sm bg-neutral-900/60 border border-neutral-800 rounded-lg text-neutral-200 placeholder-neutral-700 outline-none focus:border-neutral-600 transition-colors'
                  />
                </div>
              )}

              {/* Preview */}
              {currentBackground.imageUrl && (
                <div className='px-1 mb-1'>
                  <BackgroundPreview background={currentBackground} />
                </div>
              )}

              {/* Option rows */}
              <OptionRow
                icon={ImageIcon}
                label='Image'
                hint='Photos, gradients & uploads'
                onClick={() => setImageDialogOpen(true)}
              />
              <OptionRow
                icon={Grid3X3}
                label='Patterns'
                hint='Dots, grids, lines & more'
                onClick={() => setPatternDialogOpen(true)}
              />
              <OptionRow
                icon={Droplets}
                label='Effects'
                hint='Opacity & blur'
                onClick={() => setEffectsDialogOpen(true)}
              />

              {/* Reset */}
              {(currentBackground.imageUrl || currentBackground.pattern) && (
                <div className='pt-2 px-1'>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={handleReset}
                    className='w-full text-xs bg-transparent border-neutral-800 text-neutral-600 hover:bg-neutral-800/60 hover:text-neutral-300 transition-all rounded-lg gap-2'>
                    <RotateCcw className='h-3 w-3' />
                    Reset
                  </Button>
                </div>
              )}
            </div>
          )}
        </SidebarContent>
      </Sidebar>

      {/* ─── Image & Gradient Dialog ─── */}
      <Dialog
        open={imageDialogOpen}
        onOpenChange={setImageDialogOpen}>
        <DialogContent className='sm:max-w-xl max-h-[85vh] overflow-y-auto bg-neutral-950 border-neutral-800'>
          <DialogHeader>
            <DialogTitle className='flex items-center gap-2 text-neutral-100 text-base'>
              <div className='w-6 h-6 rounded-md bg-neutral-800 flex items-center justify-center'>
                <ImageIcon className='h-3.5 w-3.5 text-neutral-400' />
              </div>
              Background
            </DialogTitle>
            <DialogDescription className='text-neutral-600 text-xs'>
              Choose a photo, gradient, or upload your own.
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
                Colors
              </TabsTrigger>
            </TabsList>

            <TabsContent
              value='photos'
              className='pt-4'>
              {/* Upload */}
              <div className='mb-3'>
                <label className='flex items-center gap-3 p-3 rounded-lg border border-dashed border-neutral-800 hover:border-neutral-600 bg-neutral-900/30 hover:bg-neutral-800/30 cursor-pointer transition-all group'>
                  <div className='w-8 h-8 rounded-md bg-neutral-800 group-hover:bg-neutral-700 flex items-center justify-center transition-colors'>
                    <Upload className='h-3.5 w-3.5 text-neutral-500 group-hover:text-neutral-300 transition-colors' />
                  </div>
                  <div>
                    <span className='text-xs font-medium text-neutral-400 group-hover:text-neutral-200 transition-colors'>
                      Upload from device
                    </span>
                    <p className='text-[10px] text-neutral-700'>
                      JPG, PNG, WEBP
                    </p>
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
        <DialogContent className='sm:max-w-md max-h-[85vh] overflow-y-auto bg-neutral-950 border-neutral-800'>
          <DialogHeader>
            <DialogTitle className='flex items-center gap-2 text-neutral-100 text-base'>
              <div className='w-6 h-6 rounded-md bg-neutral-800 flex items-center justify-center'>
                <Grid3X3 className='h-3.5 w-3.5 text-neutral-400' />
              </div>
              Patterns
            </DialogTitle>
            <DialogDescription className='text-neutral-600 text-xs'>
              Add shape overlays on top of your background.
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
        <DialogContent className='sm:max-w-md bg-neutral-950 border-neutral-800'>
          <DialogHeader>
            <DialogTitle className='flex items-center gap-2 text-neutral-100 text-base'>
              <div className='w-6 h-6 rounded-md bg-neutral-800 flex items-center justify-center'>
                <Droplets className='h-3.5 w-3.5 text-neutral-400' />
              </div>
              Effects
            </DialogTitle>
            <DialogDescription className='text-neutral-600 text-xs'>
              Fine-tune opacity and blur settings.
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
