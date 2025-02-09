import React from "react";
import { ScrollView, View, StyleSheet } from "react-native";
import { RadioButton, Text } from "react-native-paper";

export const categories: string[] = [
  "전부 다 보기",
  "주재료",
  "야채",
  "소스",
  "조미료",
  "냉동식품",
  "기타식재료",
  "음료",
  "에이드소스",
  "포장용기",
  "기타",
  "직원간식",
];

interface CategorySelectorProps {
  isThemeDark: boolean;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
}

export default function CategorySelector({
  isThemeDark,
  selectedCategory,
  setSelectedCategory,
}: CategorySelectorProps) {
  return (
    <View style={{ paddingVertical: 5 }}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={true}
        indicatorStyle={isThemeDark ? "white" : "black"}
      >
        <RadioButton.Group
          onValueChange={(value) => setSelectedCategory(value)}
          value={selectedCategory}
        >
          <View style={styles.radioContainer}>
            {categories.map((category) => (
              <View key={category} style={styles.radioButtonItem}>
                <RadioButton.Android value={category} />
                <Text>{category}</Text>
              </View>
            ))}
          </View>
        </RadioButton.Group>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  radioContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
  },
  radioButtonItem: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 10,
  },
});
