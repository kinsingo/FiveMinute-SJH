import React, { useContext } from "react";
import { ScrollView } from "react-native";
import ThemeModeContext from "@/store/context/ThemeModeContext";
import { ScrollViewProps } from "react-native";

interface MyScrollViewProps extends ScrollViewProps {
  children: React.ReactNode;
}

export function MyHorizontalScrollView({ children, ...props }: MyScrollViewProps) {
  const { isThemeDark } = useContext(ThemeModeContext);
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={true}
      indicatorStyle={isThemeDark ? "white" : "black"}
      {...props}
    >
      {children}
    </ScrollView>
  );
}

export function MyVerticalScrollView({ children, ...props }: MyScrollViewProps) {
  const { isThemeDark } = useContext(ThemeModeContext);
  return (
    <ScrollView
      showsVerticalScrollIndicator={true}
      indicatorStyle={isThemeDark ? "white" : "black"}
      {...props}
    >
      {children}
    </ScrollView>
  );
}
