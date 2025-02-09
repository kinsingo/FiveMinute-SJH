import React, {useState, useEffect} from "react";
import { StyleSheet, View, Alert } from "react-native";
import { useScanBLEs, validIbeaconE7Name } from "@/hooks/useScanBLEs";
import { Button, Card, Text, RadioButton } from "react-native-paper";

export default function WorkAttendanceScreen() {
  const [selectedLocation, setSelectedLocation] = useState<validIbeaconE7Name>("5minGN");
  const { IsVaidArea, isScanning, setValidBeaconName } = useScanBLEs();

  useEffect(() => {
    setValidBeaconName(selectedLocation);
  }, [selectedLocation, setValidBeaconName]);

  async function CheckinForWork() {
    if (await IsVaidArea()) {
      Alert.alert("출근 완료", "출근이 정상적으로 처리되었습니다.");
    } else {
      Alert.alert("출근 실패", "올바른 위치에 있지 않습니다. 가게 근처로 이동해주세요.");
    }
  }

  async function CheckoutForWork() {
    if (await IsVaidArea()) {
      Alert.alert("퇴근 완료", "퇴근이 정상적으로 처리되었습니다.");
    } else {
      Alert.alert("퇴근 실패", "올바른 위치에 있지 않습니다. 가게 근처로 이동해주세요.");
    }
  }

  return (
    <View style={styles.container}>
      <Card style={styles.card} mode="contained">
        <Card.Content>
          <Text variant="titleLarge" style={styles.title}>
            근태 관리
          </Text>

       {/* ✅ 라디오 버튼 그룹 */}
       <RadioButton.Group
            onValueChange={(value) => setSelectedLocation(value as validIbeaconE7Name)}
            value={selectedLocation}
          >
            <View style={styles.radioContainer} >
              <RadioButton.Item label="강남점" value="5minGN" disabled={isScanning} />
              <RadioButton.Item label="수내점" value="5minSN" disabled={isScanning} />
              <RadioButton.Item label="관악점" value="5minSL" disabled={isScanning} />
            </View>
          </RadioButton.Group>

          <Button
            onPress={CheckinForWork}
            mode="contained"
            icon="briefcase-check"
            style={[styles.button]}
            disabled={isScanning}
          >
            출근
          </Button>
          <Button
            onPress={CheckoutForWork}
            mode="elevated"
            icon="logout"
            style={[styles.button]}
            disabled={isScanning}
          >
            퇴근
          </Button>
        </Card.Content>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: 300,
    padding: 20,
    borderRadius: 12,
    elevation: 5,
  },
  title: {
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  radioContainer: {
    marginBottom: 20,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  button: {
    width: "100%",
    marginVertical: 10,
  },
});
