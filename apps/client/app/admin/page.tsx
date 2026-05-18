"use client";
import React from "react";
import GridLayout, {
  Layout,
  noCompactor,
  useContainerWidth,
} from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "./grid-dashboard.css";
import AdminWrapper from "./_components/AdminWrapper";
import { Pen, Plus, Save, Trash } from "lucide-react";
import { DesktopIcon, GlobeIcon } from "@phosphor-icons/react";
import HoverExtendBtn from "@/components/button/HoverExtendBtn";
import { useDispatch, useSelector } from "react-redux";
import { setActiveSidebar } from "@/redux/sidebarSlice";
import {
  defaultBackground,
  Widget,
  setWidgets,
  addWidget as addWidgetAction,
  removeWidget as removeWidgetAction,
  selectWidget,
} from "@/redux/dashboardSlice";
import { RootState } from "@/redux/store";
import { cn } from "@/lib/utils";
import {
  SHAPE_PATTERNS,
  getPatternSize,
  getPatternBackgroundPosition,
} from "@/components/side-bar/constants";

// Helper: detect if the background value is an actual image URL/data URI
const isImageUrl = (val: string) =>
  val.startsWith("http") || val.startsWith("data:") || val.startsWith("blob:");

// Helper: render a pattern overlay given BackgroundSettings
function renderPatternOverlay(bg: {
  pattern: string;
  patternColor: string;
  patternOpacity: number;
}) {
  if (!bg.pattern) return null;
  const patternDef = SHAPE_PATTERNS.find((p) => p.id === bg.pattern);
  if (!patternDef) return null;
  const hex = bg.patternColor;
  const alpha = bg.patternOpacity / 100;
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
}
const COLUMNS = 82;
const MARGIN = 2;

const AdminPage: React.FC = () => {
  const { width, containerRef, mounted } = useContainerWidth();

  const {
    background: dashboardBackground,
    widgets,
    selectedWidgetId,
  } = useSelector((state: RootState) => state.dashboard);
  const { activeSidebar } = useSelector((state: RootState) => state.sidebar);

  const dispatch = useDispatch();

  const rowHeight =
    width > 0 ? (width - MARGIN * (COLUMNS + 1)) / COLUMNS : 0;

  const layout: Layout = widgets.map((w: Widget) => ({
    i: w.id,
    x: w.x,
    y: w.y,
    w: w.w,
    h: w.h,
    minW: 2,
    minH: 2,
  }));

  const handleLayoutChange = (newLayout: Layout) => {
    const updatedWidgets = widgets.map((w: Widget) => {
      const item = newLayout.find((l) => l.i === w.id);
      return item
        ? { ...w, x: item.x, y: item.y, w: item.w, h: item.h }
        : w;
    });
    dispatch(setWidgets(updatedWidgets));
  };

  const addWidget = () => {
    const newWidget: Widget = {
      id: Date.now().toString(),
      x: 0,
      y: 0,
      w: 6,
      h: 6,
      title: "",
      background: { ...defaultBackground },
    };

    dispatch(addWidgetAction(newWidget));
  };

  // Remove widget
  const removeWidget = (id: string | undefined) => {
    if (!id) return;
    dispatch(removeWidgetAction(id));
  };

  return (
    <div
      className='min-h-screen'
      onClick={() => {
        dispatch(setActiveSidebar(""));
        dispatch(selectWidget(null));
      }}>
      <AdminWrapper
        buttons={[
          {
            label: "Preview",
            onClick: () => {},
            variant: "outline",
            Icon: GlobeIcon,
          },
          {
            label: "Publish",
            onClick: () => {},
            variant: "default",
            Icon: Save,
          },
        ]}>
        <div
          onClick={(e) => e.stopPropagation()}
          className='w-fit mb-1.5 mx-auto flex items-center justify-center gap-2 transition-all duration-300'>
          <HoverExtendBtn
            Icon={Plus}
            label='Add Widget'
            onClick={addWidget}
          />
          <HoverExtendBtn
            Icon={DesktopIcon}
            label='Tablet view'
            onClick={addWidget}
          />

          <HoverExtendBtn
            Icon={Pen}
            label='Background'
            onClick={() => {
              dispatch(setActiveSidebar("background"));
            }}
          />
          {activeSidebar !== "background" && (
            <HoverExtendBtn
              Icon={Trash}
              label='Delete'
              className='bg-red-200/80 transition-all duration-300'
              onClick={() => {
                dispatch(setActiveSidebar("background"));
              }}
            />
          )}
        </div>

        <div
          ref={containerRef}
          className={cn(
            "relative border-[3px] border-transparent hover:border-green-600 has-[.react-grid-item:hover]:border-transparent min-h-150 p-4 overflow-hidden transition-all duration-200 ease-in-out",
            activeSidebar === "background" && "border-green-600",
          )}
          onClick={(e) => {
            e.stopPropagation();
            dispatch(setActiveSidebar("background"));
            dispatch(selectWidget(null));
          }}
          style={{
            background: dashboardBackground.imageUrl
              ? "transparent"
              : "#e5e7eb",
          }}>
          {/* Dashboard Background Layer */}
          {dashboardBackground.imageUrl && (
            <div
              className='absolute inset-0 bg-cover bg-center'
              style={{
                ...(isImageUrl(dashboardBackground.imageUrl)
                  ? { backgroundImage: `url(${dashboardBackground.imageUrl})` }
                  : { background: dashboardBackground.imageUrl }),
                opacity: dashboardBackground.opacity / 100,
                filter: `blur(${dashboardBackground.blur}px)`,
              }}
            />
          )}

          {/* Dark overlay for dashboard */}
          {dashboardBackground.imageUrl && (
            <div className='absolute inset-0 bg-black/30' />
          )}

          {/* Pattern overlay for dashboard */}
          {renderPatternOverlay(dashboardBackground)}

          {/* Grid Container */}
          {mounted && width > 0 && (
            <GridLayout
              className='relative z-10'
              layout={layout}
              width={width}
              gridConfig={{
                cols: COLUMNS,
                rowHeight,
                margin: [MARGIN, MARGIN],
              }}
              resizeConfig={{ handles: ["e", "se", "s", "sw", "w"] }}
              compactor={noCompactor}
              onLayoutChange={handleLayoutChange}>
              {widgets.map((w: Widget) => (
                <div
                  key={w.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    dispatch(selectWidget(w.id));
                    dispatch(setActiveSidebar("widget-settings"));
                  }}
                  className={cn(
                    "relative overflow-hidden border-[3px] border-transparent hover:border-gray-400 has-[.react-grid-item:hover]:border-transparent transition-all duration-200 ease-in-out",
                    w.background.transparent
                      ? "bg-transparent"
                      : w.background.imageUrl
                        ? "bg-transparent"
                        : "bg-[#ffffff]",
                    activeSidebar === "widget-settings" &&
                      selectedWidgetId === w.id &&
                      "border-blue-600",
                  )}
                  style={{
                    boxShadow: w.background.shadow || "none",
                  }}>
                  {/* Widget Background Layer - hidden when transparent */}
                  {!w.background.transparent && w.background.imageUrl && (
                    <div
                      className='absolute inset-0 bg-cover bg-center'
                      style={{
                        ...(isImageUrl(w.background.imageUrl)
                          ? {
                              backgroundImage: `url(${w.background.imageUrl})`,
                            }
                          : { background: w.background.imageUrl }),
                        opacity: w.background.opacity / 100,
                        filter: `blur(${w.background.blur}px)`,
                      }}
                    />
                  )}

                  {!w.background.transparent && w.background.imageUrl && (
                    <div className='absolute inset-0 bg-black/30' />
                  )}

                  {/* Pattern overlay for widget - hidden when transparent */}
                  {!w.background.transparent &&
                    renderPatternOverlay(w.background)}

                  {/* Widget Text Content */}
                  {w.background.textContent && (
                    <div className='relative z-10 flex items-center justify-center h-full w-full p-3'>
                      <span
                        className='font-medium whitespace-pre-wrap text-center wrap-break-word'
                        style={{
                          color: w.background.textColor || "#000000",
                          fontSize: `${w.background.textSize || 14}px`,
                        }}>
                        {w.background.textContent}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </GridLayout>
          )}
        </div>
      </AdminWrapper>
    </div>
  );
};

export default AdminPage;
