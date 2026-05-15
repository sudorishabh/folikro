import React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface IButton {
  label: string;
  onClick: () => void;
  variant?: "default" | "outline" | "secondary" | "destructive";
  Icon: React.ComponentType<{ size?: number }>;
}

interface Props {
  children: React.ReactNode;
  buttons?: IButton[];
}
const AdminWrapper = ({ children, buttons }: Props) => {
  return (
    <div className='p-4'>
      <div className='flex justify-between items-center'>
        <h1 className='text-2xl tracking-tight font-semibold'>
          Portfolio Settings
        </h1>
        <div className='flex gap-3'>
          {buttons?.map((button, index) => (
            <Button
              className='text-xs h-8 px-4!'
              key={index}
              onClick={button.onClick}
              variant={button.variant}>
              <button.Icon />
              {button.label}
            </Button>
          ))}
        </div>

        {/* <Popover>
          <PopoverTrigger asChild>
            <Button
              variant='outline'
              className='bg-slate-800/80 border-slate-600 text-white hover:bg-slate-700'>
              🎨 Dashboard Background
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className='w-80 bg-slate-900 border-slate-700'
            side='bottom'
            align='start'>
            <BackgroundSettingsPanel
              background={dashboardBackground}
              onUpdate={updateDashboardBackground}
              onReset={() => setDashboardBackground({ ...defaultBackground })}
              onImageUpload={handleDashboardImageUpload}
              onImageRemove={() => updateDashboardBackground({ imageUrl: "" })}
              panelTitle='Dashboard Background'
            />
          </PopoverContent>
        </Popover> */}
      </div>
      {children}
    </div>
  );
};

export default AdminWrapper;
