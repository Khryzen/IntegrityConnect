import { View } from "@/components/Themed";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack, router, useSegments } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator } from "react-native";
import "./../global.css";

// CHANGE KEY: Use an authentication key instead of onboarding
const AUTH_KEY = "is_authenticated";

export default function RootLayout() {
  // Rename state variable to reflect authentication status
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const segments = useSegments();
  const routerIsReady = isAuthenticated !== null;

  // Change flow name to 'login' to match your new screen filename
  const inLoginFlow = segments[0] === "login";

  const redirectAttempted = useRef(false);

  useEffect(() => {
    const checkAuthStatus = async () => {
      // Check if the user has a valid authentication token/status
      const status = await AsyncStorage.getItem(AUTH_KEY);
      // We assume they are authenticated if the key is 'true'
      setIsAuthenticated(status === "true");
    };
    checkAuthStatus();
  }, []);

  useEffect(() => {
    if (!routerIsReady || redirectAttempted.current) return;

    // Logic: If user is logged in but in the login flow, redirect to tabs.
    const requiresTabs = isAuthenticated && inLoginFlow;

    // Logic: If user is NOT logged in and not in the login flow, redirect to login.
    const requiresLogin = !isAuthenticated && !inLoginFlow;

    // Reset the ref when the flow is correct
    if (!requiresTabs && !requiresLogin) {
      redirectAttempted.current = false;
      return;
    }

    // PERFORM REDIRECT ONLY IF NOT ATTEMPTED
    if (requiresTabs) {
      redirectAttempted.current = true;
      router.replace("/(tabs)");
    } else if (requiresLogin) {
      redirectAttempted.current = true;
      router.replace("/login"); // Redirect to the new 'login' screen
    }
  }, [isAuthenticated, routerIsReady, inLoginFlow]);

  if (isAuthenticated === null) {
    return (
      <View className="flex-1 justify-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // Blocking render logic adjusted for clarity (isAuthenticated vs !inLoginFlow)
  const isCurrentlyInCorrectFlow = isAuthenticated === !inLoginFlow;

  if (!isCurrentlyInCorrectFlow) {
    return null;
  }

  return (
    <Stack>
      <Stack.Screen
        name="(tabs)"
        options={{
          headerShown: false,
        }}
      />
      {/* Change screen name from 'onboarding' to 'login' */}
      <Stack.Screen
        name="login"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen name="modal" options={{ presentation: "modal" }} />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}
