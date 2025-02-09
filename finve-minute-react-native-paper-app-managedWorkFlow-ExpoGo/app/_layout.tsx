import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useColorScheme } from "react-native";
import { useFonts } from "expo-font";
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
import { Drawer } from "expo-router/drawer";
import { GestureHandlerRootView } from "react-native-gesture-handler";

SplashScreen.preventAutoHideAsync(); // Prevent the splash screen from auto-hiding before asset loading is complete.

const { LightTheme, DarkTheme } = adaptNavigationTheme({
  reactNavigationLight: NavigationDefaultTheme,
  reactNavigationDark: NavigationDarkTheme,
});

const CombinedDefaultTheme = merge(MD3LightTheme, LightTheme) as any;
const CombinedDarkTheme = merge(MD3DarkTheme, DarkTheme) as any;

export default function RootLayout() {
  const systemColorScheme = useColorScheme(); // ✅ 현재 시스템의 테마 감지
  const [isThemeDark, setIsThemeDark] = useState(systemColorScheme == "dark");
  const theme = isThemeDark ? CombinedDarkTheme : CombinedDefaultTheme;

  const toggleTheme = useCallback(() => {
    return setIsThemeDark((prev) => !prev);
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

  useEffect(() => {
    setIsThemeDark(systemColorScheme === "dark");
  }, [systemColorScheme]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeModeContext.Provider value={preferences}>
      <PaperProvider theme={theme}>
        <ThemeProvider value={theme}>
          <AuthContextProvider>
            <GestureHandlerRootView style={{ flex: 1 }}>
              <Drawer screenOptions={{ header: (props) => <Header {...props} /> }}>
                <Drawer.Screen name="(tabs)" options={{ title: "5분덮밥" }} />
                <Drawer.Screen name="attendance" options={{ title: "근태관리" }} />
                <Drawer.Screen name="inventory" options={{ title: "재고관리" }} />
                <Drawer.Screen name="todo" options={{ title: "지시사항" }} />
              </Drawer>
            </GestureHandlerRootView>
            <StatusBar style={isThemeDark ? "light" : "dark"} />
          </AuthContextProvider>
        </ThemeProvider>
      </PaperProvider>
    </ThemeModeContext.Provider>
  );
}
