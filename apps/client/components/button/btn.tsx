import React from "react";
import { Button as CustomButton } from "@/components/ui/button";

interface Props extends React.ComponentProps<typeof CustomButton> {
  label?: string;
  variant?: "default" | "outline" | "ghost" | "destructive";
  className?: string;
  onClick?: () => void;
}

const Btn = ({ label, variant, size, className, onClick, ...props }: Props) => {
  const buttonVariants = {
    default: "h-8 bg-gray-800 text-white hover:bg-gray-900",
    outline:
      "border border-gray-800 text-gray-800 hover:bg-gray-800 hover:text-white",
    ghost: "h-8 bg-transparent text-gray-800 hover:bg-gray-100",
    destructive: "h-8 bg-red-600 text-white hover:bg-red-700",
  };
  const variantStyle = buttonVariants[variant || "default"];

  return (
    <CustomButton
      size={size}
      className={`cursor-pointer text-xs ${variantStyle} ${className}`}
      onClick={onClick}
      {...props}>
      {label}
    </CustomButton>
  );
};

export default Btn;
