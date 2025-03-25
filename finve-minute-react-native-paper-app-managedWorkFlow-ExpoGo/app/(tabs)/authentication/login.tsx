import { useState, useContext } from "react";
import ExternalLink from "@/components/ExternalLink";
import { View, StyleSheet, ImageBackground,Alert } from "react-native";
import { Card, TextInput, Button, Text, useTheme } from "react-native-paper";
import { AuthContext } from "@/store/context/AuthContext";
import { useRouter } from "expo-router";
import React from "react";

export default function SignInScreen() {
  const theme = useTheme();
  const [email, setEmail] = useState({ value: "", IsValid: true });
  const [password, setPassword] = useState({ value: "", IsValid: true });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const auth = useContext(AuthContext);
  const router = useRouter();
  const [actionMessage, setActionMessage] = useState({
    success: true,
    message: "",
    subMessage: "",
  });

 
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev); // true <-> false 토글
  };

  const handleSignIn = async () => {
    // 로그인 상태에서 로그아웃
    if (auth.isLogin) {
      setLoading(true);
      const success = await auth.logout();
      if (success) {
        setActionMessage({
          success: true,
          message: "로그아웃 성공",
          subMessage: "",
        });
      } else {
        setActionMessage({
          success: false,
          message: "로그아웃 실패",
          subMessage: "로그아웃 중 오류가 발생했습니다.",
        });
      }
      setLoading(false);
      return;
    }

    // 이메일은 빈 값이 아니어야 함
    if (!email.value) {
      setEmail((prev) => ({ ...prev, isValid: false }));
      setActionMessage({
        success: false,
        message: "로그인 실패",
        subMessage: "이메일을 입력해주세요.",
      });
      return;
    } else {
      setEmail((prev) => ({ ...prev, isValid: true }));
    }

    // 비밀번호는 빈 값이 아니어야 함
    if (!password.value) {
      setPassword((prev) => ({ ...prev, isValid: false }));
      setActionMessage({
        success: false,
        message: "로그인 실패",
        subMessage: "비밀번호를 입력해주세요.",
      });
      return;
    } else {
      setPassword((prev) => ({ ...prev, isValid: true }));
    }

    setLoading(true);
    try {
      const data = await auth.login({
        email: email.value,
        password: password.value,
      });
      if (data.success) {
        setActionMessage({
          success: true,
          message: "로그인 성공",
          subMessage: `환영합니다, ${data.user.email}!`,
        });
        Alert.alert(
          "로그인 성공",
          "계정관리 페이지로 이동하시겠습니까?",
          [
            {
              text: "OK",
              onPress: () => router.push("/account"),
            },
            {
              text: "Cancel",
              style: "cancel",
            },
         
          ],
          { cancelable: false }
        );
      } else {
        setActionMessage({
          success: false,
          message: "로그인 실패",
          subMessage: data.message,
        });
      }
    } catch (error: any) {
      setActionMessage({
        success: false,
        message: "오류 발생",
        subMessage:
          error.response?.data?.message ||
          "서버와 통신 중 오류가 발생했습니다.",
      });
    }
    setLoading(false);
  };

  return (
    <ImageBackground
      source={require("../../../assets/images/Five-Min-Auth-Transparent.png")} // 배경 이미지 URL
      style={styles.background}
      resizeMode="cover" // 이미지가 화면을 덮도록 설정
    >
      <View style={styles.container}>
        <Card style={styles.card}>
          <View style={styles.header}>
            <Text
              variant="headlineMedium"
              style={[
                styles.headerText,
                { backgroundColor: theme.colors.primaryContainer },
              ]}
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
                    color: actionMessage.success
                      ? theme.colors.primary
                      : theme.colors.error,
                  },
                ]}
              >
                {actionMessage.message}
                {"\n"}
                {actionMessage.subMessage}
              </Text>
            ) : null}
          </View>

          <View style={styles.form}>
            {!auth.isLogin && (
              <>
                <TextInput
                  label="Email"
                  mode="outlined"
                  value={email.value}
                  onChangeText={(text) => setEmail({ ...email, value: text })}
                  disabled={loading}
                  style={[
                    styles.input,
                    !email.IsValid && {
                      backgroundColor: theme.colors.errorContainer,
                    },
                    email.IsValid && {
                      backgroundColor: theme.colors.background,
                    },
                  ]}
                  keyboardType="email-address"
                />
                <TextInput
                  label="Password"
                  mode="outlined"
                  value={password.value}
                  onChangeText={(text) =>
                    setPassword({ ...password, value: text })
                  }
                  disabled={loading}
                  style={[
                    styles.input,
                    !password.IsValid && {
                      backgroundColor: theme.colors.errorContainer,
                    },
                    password.IsValid && {
                      backgroundColor: theme.colors.background,
                    },
                  ]}
                  secureTextEntry={!showPassword} // showPassword가 true일 때 텍스트 표시
                  right={
                    <TextInput.Icon
                      icon={showPassword ? "eye-off" : "eye"} // 아이콘 변경
                      onPress={togglePasswordVisibility} // 클릭 시 토글 함수 호출
                    />
                  }
                />
              </>
            )}

            <Button
              onPress={handleSignIn}
              style={[
                styles.button,
                { backgroundColor: theme.colors.primaryContainer },
              ]}
              disabled={loading}
            >
              <Text variant="bodyLarge" style={{ fontWeight: "bold" }}>
                {auth.isLogin && "로그아웃"}
                {!auth.isLogin && "로그인"}
              </Text>
            </Button>
          </View>

          {!auth.isLogin && (
            <View style={styles.footer}>
              <Text variant="bodyMedium">
                계정이 없으신가요?{" "}
                <ExternalLink
                  style={styles.link}
                  href="https://www.5minbowl.com/authentication/register"
                >
                  회원가입
                </ExternalLink>
              </Text>
              <Text variant="bodyMedium">
                비밀번호를 잊으셨나요?{" "}
                <ExternalLink
                  style={styles.link}
                  href="https://www.5minbowl.com/authentication/forget-password"
                >
                  여기서 재설정
                </ExternalLink>
              </Text>
            </View>
          )}
        </Card>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  card: {
    width: "100%",
    maxWidth: 400,
    padding: 16,
    borderRadius: 8,
    elevation: 4,
  },
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
  form: {
    marginBottom: 16,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 16,
  },
  footer: {
    marginTop: 16,
    alignItems: "center",
  },
  link: {
    color: "#2196f3",
    textDecorationLine: "underline",
  },
});
