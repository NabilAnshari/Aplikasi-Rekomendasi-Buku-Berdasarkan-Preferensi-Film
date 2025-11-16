// Representasi dasar dari buku
interface Book {
  id: string;
  volumeInfo: VolumeInfo;
}

// Detail volume buku
interface VolumeInfo {
  title: string;
  authors?: string[];
  publisher?: string;
  publishedDate?: string;
  description?: string;
  categories?: string[];
  averageRating?: number;
  ratingsCount?: number;
  pageCount?: number;
  language?: string;
  imageLinks?: ImageLinks;
  previewLink?: string;
  infoLink?: string;
}

// Gambar thumbnail
interface ImageLinks {
  smallThumbnail?: string;
  thumbnail?: string;
}

// Untuk trending/popular (opsional, kalau mau mirip TMDB Trending)
interface TrendingBook {
  searchTerm: string;
  book_id: string;
  title: string;
  count: number;
  thumbnail_url?: string;
}

// Detail buku, extend dari VolumeInfo biar ringkas
interface BookDetails {
  id: string;
  title: string;
  authors?: string[];
  publisher?: string;
  publishedDate?: string;
  description?: string;
  categories?: string[];
  averageRating?: number;
  ratingsCount?: number;
  pageCount?: number;
  language?: string;
  imageLinks?: ImageLinks;
  previewLink?: string;
  infoLink?: string;
}


// Props untuk kartu trending (kalau dipakai di UI)
interface TrendingCardProps {
  book: TrendingBook;
  index: number;
}

// Parameter untuk fetchBooks (query + pagination)
interface FetchBooksParams {
  query: string;
  startIndex?: number;  // pagination awal
  maxResults?: number;  // jumlah buku per request
}

