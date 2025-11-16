import api from "./api";
export const updateClickDetail = async (book: BookDetails) => {
  await api.post("/books/feedback", {
    book_id: book.id,
    title: book.title,
    authors: book.authors ?? [],
    cover_url: book.imageLinks?.thumbnail ?? "",
    type: "detail",
  });
};

export const updateAddFavorite = async (book: BookDetails) => {
  await api.post("/books/feedback", {
    book_id: book.id,
    title: book.title,
    authors: book.authors ?? [],
    cover_url: book.imageLinks?.thumbnail ?? "",
    type: "favorite",
  });
};

export const getTrendingBooks = async (): Promise<TrendingBook[]> => {
  const res = await api.get("/books/trending");
  return res.data;
};
