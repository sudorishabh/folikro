import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type BackgroundSettings = {
  imageUrl: string;
  opacity: number;
  blur: number;
  pattern: string; // CSS pattern overlay id (e.g. "dots", "grid", "diagonal", etc.) or "" for none
  patternOpacity: number; // 0-100
  patternColor: string; // hex color for the pattern
  shadow: string; // CSS box-shadow value (e.g. "0px 4px 12px rgba(0,0,0,0.3)") or "" for none
  textContent: string; // Text to display on the widget
  textColor: string; // hex color for widget text
  textSize: number; // font size in px
  transparent: boolean; // If true, widget background is hidden, only text visible
};

export const defaultBackground: BackgroundSettings = {
  imageUrl: "",
  opacity: 100,
  blur: 0,
  pattern: "",
  patternOpacity: 20,
  patternColor: "#ffffff",
  shadow: "",
  textContent: "",
  textColor: "#000000",
  textSize: 14,
  transparent: false,
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
