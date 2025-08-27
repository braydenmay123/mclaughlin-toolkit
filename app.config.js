/** Expo app config in JS to avoid JSON parse errors */
module.exports = {
  expo: {
    name: "McLaughlin Toolkit",
    slug: "home-buyers-planning-tool",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "myapp",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,

    splash: {
      image: "./assets/images/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },

    ios: {
      supportsTablet: true,
      bundleIdentifier: "app.rork.home-buyers-planning-tool",
    },

    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      package: "app.rork.home-buyers-planning-tool",
    },

    web: {
      bundler: "webpack",
      output: "static",
      favicon: "./assets/images/favicon.png",
      // CSP relaxed enough for Expo web; we can tighten later if desired.
      contentSecurityPolicy:
        "default-src 'self'; script-src 'self' 'unsafe-eval' 'wasm-unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; connect-src *; font-src 'self' data:; worker-src 'self' blob:",
    },

    plugins: [
      [
        "expo-router",
        {
          origin: "https://rork.com/",
        },
      ],
    ],

    experiments: {
      typedRoutes: true,
    },
  },
};
