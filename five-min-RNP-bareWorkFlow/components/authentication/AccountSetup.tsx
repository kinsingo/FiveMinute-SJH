import ExternalLink from "@/components/ExternalLink";
import { StyleSheet } from "react-native";
import { Text } from "react-native-paper";

export default function AccountSetup() {
  return (
    <>
      <Text variant="bodyMedium">
        계정이 없으신가요?{" "}
        <ExternalLink style={styles.link} href="https://www.5minbowl.com/authentication/register">
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
    </>
  );
}

const styles = StyleSheet.create({
  link: {
    color: "#2196f3",
    textDecorationLine: "underline",
  },
});
