import React, { useState, useCallback } from "react";
import { View, Text, ActivityIndicator, Alert } from "react-native";
import { useRouter } from "expo-router";
import api from "@/services/api";
import { getMe } from "@/services/auth";
import { useFocusEffect } from "@react-navigation/native";
import { removeFavorite as apiRemoveFavorite } from "@/services/favoriteApi";
import FavoriteList from "@/components/FavoriteList";

type FavoriteApiItem = {
  id: number;
  user_id: number;
  book_api: string;
};

const Favorite = () => {
  const [favorites, setFavorites] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  const fetchFavorites = useCallback(async () => {
    setLoading(true);
    try {
      const user = await getMe();
      const res = await api.get(`/favorite/${user.id}`);
      const favoriteList: FavoriteApiItem[] = res.data?.data || [];

      const details = await Promise.all(
        favoriteList.map(async (fav) => {
          try {
            const r = await fetch(
              `https://www.googleapis.com/books/v1/volumes/${fav.book_api}`
            );
            const d = await r.json();
            return { id: d.id, volumeInfo: d.volumeInfo } as Book;
          } catch (err) {
            console.warn(
              "Failed fetch book detail for favorite:",
              fav.book_api,
              err
            );
            return null;
          }
        })
      );

      setFavorites(details.filter((x): x is Book => Boolean(x)));
    } catch (err) {
      console.error("Error fetch favorites:", err);
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchFavorites();
    }, [fetchFavorites])
  );

  const handleRemove = async (bookId: string) => {
    if (!bookId) return;
    Alert.alert("Hapus Favorit", "Yakin ingin menghapus buku ini?", [
      { text: "Batal", style: "cancel" },
      {
        text: "Hapus",
        style: "destructive",
        onPress: async () => {
          try {
            const res = await apiRemoveFavorite(bookId);
            if (res?.status === 200 || res?.status === 204) {
              setFavorites((prev) => prev.filter((b) => b.id !== bookId));
              return;
            }
          } catch (err: any) {
            if (err.response?.status === 404) {
              setFavorites((prev) => prev.filter((b) => b.id !== bookId));
              return;
            }
            console.error("Failed to remove favorite:", err);
            Alert.alert("Error", "Gagal menghapus favorite. Coba lagi.");
          }
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white mt-3">
        <ActivityIndicator size="large" color="#54408C" />
      </View>
    );
  }
  return (
    <View className="flex-1 bg-white px-4 pt-6 mt-8">
      <View className="items-center">
        <Text className="text-xl font-bold mb-4">My Favorite</Text>
      </View>
      <FavoriteList favorites={favorites} onRemove={handleRemove} />
    </View>

  );
};

export default Favorite;
