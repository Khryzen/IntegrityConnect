import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React from "react";
import { Button, Text, TextInput, View } from "react-native";

const AUTH_KEY = "is_authenticated";

export default function LoginScreen(){
  const router = useRouter();
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');

  const handleLogin = async () => {
    let loginSuccess = true
    if (loginSuccess){
      console.log('Success');
    }
    await AsyncStorage.setItem(AUTH_KEY, 'true');
    router.replace('/(tabs)');
  }

  return (
    <View className="flex-1 justify-center items-center p-5">
      <Text className="text-3xl font-bold mb-8">Welcome Back!</Text>
      <TextInput
        className="w-full p-4 mb-4 border border-gray-300 rounded-lg"
        placeholder="Username"
        onChangeText={setUsername}
        value={username}
      />
      <TextInput
        className="w-full p-4 mb-4 border border-gray-300 rounded-lg"
        placeholder="Password"
        onChangeText={setPassword}
        value={password}
        secureTextEntry
      />
      <Button
        title="Log In"
        onPress={handleLogin}
        disabled={!username || !password}
      ></Button>
    </View>
  );
}