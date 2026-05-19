import React from "react";
import UserDropdown from "./user-dropdown";
import CenterActionBar from "./center-action-bar";
import RightActionBar from "./right-action-bar";

const AdminHeader = () => {
  return (
    <header className='px-6 flex items-center h-16 bg-white justify-between'>
      {/* <div className='w-1/3'></div> */}
      <div className='w-1/3 flex justify-start'>
        <UserDropdown />
      </div>
      <div className='w-1/3 flex justify-center'>
        <CenterActionBar />
      </div>
      <div className='w-1/3 flex justify-end'>
        <RightActionBar />
      </div>
    </header>
  );
};

export default AdminHeader;
