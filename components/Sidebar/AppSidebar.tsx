"use client";
import * as React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import {
  updateBackground,
  resetBackground,
  updateWidgetBackground,
  updateWidget,
  defaultBackground,
} from "@/redux/dashboardSlice";
import { BackgroundSettingsPanel } from "@/components/Settings/BackgroundSettingsPanel";
import { ChangeEvent } from "react";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { activeSidebar } = useSelector((state: RootState) => state.sidebar);
  const { background, widgets, selectedWidgetId } = useSelector(
    (state: RootState) => state.dashboard,
  );
  const dispatch = useDispatch();

  const selectedWidget = widgets.find((w) => w.id === selectedWidgetId);

  const handleDashboardImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageUrl = event.target?.result as string;
        dispatch(updateBackground({ imageUrl }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleWidgetImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (!selectedWidgetId) return;
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageUrl = event.target?.result as string;
        dispatch(
          updateWidgetBackground({
            id: selectedWidgetId,
            updates: { imageUrl },
          }),
        );
      };
      reader.readAsDataURL(file);
    }
  };

  const getTitle = () => {
    if (activeSidebar === "background") return "Dashboard Background";
    if (activeSidebar === "widget-settings") return "Widget Settings";
    return "Settings";
  };

  return (
    <Sidebar
      variant='inset'
      {...props}>
      <SidebarHeader className='p-4 border-b border-sidebar-border'>
        <h2 className='text-lg font-semibold text-sidebar-foreground'>
          {getTitle()}
        </h2>
      </SidebarHeader>
      <SidebarContent className='p-4'>
        {activeSidebar === "background" && (
          <BackgroundSettingsPanel
            background={background}
            onUpdate={(updates) => dispatch(updateBackground(updates))}
            onReset={() => dispatch(resetBackground())}
            onImageUpload={handleDashboardImageUpload}
            onImageRemove={() => dispatch(updateBackground({ imageUrl: "" }))}
            panelTitle='Dashboard Appearance'
          />
        )}
        {activeSidebar === "widget-settings" && selectedWidget && (
          <BackgroundSettingsPanel
            background={selectedWidget.background}
            onUpdate={(updates) =>
              dispatch(
                updateWidgetBackground({ id: selectedWidget.id, updates }),
              )
            }
            onReset={() =>
              dispatch(
                updateWidgetBackground({
                  id: selectedWidget.id,
                  updates: defaultBackground,
                }),
              )
            }
            onImageUpload={handleWidgetImageUpload}
            onImageRemove={() =>
              dispatch(
                updateWidgetBackground({
                  id: selectedWidget.id,
                  updates: { imageUrl: "" },
                }),
              )
            }
            panelTitle='Widget Appearance'
            widgetTitle={selectedWidget.title}
            onTitleChange={(title) =>
              dispatch(
                updateWidget({ id: selectedWidget.id, updates: { title } }),
              )
            }
          />
        )}
      </SidebarContent>
    </Sidebar>
  );
}
