import { createContext, useState, useContext, useReducer } from "react";

// ------------------------------------------------------------------------------------------------

const DEFAULT_APP_SETTINGS = {
  export: { quality: 95, type: "image/jpeg" },
  render: { roundPixels: true, antialias: false, autoDensity: true },
  ui: { backgroundColor: "#6b6b6b" },
};

// Context with default settings
const AppSettings = createContext({ ...DEFAULT_APP_SETTINGS });

// Context Provider, TODO load from localStorage
export function AppSettingsProvider({ children }) {
  const [appSettings, appSettingsDispatch] = useReducer(appSettingsReducer, {
    ...DEFAULT_APP_SETTINGS,
  });
  const value = { appSettings, appSettingsDispatch };
  return <AppSettings.Provider value={value}>{children}</AppSettings.Provider>;
}

// Context consumer hook
export function useAppSettings() {
  return useContext(AppSettings);
}

function appSettingsReducer(state, action) {
  let nState = { ...state };

  switch (action.type) {
    case "export_type_changed":
      nState.export.type = action.newvalue;
      break;
    case "export_quality_changed":
      nState.export.quality = action.newvalue;
      break;
    case "render_roundpixels_toggled":
      nState.render.roundPixels = action.newvalue;
      break;
    case "render_antialias_toggled":
      nState.render.antialias = action.newvalue;
      break;
    case "ui_backgroundcolor_changed":
      nState.ui.backgroundColor = action.newvalue;
      break;
  }

  return nState;
}

// ------------------------------------------------------------------------------------------------

const DEFAULT_IMG_SETTINGS = {
  zoom: 1,
  borderSize: 10,
  ratio: 3 / 2,
  angle: 0,
  ratioMode: "OUTPUT_RATIO",
  orientation: "LANDSCAPE",
  translation: { x: 0, y: 0 },
  borderColor: "#ffffff",
  backgroundColor: 0xffffff,
  backgroundAlpha: 1,
  borderAlpha: 1,
};

const ImageSettings = createContext({ ...DEFAULT_IMG_SETTINGS });

export function ImageSettingsProvider({ children }) {
  const [imageSettings, imageSettingsDispatch] = useReducer(
    imageSettingsReducer,
    { ...DEFAULT_IMG_SETTINGS },
  );

  const value = { imageSettings, imageSettingsDispatch };

  return (
    <ImageSettings.Provider value={value}>{children}</ImageSettings.Provider>
  );
}

export function useImageSettings() {
  return useContext(ImageSettings);
}

function imageSettingsReducer(state, action) {
  let nState = { ...state, translation: { ...state.translation } };

  switch (action.type) {
    case "zoom_changed":
      nState.zoom = action.newvalue;
      break;
    case "border_size_changed":
      nState.borderSize = action.newvalue;
      break;
    case "orientation_changed":
      nState.orientation =
        state.orientation == "LANDSCAPE" ? "PORTRAIT" : "LANDSCAPE";
      nState.ratio = 1.0 / state.ratio;
      break;
    case "image_translated":
      nState.translation.x = action.newvalue.x;
      nState.translation.y = action.newvalue.y;
      break;
    case "ratio_changed":
      nState.ratio = action.newvalue;
      break;
    case "reset_settings":
      nState.zoom = 1;
      nState.translation = { x: 0, y: 0 };
      nState.angle = 0;
      break;
    case "border_color_changed":
      nState.borderColor = action.newvalue;
      break;
  }

  return nState;
}
