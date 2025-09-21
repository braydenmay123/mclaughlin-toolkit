import { Slot } from "expo-router";

export const unstable_settings = {
  initialRouteName: "(app)",
};

/**
 * Root layout: no providers. Just delegate to groups.
 * (app) group will contain all providers.
 * (404) group stays minimal for static export safety.
 */
export default function RootLayout() {
  return <Slot />;
}