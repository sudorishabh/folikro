import React from "react";
import AdminWrapper from "./_components/SidebarProvider";
import SidebarProvider from "./_components/SidebarProvider";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SidebarProvider>{children}</SidebarProvider>;
}
