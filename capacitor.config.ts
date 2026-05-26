import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "app.lovable.bond",
  appName: "Bond",
  webDir: "dist",
  bundledWebRuntime: false,
  // Hot-reload no device durante dev: aponte para o preview do Lovable
  // server: { url: "https://id-preview--b85016e3-9396-4a23-a82f-78c0dbd0c618.lovable.app", cleartext: true },
  ios: {
    contentInset: "always",
    limitsNavigationsToAppBoundDomains: false,
    scrollEnabled: true,
    backgroundColor: "#FFFFFF",
  },
  android: {
    backgroundColor: "#FFFFFF",
    allowMixedContent: false,
    captureInput: true,
    webContentsDebuggingEnabled: false,
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 900,
      launchAutoHide: true,
      backgroundColor: "#FFFFFF",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true,
    },
    StatusBar: {
      style: "LIGHT",
      backgroundColor: "#FFFFFF",
      overlaysWebView: false,
    },
    Keyboard: {
      resize: "native",
      resizeOnFullScreen: true,
    },
    Haptics: {},
    Preferences: {
      group: "BondAppPreferences",
    },
  },
};

export default config;