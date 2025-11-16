import api from "./api";
import { getMe } from "./auth";

export const addFavorite = async (bookApi: string) => {
  const user = await getMe();
  try {
    const res = await api.post("/favorite", {
      user_id: user.id,
      book_api: bookApi,
    });
    return res.data;
  } catch (err: any) {
    if (err.response) {
      console.error("error:", err.response.data);
      throw err;
    }
  }
};

export const removeFavorite = async (bookApi: string) => {
  const user = await getMe();
  const res = await api.delete("/favorite", {
    data: { user_id: user.id, book_api: bookApi },
  });
  return res.data;
};

export const isBookFavorited = async (bookApi: string) => {
  const user = await getMe();
  const res = await api.get(`/favorite/${user.id}`);
  const favorites = res.data.data;
  return favorites.some((fav: any) => fav.book_api === bookApi);
};