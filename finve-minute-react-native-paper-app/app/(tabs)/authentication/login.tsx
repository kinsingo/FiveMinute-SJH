import {useState} from "react";
import { View, StyleSheet, ImageBackground } from "react-native";
import { Card, TextInput, Button, Text, useTheme } from "react-native-paper";

export default function SignInScreen() {
  const theme = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [actionMessage, setActionMessage] = useState({
    message: "",
    subMessage: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev); // true <-> false 토글
  };

  const handleSignIn = () => {
    // TODO: Replace with your sign-in logic
    if (!email || !password) {
      setActionMessage({
        message: "로그인 실패",
        subMessage: "이메일과 비밀번호를 입력해주세요.",
      });
      return;
    }

    // Example: Reset messages on successful login
    setActionMessage({
      message: "로그인 성공",
      subMessage: "환영합니다!",
    });
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
              로그인
            </Text>
            <Text variant="bodyMedium" style={styles.subHeaderText}>
              Enter your email and password to sign in
            </Text>
            {actionMessage.message ? (
              <Text style={styles.actionMessage}>
                {actionMessage.message}
                {"\n"}
                {actionMessage.subMessage}
              </Text>
            ) : null}
          </View>

          <View style={styles.form}>
            <TextInput
              label="Email"
              mode="outlined"
              value={email}
              onChangeText={setEmail}
              style={styles.input}
              keyboardType="email-address"
            />
            <TextInput
              label="Password"
              mode="outlined"
              value={password}
              onChangeText={setPassword}
              style={styles.input}
              secureTextEntry={!showPassword} // showPassword가 true일 때 텍스트 표시
              right={
                <TextInput.Icon
                  icon={showPassword ? "eye-off" : "eye"} // 아이콘 변경
                  onPress={togglePasswordVisibility} // 클릭 시 토글 함수 호출
                />
              }
            />
            <Button
              mode="contained"
              onPress={handleSignIn}
              style={[
                styles.button,
                { backgroundColor: theme.colors.primaryContainer },
              ]}
            >
              <Text variant="bodyLarge" style={{ fontWeight: "bold" }}>
                SIGN IN
              </Text>
            </Button>
          </View>

          <View style={styles.footer}>
            <Text variant="bodyMedium">
              계정이 없으신가요?{" "}
              <Text style={styles.link} onPress={() => {}}>
                회원가입
              </Text>
            </Text>
            <Text variant="bodyMedium">
              비밀번호를 잊으셨나요?{" "}
              <Text style={styles.link} onPress={() => {}}>
                여기서 재설정
              </Text>
            </Text>
          </View>
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
