import {
  View,
  StyleSheet,
  ImageBackground,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { Card } from "react-native-paper";
import React from "react";
import useAuthForm from "@/hooks/useAuthForm";
import AccountDeletionDialog from "@/components/authentication/AccountDeletionDialog";
import AccountSetup from "@/components/authentication/AccountSetup";
import AccountTextInputs from "@/components/authentication/AccountTextInputs";
import AccountHeader from "@/components/authentication/AccountHeader";
import LoginLogoutButton from "@/components/authentication/LoginLogoutButton";

export default function SignInScreen() {
  const {
    auth,
    email,
    setEmail,
    password,
    setPassword,
    loading,
    showPassword,
    togglePasswordVisibility,
    actionMessage,
    handleSignIn,
    setLoading,
    setActionMessage,
  } = useAuthForm();

  return (
    <ImageBackground
      source={require("../../../assets/images/Five-Min-Auth-Transparent.png")} // 배경 이미지 URL
      style={styles.background}
      resizeMode="cover" // 이미지가 화면을 덮도록 설정
    >
      <View style={styles.container}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <Card style={styles.card}>
            <AccountHeader actionMessage={actionMessage} />
            <View style={styles.form}>
              {!auth.isLogin && (
                <AccountTextInputs
                  email={email}
                  setEmail={setEmail}
                  password={password}
                  setPassword={setPassword}
                  loading={loading}
                  showPassword={showPassword}
                  togglePasswordVisibility={togglePasswordVisibility}
                />
              )}
              <LoginLogoutButton auth={auth} loading={loading} handleSignIn={handleSignIn} />
            </View>
            {!auth.isLogin && (
              <View style={styles.footer}>
                <AccountSetup />
              </View>
            )}
            {auth.isLogin && (
              <View style={styles.footer}>
                <AccountDeletionDialog
                  auth={auth}
                  setLoading={setLoading}
                  setActionMessage={setActionMessage}
                />
              </View>
            )}
          </Card>
        </TouchableWithoutFeedback>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  card: {
    maxWidth: 400,
    maxHeight: 450,
    padding: 16,
    borderRadius: 8,
    elevation: 4,
    justifyContent: "center",
  },
  form: {
    marginBottom: 16,
  },
  footer: {
    alignItems: "center",
  },
});
