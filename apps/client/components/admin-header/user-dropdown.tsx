import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDownIcon, UserIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Btn from "../button/btn";
import { GrayIconStyle } from "../shared/style";
import { cn } from "@/lib/utils";

const UserDropdown = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Btn
          variant='ghost'
          className='h-10 rounded-lg flex items-center gap-1 focus-visible:ring-0 focus-visible:ring-offset-0 p-0!'
          aria-label='User'>
          <Avatar className='size-9 rounded-lg'>
            <AvatarImage
              src='https://100k-faces.vercel.app/api/random-image'
              alt='User'
            />
            <AvatarFallback>
              <UserIcon className={GrayIconStyle} />
            </AvatarFallback>
          </Avatar>
          <ChevronDownIcon className={cn(GrayIconStyle, "size-5")} />
        </Btn>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem>Billing</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>Team</DropdownMenuItem>
          <DropdownMenuItem>Subscription</DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserDropdown;
