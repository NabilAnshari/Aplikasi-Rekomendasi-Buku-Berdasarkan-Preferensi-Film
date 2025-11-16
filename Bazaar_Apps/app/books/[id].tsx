import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect } from "react";
import { router, useLocalSearchParams } from "expo-router";
import useFetch from "@/services/useFetch";
import { fetchBookDetails } from "@/services/googleBooksApi";
import {
  addFavorite,
  removeFavorite,
  isBookFavorited,
} from "@/services/favoriteApi";
import {
  updateClickDetail,
  updateAddFavorite,
} from "@/services/UserActivityApi";
import { icons } from "@/constants/icons";
import { FontAwesome } from "@expo/vector-icons";
import { FontAwesome6 } from "@expo/vector-icons";

interface InfoProps {
  label: string;
  value?: string | number | null;
}

const InfoRow = ({ label, value }: InfoProps) => {
  if (!value) return null;
  return (
    <View className="mt-5">
      <Text className="text-black font-bold text-lg">{label}</Text>
      <Text className="text-gray-700 text-base mt-1 leading-6">{value}</Text>
    </View>
  );
};

const BookDetails = () => {
  const { id } = useLocalSearchParams();
  const { data: book, loading } = useFetch(() =>
    fetchBookDetails(id as string)
  );

  const [favorited, setFavorited] = useState(false);

  useEffect(() => {
    if (!book?.id) return;
    const init = async () => {
      try {
        await updateClickDetail(book);
        const exists = await isBookFavorited(book.id);
        setFavorited(exists);
      } catch (err) {
        console.error("Init BookDetails error:", err);
      }
    };
    init();
  }, [book?.id]);

  const toggleFavorite = async () => {
    if (!book?.id) return;
    try {
      if (favorited) {
        await removeFavorite(book.id);
        setFavorited(false);
      } else {
        await addFavorite(book.id);
        setFavorited(true);
        await updateAddFavorite(book);
      }
    } catch (err) {
      console.error("Failed toggle favorite:", err);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white mt-10">
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text className="text-black mt-2">Loading book details...</Text>
      </View>
    );
  }

  if (!book) {
    return (
      <View className="flex-1 items-center justify-center bg-white ">
        <Text className="text-black text-lg">Book details not found.</Text>
        <TouchableOpacity
          className="mt-4 px-5 py-3 bg-accent rounded-lg"
          onPress={router.back}
        >
          <Text className="text-white text-base font-semibold">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white mt-7">
      <ScrollView contentContainerStyle={{ paddingBottom: 50 }}>
        {/* Cover Buku */}
        <View className="relative items-center mt-10">
          {book.imageLinks?.thumbnail && (
            <Image
              source={{ uri: book.imageLinks.thumbnail }}
              className="w-[50%] aspect-[3/4] rounded-xl mt-10"
              resizeMode="cover"
            />
          )}

          <View className="absolute top-[-40] left-0 right-0 flex-row justify-between px-6 mt-8 w-full">
            <TouchableOpacity
              onPress={router.back}
              className="bg-white/90 rounded-full p-2 shadow"
            >
              <FontAwesome6 name="arrow-left" size={22} color="black" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={toggleFavorite}
              className="bg-white/90 rounded-full p-2 shadow"
            >
              <FontAwesome
                name={favorited ? "heart" : "heart-o"}
                size={20}
                color="#7C3AED"
              />
            </TouchableOpacity>
          </View>
        </View>

        <View className="px-6 mt-8">
          <Text className="text-black font-bold text-2xl mb-3">
            {book.title || "No Title"}
          </Text>

          <Text
            className="text-gray-700 text-base leading-6 mb-5"
            style={{ textAlign: "justify" }}  
          >
            {book.description || "No description available for this book."}
          </Text>


          <InfoRow
            label="Genre"
            value={book.categories?.length ? book.categories.join(", ") : "N/A"}
          />
          <InfoRow
            label="Author"
            value={book.authors?.join(", ") || "Unknown"}
          />
          <InfoRow
            label="Published"
            value={book.publishedDate ? book.publishedDate.split("-")[0] : "N/A"}
          />
          <InfoRow label="Publisher" value={book.publisher || "N/A"} />
          <InfoRow
            label="Pages"
            value={book.pageCount ? `${book.pageCount} pages` : "N/A"}
          />

          {book.averageRating && (
            <View className="flex-row items-center mt-6">
              <Image source={icons.star} className="w-5 h-5 mr-2" />
              <Text className="text-black text-base">
                {book.averageRating}/5 ({book.ratingsCount || 0} ratings)
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default BookDetails;
