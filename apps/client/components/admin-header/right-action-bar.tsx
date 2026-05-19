import React from "react";
import { Button } from "@/components/ui/button";
import {
  PieChart,
  Play,
  Redo,
  Save,
  Settings,
  Share2,
  Undo,
} from "lucide-react";
import Btn from "../button/btn";
import { GrayIconStyle } from "../shared/style";
import { cn } from "@/lib/utils";

const RightActionBar = () => {
  return (
    <div className='flex items-center justify-end gap-4'>
      <div className='flex items-center gap-2'>
        <Btn
          variant='ghost'
          className='p-0!'
          aria-label='Undo'>
          <Undo className={GrayIconStyle} />
        </Btn>
        <Btn
          variant='ghost'
          className='p-0!'
          aria-label='Redo'>
          <Redo className={GrayIconStyle} />
        </Btn>

        <span className='h-8 w-px bg-gray-400 mx-2'></span>

        <Btn
          variant='ghost'
          className='p-0!'
          aria-label='Settings'>
          <Settings className={GrayIconStyle} />
        </Btn>
        <Btn
          variant='ghost'
          className='p-0!'
          aria-label='Play'>
          <Play className={GrayIconStyle} />
        </Btn>
        <Btn
          variant='ghost'
          className='p-0!'
          aria-label='Share'>
          <Share2 className={GrayIconStyle} />
        </Btn>
        <Btn
          variant='ghost'
          className='p-0!'
          aria-label='Pie Chart'>
          <PieChart
            //   strokeWidth={1.5}
            className={GrayIconStyle}
          />
        </Btn>
      </div>

      <Btn
        variant='default'
        hoverLabel='Publish'>
        {/* <Save className={cn(GrayIconStyle, "size-4 text-white stroke-2")} /> */}
        Publish
      </Btn>
    </div>
  );
};

export default RightActionBar;
