import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { bookCategories } from "@/constants/categoty";
import useFetch from "@/services/useFetch";
import { fetchBooksByCategory } from "@/services/googleBooksApi";
import BookCard from "@/components/BookCard";

const Category = () => {
  const [activeCategory, setActiveCategory] = useState(bookCategories[0].id);
  const router = useRouter();

  const { data: books, loading, error, refetch } = useFetch(
    () => fetchBooksByCategory(activeCategory),
    true
  );

  useEffect(() => {
    refetch();
  }, [activeCategory]);

  return (
    <View className="flex-1 bg-white pt-10 mt-3">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 mb-4">
        <TouchableOpacity onPress={() => router.push("/searchBooks")}>
          <Ionicons name="search-outline" size={24} color="black" />
        </TouchableOpacity>

        <Text className="text-xl font-bold">Category</Text>

        <TouchableOpacity onPress={() => router.push("/profile")}>
          <Ionicons name="person-circle-outline" size={26} color="black" />
        </TouchableOpacity>
      </View>

      {/* Menu kategori */}
      <FlatList
        data={bookCategories}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => setActiveCategory(item.id)}
            className="mr-6 pb-2"
          >
            <Text
              className={`text-base font-medium ${
                activeCategory === item.id ? "text-black" : "text-gray-400"
              }`}
            >
              {item.title}
            </Text>
            {activeCategory === item.id && (
              <View className="h-0.5 bg-black mt-1 rounded-full" />
            )}
          </TouchableOpacity>
        )}
      />

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#4F46E5" />
        </View>
      ) : error ? (
        <View className="flex-1 items-center justify-center">
          <Text className="text-red-500">Error: {error.message}</Text>
        </View>
      ) : (
        <FlatList
          data={books}
          keyExtractor={(item, index) => item.id ?? index.toString()}
          renderItem={({ item }) => (
            <BookCard book={item} style={{ width: "48%" }} />
          )}
          numColumns={2}
          columnWrapperStyle={{
            justifyContent: "space-between",
            marginBottom: 16,
          }}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40 }}
        />
      )}
    </View>
  );
};
export default Category;
