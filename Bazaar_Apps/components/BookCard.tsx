import { useRouter } from "expo-router";
import {
  Text,
  Image,
  TouchableOpacity,
  View,
  StyleProp,
  ViewStyle,
} from "react-native";

interface BookCardProps {
  book: Book;
  style?: StyleProp<ViewStyle>;
}

const BookCard: React.FC<BookCardProps> = ({ book, style }) => {
  const router = useRouter();
  const { id, volumeInfo } = book;
  const { title, authors, publishedDate, imageLinks } = volumeInfo;

  return (
    <TouchableOpacity
      style={[{ marginBottom: 16 }, style]} 
      onPress={() =>
        router.push({
          pathname: "/books/[id]", 
          params: { id }, 
        })
      }
    >
      <Image
        source={{
          uri:
            imageLinks?.thumbnail ??
            "https://placehold.co/200x300/cccccc/000000?text=No+Image",
        }}
        style={{
          width: "100%",
          height: 200, 
          borderRadius: 8,
        }}
        resizeMode="cover"
      />

      <Text
        style={{
          fontSize: 14,
          fontWeight: "bold",
          color: "black",
          marginTop: 8,
        }}
        numberOfLines={2}
      >
        {title}
      </Text>

      {authors && authors.length > 0 && (
        <Text
          style={{ fontSize: 12, color: "gray", marginTop: 2 }}
          numberOfLines={1}
        >
          {authors.join(", ")}
        </Text>
      )}

      {publishedDate && (
        <View style={{ marginTop: 2 }}>
          <Text style={{ fontSize: 12, color: "gray" }}>
            {publishedDate.split("-")[0]}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default BookCard;
