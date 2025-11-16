import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "./globals.css";

export default function RootLayout() {
  return (
    <>
      <StatusBar style="auto"hidden={true}/>
      <Stack
      >
        {/* Login & Register */}
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="register" options={{ headerShown: false }} />
        <Stack.Screen name="FilmListPage" options={{ headerShown: false }} />
        <Stack.Screen name="recommendations" options={{ headerShown: false }} />
        <Stack.Screen
          name="(tabs)"
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="books/[id]"
          options={{headerShown: false}}
        />
        <Stack.Screen name="admin/dashboard" options={{ headerShown: false }} />
        <Stack.Screen name="admin/editUser" options={{ headerShown: false }} />

        {/* Dashboard (home) */}
        <Stack.Screen name="searchMovies" options={{ headerShown: false }} />
        <Stack.Screen name="searchBooks" options={{ headerShown: false }} />
        <Stack.Screen name="editProfile" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}
