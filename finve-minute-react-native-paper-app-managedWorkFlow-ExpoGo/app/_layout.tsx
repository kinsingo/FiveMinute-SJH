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

const CustomDefaultTheme = {
  ...CombinedDefaultTheme,
  colors: {
    ...CombinedDefaultTheme.colors,
    "tertiary": "rgb(0, 99, 154)",
    "tertiaryContainer": "rgb(206, 229, 255)",
    "onTertiaryContainer": "rgb(0, 29, 50)",
    "kakaotalk": "rgb(95, 98, 0)",
    "onKakaotalk": "rgb(255, 255, 255)",
    "kakaotalkContainer": "rgb(229, 234, 93)",
    "onKakaotalkContainer": "rgb(28, 29, 0)",
    "male": "rgb(0, 99, 154)",
    "onMale": "rgb(255, 255, 255)",
    "maleContainer": "rgb(206, 229, 255)",
    "onMaleContainer": "rgb(0, 29, 50)",
    "female": "rgb(185, 12, 85)",
    "onFemale": "rgb(255, 255, 255)",
    "femaleContainer": "rgb(255, 217, 223)",
    "onFemaleContainer": "rgb(63, 0, 24)"
  }, // Copy it from the color codes scheme and then use it here
};

const CustomDarkTheme = {
  ...CombinedDarkTheme,
  colors: {
    ...CombinedDarkTheme.colors,
    "tertiary": "rgb(150, 204, 255)",
    "tertiaryContainer": "rgb(0, 74, 117)",
    "onTertiaryContainer": "rgb(206, 229, 255)",
    "kakaotalk": "rgb(200, 206, 68)",
    "onKakaotalk": "rgb(49, 51, 0)",
    "kakaotalkContainer": "rgb(71, 74, 0)",
    "onKakaotalkContainer": "rgb(229, 234, 93)",
    "male": "rgb(150, 204, 255)",
    "onMale": "rgb(0, 51, 83)",
    "maleContainer": "rgb(0, 74, 117)",
    "onMaleContainer": "rgb(206, 229, 255)",
    "female": "rgb(255, 177, 194)",
    "onFemale": "rgb(102, 0, 43)",
    "femaleContainer": "rgb(143, 0, 63)",
    "onFemaleContainer": "rgb(255, 217, 223)"
  }, // Copy it from the color codes scheme and then use it here
};

export default function RootLayout() {
  const systemColorScheme = useColorScheme(); // ✅ 현재 시스템의 테마 감지
  const [isThemeDark, setIsThemeDark] = useState(systemColorScheme == "dark");
  const theme = isThemeDark ? CustomDarkTheme : CustomDefaultTheme;

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
                <Drawer.Screen name="account" options={{ title: "계정관리" }} />
              </Drawer>
            </GestureHandlerRootView>
            <StatusBar style={isThemeDark ? "light" : "dark"} />
          </AuthContextProvider>
        </ThemeProvider>
      </PaperProvider>
    </ThemeModeContext.Provider>
  );
}
