import { View, Text, ScrollView, Image, TouchableOpacity, Alert } from "react-native";
import React, { useCallback } from "react";
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { logout, getMe } from "@/services/auth";
import { create } from "zustand";

const getImageUrl = (image?: string | null) => {
  if (!image) return null;
  let url = `http://10.0.2.2:5000/images/user/${image}`;
  return url.replace(/ /g, "%20");
};

type User = {
  id: string;
  name: string;
  email: string;
  image_link: string;
  role: string;
  image: string;
};

export const useAuthStore = create<{
  user: User | null;
  token: string | null;
  setUser: (u: User | null) => void;
  setToken: (t: string | null) => void;
  clearAuth: () => void;
}>((set) => ({
  user: null,
  token: null,
  setUser: (u) => set({ user: u }),
  setToken: (t) => set({ token: t }),
  clearAuth: () => set({ user: null, token: null }),
}));

const Profile = () => {
  const { user, setUser, clearAuth } = useAuthStore();

  useFocusEffect(
    useCallback(() => {
      getMe().then(setUser).catch(console.error);
    }, [])
  );

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      clearAuth();
      router.replace("/login");
    }
  };

  const handleAbout = () => {
    Alert.alert(
      "Tentang Aplikasi",
      "Aplikasi ini adalah aplikasi rekomendasi buku berdasarkan preferensi film favorit pengguna dengan menggunakan metode content based filtering untuk merekomendasikan buku.\n\nDibuat menggunakan React Native (Expo) dengan Express JS dan Node JS sebagai server backend, serta Flask + API TMDB & Google Books.",
      [{ text: "OK" }]
    );
  };

  return (
    <ScrollView className="flex-1 bg-white mt-5">
      <View className="items-center py-5 border-b border-gray-200">
        <Text className="text-xl font-bold text-black">Profile</Text>
      </View>

      <View className="items-center mt-6">
        <Image
          source={
            getImageUrl(user?.image)
              ? { uri: getImageUrl(user?.image) as string }
              : require("../../assets/images/default-images.jpg")
          }
          className="w-28 h-28 rounded-full"
        />

        <Text className="mt-3 text-lg font-bold text-violet-700">
          {user?.name}
        </Text>
      </View>

      <View className="mt-8">
        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: "/editProfile",
              params: user as any,
            })
          }
          className="flex-row items-center px-6 py-4 border-b border-gray-200"
        >
          <View className="bg-violet-50 p-3 rounded-full">
            <Ionicons name="person-outline" size={22} color="#6D28D9" />
          </View>
          <Text className="ml-4 text-base font-medium text-black">
            Detail Account
          </Text>
          <View className="ml-auto">
            <Ionicons name="chevron-forward" size={20} color="gray" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/favorite")}
          className="flex-row items-center px-6 py-4 border-b border-gray-200"
        >
          <View className="bg-violet-50 p-3 rounded-full">
            <Ionicons name="heart-outline" size={22} color="#6D28D9" />
          </View>
          <Text className="ml-4 text-base font-medium text-black">
            Your Favorites
          </Text>
          <View className="ml-auto">
            <Ionicons name="chevron-forward" size={20} color="gray" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleAbout} 
          className="flex-row items-center px-6 py-4 border-b border-gray-200"
        >
          <View className="bg-violet-50 p-3 rounded-full">
            <Ionicons
              name="information-circle-outline"
              size={22}
              color="#6D28D9"
            />
          </View>
          <Text className="ml-4 text-base font-medium text-black">About</Text>
          <View className="ml-auto">
            <Ionicons name="chevron-forward" size={20} color="gray" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleLogout}
          className="flex-row items-center px-6 py-4"
        >
          <View className="bg-violet-50 p-3 rounded-full">
            <Ionicons name="log-out-outline" size={22} color="#6D28D9" />
          </View>
          <Text className="ml-4 text-base font-medium text-black">Log Out</Text>
          <View className="ml-auto">
            <Ionicons name="chevron-forward" size={20} color="gray" />
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default Profile;
