import { View, Text, FlatList, Image, TouchableOpacity } from "react-native";
import React from "react";
import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { removeFavorite } from "@/services/favoriteApi"; // ✅ service sudah kirim user_id + book_api

interface FavoriteListProps {
  favorites: any[];
  onRemove: (bookId: string) => void;
}

const FavoriteList = ({ favorites, onRemove }: FavoriteListProps) => {
  const router = useRouter();

  const handleRemove = async (bookId: string) => {
  try {
    const res = await removeFavorite(bookId);
    if (res.status === 204 || res.status === 200) {
      onRemove(bookId);
    }
  } catch (err: any) {
    if (err.response?.status === 204) {
      onRemove(bookId);
      return;
    }
    console.error("Failed to remove favorite:", err);
  }
};


  if (!favorites || favorites.length === 0) {
    return (
      <Text className="text-gray-500 text-center mt-5">No favorites yet.</Text>
    );
  }

  return (
    <FlatList
      data={favorites}
      keyExtractor={(item) => item.id || item.etag}
      renderItem={({ item }) => {
        const volumeInfo = item.volumeInfo || {};
        return (
          <View className="flex-row items-center bg-white rounded-xl p-3 mb-3 shadow">
            {/* Navigasi ke detail buku */}
            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: "/books/[id]",
                  params: { id: item.id },
                })
              }
              activeOpacity={0.8}
              className="flex-1 flex-row items-center"
            >
              {/* Thumbnail */}
              {volumeInfo.imageLinks?.thumbnail ? (
                <Image
                  source={{ uri: volumeInfo.imageLinks.thumbnail }}
                  className="w-14 h-20 rounded-md mr-3"
                />
              ) : (
                <View className="w-14 h-20 bg-gray-200 rounded-md mr-3" />
              )}

              {/* Info */}
              <View className="flex-1">
                <Text
                  className="text-sm font-semibold text-gray-900"
                  numberOfLines={2}
                >
                  {volumeInfo.title || "Unknown Title"}
                </Text>
                <Text
                  className="text-xs text-gray-600 mt-1"
                  numberOfLines={1}
                >
                  {volumeInfo.authors?.join(", ") || "Unknown Author"}
                </Text>
              </View>
            </TouchableOpacity>

            {/* Tombol Remove Favorite */}
            <TouchableOpacity onPress={() => handleRemove(item.id)} className="p-2">
              <FontAwesome name="heart" size={20} color="#54408C" />
            </TouchableOpacity>
          </View>
        );
      }}
    />
  );
};

export default FavoriteList;
