import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "./api";
import { saveTokens, clearTokens, getTokens } from "./storage";
import { router } from "expo-router";

export const login = async (email: string, password: string) => {
  const res = await api.post("/login", { email, password });
  const { accessToken, refreshToken, user } = res.data;

  await saveTokens(accessToken, refreshToken);
  await AsyncStorage.setItem("user_role", user.role);

  return user;
};

export const register = async (
  name: string,
  email: string,
  password: string,
  confPassword: string
) => {
  const res = await api.post("/users", { name, email, password, confPassword });
  return res.data;
};

export const getUsers = async () => {
  const { accessToken } = await getTokens();
  const res = await api.get("/users", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return res.data;
};

export const getMe = async () => {
  const { accessToken } = await getTokens();
  if (!accessToken) throw new Error("No access token");
  const res = await api.get("/me", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return res.data;
};

export const refreshToken = async () => {
  const { refreshToken } = await getTokens();
  if (!refreshToken) throw new Error("No refresh token found");

  const res = await api.get("/token", {
    headers: { Authorization: `Bearer ${refreshToken}` },
  });
  const { accessToken } = res.data;
  await saveTokens(accessToken, refreshToken);
  return accessToken;
};

export const logout = async () => {
  try {
    const {refreshToken} = await getTokens();
    if (refreshToken) {
      await api.delete("/logout", { data: { token: refreshToken }});
    }
    await clearTokens();
    router.replace("/login");
  } catch (err) {
    console.error("Logout error:", err);
  }
};

export const updateUser = async (id: number, data: any) => {
  const { accessToken } = await getTokens();
  const res = await api.patch(`/users/${id}`, data, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return res.data;
};

export const deleteUser = async (id: number) => {
  const { accessToken } = await getTokens();
  const res = await api.delete(`/admin/users/${id}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return res.data;
};

export const updateUserByAdmin = async (id: number, data: any) => {
  const { accessToken } = await getTokens();
  const res = await api.patch(`/admin/users/${id}`, data, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return res.data;
};
