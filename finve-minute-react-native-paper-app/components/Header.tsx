import React, { useState, useContext } from "react";
import { useTheme, Appbar, Switch, Text, Menu } from "react-native-paper";
import ThemeModeContext from "../context/ThemeModeContext";
import { getHeaderTitle } from "@react-navigation/elements";

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
      {/* 뒤로 가기 버튼 */}
      {back ? <Appbar.BackAction onPress={navigation.goBack} /> : null}

      {/* 헤더 타이틀 */}
      <Appbar.Content title={title} />

      {/* 테마 전환 스위치 */}
      <Text style={{ marginHorizontal: 5 }}>{isThemeDark ? "Dark" : "Light"}</Text>
      <Switch color={"red"} value={isThemeDark} onValueChange={toggleTheme} />

      {/* 메뉴 버튼 */}
      {!back && (
        <Menu
          visible={menuVisible}
          onDismiss={closeMenu}
          anchor={
            <Appbar.Action
              icon="dots-vertical"
              onPress={openMenu}
            />
          }
        >
          <Menu.Item
            onPress={() => {
              console.log("Option 1 was pressed");
            }}
            title="Option 1"
          />
          <Menu.Item
            onPress={() => {
              console.log("Option 2 was pressed");
            }}
            title="Option 2"
          />
          <Menu.Item
            onPress={() => {
              console.log("Option 3 was pressed");
            }}
            title="Option 3"
            disabled
          />
        </Menu>
      )}
    </Appbar.Header>
  );
}
