import { View, Text, TouchableOpacity, Alert } from "react-native";
import AuthForm from "../components/AuthForm";
import { login } from "../services/auth";
import { Tabs, useRouter } from "expo-router";

export default function LoginScreen() {
  const router = useRouter();

  const handleLogin = async ({ email, password }: any) => {
    try {
      const user = await login(email, password);

      if (user.role === "admin") {
        router.replace("/admin/dashboard"); 
      } else {
        router.replace("/"); 
      }
    } catch (err: any) {
      Alert.alert("Login Failed", err.message);
    }
  };

  return (
    <View className="flex-1 justify-center px-6">
      <Text className="text-3xl font-bold mb-2">Welcome</Text>
      <Text className="text-gray-500 mb-6">Sign to your account</Text>

      <AuthForm onSubmit={handleLogin} type="login" />

      <TouchableOpacity onPress={() => router.push("/register")} className="mt-6">
        <Text className="text-center text-gray-500">
          Don’t have an account?{" "}
          <Text className="text-purple-700 font-semibold">Sign Up</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}
