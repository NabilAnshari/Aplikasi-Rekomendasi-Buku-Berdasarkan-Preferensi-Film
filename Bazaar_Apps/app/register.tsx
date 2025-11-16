import { View, Text, Alert, TouchableOpacity } from "react-native";
import AuthForm from "../components/AuthForm";
import { register } from "../services/auth";
import { useRouter } from "expo-router";

export default function RegisterScreen() {
  const router = useRouter();

  const handleRegister = async ({ name, email, password, confPassword }: any) => {
    try {
      const res = await register(name, email, password, confPassword);
      Alert.alert("Sukses", res.msg || "Register berhasil");
      router.replace("/login");
    } catch (err: any) {
      Alert.alert("Error", "Register failed");
    }
  };

  return (
    <View className="flex-1 justify-center px-6">
      <Text className="text-3xl font-bold mb-2">Sign Up</Text>
      <Text className="text-gray-500 mb-6">
        Create account and choose favorite menu
      </Text>

      <AuthForm onSubmit={handleRegister} type="register" />

      <TouchableOpacity onPress={() => router.replace("/login")} className="mt-6">
        <Text className="text-center text-gray-500">
          Have an account?{" "}
          <Text className="text-purple-700 font-semibold">Sign In</Text>
        </Text>
      </TouchableOpacity>

      <Text className="absolute bottom-12 text-center text-gray-400 text-xs w-full ml-6">
        By clicking Register, you agree to our {" "}
        <Text className="text-purple-700 font-semibold">Terms and Data Policy.</Text>
      </Text>
    </View>
  );
}
