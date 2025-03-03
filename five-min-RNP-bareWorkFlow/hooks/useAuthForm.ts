
import { useState, useContext } from "react";
import {  Alert } from "react-native";
import { AuthContext } from "@/store/context/AuthContext";
import { useRouter } from "expo-router";


export default function useAuthForm() {
  const auth = useContext(AuthContext);
  const router = useRouter();
  const [email, setEmail] = useState({ value: "", isValid: true });
  const [password, setPassword] = useState({ value: "", isValid: true });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [actionMessage, setActionMessage] = useState({
    success: true,
    message: "",
    subMessage: "",
  });

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev); // true <-> false 토글
  };

  const logout = async () => {
    setLoading(true);
    const success = await auth.logout();
    setLoading(false);
    setActionMessage({
      success: success,
      message: success ? "로그아웃 성공" : "로그아웃 실패",
      subMessage: success ? "" : "로그아웃 중 오류가 발생했습니다.",
    });
  };

  const handleSignIn = async () => {
    // 로그인 상태에서 로그아웃
    if (auth.isLogin) {
      await logout();
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
        subMessage: error.response?.data?.message || "서버와 통신 중 오류가 발생했습니다.",
      });
    }
    setLoading(false);
  };

  return {
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
  };
}
