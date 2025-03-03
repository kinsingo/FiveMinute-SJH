import { TextInput, useTheme } from "react-native-paper";
import React from "react";

interface AccountTextInputsProps {
  email: { value: string; isValid: boolean };
  setEmail: (email: { value: string; isValid: boolean }) => void;
  password: { value: string; isValid: boolean };
  setPassword: (password: { value: string; isValid: boolean }) => void;
  loading: boolean;
  showPassword: boolean;
  togglePasswordVisibility: () => void;
}

export default function AccountTextInputs({
  email,
  setEmail,
  password,
  setPassword,
  loading,
  showPassword,
  togglePasswordVisibility,
}: AccountTextInputsProps){
    const theme = useTheme();

    return(
        <>
        <TextInput
          label="Email"
          mode="outlined"
          value={email.value}
          onChangeText={(text) => setEmail({ ...email, value: text })}
          autoCapitalize="none" // ✅ 자동 대문자 변환 방지
          disabled={loading}
          style={[
            {marginBottom: 16},
            !email.isValid && {
              backgroundColor: theme.colors.errorContainer,
            },
            email.isValid && {
              backgroundColor: theme.colors.background,
            },
          ]}
          keyboardType="email-address"
        />
        <TextInput
          label="Password"
          mode="outlined"
          autoCapitalize="none" // ✅ 자동 대문자 변환 방지
          value={password.value}
          onChangeText={(text) => setPassword({ ...password, value: text })}
          disabled={loading}
          style={[
            {marginBottom: 16},
            !password.isValid && {
              backgroundColor: theme.colors.errorContainer,
            },
            password.isValid && {
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
    );
}