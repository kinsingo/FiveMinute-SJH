import { SafeAreaView, StyleSheet, View } from "react-native";
import { Card, Button } from "react-native-paper";

export default function LoginRequired({ title , router }:  { title:string, router: any }) {
  return (
    <SafeAreaView style={styles.centerContainer}>
      <Card style={styles.card}>
        <Card.Title title={title} subtitle={"로그인 후 이용 가능합니다"} subtitleStyle={{textAlign:"center"}} titleStyle={{textAlign:"center"}} />
        <Card.Cover
          source={require("../assets/images/android-chrome-512x512.png")}
          style={styles.cardCover}
        />
        <View style={{ justifyContent: "center", alignItems: "center", padding: 0 }}>
          <Card.Actions>
            <Button mode="contained" onPress={() => router.push("/(tabs)/authentication/login")}>
              로그인하러 가기
            </Button>
          </Card.Actions>
        </View>
      </Card>
    </SafeAreaView>
  );
}

// ✅ 스타일
const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: "80%",
    padding: 20,
  },
  cardCover: {
    height: 250,
    resizeMode: "center",
    backgroundColor: "transparent",
  },
  centerButton: {
    alignSelf: "center",
  },
});
