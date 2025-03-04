import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import Constants from "expo-constants";
import { Platform } from "react-native";
import { Alert } from "react-native";
import axios from "axios";

export const PUSHTOKEN_URL = "https://www.5minbowl.com/api/react-native-app-pushtokens";

// 백엔드 API에 푸시 토큰 저장
async function sendPushTokenToServer(token: string) {
  try {
    const response = await axios.post(PUSHTOKEN_URL, { token });
    if (response.status === 201) {
      //console.log("Push token stored successfully!");
    } else {
      console.error("Failed to store push token:", response.data);
    }
  } catch (error) {
    console.error("Error sending push token:", error);
  }
}

export async function registerForPushNotificationsAsync() {
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("fiveMinute", {
      name: "fiveMinute",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      Alert.alert("Permission not granted to get push token for push notification!");
    }
    const projectId =
      Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
    if (!projectId) {
      Alert.alert("Project ID not found");
    }
    try {
      const pushTokenString = (
        await Notifications.getExpoPushTokenAsync({
          projectId,
        })
      ).data;
      //console.log("pushTokenString:" + pushTokenString);
      await sendPushTokenToServer(pushTokenString);
      return pushTokenString;
    } catch (e: unknown) {
      console.error(`${e}`);
    }
  } else {
    Alert.alert("Must use physical device for push notifications");
  }
}
