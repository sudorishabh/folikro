import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type BackgroundSettings = {
  imageUrl: string;
  opacity: number;
  blur: number;
  borderWidth: number;
  borderColor: string;
  borderRadius: number;
};

export const defaultBackground: BackgroundSettings = {
  imageUrl: "",
  opacity: 100,
  blur: 0,
  borderWidth: 0,
  borderColor: "#3b82f6",
  borderRadius: 8,
};

export type Widget = {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  title: string;
  background: BackgroundSettings;
};

interface DashboardState {
  background: BackgroundSettings;
  widgets: Widget[];
  selectedWidgetId: string | null;
}

const initialWidgets: Widget[] = [
  {
    id: "a",
    x: 0,
    y: 0,
    w: 12,
    h: 12,
    title: "",
    background: { ...defaultBackground },
  },
  {
    id: "b",
    x: 6,
    y: 0,
    w: 12,
    h: 12,
    title: "",
    background: { ...defaultBackground },
  },
  {
    id: "c",
    x: 12,
    y: 0,
    w: 12,
    h: 12,
    title: "",
    background: { ...defaultBackground },
  },
  {
    id: "d",
    x: 24,
    y: 0,
    w: 12,
    h: 12,
    title: "",
    background: { ...defaultBackground },
  },
];

const initialState: DashboardState = {
  background: defaultBackground,
  widgets: initialWidgets,
  selectedWidgetId: null,
};

export const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    updateBackground: (
      state,
      action: PayloadAction<Partial<BackgroundSettings>>,
    ) => {
      state.background = { ...state.background, ...action.payload };
    },
    resetBackground: (state) => {
      state.background = defaultBackground;
    },
    setWidgets: (state, action: PayloadAction<Widget[]>) => {
      state.widgets = action.payload;
    },
    addWidget: (state, action: PayloadAction<Widget>) => {
      state.widgets.push(action.payload);
    },
    removeWidget: (state, action: PayloadAction<string>) => {
      state.widgets = state.widgets.filter((w) => w.id !== action.payload);
      if (state.selectedWidgetId === action.payload) {
        state.selectedWidgetId = null;
      }
    },
    updateWidget: (
      state,
      action: PayloadAction<{ id: string; updates: Partial<Widget> }>,
    ) => {
      const { id, updates } = action.payload;
      const index = state.widgets.findIndex((w) => w.id === id);
      if (index !== -1) {
        state.widgets[index] = { ...state.widgets[index], ...updates };
      }
    },
    updateWidgetBackground: (
      state,
      action: PayloadAction<{
        id: string;
        updates: Partial<BackgroundSettings>;
      }>,
    ) => {
      const { id, updates } = action.payload;
      const index = state.widgets.findIndex((w) => w.id === id);
      if (index !== -1) {
        state.widgets[index].background = {
          ...state.widgets[index].background,
          ...updates,
        };
      }
    },
    selectWidget: (state, action: PayloadAction<string | null>) => {
      state.selectedWidgetId = action.payload;
    },
  },
});

export const {
  updateBackground,
  resetBackground,
  setWidgets,
  addWidget,
  removeWidget,
  updateWidget,
  updateWidgetBackground,
  selectWidget,
} = dashboardSlice.actions;
export default dashboardSlice.reducer;
