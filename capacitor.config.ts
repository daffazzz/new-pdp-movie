import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.pdpx.site',
  appName: 'PDP Movie',
  webDir: 'out',
  server: {
    androidScheme: 'https'
  }
};

export default config;
