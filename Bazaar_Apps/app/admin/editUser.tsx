import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import { updateUser, updateUserByAdmin } from "../../services/auth"; 

export default function EditUserScreen() {
  const router = useRouter();
  const { id, name, email } = useLocalSearchParams();

  const [newName, setNewName] = useState<string>(name as string);
  const [newEmail, setNewEmail] = useState<string>(email as string);

  const handleUpdate = async () => {
    try {
      if (!newName || !newEmail) {
        Alert.alert("Error", "Nama dan email tidak boleh kosong");
        return;
      }

      await updateUserByAdmin(Number(id), { name: newName, email: newEmail });
      Alert.alert("Sukses", "User berhasil diperbarui", [
        {
          text: "OK",
          onPress: () => router.back(), 
        },
      ]);
    } catch (err) {
      console.log("Update error:", err);
      Alert.alert("Error", "Gagal memperbarui user");
    }
  };

  return (
    <ScrollView className="flex-1 p-4 bg-white">
      <Text className="text-2xl font-bold mb-4">Edit User</Text>

      <Text className="mb-2 font-semibold">Nama</Text>
      <TextInput
        value={newName}
        onChangeText={setNewName}
        placeholder="Masukkan nama"
        className="border p-3 rounded-xl mb-4"
      />

      <Text className="mb-2 font-semibold">Email</Text>
      <TextInput
        value={newEmail}
        onChangeText={setNewEmail}
        placeholder="Masukkan email"
        keyboardType="email-address"
        className="border p-3 rounded-xl mb-4"
      />

      <TouchableOpacity
        onPress={handleUpdate}
        className="bg-purple-500 p-3 rounded-xl"
      >
        <Text className="text-center text-white font-bold">Simpan</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.back()}
        className="bg-gray-300 p-3 rounded-xl mt-3"
      >
        <Text className="text-center text-black font-bold">Batal</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
