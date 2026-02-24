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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ChevronDown,
  AppWindowIcon,
  BookOpen,
  Bot,
  Frame,
  LifeBuoy,
  Map,
  PieChart,
  Send,
  Settings2,
  SquareTerminal,
} from "lucide-react";
import { PencilIcon } from "@phosphor-icons/react";
import { NavMain } from "./nav-main";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";

const TEMPLATES = [
  {
    name: "Nature & Landscapes",
    items: [
      {
        name: "Misty Forest",
        url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=800&auto=format&fit=crop",
      },
      {
        name: "Alpine Lakes",
        url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800&auto=format&fit=crop",
      },
      {
        name: "Serene Beach",
        url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop",
      },
      {
        name: "Desert Dunes",
        url: "https://images.unsplash.com/photo-1473580044384-7ba9967e16a0?q=80&w=800&auto=format&fit=crop",
      },
    ],
  },
  {
    name: "Abstract & Tech",
    items: [
      {
        name: "Fluid Waves",
        url: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=800&auto=format&fit=crop",
      },
      {
        name: "Digital Mesh",
        url: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=800&auto=format&fit=crop",
      },
      {
        name: "Geometric Gems",
        url: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?q=80&w=800&auto=format&fit=crop",
      },
      {
        name: "Neon Lines",
        url: "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=800&auto=format&fit=crop",
      },
    ],
  },
  {
    name: "Minimalist",
    items: [
      {
        name: "Clean Paper",
        url: "https://images.unsplash.com/photo-1517148815978-75f6acaaf327?q=80&w=800&auto=format&fit=crop",
      },
      {
        name: "Soft Grain",
        url: "https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=800&auto=format&fit=crop",
      },
      {
        name: "Dark Texture",
        url: "https://images.unsplash.com/photo-1519750783826-e2420f4d687f?q=80&w=800&auto=format&fit=crop",
      },
      {
        name: "Morning Light",
        url: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?q=80&w=800&auto=format&fit=crop",
      },
    ],
  },
];

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
          // <BackgroundSettingsPanel
          //   background={background}
          //   onUpdate={(updates) => dispatch(updateBackground(updates))}
          //   onReset={() => dispatch(resetBackground())}
          //   onImageUpload={handleDashboardImageUpload}
          //   onImageRemove={() => dispatch(updateBackground({ imageUrl: "" }))}
          //   panelTitle='Dashboard Appearance'
          // />
          <Tabs
            defaultValue='preview'
            className='w-full'>
            <TabsList className='w-full'>
              <TabsTrigger
                value='preview'
                className='text-xs'>
                <AppWindowIcon />
                Templates
              </TabsTrigger>
              <TabsTrigger
                value='code'
                className='text-xs'>
                <PencilIcon />
                Custom
              </TabsTrigger>
            </TabsList>
            <TabsContent
              value='preview'
              className='space-y-4 pt-4'>
              <div className='flex flex-col gap-3'>
                {TEMPLATES.map((category) => (
                  <Collapsible
                    key={category.name}
                    className='group/collapsible border border-slate-800/60 rounded-xl bg-slate-900/20 backdrop-blur-sm overflow-hidden transition-all duration-300 hover:border-slate-700'>
                    <CollapsibleTrigger asChild>
                      <Button
                        variant='ghost'
                        className='w-full flex items-center justify-between p-4 h-auto hover:bg-white/5 transition-colors focus-visible:ring-0 focus-visible:ring-offset-0'>
                        <span className='text-sm font-semibold text-slate-200 tracking-tight'>
                          {category.name}
                        </span>
                        <ChevronDown className='h-4 w-4 text-slate-500 group-data-[state=open]/collapsible:rotate-180 transition-transform duration-300' />
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className='data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down overflow-hidden'>
                      <div className='grid grid-cols-2 gap-3 p-4 pt-0'>
                        {category.items.map((item) => (
                          <button
                            key={item.name}
                            onClick={() =>
                              dispatch(updateBackground({ imageUrl: item.url }))
                            }
                            className='group relative h-24 rounded-lg overflow-hidden border border-slate-800 hover:border-blue-500/50 transition-all shadow-lg hover:shadow-blue-500/10 active:scale-95'>
                            <img
                              src={item.url}
                              alt={item.name}
                              className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-500'
                              loading='lazy'
                            />
                            <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                              <span className='text-[10px] font-bold text-white uppercase tracking-widest truncate w-full'>
                                {item.name}
                              </span>
                            </div>
                            {background.imageUrl === item.url && (
                              <div className='absolute top-1 right-1 bg-blue-500 rounded-full p-1 shadow-lg ring-2 ring-slate-900'>
                                <div className='w-1.5 h-1.5 bg-white rounded-full' />
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                ))}
              </div>

              <Button
                variant='outline'
                className='w-full mt-2 text-xs bg-slate-900/40 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-white transition-all rounded-xl'
                onClick={() => dispatch(updateBackground({ imageUrl: "" }))}>
                Remove Background
              </Button>
            </TabsContent>
            <TabsContent value='code'>
              <BackgroundSettingsPanel
                background={background}
                onUpdate={(updates) => dispatch(updateBackground(updates))}
                onReset={() => dispatch(resetBackground())}
                onImageUpload={handleDashboardImageUpload}
                onImageRemove={() =>
                  dispatch(updateBackground({ imageUrl: "" }))
                }
                panelTitle='Dashboard Appearance'
              />
            </TabsContent>
          </Tabs>
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
