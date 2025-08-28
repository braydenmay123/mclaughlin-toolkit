import 'react-native-gesture-handler';
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { Text, View, StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Colors from "@/constants/colors";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { trpc, trpcClient } from "@/lib/trpc";

const queryClient = new QueryClient();

export const unstable_settings = {
  initialRouteName: "index",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  console.log('RootLayout initializing...');
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
    if (loaded) {
      SplashScreen.hideAsync().catch(console.error);
    }
  }, [loaded]);

  // Add global error handler for web
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleError = (event: ErrorEvent) => {
        console.error('Global error:', event.error);
      };
      const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
        console.error('Unhandled promise rejection:', event.reason);
      };
      
      window.addEventListener('error', handleError);
      window.addEventListener('unhandledrejection', handleUnhandledRejection);
      
      return () => {
        window.removeEventListener('error', handleError);
        window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      };
    }
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
      <GestureHandlerRootView style={{ flex: 1 }}>
        <trpc.Provider client={trpcClient} queryClient={queryClient}>
          <QueryClientProvider client={queryClient}>
            <RootLayoutNav />
          </QueryClientProvider>
        </trpc.Provider>
      </GestureHandlerRootView>
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
        <Stack.Screen name="calculator" options={{ headerShown: false }} />
        <Stack.Screen name="tfsa" options={{ headerShown: false }} />
        <Stack.Screen name="investment" options={{ headerShown: false }} />
        <Stack.Screen name="advisor" options={{ headerShown: false }} />
        <Stack.Screen name="rrsp-tax-savings" options={{ headerShown: false }} />
        <Stack.Screen name="withdrawal-strategy" options={{ headerShown: false }} />

        <Stack.Screen name="advisor/gic-vs-insurance" options={{ headerShown: false }} />
        <Stack.Screen name="advisor/segregated-funds" options={{ headerShown: false }} />
        <Stack.Screen name="test" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ 
          presentation: 'modal',
          animation: 'slide_from_bottom',
        }} />
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