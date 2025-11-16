import { View, Text, FlatList, TouchableOpacity, Alert } from "react-native";
import { useEffect, useState, useCallback } from "react";
import { getUsers, logout, deleteUser } from "../../services/auth";
import { clearTokens } from "../../services/storage";
import UserCard from "../../components/UserCard";
import { useRouter, useFocusEffect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function DashboardScreen() {
  const router = useRouter();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = useCallback(async () => {
    try {
      const userRole = await AsyncStorage.getItem("user_role");
      if (userRole !== "admin") {
        Alert.alert("Error", "Hanya admin yang bisa mengakses halaman ini");
        router.replace("/");
        return;
      }

      const data = await getUsers();
      setUsers(data);
    } catch (err) {
      console.log("Error fetchUsers:", err);
      router.replace("/login");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useFocusEffect(
    useCallback(() => {
      fetchUsers();
    }, [fetchUsers])
  );

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.log("Logout error:", err);
    } finally {
      await clearTokens();
      router.replace("/login");
    }
  };

  const handleDelete = async (id: number) => {
    Alert.alert("Konfirmasi", "Yakin ingin menghapus user ini?", [
      { text: "Batal", style: "cancel" },
      {
        text: "Hapus",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteUser(id);
            setUsers((prev) => prev.filter((u) => u.id !== id));
          } catch (err) {
            console.log("Delete error:", err);
            Alert.alert("Error", "Gagal menghapus user");
          }
        },
      },
    ]);
  };

  const handleEdit = (user: any) => {
    router.push({
      pathname: "/admin/editUser",
      params: { id: user.id, name: user.name, email: user.email },
    });
  };

  return (
    <View className="flex-1 p-4">
      <Text className="text-2xl font-bold mb-4">Dashboard</Text>

      {loading ? (
        <Text className="text-center text-gray-500 mt-10">Memuat data...</Text>
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <UserCard user={item} onEdit={handleEdit} onDelete={handleDelete} />
          )}
          refreshing={loading}
          onRefresh={fetchUsers}
        />
      )}

      <TouchableOpacity
        onPress={handleLogout}
        className="bg-pink-500 p-3 rounded-xl mt-4 mb-5"
      >
        <Text className="text-center text-white font-bold">Logout</Text>
      </TouchableOpacity>
    </View>
  );
}