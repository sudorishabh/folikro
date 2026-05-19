import React from "react";
import UserDropdown from "./user-dropdown";

const AdminHeader = () => {
  return (
    <header className='px-6 flex items-center h-16 bg-white justify-between'>
      <UserDropdown />
    </header>
  );
};

export default AdminHeader;
