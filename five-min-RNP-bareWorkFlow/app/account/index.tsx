import React, { useState, useCallback, useContext, useEffect } from "react";
import {
  View,
  StyleSheet,
  Image,
  Alert,
  ImageBackground,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { Text, TextInput, Button, RadioButton, Card, useTheme } from "react-native-paper";
import { useFocusEffect } from "@react-navigation/native";
import { MyHorizontalScrollView } from "@/components/MyScrollView";
import axios from "axios";
import { AuthContext, ACCOUNT_INFO_URL, UserInfo } from "@/store/context/AuthContext";
import MyActivityIndicator from "@/components/MyActivityIndicator";
import { useRouter } from "expo-router";

const AccountManagementScreen = () => {
  const [isLoading, setIsLoading] = useState(false);
  const auth = useContext(AuthContext);
  const theme = useTheme();
  const router = useRouter();
  const [userInfo, setUserInfo] = useState<UserInfo>({
    email: "",
    nickname: "",
    realname: "",
    birthdate: "",
    position: "",
    gender: "",
  });

  useEffect(() => {
    auth.setUserInfo(userInfo);
  }, [userInfo]);

  const [editable, setEditable] = useState(false);
  useFocusEffect(
    useCallback(() => {
      const fetchUserInfo = async () => {
        try {
          setIsLoading(true);
          const accountInfoResponse = await axios.get(ACCOUNT_INFO_URL, {
            params: { email: auth.user?.email },
          });
          setUserInfo({
            email: auth.user!.email,
            nickname: accountInfoResponse.data.nickname,
            realname: accountInfoResponse.data.realname,
            birthdate: accountInfoResponse.data.birthdate,
            position: accountInfoResponse.data.position,
            gender: accountInfoResponse.data.gender,
          });
        } catch (error: any) {
          Alert.alert("🚨 서버 응답: " + error.message);
        } finally {
          setIsLoading(false);
        }
      };
      fetchUserInfo();
    }, [])
  );

  const handleSave = async () => {
    if (!userInfo.nickname) return Alert.alert("모든 입력이 필요합니다", "닉네임을 입력해 주세요");
    if (!userInfo.realname) return Alert.alert("모든 입력이 필요합니다", "이름을 입력해 주세요");
    if (!userInfo.birthdate)
      return Alert.alert("모든 입력이 필요합니다", "생년월일을 입력해 주세요");
    if (!userInfo.position) return Alert.alert("모든 입력이 필요합니다", "직책을 선택해 주세요");
    if (!userInfo.gender) return Alert.alert("모든 입력이 필요합니다", "성별을 선택해 주세요");
    try {
      setIsLoading(true);
      const response = await axios.post(ACCOUNT_INFO_URL, {
        email: userInfo.email,
        nickname: userInfo.nickname,
        realname: userInfo.realname,
        birthdate: userInfo.birthdate,
        position: userInfo.position,
        gender: userInfo.gender,
      });
      if (response.data.success) {
        Alert.alert("저장되었습니다.", response.data.message);
        setEditable(false);
      } else {
        Alert.alert("🚨 저장 실패", response.data.message);
      }
    } catch (error: any) {
      Alert.alert("🚨 서버 응답: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const profileImage =
    userInfo.gender === "남자"
      ? require("@/assets/images/fiveminicon_male_512x512.png")
      : require("@/assets/images/fiveminicon_female_512x512.png");

  const backgroundColor =
    //@ts-ignore
    userInfo.gender === "남자" ? theme.colors.maleContainer : theme.colors.femaleContainer;
  const foregroundColor =
    //@ts-ignore
    userInfo.gender === "남자" ? theme.colors.onMaleContainer : theme.colors.onFemaleContainer;
  //@ts-ignore
  const textColor = userInfo.gender === "남자" ? theme.colors.onMale : theme.colors.onFemale;
  //@ts-ignore
  const componentColor = userInfo.gender === "남자" ? theme.colors.male : theme.colors.female;

  const cardTextStyle = [styles.text, { color: foregroundColor }];

  if (isLoading) return <MyActivityIndicator />;

  return (
    <ImageBackground
      source={require("@/assets/images/Five-Min-Auth-Transparent.png")} // 배경 이미지 URL
      style={styles.background}
      resizeMode="cover" // 이미지가 화면을 덮도록 설정
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <Card style={[styles.card, { backgroundColor: backgroundColor }]} mode="contained">
            <Card.Content>
              <View style={styles.profileContainer}>
                <Image source={profileImage} style={styles.profileImage} />
              </View>
              <Text variant="bodyLarge" style={cardTextStyle}>
                이메일: {userInfo.email}
              </Text>

              {editable ? (
                <TextInput
                  label="닉네임"
                  value={userInfo.nickname}
                  onChangeText={(text) => setUserInfo({ ...userInfo, nickname: text })}
                  style={cardTextStyle}
                />
              ) : (
                <Text variant="bodyLarge" style={cardTextStyle}>
                  닉네임: {userInfo.nickname}
                </Text>
              )}
              {editable ? (
                <TextInput
                  label="이름"
                  value={userInfo.realname}
                  onChangeText={(text) => setUserInfo({ ...userInfo, realname: text })}
                  style={cardTextStyle}
                />
              ) : (
                <Text variant="bodyLarge" style={cardTextStyle}>
                  이름: {userInfo.realname}
                </Text>
              )}

              {editable ? (
                <TextInput
                  label="주민번호 앞 자리 (YYMMDD)"
                  value={userInfo.birthdate}
                  keyboardType="numeric"
                  maxLength={6}
                  onChangeText={(text) => setUserInfo({ ...userInfo, birthdate: text })}
                  style={cardTextStyle}
                />
              ) : (
                <Text variant="bodyLarge" style={cardTextStyle}>
                  생년월일: {userInfo.birthdate}
                </Text>
              )}

              {editable ? (
                <RadioButton.Group
                  onValueChange={(value) => setUserInfo({ ...userInfo, position: value })}
                  value={userInfo.position}
                >
                  <View style={styles.radioContainer}>
                    <Text style={cardTextStyle}>직책: </Text>
                    <MyHorizontalScrollView>
                      {["직원", "매니저", "점장", "사장"].map((role) => (
                        <View key={role} style={styles.radioItem}>
                          <RadioButton.Android color={componentColor} value={role} />
                          <Text>{role}</Text>
                        </View>
                      ))}
                    </MyHorizontalScrollView>
                  </View>
                </RadioButton.Group>
              ) : (
                <Text variant="bodyLarge" style={cardTextStyle}>
                  직책: {userInfo.position}
                </Text>
              )}

              {editable ? (
                <RadioButton.Group
                  onValueChange={(value) => setUserInfo({ ...userInfo, gender: value })}
                  value={userInfo.gender}
                >
                  <View style={styles.radioContainer}>
                    <Text style={cardTextStyle}>성별: </Text>
                    {["남자", "여자"].map((gender) => (
                      <View key={gender} style={styles.radioItem}>
                        <RadioButton.Android color={componentColor} value={gender} />
                        <Text>{gender}</Text>
                      </View>
                    ))}
                  </View>
                </RadioButton.Group>
              ) : (
                <Text variant="bodyLarge" style={cardTextStyle}>
                  성별: {userInfo.gender}
                </Text>
              )}
            </Card.Content>
            <Card.Actions>
              <Button
                textColor={theme.colors.secondary}
                buttonColor={theme.colors.secondaryContainer}
                onPress={() => router.push("/(tabs)/authentication/login")}
              >
                로그인/로그아웃
              </Button>
              <Button
                buttonColor={componentColor}
                textColor={textColor}
                onPress={() => (editable ? handleSave() : setEditable(true))}
              >
                {editable ? "저장" : "수정"}
              </Button>
            </Card.Actions>
          </Card>
        </View>
      </TouchableWithoutFeedback>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  background: {
    flex: 1,
  },
  card: {
    padding: 10,
    borderRadius: 10,
    justifyContent: "center",
    maxHeight: 600,
    elevation: 10,
  },
  profileContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 30,
  },
  radioContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
    flexWrap: "wrap",
  },
  radioItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 3,
  },
  text: {
    marginBottom: 10,
  },
});

export default AccountManagementScreen;
