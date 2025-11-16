import { View, Text, TouchableOpacity } from "react-native";
import React from "react";

export default function UserCard({
  user,
  onEdit,
  onDelete,
}: {
  user: any;
  onEdit: (user: any) => void;
  onDelete: (id: number) => void;
}) {
  return (
    <View className="p-4 border rounded-xl m-2 bg-white shadow">
      <Text className="font-bold text-lg">{user.name}</Text>
      <Text className="text-gray-600">{user.email}</Text>

      {/* Action Buttons */}
      <View className="flex-row mt-3 space-x-3">
        <TouchableOpacity
          className="bg-violet-500 px-4 py-2 rounded-lg"
          onPress={() => onEdit(user)}
        >
          <Text className="text-white font-semibold">Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-pink-500 px-4 py-2 rounded-lg ml-1"
          onPress={() => onDelete(user.id)}
        >
          <Text className="text-white font-semibold">Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
