import React from "react";
import { Button } from "@/components/ui/button";
import { PieChart, Play, Redo, Settings, Share2, Undo } from "lucide-react";

const RightActionBar = () => {
  return (
    <div className='flex items-center'>
      <Button
        variant='ghost'
        size='icon'
        className='size-8 rounded-lg'
        aria-label='Undo'>
        <Undo className='size-6' />
      </Button>
      <Button
        variant='ghost'
        size='icon'
        className='size-8 rounded-lg'
        aria-label='Redo'>
        <Redo className='size-6' />
      </Button>

      <span className='h-8 w-px bg-gray-400 mx-2'></span>

      <Button
        variant='ghost'
        size='icon'
        className='size-8 rounded-lg'
        aria-label='Settings'>
        <Settings className='size-6' />
      </Button>
      <Button
        variant='ghost'
        size='icon'
        className='size-8 rounded-lg'
        aria-label='Play'>
        <Play className='size-6' />
      </Button>
      <Button
        variant='ghost'
        size='icon'
        className='size-8 rounded-lg'
        aria-label='Share'>
        <Share2 className='size-6' />
      </Button>
      <Button
        variant='ghost'
        size='icon'
        className='size-8 rounded-lg'
        aria-label='Pie Chart'>
        <PieChart className='size-6' />
      </Button>

      <Button
        variant='default'
        className='text-xs h-8 px-4!'>
        Publish
      </Button>
    </div>
  );
};

export default RightActionBar;
