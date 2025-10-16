import { View } from "@/components/Themed";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator } from "react-native";
import "./../global.css";


const ONBOARDING_KEY = 'has_onboarded';

export default function RootLayout(){
  const [hasOnboarded, setHasOnboarded] = useState<boolean | null>(null);

  useEffect(() =>{
    const checkOnboardingStatus = async () =>{
      const status = await AsyncStorage.getItem(ONBOARDING_KEY);
      setHasOnboarded(status == 'true');
    };
    checkOnboardingStatus();
  }, []);

  if (hasOnboarded === null){
    return(
      <View className="flex-1 justify-center">
        <ActivityIndicator size='large'/>
      </View>
    );
  }

  return (
    <Stack>
      {hasOnboarded ? (
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      ) : (
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
      )}

      <Stack.Screen name="modal" options={{ presentation: 'modal' }}/>
      <Stack.Screen name="+not-found"/>
    </Stack>
  );
}