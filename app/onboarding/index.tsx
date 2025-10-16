import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { Button, Text, View } from "react-native";

const ONBOARDING_KEY = "has-onboarded";

export default function OnboardingScreen() {
  const router = useRouter();

  const completeOnboarding = async () =>{
    await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
    router.replace('/(tabs)');
  };

  return(
    <View className="flex flex-col gap-5 min-h-100 pt-20 px-5">
      <Text className="text-5xl leading-[1.2] text-center">Welcome to IntegrityConnect!</Text>
      <Text>This is your one-time onboarding experience</Text>
      <Button title="Get Started" onPress={completeOnboarding}/>
    </View>
  )
}
