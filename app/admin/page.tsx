"use client";
import React, { useEffect, useRef } from "react";
import { GridStack, GridStackNode } from "gridstack";
import "gridstack/dist/gridstack.min.css";
import "./grid-dashboard.css";
import AdminWrapper from "./_components/AdminWrapper";
import { Pen, Plus, Save, Trash } from "lucide-react";
import { DesktopIcon, GlobeIcon } from "@phosphor-icons/react";
import HoverExtendBtn from "@/components/Buttons/HoverExtendBtn";
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
import { SHAPE_PATTERNS } from "@/components/Sidebar/AppSidebar";

// Helper: detect if the background value is an actual image URL/data URI
const isImageUrl = (val: string) =>
  val.startsWith("http") || val.startsWith("data:") || val.startsWith("blob:");

// Helper: get CSS background-size for a pattern
function getPatternSize(patternId: string): string {
  switch (patternId) {
    case "dots":
      return "20px 20px";
    case "grid":
      return "20px 20px";
    case "diagonal":
      return "14px 14px";
    case "crosshatch":
      return "14px 14px";
    case "horizontal-lines":
      return "100% 15px";
    case "vertical-lines":
      return "15px 100%";
    case "checkerboard":
      return "20px 20px";
    case "zigzag":
      return "20px 20px";
    case "triangles":
      return "30px 30px";
    default:
      return "20px 20px";
  }
}

function getPatternBackgroundPosition(patternId: string): string | undefined {
  if (patternId === "checkerboard") return "0 0, 10px 10px";
  return undefined;
}

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
const AdminPage: React.FC = () => {
  const [mounted, setMounted] = React.useState(false);
  const gridRef = useRef<HTMLDivElement | null>(null);
  const gridInstance = useRef<GridStack | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { background: dashboardBackground, widgets } = useSelector(
    (state: RootState) => state.dashboard,
  );
  const { activeSidebar } = useSelector((state: RootState) => state.sidebar);

  const dispatch = useDispatch();
  const widgetsRef = useRef(widgets);

  useEffect(() => {
    widgetsRef.current = widgets;
  }, [widgets]);

  // Initialize GridStack ONCE
  useEffect(() => {
    if (!gridRef.current || !mounted) return;

    const COLUMNS = 82; // Increase this (e.g., 144) if you need even smaller resize increments
    const MARGIN = 2;

    const grid = GridStack.init(
      {
        column: COLUMNS,
        cellHeight: 20,
        margin: MARGIN,
        float: true,
        resizable: { handles: "e, se, s, sw, w" },
        // FIX 1: Remove `columnOpts` breakpoints so your grid maintains a high
        // 96-column resolution on all screen sizes, ensuring fine-grained resizing.
      },
      gridRef.current,
    );

    gridInstance.current = grid;

    const syncDimensions = () => {
      if (!gridRef.current || !gridInstance.current) return;

      const columns = gridInstance.current.getColumn();
      const containerWidth = gridRef.current.clientWidth;
      const cellHeight = containerWidth / columns;

      // FIX 2: Pass as an exact string with "px" appended.
      // This forces GridStack to respect the floating-point precision
      // instead of rounding it to an integer, smoothing out vertical resizes.
      gridInstance.current.cellHeight(`${cellHeight}px`);

      gridRef.current.style.setProperty("--cell-size", `${cellHeight}px`);
      gridRef.current.style.setProperty("--grid-columns", `${columns}`);
    };

    // Initial sync
    syncDimensions();

    const handleResize = () => syncDimensions();
    window.addEventListener("resize", handleResize);

    // Sync GridStack → React state
    grid.on("change", (_, items: GridStackNode[]) => {
      const updatedWidgets = widgetsRef.current.map((w: Widget) => {
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
      });
      dispatch(setWidgets(updatedWidgets));
    });

    // Add min-constraints to all items
    grid.getGridItems().forEach((el) => {
      grid.update(el, { minW: 2, minH: 2 });
    });

    return () => {
      window.removeEventListener("resize", handleResize);
      grid.destroy(false);
      gridInstance.current = null;
    };
  }, [dispatch, mounted]);

  // Initialize GridStack ONCE
  // useEffect(() => {
  //   if (!gridRef.current) return;

  //   const initialCellHeight = calculateCellHeight();

  //   const grid = GridStack.init(
  //     {
  //       cellHeight: initialCellHeight,
  //       margin: 8,
  //       float: true,
  //       columnOpts: { breakpoints: [{ w: 768, c: 1 }] },
  //     },
  //     gridRef.current,
  //   );

  //   gridInstance.current = grid;

  //   // Update cell height on window resize to maintain 1:1 ratio
  //   const handleResize = () => {
  //     if (gridInstance.current) {
  //       const newCellHeight = calculateCellHeight();
  //       gridInstance.current.cellHeight(newCellHeight);
  //     }
  //   };

  //   window.addEventListener("resize", handleResize);

  //   // Sync GridStack → React state
  //   grid.on("change", (_, items: GridStackNode[]) => {
  //     setWidgets((prev) =>
  //       prev.map((w) => {
  //         const updated = items.find((i) => i.id === w.id);
  //         return updated
  //           ? {
  //               ...w,
  //               x: updated.x ?? w.x,
  //               y: updated.y ?? w.y,
  //               w: updated.w ?? w.w,
  //               h: updated.h ?? w.h,
  //             }
  //           : w;
  //       }),
  //     );
  //   });

  //   return () => {
  //     window.removeEventListener("resize", handleResize);
  //     grid.destroy(false);
  //     gridInstance.current = null;
  //   };
  // }, []);

  // Add widget dynamically
  const addWidget = () => {
    if (!gridInstance.current) return;

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

    setTimeout(() => {
      const element = document.querySelector(`[gs-id="${newWidget.id}"]`);
      if (element && gridInstance.current) {
        gridInstance.current.makeWidget(element as HTMLElement);
      }
    }, 0);
  };

  // Remove widget
  const removeWidget = (id: string | undefined) => {
    if (!id) return;
    dispatch(removeWidgetAction(id));
  };

  return (
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
      <div className='w-fit mb-1.5 mx-auto flex items-center justify-center gap-2 transition-all duration-300'>
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
        className={cn(
          "relative border-[3px] border-transparent hover:border-green-600 has-[.grid-stack-item:hover]:border-transparent min-h-150 p-4 overflow-hidden transition-all duration-200 ease-in-out",
          activeSidebar === "background" && "border-green-600",
        )}
        onClick={() => {
          dispatch(setActiveSidebar("background"));
        }}
        style={{
          background: dashboardBackground.imageUrl ? "transparent" : "#e5e7eb",
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
        <div
          className='grid-stack relative z-10'
          ref={gridRef}>
          {mounted &&
            widgets.map((w: Widget) => (
              <div
                key={w.id}
                onClick={(e) => {
                  e.stopPropagation();
                  dispatch(selectWidget(w.id));
                  dispatch(setActiveSidebar("widget-settings"));
                }}
                className='grid-stack-item'
                gs-id={w.id}
                gs-x={w.x}
                gs-y={w.y}
                gs-w={w.w}
                gs-h={w.h}>
                <div
                  className={cn(
                    "grid-stack-item-content relative overflow-hidden border-[3px] border-transparent hover:border-gray-400 has-[.grid-stack-item:hover]:border-transparent transition-all duration-200 ease-in-out",
                    w.background.imageUrl ? "bg-transparent" : "bg-[#ffffff]",
                    activeSidebar === "widget-settings" && "border-blue-600",
                  )}>
                  {/* Widget Background Layer */}
                  {w.background.imageUrl && (
                    <div
                      className='absolute inset-0 bg-cover bg-center'
                      style={{
                        ...(isImageUrl(w.background.imageUrl)
                          ? { backgroundImage: `url(${w.background.imageUrl})` }
                          : { background: w.background.imageUrl }),
                        opacity: w.background.opacity / 100,
                        filter: `blur(${w.background.blur}px)`,
                      }}
                    />
                  )}

                  {w.background.imageUrl && (
                    <div className='absolute inset-0 bg-black/30' />
                  )}

                  {/* Pattern overlay for widget */}
                  {renderPatternOverlay(w.background)}

                  {/* <d iv
                    className='relative z-10 flex justify-between items-start h-full p-3'
                    style={{ color: "white" }}>
                    {w.title && <span className='font-medium'>{w.title}</span>}
                    <div className='flex gap-1'>
                      <button
                        onClick={() => removeWidget(w.id)}
                        className='p-1.5 hover:bg-red-500/50 transition-colors'
                        title='Remove Widget'>
                        ✖
                      </button>
                    </div>
                  </d> */}
                </div>
              </div>
            ))}
        </div>
      </div>
    </AdminWrapper>
  );
};

export default AdminPage;
