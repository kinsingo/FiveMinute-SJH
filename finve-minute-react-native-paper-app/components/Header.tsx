import React, { useState, useContext } from "react";
import { useTheme, Appbar, Switch, Text, Menu } from "react-native-paper";
import ThemeModeContext from "../store/context/ThemeModeContext";
import { getHeaderTitle } from "@react-navigation/elements";
import * as WebBrowser from "expo-web-browser";

export default function Header({ navigation, route, options, back }: any) {
  const theme = useTheme();
  const { toggleTheme, isThemeDark } = useContext(ThemeModeContext);

  const [menuVisible, setMenuVisible] = useState(false);

  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

  const title = getHeaderTitle(options, route.name);

  return (
    <Appbar.Header
      theme={{
        colors: {
          primary: theme.colors.surface,
        },
      }}
    >

      {back ? (
           /* 뒤로 가기 버튼 */
        <Appbar.BackAction onPress={navigation.goBack} />
      ) : (
        /* 햄버거 버튼 (Drawer 열기) */
        <Appbar.Action icon="menu" onPress={navigation.openDrawer} />
      )}

      {/* 헤더 타이틀 */}
      <Appbar.Content title={title} />

      {/* 테마 전환 스위치 */}
      <Text style={{ marginHorizontal: 5 }}>{isThemeDark ? "Dark" : "Light"}</Text>
      <Switch value={isThemeDark} onValueChange={toggleTheme} />

      {/* 메뉴 버튼 */}
      {!back && (
        <Menu
          visible={menuVisible}
          onDismiss={closeMenu}
          anchor={<Appbar.Action icon="dots-vertical" onPress={openMenu} />}
          anchorPosition="bottom"
          mode="elevated"
        >
          <Menu.Item
            leadingIcon={"web"}
            onPress={() => {
              WebBrowser.openBrowserAsync("https://www.5minbowl.com");
            }}
            title="5분 덮밥 Website"
          />
          <Menu.Item
            leadingIcon={"check"}
            onPress={() => {
              console.log("Option 2 was pressed");
            }}
            title="TBD"
            disabled
          />
        </Menu>
      )}
    </Appbar.Header>
  );
}
