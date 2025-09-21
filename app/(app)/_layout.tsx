import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { Text, View, StyleSheet } from "react-native";
import Colors from "@/constants/colors";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { trpc, trpcClient } from "@/lib/trpc";

const queryClient = new QueryClient();

export default function AppGroupLayout() {
  console.log('AppGroupLayout initializing...');
  const isSSR = typeof window === 'undefined';
  if (isSSR) return <SSRAppGroup />;
  return <ClientAppGroup />;
}

function SSRAppGroup() {
  return (
    <View style={layoutStyles.root} testID="appgroup-ssr-fallback">
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: Colors.background },
          animation: "fade_from_bottom",
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="calculators" options={{ headerShown: false }} />
        <Stack.Screen name="calculator" options={{ headerShown: false }} />
        <Stack.Screen name="tfsa" options={{ headerShown: false }} />
        <Stack.Screen name="investment" options={{ headerShown: false }} />
        <Stack.Screen name="advisor" options={{ headerShown: false }} />
        <Stack.Screen name="rrsp-tax-savings" options={{ headerShown: false }} />
        <Stack.Screen name="withdrawal-strategy" options={{ headerShown: false }} />
        <Stack.Screen name="large-purchase" options={{ headerShown: false }} />
        <Stack.Screen name="tax-calculator" options={{ headerShown: false }} />
        <Stack.Screen name="asset-mapping" options={{ headerShown: false }} />
        <Stack.Screen name="asset-map" options={{ headerShown: false }} />
        <Stack.Screen name="mapping" options={{ headerShown: false }} />
        <Stack.Screen name="privacy-policy" options={{ headerShown: false }} />
        <Stack.Screen name="terms-of-service" options={{ headerShown: false }} />
        <Stack.Screen name="document-portal" options={{ headerShown: false }} />
        <Stack.Screen name="test" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
      </Stack>
    </View>
  );
}

function ClientAppGroup() {
  const [loaded, error] = useFonts({
    ...FontAwesome.font,
  });

  console.log('Font loading state:', { loaded, error: error?.message });

  useEffect(() => {
    if (error) {
      console.error('Font loading error:', error);
    }
  }, [error]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        await SplashScreen.preventAutoHideAsync();
      } catch {}
      if (loaded && !cancelled) {
        try { await SplashScreen.hideAsync(); } catch {}
      }
    })();
    return () => { cancelled = true; };
  }, [loaded]);

  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error('Global error:', (event as unknown as { error?: unknown })?.error);
    };
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('Unhandled promise rejection:', (event as unknown as { reason?: unknown })?.reason);
    };
    window.addEventListener('error', handleError as EventListener);
    window.addEventListener('unhandledrejection', handleUnhandledRejection as EventListener);
    return () => {
      window.removeEventListener('error', handleError as EventListener);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection as EventListener);
    };
  }, []);

  if (error) {
    console.error('Font error details:', error);
    return (
      <View style={errorStyles.container}>
        <Text style={errorStyles.text}>Error loading fonts</Text>
        <Text style={errorStyles.details}>{error.message}</Text>
      </View>
    );
  }

  if (!loaded) {
    return (
      <View style={errorStyles.container}>
        <Text style={errorStyles.text}>Loading...</Text>
      </View>
    );
  }

  try {
    return (
      <View style={layoutStyles.root}>
        <trpc.Provider client={trpcClient} queryClient={queryClient}>
          <QueryClientProvider client={queryClient}>
            <RootLayoutNav />
          </QueryClientProvider>
        </trpc.Provider>
      </View>
    );
  } catch (err) {
    console.error('App initialization error:', err);
    return (
      <View style={errorStyles.container}>
        <Text style={errorStyles.text}>App initialization failed</Text>
        <Text style={errorStyles.details}>{err instanceof Error ? err.message : 'Unknown error'}</Text>
      </View>
    );
  }
}

function RootLayoutNav() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: Colors.background },
          animation: "fade_from_bottom",
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="calculators" options={{ headerShown: false }} />
        <Stack.Screen name="calculator" options={{ headerShown: false }} />
        <Stack.Screen name="tfsa" options={{ headerShown: false }} />
        <Stack.Screen name="investment" options={{ headerShown: false }} />
        <Stack.Screen name="advisor" options={{ headerShown: false }} />
        <Stack.Screen name="rrsp-tax-savings" options={{ headerShown: false }} />
        <Stack.Screen name="withdrawal-strategy" options={{ headerShown: false }} />
        <Stack.Screen name="large-purchase" options={{ headerShown: false }} />
        <Stack.Screen name="tax-calculator" options={{ headerShown: false }} />
        <Stack.Screen name="asset-mapping" options={{ headerShown: false }} />
        <Stack.Screen name="asset-map" options={{ headerShown: false }} />
        <Stack.Screen name="mapping" options={{ headerShown: false }} />
        <Stack.Screen name="privacy-policy" options={{ headerShown: false }} />
        <Stack.Screen name="terms-of-service" options={{ headerShown: false }} />
        <Stack.Screen name="document-portal" options={{ headerShown: false }} />
        <Stack.Screen name="test" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
      </Stack>
    </>
  );
}

const errorStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: Colors.background,
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 10,
    textAlign: 'center',
  },
  details: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});

const layoutStyles = StyleSheet.create({
  root: { flex: 1 },
});