import AsyncStorage from "@react-native-async-storage/async-storage";

const ACCESS_TOKEN = "accessToken";
const REFRESH_TOKEN = "refreshToken";

export const saveTokens = async (accessToken: string, refreshToken: string) => {
  await AsyncStorage.setItem(ACCESS_TOKEN, accessToken);
  await AsyncStorage.setItem(REFRESH_TOKEN, refreshToken);
};

export const getTokens = async () => {
  const accessToken = await AsyncStorage.getItem(ACCESS_TOKEN);
  const refreshToken = await AsyncStorage.getItem(REFRESH_TOKEN);
  // console.log(accessToken, refreshToken);
  return { accessToken, refreshToken };
};

export const clearTokens = async () => {
  await AsyncStorage.removeItem(ACCESS_TOKEN);
  await AsyncStorage.removeItem(REFRESH_TOKEN);
};