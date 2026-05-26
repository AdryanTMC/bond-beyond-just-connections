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
  },
  android: {
    backgroundColor: "#0F1B3D",
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 1200,
      backgroundColor: "#0F1B3D",
      androidSplashResourceName: "splash",
      showSpinner: false,
    },
    StatusBar: {
      style: "DARK",
      backgroundColor: "#0F1B3D",
    },
  },
};

export default config;