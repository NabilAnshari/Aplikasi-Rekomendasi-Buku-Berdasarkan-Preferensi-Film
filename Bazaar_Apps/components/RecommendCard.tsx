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

const RecommendCard: React.FC<BookCardProps> = ({ book, style }) => {
  const router = useRouter();
  const { id, volumeInfo } = book;
  const { title, authors, publishedDate, imageLinks } = volumeInfo;

  return (
    <TouchableOpacity
      style={[{ marginBottom: 3 }, style]} 
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
          width: "80%",
          height: 140, 
          borderRadius: 8,
        }}
        resizeMode="cover"
      />

      <Text
        style={{
          fontSize: 12,
          fontWeight: "bold",
          color: "black",
          marginTop: 8,
        }}
        numberOfLines={2}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default RecommendCard;
