export const GOOGLE_BOOKS_CONFIG = {
  BASE_URL: "https://www.googleapis.com/books/v1/",
  API_KEY: process.env.EXPO_PUBLIC_GOOGLE_BOOKS_API_KEY,
};

export const fetchBooks = async ({
  query,
  startIndex = 0,
  maxResults = 10,
}: {
  query?: string;
  startIndex?: number;
  maxResults?: number;
}) => {
  const safeQuery =
    query && query.trim() !== "" ? query : "subject:fiction";

  const endpoint = `${GOOGLE_BOOKS_CONFIG.BASE_URL}volumes?q=${encodeURIComponent(
    safeQuery
  )}&orderBy=newest&startIndex=${startIndex}&maxResults=${maxResults}&key=${
    GOOGLE_BOOKS_CONFIG.API_KEY
  }`;

  console.log("Fetching:", endpoint);

  const response = await fetch(endpoint, { method: "GET" });
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(
      `Google Books API error ${response.status}: ${
        errorData?.error?.message || response.statusText
      }`
    );
  }

  const data = await response.json();
  return data.items || [];
};

export const fetchBookDetails = async (id: string): Promise<BookDetails> => {
  const endpoint = `${GOOGLE_BOOKS_CONFIG.BASE_URL}volumes/${id}?key=${GOOGLE_BOOKS_CONFIG.API_KEY}`;

  const response = await fetch(endpoint);
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(
      `Google Books API error ${response.status}: ${
        errorData?.error?.message || response.statusText
      }`
    );
  }

  const data = await response.json();
  return {
    id: data.id,
    ...(data.volumeInfo as VolumeInfo),
  };
};

export const fetchBooksByCategory = async (category: string) => {
  const endpoint = `${GOOGLE_BOOKS_CONFIG.BASE_URL}volumes?q=subject:${encodeURIComponent(
    category
  )}&maxResults=20&key=${GOOGLE_BOOKS_CONFIG.API_KEY}`;

  const response = await fetch(endpoint);
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(
      `Google Books API error ${response.status}: ${
        errorData?.error?.message || response.statusText
      }`
    );
  }

  const data = await response.json();
  return data.items || [];
};
