/// <reference types="@capacitor/app" />
/// <reference types="@capacitor/splash-screen" />
/// <reference types="@capgo/capacitor-updater" />

import type { CapacitorConfig } from '@capacitor/cli';

const liveUpdateChannel = process.env.CAPGO_CHANNEL?.trim() || 'staging';

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
    CapacitorUpdater: {
      appId: 'com.almurtada.market',
      defaultChannel: liveUpdateChannel,
      autoUpdate: 'off',
      periodCheckDelay: 0,
      appReadyTimeout: 10000,
      responseTimeout: 20,
      autoDeleteFailed: true,
      autoDeletePrevious: false,
      resetWhenUpdate: true,
      allowModifyUrl: false,
      allowModifyAppId: false,
      allowSetDefaultChannel: false,
      keepUrlPathAfterReload: false,
      disableJSLogging: true,
    },
  },
};

export default config;
