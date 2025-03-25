import {  Button, Text, useTheme} from "react-native-paper";
import React from "react";
import { AuthContextType } from "@/store/context/AuthContext";


interface Props {
  auth: AuthContextType;
  loading: boolean;
  handleSignIn: () => Promise<void>;
}

export default function LoginLogoutButton({ auth, loading, handleSignIn }: Props) {
  const theme = useTheme();

  return (
    <Button
      onPress={handleSignIn}
      style={{ backgroundColor: theme.colors.primaryContainer }}
      disabled={loading}
    >
      <Text variant="bodyLarge" style={{ fontWeight: "bold" }}>
        {auth.isLogin && "로그아웃"}
        {!auth.isLogin && "로그인"}
      </Text>
    </Button>
  );
}
