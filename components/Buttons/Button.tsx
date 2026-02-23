import React from "react";
import { Button as CustomButton } from "@/components/ui/button";

interface Props {
  label?: string;
  variant?: "default" | "outline" | "secondary" | "destructive";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  onClick?: () => void;
}

const Button = ({ label, variant, size, className, onClick }: Props) => {
  const buttonVariants = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    outline:
      "border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white",
    secondary: "bg-gray-600 text-white hover:bg-gray-700",
    destructive: "bg-red-600 text-white hover:bg-red-700",
  };

  const buttonSizes = {
    default: "px-4 py-2",
    sm: "px-2 py-1",
    lg: "px-6 py-3",
    icon: "p-2",
  };

  const variantStyle = buttonVariants[variant || "default"];
  const sizeStyle = buttonSizes[size || "default"];

  return (
    <CustomButton
      //   variant={variant}
      size={size}
      className={`${variantStyle} ${sizeStyle} ${className}`}
      onClick={onClick}>
      {label}
    </CustomButton>
  );
};

export default Button;
