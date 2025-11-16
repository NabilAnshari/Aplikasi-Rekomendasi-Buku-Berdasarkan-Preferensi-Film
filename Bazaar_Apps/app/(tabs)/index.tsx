import {
  ActivityIndicator,
  FlatList,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import BookCard from "@/components/BookCard";
import RecommendationIndex from "@/components/RecommendationIndex";
import useFetch from "@/services/useFetch";
import { fetchBooks } from "@/services/googleBooksApi";
import { useRouter, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { getMe } from "@/services/auth";
import api from "@/services/api";

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

export default function BookListPage() {
  const [recBooks, setRecBooks] = useState<Book[]>([]);
  const [loadingRec, setLoadingRec] = useState(true);

  const [trendingBooks, setTrendingBooks] = useState<Book[]>([]);
  const [loadingTrending, setLoadingTrending] = useState(true);

  const router = useRouter();
  const {
    data: books,
    loading: booksLoading,
    error: booksError,
    refetch,
  } = useFetch(() => fetchBooks({ startIndex: 0, maxResults: 20 }), true);

  const fetchRecommendations = useCallback(async () => {
    const user = await getMe();
    try {
      const res = await api.get(`/recommendations/${user.id}`);
      const recommendationList = res.data;

      const details = await Promise.all(
        recommendationList.map(async (rec: any) => {
          try {
            const response = await fetch(
              `https://www.googleapis.com/books/v1/volumes/${rec.book_id}`
            );
            const d = await response.json();
            return {
              id: d.id,
              volumeInfo: d.volumeInfo,
            } as Book;
          } catch {
            return null;
          }
        })
      );
      setRecBooks(details.filter(Boolean) as Book[]);
    } catch (error) {
      console.error("Error fetchRecommendations:", error);
    } finally {
      setLoadingRec(false);
    }
  }, []);

  const fetchTrending = useCallback(async () => {
    try {
      const res = await api.get("/books/trending");
      const trendingList = res.data;

      const details = await Promise.all(
        trendingList.map(async (item: any) => {
          try {
            const response = await fetch(
              `https://www.googleapis.com/books/v1/volumes/${item.book_id}`
            );
            const d = await response.json();
            return {
              id: d.id,
              volumeInfo: d.volumeInfo,
            } as Book;
          } catch {
            return null;
          }
        })
      );
      setTrendingBooks(details.filter(Boolean) as Book[]);
    } catch (error) {
      console.error("Error fetchTrending:", error);
    } finally {
      setLoadingTrending(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchRecommendations();
      fetchTrending();
    }, [fetchRecommendations, fetchTrending])
  );

  const sections = [
    ...(trendingBooks.length > 0 ? [{ section: "trending" }] : []),
    { section: "popular" },
  ];

  return (
    <View className="flex-1 bg-white pt-12 mt-3">
      <View className="flex-row items-center justify-between px-4 mb-4">
        <TouchableOpacity onPress={() => router.push("/searchBooks")}>
          <Ionicons name="search-outline" size={24} color="black" />
        </TouchableOpacity>

        <Text className="text-xl font-bold">Home</Text>

        <TouchableOpacity onPress={() => router.push("/profile")}>
          <Ionicons name="person-circle-outline" size={26} color="black" />
        </TouchableOpacity>
      </View>

      {booksLoading ? (
        <ActivityIndicator
          size="large"
          color="#0000ff"
          className="mt-10 self-center"
        />
      ) : booksError ? (
        <Text className="text-black mt-5 text-center">
          Error: {booksError?.message}
        </Text>
      ) : (
        <FlatList
          ListHeaderComponent={
            <View className="mb-4">
              <RecommendationIndex books={recBooks} />
            </View>
          }
          data={sections}
          keyExtractor={(item) => item.section}
          renderItem={({ item }) => {
            if (item.section === "trending") {
                return (
                  <View className="mb-6">
                    <Text className="text-lg text-black font-bold mb-2">Trending</Text>
                    {loadingTrending ? (
                      <ActivityIndicator size="small" color="#0000ff" />
                    ) : (
                      <FlatList
                        data={trendingBooks.slice(0, 8)} 
                        renderItem={({ item }) => (
                          <BookCard
                            book={item}
                            style={{ width: "48%", marginBottom: 16 }}
                          />
                        )}
                        keyExtractor={(item, index) => item.id ?? index.toString()}
                        numColumns={2}
                        columnWrapperStyle={{
                          justifyContent: "space-between",
                        }}
                        scrollEnabled={false}
                      />
                    )}
                  </View>
                );
              }

            if (item.section === "popular") {
              return (
                <View className="mb-6">
                  <Text className="text-lg text-black font-bold mb-2">
                    Popular Books
                  </Text>
                  <FlatList
                    data={books}
                    renderItem={({ item }) => (
                      <BookCard
                        book={item}
                        style={{ width: "48%", marginBottom: 16 }}
                      />
                    )}
                    keyExtractor={(item, index) => item.id ?? index.toString()}
                    numColumns={2}
                    columnWrapperStyle={{
                      justifyContent: "space-between",
                    }}
                    scrollEnabled={false}
                  />
                </View>
              );
            }
            return null;
          }}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}
