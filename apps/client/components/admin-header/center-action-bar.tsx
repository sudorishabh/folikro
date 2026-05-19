import React from "react";
import { Button } from "../ui/button";
import { CirclePlus, Smartphone, WandSparkles } from "lucide-react";

const CenterActionBar = () => {
  return (
    <div className='flex items-center'>
      <Button
        variant='ghost'
        size='icon'
        className='size-8 rounded-lg'
        aria-label='Search'>
        <Smartphone className='size-6' />
      </Button>
      <Button
        variant='ghost'
        size='icon'
        className='size-8 rounded-lg'
        aria-label='Magic'>
        <WandSparkles className='size-6' />
      </Button>
      <Button
        variant='ghost'
        size='icon'
        className='size-8 rounded-lg'
        aria-label='Add'>
        <CirclePlus className='size-6' />
      </Button>
    </div>
  );
};

export default CenterActionBar;
