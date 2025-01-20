import { Image, StyleSheet, View, ScrollView } from "react-native";
import { Text, useTheme } from "react-native-paper";

export default function HomeScreen() {
  const theme = useTheme();
  return (
    <ScrollView>
      <View style={{ height: 250 }}>
        <Image
          source={require("@/assets/images/Main-Page.png")}
          style={{ width: "100%", height: "100%" }}
          resizeMode="cover"
        />
      </View>
      <View style={{ padding: 32 }}>
        <Text variant="headlineMedium">Welcome!</Text>
        <Text variant="bodyMedium">5분 덮밥 JMT (소개글 추가)</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
});
