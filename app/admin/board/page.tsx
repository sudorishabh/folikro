"use client";
import { Responsive, useContainerWidth } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
// import "react-resizable/css/styles.css"; // Note: Only import this if you have run 'pnpm install react-resizable'

export default function HomePage() {
  const { width, containerRef, mounted } = useContainerWidth();

  // Define layouts for different breakpoints
  const layouts = {
    lg: [
      { i: "1", x: 0, y: 0, w: 3, h: 4 },
      { i: "2", x: 3, y: 0, w: 3, h: 4 },
      { i: "3", x: 6, y: 0, w: 3, h: 4 },
      { i: "4", x: 0, y: 4, w: 6, h: 4 },
      { i: "5", x: 6, y: 4, w: 3, h: 4 },
    ],
    md: [
      { i: "1", x: 0, y: 0, w: 3, h: 4 },
      { i: "2", x: 3, y: 0, w: 3, h: 4 },
      { i: "3", x: 6, y: 0, w: 4, h: 4 },
      { i: "4", x: 0, y: 4, w: 6, h: 4 },
      { i: "5", x: 6, y: 4, w: 4, h: 4 },
    ],
  };

  return (
    <div
      className='p-6'
      ref={containerRef}>
      <h1 className='text-3xl font-bold mb-6 text-gray-800'>
        Grid Board Dashboard
      </h1>
      {mounted && (
        <Responsive
          className='layout'
          layouts={layouts}
          breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
          cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
          rowHeight={30}
          width={width}
          // isDraggable={true}
          // isResizable={true}
        >
          <div
            key='1'
            className='bg-blue-100 rounded-lg border-2 border-blue-400 flex items-center justify-center text-blue-800 font-semibold shadow-sm cursor-move'>
            Widget 1
          </div>
          <div
            key='2'
            className='bg-green-100 rounded-lg border-2 border-green-400 flex items-center justify-center text-green-800 font-semibold shadow-sm cursor-move'>
            Widget 2
          </div>
          <div
            key='3'
            className='bg-purple-100 rounded-lg border-2 border-purple-400 flex items-center justify-center text-purple-800 font-semibold shadow-sm cursor-move'>
            Widget 3
          </div>
          <div
            key='4'
            className='bg-yellow-100 rounded-lg border-2 border-yellow-400 flex items-center justify-center text-yellow-800 font-semibold shadow-sm cursor-move'>
            Widget 4
          </div>
          <div
            key='5'
            className='bg-pink-100 rounded-lg border-2 border-pink-400 flex items-center justify-center text-pink-800 font-semibold shadow-sm cursor-move'>
            Widget 5
          </div>
        </Responsive>
      )}
    </div>
  );
}
