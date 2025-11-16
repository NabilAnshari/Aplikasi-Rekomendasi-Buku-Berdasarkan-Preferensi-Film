import {
  View,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Text,
} from "react-native";
import React, { useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { getMe } from "@/services/auth";
import BookCard from "@/components/BookCard";
import api from "@/services/api";
import { FontAwesome6 } from "@expo/vector-icons";

type Book = {
  id: string;
  volumeInfo: {
    title: string;
    authors?: string[];
    publishedDate?: string;
    imageLinks?: {
      thumbnail?: string;
    };
  };
};

const Recommendations = () => {
  const { title } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [books, setBooks] = useState<Book[]>([]);
  const [userId, setUserId] = useState<number | null>(null);

  // === FETCH DATA ===
  const fetchBookDetails = async (recommendationList: any[]) => {
    const details = await Promise.all(
      recommendationList.map(async (rec) => {
        try {
          const response = await fetch(
            `https://www.googleapis.com/books/v1/volumes/${rec.book_id}`
          );
          const d = await response.json();
          return { id: d.id, volumeInfo: d.volumeInfo } as Book;
        } catch {
          return null;
        }
      })
    );
    return details.filter(Boolean) as Book[];
  };

  const getUserRecommendations = async (uid: number) => {
    try {
      const res = await api.get(`/recommendations/${uid}`);
      setBooks(await fetchBookDetails(res.data));
    } catch (error) {
      console.error("Failed to fetch recommendations:", error);
    } finally {
      setLoading(false);
    }
  };

  const generateRecommendations = async (uid: number, filmTitle: string) => {
    try {
      await api.get(`/recommendations/${filmTitle}/${uid}`);
      const res = await api.get(`/recommendations/${uid}`);
      setBooks(await fetchBookDetails(res.data));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchRecommendationsData = async () => {
      try {
        const user = await getMe();
        setUserId(user.id);

        if (title) {
          const bookTitle = Array.isArray(title) ? title[0] : title;
          await generateRecommendations(user.id, bookTitle);
        } else {
          await getUserRecommendations(user.id);
        }
      } catch (err) {
        console.error("Failed to fetch user:", err);
        setLoading(false);
      }
    };
    fetchRecommendationsData();
  }, [title]);

  // === LOADING ===
  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Please Wait...</Text>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  // === HANDLE RESET ===
  const handleReset = async () => {
    if (!userId) return;
    try {
      await api.delete(`/recommendations/${userId}`);
      setBooks([]);
      router.replace("/FilmListPage");
    } catch (error: any) {
      console.error("Update failed:", error.response?.data || error.message);
    }
  };

  // === UI ===
  return (
    <ScrollView className="flex-1 p-4" showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View className="flex-row items-center justify-between mt-10">
        <TouchableOpacity onPress={() => router.replace("/")}>
          <FontAwesome6 name="arrow-left" size={22} color="black" />
        </TouchableOpacity>

        <Text className="text-xl font-bold text-gray-800 text-center flex-1">
          Book Recommendations
        </Text>
      </View>

      {/* Reset Button */}
      <View className="flex-row items-center justify-end p-4 mt-2">
        <TouchableOpacity
          onPress={handleReset}
          className="px-3 py-1.5 rounded-full"
          style={{ backgroundColor: "#E5DEF8" }}
        >
          <Text
            className="text-sm font-semibold"
            style={{ color: "#54408C" }}
          >
            Reset
          </Text>
        </TouchableOpacity>
      </View>

      {/* Daftar Rekomendasi */}
      <View className="flex-row flex-wrap justify-between mt-2">
        {books.length > 0 ? (
          books.map((item) => (
            <BookCard
              key={item.id}
              book={item}
              style={{ width: "48%", marginBottom: 16 }}
            />
          ))
        ) : (
          <Text
            style={{
              textAlign: "center",
              marginTop: 20,
              color: "gray",
              width: "100%",
            }}
          >
            Tidak ada rekomendasi
          </Text>
        )}
      </View>
    </ScrollView>
  );
};

export default Recommendations;