import { createContext, useState, useContext } from "react";

const DEFAULT_SETTINGS = {
  export: { quality: 97, type: "image/png" },
  render: { roundPixels: true, antialias: false, autoDensity: true },
  image: {
    borderColor: 0xffffff,
    backgroundColor: 0xffffff,
  },
  ui: { backgroundColor: "#777777" },
};

// Context with default settings
const AppSettings = createContext({ ...DEFAULT_SETTINGS });

// Context Provider, TODO load from localStorage
export function AppSettingsProvider({ children }) {
  const [appSettings, setAppSettings] = useState({ ...DEFAULT_SETTINGS });
  const value = { appSettings, setAppSettings };
  return <AppSettings.Provider value={value}>{children}</AppSettings.Provider>;
}

// Context consumer hook
export function useAppSettings() {
  return useContext(AppSettings);
}
