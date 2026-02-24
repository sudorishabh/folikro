"use client";
import * as React from "react";
import { Sidebar } from "@/components/ui/sidebar";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const {} = useSelector((state: RootState) => state.sidebar);

  return (
    <Sidebar
      variant='inset'
      {...props}></Sidebar>
  );
}
