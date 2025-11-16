import {
  ActivityIndicator,
  FlatList,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import React, { useEffect } from "react";
import BookCard from "@/components/BookCard";
import useFetch from "@/services/useFetch";
import { fetchBooks } from "@/services/googleBooksApi";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import RecommendCard from "./RecommendCard";

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

interface Props {
  books: Book[];
}

const RecommendationIndex: React.FC<Props> = ({ books }) => {
  const router = useRouter();

  return (
    <View>
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-lg text-black font-bold mb-3">Book Recommendation</Text>
        <TouchableOpacity onPress={() => router.push("/recommendations")}>
          <Text>See All</Text>
        </TouchableOpacity>
      </View>

      {books.length === 0 ? (
        <TouchableOpacity
          onPress={() => router.push("/FilmListPage")}
          className="flex-row items-center bg-white rounded-lg p-4 shadow mb-0"
        >
          <View className="w-12 h-12 rounded-full bg-purple-100 items-center justify-center">
            <Ionicons name="star" size={24} color="#7C3AED" />
          </View>

          <View className="ml-4 flex-">
            <Text className="text-gray-800 font-semibold text-base">
              Recommendation
            </Text>
            <Text className="text-gray-500 text-sm">Start Recommendation</Text>
          </View>

          <Ionicons name="chevron-forward" className="justify-items-end" size={20} color="#9CA3AF" />
        </TouchableOpacity>
      ) : (
      
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {books.slice(0, 4).map((book, index) => (
            <View
              key={book.id}
              style={{ marginRight: index === books.slice(0, 4).length - 1 ? 0 : -10 }} 
            >
              <RecommendCard book={book} style={{ width: 140 }} />
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

export default RecommendationIndex;
