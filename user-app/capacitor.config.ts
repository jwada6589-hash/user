/// <reference types="@capacitor/app" />
/// <reference types="@capacitor/splash-screen" />

import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.almurtada.market',
  appName: 'ماركت المرتضى',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    cleartext: false,
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 1200,
      launchAutoHide: true,
      launchFadeOutDuration: 250,
      backgroundColor: '#055C33',
      showSpinner: false,
    },
    SystemBars: {
      insetsHandling: 'css',
      style: 'LIGHT',
      hidden: false,
    },
  },
};

export default config;
