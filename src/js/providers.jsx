import { createContext, useState, useContext, useReducer } from "react";

// ------------------------------------------------------------------------------------------------

const DEFAULT_APP_SETTINGS = {
  export: { quality: 97, type: "image/png" },
  render: { roundPixels: true, antialias: false, autoDensity: true },
  image: {
    // Move to imageSettings
    borderColor: 0xffffff,
    backgroundColor: 0xffffff,
    backgroundAlpha: 1,
  },
  ui: { backgroundColor: "#777777" },
};

// Context with default settings
const AppSettings = createContext({ ...DEFAULT_APP_SETTINGS });

// Context Provider, TODO load from localStorage
export function AppSettingsProvider({ children }) {
  const [appSettings, setAppSettings] = useState({ ...DEFAULT_APP_SETTINGS });
  const value = { appSettings, setAppSettings };
  return <AppSettings.Provider value={value}>{children}</AppSettings.Provider>;
}

// Context consumer hook
export function useAppSettings() {
  return useContext(AppSettings);
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
  }

  return nState;
}
