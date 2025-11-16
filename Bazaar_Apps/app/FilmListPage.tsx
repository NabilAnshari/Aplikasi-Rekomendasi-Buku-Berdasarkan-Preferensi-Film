import {
  ActivityIndicator,
  FlatList,
  Image,
  ScrollView,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import { icons } from "@/constants/icons";
import React, {useEffect, useState} from "react";
import { useRouter } from "expo-router";
import MovieCard from "@/components/MovieCard";
import useFetch from "@/services/useFetch";
import { fetchMovies } from "@/services/moviesApi";

export default function FilmListPage() {
  const router = useRouter();

  const {
    data: movies,
    loading: moviesLoading,
    error: moviesError,
  } = useFetch(() =>
    fetchMovies({
      query: "",
    })
  );

  useEffect

  return (
    <View className="flex-1 bg-white">
      <ScrollView
        className="flex-1 px-5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          minHeight: "100%",
          paddingBottom: 10,
        }}
      >
        <View className="flex-row items-center justify-between mt-10 mb-3">
          <Image source={icons.logo} className="w-12 h-10" />

          <Text className="text-2xl font-bold text-gray-800">FilmList</Text>

          <TouchableOpacity onPress={() => router.replace("/searchMovies")}>
            <Image
              source={icons.search}
              className="w-6 h-6"
              style={{ tintColor: "black" }}
            />
          </TouchableOpacity>
        </View>

        {moviesLoading ? (
          <ActivityIndicator
            size="large"
            color="#0000ff"
            className="mt-10 self-center"
          />
        ) : moviesError ? (
          <Text className="text-gray-700 mt-5 text-center">
            Error: {moviesError?.message}
          </Text>
        ) : (
          <View className="flex-1 mt-5">
              <Text className="text-lg font-semibold text-gray-700 mb-2">
                Choose a Movie for
              </Text>
              <Text className="text-lg font-semibold text-purple-600 mb-2">
                Book Recommendations
              </Text>
              <View className="h-[2px] bg-purple-600 mb-4 w-full" />
            <FlatList
              data={movies}
              renderItem={({ item }) => <MovieCard {...item} />}
              keyExtractor={(item) => item.id.toString()}
              numColumns={3}
              columnWrapperStyle={{
                justifyContent: "flex-start",
                gap: 20,
                paddingRight: 5,
                marginBottom: 10,
              }}
              className="mt-2 pb-32"
              scrollEnabled={false}
            />
          </View>
        )}
      </ScrollView>
    </View>
  );
}
