import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";
import {
  PaperProvider,
  MD3DarkTheme,
  MD3LightTheme,
  adaptNavigationTheme,
} from "react-native-paper";
import merge from "deepmerge";
import { useState, useCallback, useMemo } from "react";
import ThemeModeContext from "../store/context/ThemeModeContext";
import Header from "../components/Header";
import AuthContextProvider from "../store/context/AuthContext";
// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const { LightTheme, DarkTheme } = adaptNavigationTheme({
  reactNavigationLight: NavigationDefaultTheme,
  reactNavigationDark: NavigationDarkTheme,
});

const CombinedDefaultTheme = merge(MD3LightTheme, LightTheme) as any;
const CombinedDarkTheme = merge(MD3DarkTheme, DarkTheme) as any;

export default function RootLayout() {
  const [isThemeDark, setIsThemeDark] = useState(false);

  const theme = isThemeDark ? CombinedDarkTheme : CombinedDefaultTheme;

  const toggleTheme = useCallback(() => {
    return setIsThemeDark(!isThemeDark);
  }, [isThemeDark]);

  const preferences = useMemo(
    () => ({
      toggleTheme,
      isThemeDark,
    }),
    [toggleTheme, isThemeDark]
  );

  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeModeContext.Provider value={preferences}>
      <PaperProvider theme={theme}>
        <ThemeProvider value={theme}>
          <AuthContextProvider>
            <Stack
              screenOptions={{
                header: (props) => <Header {...props} />, // Header를 각 스크린에 적용
              }}
            >
              <Stack.Screen
                name="(tabs)"
                options={{ headerShown: true, title: "5분 덮밥" }}
              />
              <Stack.Screen name="+not-found" />
            </Stack>
            <StatusBar style={isThemeDark ? "light" : "dark"} />
          </AuthContextProvider>
        </ThemeProvider>
      </PaperProvider>
    </ThemeModeContext.Provider>
  );
}
