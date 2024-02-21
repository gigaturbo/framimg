import { createContext, useState, useContext } from "react";

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
  const [imageSettings, setImageSettings] = useState({
    ...DEFAULT_IMG_SETTINGS,
  });
  const value = { imageSettings, setImageSettings };
  return (
    <ImageSettings.Provider value={value}>{children}</ImageSettings.Provider>
  );
}

// Context consumer hook
export function useImageSettings() {
  return useContext(ImageSettings);
}
