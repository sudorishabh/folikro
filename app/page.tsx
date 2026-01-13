"use client";
import React, { useEffect, useRef, useState } from "react";
import { GridStack, GridStackNode } from "gridstack";
import "gridstack/dist/gridstack.min.css";

type Widget = {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
};

const initialWidgets: Widget[] = [
  { id: "a", x: 0, y: 0, w: 4, h: 2 },
  { id: "b", x: 4, y: 0, w: 4, h: 3 },
  { id: "c", x: 8, y: 0, w: 4, h: 3 },
  { id: "d", x: 11, y: 0, w: 4, h: 3 },
  { id: "4", x: 14, y: 0, w: 4, h: 3 },
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

  return (
    <div>
      <button
        onClick={addWidget}
        style={{ marginBottom: 12 }}>
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
              className='grid-stack-item-content'
              style={{
                background: "#1e293b",
                color: "white",
                borderRadius: 8,
                padding: 12,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}>
              <span>Widget {w.id}</span>
              <button onClick={() => removeWidget(w.id)}>✖</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GridDashboard;
