import { View, StyleSheet } from "react-native";
import { Text, useTheme } from "react-native-paper";
import React from "react";

export default function AccountHeader({
  actionMessage,
}: {
  actionMessage: { message: string; success: boolean; subMessage: string };
}) {
  const theme = useTheme();
  return (
    <View style={styles.header}>
      <Text
        variant="headlineMedium"
        style={[styles.headerText, { backgroundColor: theme.colors.primaryContainer }]}
      >
        5분 덮밥
      </Text>
      <Text variant="bodyMedium" style={styles.subHeaderText}>
        Enter your email and password to sign in
      </Text>
      {actionMessage.message ? (
        <Text
          style={[
            styles.actionMessage,
            {
              color: actionMessage.success ? theme.colors.primary : theme.colors.error,
            },
          ]}
        >
          {actionMessage.message}
          {"\n"}
          {actionMessage.subMessage}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: "center",
    marginBottom: 16,
  },
  headerText: {
    fontWeight: "bold",
    width: "100%",
    textAlign: "center",
    padding: 16,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  subHeaderText: {
    color: "#888",
    marginTop: 8,
  },
  actionMessage: {
    marginTop: 8,
    color: "#d32f2f",
    textAlign: "center",
  },
});
