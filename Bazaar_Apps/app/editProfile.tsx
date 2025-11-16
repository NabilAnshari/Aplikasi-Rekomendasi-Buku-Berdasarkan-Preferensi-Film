import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useLocalSearchParams } from "expo-router";
import api from "@/services/api";
import * as ImagePicker from "expo-image-picker";
import { getMe } from "@/services/auth";
import { useAuthStore } from "./(tabs)/profile";
import { getTokens } from "@/services/storage";

function getParam(param: string | string[] | undefined): string | undefined {
  if (!param) return undefined;
  return Array.isArray(param) ? param[0] : param;
}

const getImageUrl = (image?: string | null) => {
  if (!image) return null;

  if (image.startsWith("file://") || image.startsWith("content://")) {
    return image; 
  }

  if (image.startsWith("http")) {
    return image.replace("localhost", "10.0.2.2");
  }

  return `http://10.0.2.2:5000/images/user/${image}`;
};

const EditProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();
  const params = useLocalSearchParams();
  const setUser = useAuthStore((state) => state.setUser);

  const [form, setForm] = useState({
    id: getParam(params.id) || "",
    name: getParam(params.name) || "",
    email: getParam(params.email) || "",
    image_link: getParam(params.image_link) || null,
    image: getParam(params.image) || "",
    userFile: null as any,
    currPassword: "",
    newPassword: "",
    confPassword: "",
  });
  console.log("EditProfile form state:", form);
  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 1,
    });

    if (!result.canceled) {
      const picked = result.assets[0];
      setForm((prev) => ({
        ...prev,
        image: picked.uri,
        userFile: picked,
      }));
    }
  };
  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    try {
      const { name, email, currPassword, newPassword, confPassword, userFile } =
        form;

      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("currPassword", currPassword);
      formData.append("newPassword", newPassword);
      formData.append("confPassword", confPassword);

      if (userFile) {
        formData.append("userImage", {
          uri: userFile.uri,
          type: "image/jpg",
          name: userFile.fileName || `profile_${Date.now()}.jpg`,
        } as any);
      }

      const { accessToken } = await getTokens();
      console.log("token:", accessToken);
      await api.patch(`/users/${form.id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const updateUser = await getMe();
      setUser(updateUser);
      router.replace(("/(tabs)/profile"));
      setIsEditing(false);
    } catch (error: any) {
      console.error("Update failed:", error.response?.data || error.message);
      Alert.alert(
        "Error",
        error.response?.data?.msg || "Failed to update profile"
      );
    }
  };
  return (
    <ScrollView className="flex-1 bg-white mt-8">
      {/* Header */}
      <View className="flex-row items-center px-4 py-4 border-b border-gray-200">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text className="flex-1 text-center text-lg font-bold text-black">
          My Account
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <View className="items-center mt-6">
        <Image
          source={
            getImageUrl(form.image)
              ? { uri: getImageUrl(form.image)! }
              : require("../assets/images/default-images.jpg")
          }
          className="w-28 h-28 rounded-full"
        />

        {isEditing && (
          <TouchableOpacity onPress={handlePickImage}>
            <Text className="mt-2 text-sm font-semibold text-violet-700">
              Change Picture
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Form */}
      <View className="px-6 mt-6 space-y-4">
        <View>
          <Text className="text-sm font-semibold text-black mb-1">Name</Text>
          <TextInput
            value={form.name}
            onChangeText={(val) => handleChange("name", val)}
            editable={isEditing}
            className="border border-gray-300 rounded-lg px-4 py-3 text-black"
          />
        </View>

        <View>
          <Text className="text-sm font-semibold text-black mb-1">Email</Text>
          <TextInput
            value={form.email}
            onChangeText={(val) => handleChange("email", val)}
            editable={isEditing}
            keyboardType="email-address"
            className="border border-gray-300 rounded-lg px-4 py-3 text-black"
          />
        </View>
        {isEditing && (
          <>
            <View>
              <Text className="text-sm font-semibold text-black mb-1">
                Current Password
              </Text>
              <TextInput
                secureTextEntry
                value={form.currPassword}
                onChangeText={(val) => handleChange("currPassword", val)}
                className="border border-gray-300 rounded-lg px-4 py-3 text-black"
              />
            </View>

            <View>
              <Text className="text-sm font-semibold text-black mb-1">
                New Password
              </Text>
              <TextInput
                secureTextEntry
                value={form.newPassword}
                onChangeText={(val) => handleChange("newPassword", val)}
                className="border border-gray-300 rounded-lg px-4 py-3 text-black"
              />
            </View>

            <View>
              <Text className="text-sm font-semibold text-black mb-1">
                Confirm Password
              </Text>
              <TextInput
                secureTextEntry
                value={form.confPassword}
                onChangeText={(val) => handleChange("confPassword", val)}
                className="border border-gray-300 rounded-lg px-4 py-3 text-black"
              />
            </View>
          </>
        )}
      </View>

      <View className="px-6 mt-10 mb-10 flex-row justify-between space-x-4">
        <TouchableOpacity
          onPress={() => setIsEditing(true)}
          disabled={isEditing} 
          className={`flex-1 py-4 rounded-full items-center ${
            isEditing ? "bg-gray-400" : "bg-violet-700"
          }`}
        >
          <Text className="text-white font-semibold text-base">
            Edit Profile
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleSave}
          disabled={!isEditing} 
          className={`flex-1 py-4 rounded-full items-center ${
            isEditing ? "bg-violet-700" : "bg-gray-400"
          }`}
        >
          <Text className="text-white font-semibold text-base">
            Save Changes
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};
export default EditProfile;
