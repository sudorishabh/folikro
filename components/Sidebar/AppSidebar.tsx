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
  Type,
  BoxSelect,
  Eye,
  EyeOff,
} from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
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
  const [textDialogOpen, setTextDialogOpen] = useState(false);
  const [shadowDialogOpen, setShadowDialogOpen] = useState(false);

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
              <OptionRow
                icon={Type}
                label='Text & Style'
                hint='Text, color & transparency'
                onClick={() => setTextDialogOpen(true)}
              />
              <OptionRow
                icon={BoxSelect}
                label='Shadow'
                hint='Drop shadows & elevation'
                onClick={() => setShadowDialogOpen(true)}
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

      {/* ─── Text & Style Dialog ─── */}
      <Dialog
        open={textDialogOpen}
        onOpenChange={setTextDialogOpen}>
        <DialogContent className='sm:max-w-md bg-neutral-950 border-neutral-800'>
          <DialogHeader>
            <DialogTitle className='flex items-center gap-2 text-neutral-100 text-base'>
              <div className='w-6 h-6 rounded-md bg-neutral-800 flex items-center justify-center'>
                <Type className='h-3.5 w-3.5 text-neutral-400' />
              </div>
              Text & Style
            </DialogTitle>
            <DialogDescription className='text-neutral-600 text-xs'>
              Add text, change its color, or make the widget transparent.
            </DialogDescription>
          </DialogHeader>

          <div className='flex flex-col gap-5'>
            {/* Text Content */}
            <div className='space-y-2.5'>
              <Label className='text-neutral-400 text-xs font-medium flex items-center gap-2'>
                <Type className='h-3.5 w-3.5 text-violet-500/70' />
                Text Content
              </Label>
              <textarea
                placeholder='Enter text to display…'
                value={currentBackground.textContent || ""}
                onChange={(e) => handleUpdate({ textContent: e.target.value })}
                rows={3}
                className='w-full px-3 py-2 text-sm bg-neutral-900/60 border border-neutral-800 rounded-lg text-neutral-200 placeholder-neutral-700 outline-none focus:border-neutral-600 transition-colors resize-none'
              />
              <p className='text-[10px] text-neutral-600'>
                Text will be displayed on the widget
              </p>
            </div>

            {/* Text Color */}
            <div className='space-y-2.5'>
              <Label className='text-neutral-400 text-xs font-medium flex items-center gap-2'>
                <Palette className='h-3.5 w-3.5 text-pink-500/70' />
                Text Color
              </Label>
              <div className='flex items-center gap-3'>
                <div className='relative'>
                  <input
                    type='color'
                    value={currentBackground.textColor || "#000000"}
                    onChange={(e) =>
                      handleUpdate({ textColor: e.target.value })
                    }
                    className='w-10 h-10 rounded-lg border border-neutral-700 cursor-pointer bg-transparent'
                  />
                </div>
                <input
                  type='text'
                  value={currentBackground.textColor || "#000000"}
                  onChange={(e) => handleUpdate({ textColor: e.target.value })}
                  className='flex-1 px-3 py-2 text-sm bg-neutral-900/60 border border-neutral-800 rounded-lg text-neutral-200 font-mono outline-none focus:border-neutral-600 transition-colors'
                />
              </div>
              <p className='text-[10px] text-neutral-600'>
                Choose a color for the displayed text
              </p>
            </div>

            {/* Text Size */}
            <div className='space-y-2.5'>
              <div className='flex justify-between items-center'>
                <Label className='text-neutral-400 text-xs font-medium flex items-center gap-2'>
                  <Type className='h-3.5 w-3.5 text-emerald-500/70' />
                  Text Size
                </Label>
                <span className='text-[11px] font-mono text-neutral-500 bg-neutral-800 px-2 py-0.5 rounded'>
                  {currentBackground.textSize || 14}px
                </span>
              </div>
              <Slider
                value={[currentBackground.textSize || 14]}
                onValueChange={([value]) => handleUpdate({ textSize: value })}
                min={8}
                max={72}
                step={1}
                className='w-full'
              />
              <p className='text-[10px] text-neutral-600'>
                Adjust the font size of the displayed text
              </p>
            </div>

            {/* Transparent Toggle */}
            <div className='space-y-2.5'>
              <div className='flex items-center justify-between'>
                <Label className='text-neutral-400 text-xs font-medium flex items-center gap-2'>
                  {currentBackground.transparent ? (
                    <EyeOff className='h-3.5 w-3.5 text-cyan-500/70' />
                  ) : (
                    <Eye className='h-3.5 w-3.5 text-cyan-500/70' />
                  )}
                  Transparent Background
                </Label>
                <Switch
                  checked={currentBackground.transparent || false}
                  onCheckedChange={(checked) =>
                    handleUpdate({ transparent: checked })
                  }
                />
              </div>
              <p className='text-[10px] text-neutral-600'>
                When enabled, the widget background is hidden — only text
                remains visible
              </p>
            </div>

            {/* Live Text Preview */}
            {currentBackground.textContent && (
              <div className='space-y-2.5'>
                <Label className='text-neutral-400 text-xs font-medium'>
                  Preview
                </Label>
                <div className='flex items-center justify-center p-4 bg-neutral-900/30 rounded-lg border border-neutral-800 min-h-15'>
                  <span
                    style={{
                      color: currentBackground.textColor || "#000000",
                      fontSize: `${currentBackground.textSize || 14}px`,
                    }}
                    className='font-medium whitespace-pre-wrap text-center'>
                    {currentBackground.textContent}
                  </span>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* ─── Shadow Dialog ─── */}
      <Dialog
        open={shadowDialogOpen}
        onOpenChange={setShadowDialogOpen}>
        <DialogContent className='sm:max-w-md bg-neutral-950 border-neutral-800'>
          <DialogHeader>
            <DialogTitle className='flex items-center gap-2 text-neutral-100 text-base'>
              <div className='w-6 h-6 rounded-md bg-neutral-800 flex items-center justify-center'>
                <BoxSelect className='h-3.5 w-3.5 text-neutral-400' />
              </div>
              Shadow
            </DialogTitle>
            <DialogDescription className='text-neutral-600 text-xs'>
              Add depth to your widget with shadow effects.
            </DialogDescription>
          </DialogHeader>

          <div className='flex flex-col gap-5'>
            {/* Shadow Presets */}
            <div className='space-y-2.5'>
              <Label className='text-neutral-400 text-xs font-medium'>
                Presets
              </Label>
              <div className='grid grid-cols-3 gap-2'>
                {[
                  { label: "None", value: "" },
                  {
                    label: "Subtle",
                    value:
                      "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.06)",
                  },
                  { label: "Small", value: "0 2px 8px rgba(0,0,0,0.15)" },
                  { label: "Medium", value: "0 4px 16px rgba(0,0,0,0.2)" },
                  { label: "Large", value: "0 8px 30px rgba(0,0,0,0.25)" },
                  { label: "XL", value: "0 12px 40px rgba(0,0,0,0.3)" },
                  { label: "Glow", value: "0 0 20px rgba(59,130,246,0.4)" },
                  { label: "Hard", value: "4px 4px 0px rgba(0,0,0,0.25)" },
                  { label: "Inset", value: "inset 0 2px 8px rgba(0,0,0,0.2)" },
                ].map((preset) => (
                  <button
                    key={preset.label}
                    onClick={() => handleUpdate({ shadow: preset.value })}
                    className={`px-3 py-2.5 rounded-lg text-[11px] font-medium transition-all duration-150 border ${
                      currentBackground.shadow === preset.value
                        ? "bg-neutral-700 border-neutral-500 text-white"
                        : "bg-neutral-900/60 border-neutral-800 text-neutral-400 hover:bg-neutral-800/80 hover:text-neutral-200"
                    }`}>
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Shadow */}
            <div className='space-y-2.5'>
              <Label className='text-neutral-400 text-xs font-medium'>
                Custom Shadow (CSS)
              </Label>
              <input
                type='text'
                placeholder='e.g. 0 4px 12px rgba(0,0,0,0.3)'
                value={currentBackground.shadow || ""}
                onChange={(e) => handleUpdate({ shadow: e.target.value })}
                className='w-full px-3 py-2 text-xs bg-neutral-900/60 border border-neutral-800 rounded-lg text-neutral-200 placeholder-neutral-700 font-mono outline-none focus:border-neutral-600 transition-colors'
              />
              <p className='text-[10px] text-neutral-600'>
                Enter any valid CSS box-shadow value
              </p>
            </div>

            {/* Shadow Preview */}
            <div className='space-y-2.5'>
              <Label className='text-neutral-400 text-xs font-medium'>
                Preview
              </Label>
              <div className='flex items-center justify-center p-6 bg-neutral-900/30 rounded-lg border border-neutral-800'>
                <div
                  className='w-20 h-20 rounded-lg bg-white/90 transition-all duration-300'
                  style={{ boxShadow: currentBackground.shadow || "none" }}
                />
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
