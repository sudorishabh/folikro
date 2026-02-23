"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface Props {
  Icon: React.ElementType;
  label: string;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit" | "reset";
}

const HoverExtendBtn = ({
  Icon,
  label,
  onClick,
  className,
  type = "button",
}: Props) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={cn(
        "group relative flex h-9 items-center justify-center overflow-hidden rounded-full bg-gray-100 text-white transition-all duration-300 ease-out hover:shadow-md hover:shadow-gray-500/20 active:scale-95 cursor-pointer",
        "border border-gray-100 px-2.5 w-fit min-w-9",
        className,
      )}>
      {/* Icon Wrapper */}
      <div className='flex items-center justify-center shrink-0 z-20'>
        <Icon
          size={18}
          className='text-gray-700 transition-transform duration-300 group-hover:rotate-12'
        />
      </div>

      {/* Label Wrapper - reveals on hover using Grid trick for smooth expansion */}
      <div className='grid grid-cols-[0fr] opacity-0 transition-all duration-300 ease-out group-hover:grid-cols-[1fr] group-hover:opacity-100'>
        <div className='overflow-hidden uppercase font-bold text-[10px] tracking-widest whitespace-nowrap text-gray-700'>
          <span className='block ml-2 pr-1'>{label}</span>
        </div>
      </div>

      {/* Premium Glossy Overlay */}
      <div className='absolute inset-0 z-10 pointer-events-none bg-linear-to-b from-white/20 to-transparent'></div>

      {/* Hover Background Highlight */}
      <div className='absolute inset-0 z-0 bg-black/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100'></div>
    </button>
  );
};

export default HoverExtendBtn;
