/** Expo app config in JS (SDK 53) */
module.exports = {
  expo: {
    name: "McLaughlin Toolkit",
    slug: "home-buyers-planning-tool",
    version: "1.0.0",
    orientation: "portrait",
    platforms: ["ios", "android", "web"],
    icon: "./assets/images/icon.png",
    scheme: "myapp",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,

    splash: {
      image: "./assets/images/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },

    ios: {
      supportsTablet: true,
      bundleIdentifier: "app.rork.home-buyers-planning-tool"
    },

    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff"
      },
      package: "app.rork.home-buyers-planning-tool"
    },

    // ⬇️ Force Metro for web to satisfy expo export
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png",
      contentSecurityPolicy:
        "default-src 'self'; script-src 'self' 'unsafe-eval' 'wasm-unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; connect-src *; font-src 'self' data:; worker-src 'self' blob:"
    },

    plugins: [
      ["expo-router", { origin: "https://rork.com/" }]
    ],

    experiments: {
      typedRoutes: true
    }
  }
};
