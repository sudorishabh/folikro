"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Props extends React.ComponentProps<typeof Button> {
  children?: React.ReactNode;
  variant?: "default" | "outline" | "ghost" | "destructive";
  className?: string;
  onClick?: () => void;
  hoverLabel?: string;
}

const HOVER_LABEL_DELAY_MS = 800;

const Btn = ({
  children,
  variant,
  size,
  className,
  onClick,
  hoverLabel,
  ...props
}: Props) => {
  const buttonVariants = {
    default: "h-8 bg-gray-800 text-white hover:bg-gray-900",
    outline:
      "border border-gray-800 text-gray-800 hover:bg-gray-800 hover:text-white",
    ghost: "h-8 bg-transparent text-gray-800 hover:bg-gray-100",
    destructive: "h-8 bg-red-600 text-white hover:bg-red-700",
  };
  const variantStyle = buttonVariants[variant || "default"];

  const button = (
    <Button
      aria-label={hoverLabel}
      size={size}
      className={`cursor-pointer rounded-lg text-sm px-6 gap-1.5 transition-all duration-300 ${variantStyle} ${className}`}
      onClick={onClick}
      {...props}>
      {children && children}
    </Button>
  );

  if (!hoverLabel) {
    return button;
  }

  return (
    <Tooltip delayDuration={HOVER_LABEL_DELAY_MS}>
      <TooltipTrigger asChild>{button}</TooltipTrigger>
      <TooltipContent sideOffset={4}>{hoverLabel}</TooltipContent>
    </Tooltip>
  );
};

export default Btn;
