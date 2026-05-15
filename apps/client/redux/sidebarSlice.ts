import { createSlice } from "@reduxjs/toolkit";
import { PayloadAction } from "@reduxjs/toolkit";

export interface SidebarState {
  activeSidebar: string;
}

const initialState: SidebarState = {
  activeSidebar: "",
};

export const sidebarSlice = createSlice({
  name: "sidebar",
  initialState,
  reducers: {
    setActiveSidebar: (state, action: PayloadAction<string>) => {
      state.activeSidebar = action.payload;
    },
  },
});

export const { setActiveSidebar } = sidebarSlice.actions;
export default sidebarSlice.reducer;
