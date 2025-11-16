import { View, Text, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import useFetch from '@/services/useFetch';
import { fetchMovies } from '@/services/moviesApi';
import MovieCard from '@/components/MovieCard';
import SearchBar from '@/components/SearchBar';
import { useRouter } from 'expo-router';
import { FontAwesome6 } from '@expo/vector-icons';

const SearchMovies = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const {
    data: movies,
    loading,
    error,
    refetch: loadMovies,
    reset,
  } = useFetch(
    () =>
      fetchMovies({
        query: searchQuery,
      }),
    false
  );

  // pencarian otomatis setelah 500ms
  useEffect(() => {
    const timeOutId = setTimeout(async () => {
      if (searchQuery.trim()) {
        await loadMovies();
      } else {
        reset();
      }
    }, 500);

    return () => clearTimeout(timeOutId);
  }, [searchQuery]);

  return (
    <View className="flex-1 bg-white">
      <View className="flex-row items-center justify-between mt-16 mb-3 px-5">
        <TouchableOpacity onPress={() => router.back()}>
          <FontAwesome6 name="arrow-left" size={22} color="black" />
        </TouchableOpacity>

        <Text className="text-2xl font-bold text-gray-800">Search Movies</Text>

        <View style={{ width: 22 }} /> 
      </View>


      <FlatList
        data={movies}
        renderItem={({ item }) => <MovieCard {...item} />}
        keyExtractor={(item) => item.id.toString()}
        className="px-5"
        numColumns={3}
        columnWrapperStyle={{
          justifyContent: 'center',
          gap: 16,
          marginVertical: 16,
        }}
        contentContainerStyle={{
          paddingTop: 20, //
          paddingBottom: 100,
        }}
        ListHeaderComponent={
          <View className="mb-3">
            {/* Search Bar */}
            <View className="mb-2">
              <SearchBar
                placeholder="Search Movie..."
                value={searchQuery}
                onChangeText={(text: string) => setSearchQuery(text)}
              />
            </View>

            {/* Loading Indicator */}
            {loading && (
              <ActivityIndicator size="large" color="#6b21a8" className="my-3" />
            )}

            {error && (
              <Text className="text-red-500 text-center my-3 px-5">
                Error: {error.message}
              </Text>
            )}

            {!loading && !error && searchQuery.trim() && movies?.length > 0 && (
              <Text className="text-lg font-bold text-gray-800 text-center">
                Search Results for{' '}
                <Text className="text-violet-700">{searchQuery}</Text>
              </Text>
            )}
          </View>
        }
        ListEmptyComponent={
          !loading && !error ? (
            <View className="mt-10 px-5">
              <Text className="text-center text-gray-400">
                {searchQuery.trim() ? 'No Movies found' : 'Search for a movie'}
              </Text>
            </View>
          ) : null
        }
      />
    </View>
  );
};

export default SearchMovies;
