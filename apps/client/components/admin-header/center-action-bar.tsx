import React from "react";
import { CirclePlus, Smartphone, WandSparkles } from "lucide-react";
import Btn from "../button/btn";
import { GrayIconStyle } from "../shared/style";

const CenterActionBar = () => {
  return (
    <div className='flex items-center gap-2'>
      <Btn
        variant='ghost'
        className='p-0!'
        aria-label='Search'>
        <Smartphone className={GrayIconStyle} />
      </Btn>
      <Btn
        variant='ghost'
        className='p-0!'
        aria-label='Magic'>
        <WandSparkles className={GrayIconStyle} />
      </Btn>
      <Btn
        variant='ghost'
        className='p-0!'
        aria-label='Add'>
        <CirclePlus className={GrayIconStyle} />
      </Btn>
    </div>
  );
};

export default CenterActionBar;
