import React from "react";
import UserDropdown from "./user-dropdown";
import CenterActionBar from "./center-action-bar";
import RightActionBar from "./right-action-bar";
import ChangeDashboardDropdown from "./change-dashboard-dropdown";

const AdminHeader = () => {
  return (
    <header className='px-6 flex items-center h-14 bg-white justify-between'>
      {/* <div className='w-1/3'></div> */}
      <div className='w-2/5 flex items-center gap-4 justify-start'>
        <UserDropdown />
        <ChangeDashboardDropdown />
      </div>
      <div className='w-1/5 flex justify-center'>
        <CenterActionBar />
      </div>
      <div className='w-2/5 flex justify-end'>
        <RightActionBar />
      </div>
    </header>
  );
};

export default AdminHeader;
