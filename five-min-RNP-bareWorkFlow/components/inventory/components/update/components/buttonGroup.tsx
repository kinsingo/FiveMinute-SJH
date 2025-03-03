import React from "react";
import { View, StyleSheet } from "react-native";
import { Button } from "react-native-paper";

interface ButtonGroupProps {
  resetData: () => void;
  reload: () => void;
  uploadData: () => void;
  isUploading: boolean;
}

export default function ButtonGroup({
  resetData,
  reload,
  uploadData,
  isUploading,
}: ButtonGroupProps) {
  return (
    <View style={styles.buttonContainer}>
      <View style={styles.buttonContainer_rows}>
        <Button mode="outlined" onPress={resetData}>
          {"데이터 초기화"}
        </Button>
        <Button mode="outlined" onPress={reload}>
          최신 데이터 불러오기
        </Button>
      </View>
      <Button mode="contained-tonal" onPress={uploadData}>
        {isUploading ? "데이터 업로드중.." : "데이터 업로드"}
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: "column",
    gap: 5,
    marginHorizontal: 27,
    marginVertical: 10,
  },
  buttonContainer_rows: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
