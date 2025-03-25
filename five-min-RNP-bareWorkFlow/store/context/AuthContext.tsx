import { createContext, useState, useEffect, useMemo } from "react";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { scheduleDailyInventoryNotification } from "@/util/dailyNotificationAsync";

const AUTH_URL = "https://www.5minbowl.com/api/react-native-app-auth"; // Next.js Auth API 경로
export const ACCOUNT_INFO_URL = "https://www.5minbowl.com/api/react-native-app-account"; // Next.js Auth API 경로

const TOKEN_KEY = "authToken"; // SecureStore에 저장할 토큰 키
const EMAIL_KEY = "userEmail"; // SecureStore에 저장할 이메일 키

interface User {
  id: string;
  email: string;
  isAdmin: boolean;
  isDeveloper: boolean;
}

export type Position = "직원" | "매니저" | "점장" | "사장" | "";

export interface UserInfo {
  email: string;
  nickname: string;
  realname: string;
  birthdate: string;
  position: Position;
  gender: string;
}

export interface AuthContextType {
  login: ({ email, password }: { email: string; password: string }) => Promise<any>;
  logout: () => Promise<boolean>;
  delete: () => Promise<void>;
  getCurrentUserEmail: () => Promise<string | null>;
  getRecommendedUserName: () => string;
  getAccountInfo: (email: string) => Promise<any>;
  token: string | null;
  isLogin: boolean;
  user: User | null;
  userInfo: UserInfo | null;
  setUserInfo: (userInfo: UserInfo) => void;
}

export const AuthContext = createContext<AuthContextType>({
  login: async ({ email, password }: { email: string; password: string }) => ({ success: false }),
  logout: async () => false,
  delete: async () => {},
  getCurrentUserEmail: async (): Promise<string | null> => null,
  getRecommendedUserName: () => "",
  getAccountInfo: async (email: string) => null,
  token: "",
  isLogin: false,
  user: null,
  userInfo: null,
  setUserInfo: (userInfo: UserInfo) => {},
});

import { ReactNode } from "react";

export default function AuthContextProvider({ children }: { children: ReactNode }) {
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  // ✅ 앱 실행 시 SecureStore에서 토큰을 불러와 자동 로그인 유지
  useEffect(() => {
    const loadToken = async () => {
      try {
        const token = await SecureStore.getItemAsync(TOKEN_KEY);
        if (token) {
          try {
            // ✅ 토큰이 존재하면 백엔드에 유효성 검사 요청
            const response = await axios.get(AUTH_URL, {
              headers: { Authorization: `Bearer ${token}` },
            });

            // ✅ 토큰이 유효하면 저장
            if (response.data.success) {
              setAuthToken(token);
              setUser(response.data.user);
              const accountInfoResponse = await getAccountInfo(response.data.user.email);
              setUserInfo({
                email: response.data.user.email,
                nickname: accountInfoResponse.data.nickname,
                realname: accountInfoResponse.data.realname,
                birthdate: accountInfoResponse.data.birthdate,
                position: accountInfoResponse.data.position,
                gender: accountInfoResponse.data.gender,
              });
            } else {
              console.warn("🚨 서버 응답: " + response.data.message);
              await logout();
            }
          } catch (error: any) {
            if (error.response && error.response.status === 401) {
              console.warn("🚨 토큰 만료 감지. 자동 로그아웃.");
              await logout();
            } else {
              console.error("🔴 네트워크 오류 발생:", error.message);
            }
          }
        }
      } catch (error) {
        console.error("🔴 토큰 불러오기 실패:", error);
      }
    };
    loadToken();
  }, []);

  // ✅ authToken이 변경될 때 SecureStore 업데이트
  useEffect(() => {
    if (authToken) {
      SecureStore.setItemAsync(TOKEN_KEY, authToken).catch((error) =>
        console.error("🔴 토큰 저장 실패:", error)
      );
    }
  }, [authToken]);

  const userPosition = useMemo(() => userInfo?.position, [userInfo]);
  useEffect(() => {
    if (userPosition) {
      scheduleDailyInventoryNotification(userPosition);
    }
  }, [userPosition]);

  async function getAccountInfo(email: string) {
    const accountInfoResponse = await axios.get(ACCOUNT_INFO_URL, {
      params: { email: email },
    });
    return accountInfoResponse;
  }

  // ✅ 로그인 함수 (토큰 저장 및 Context 상태 업데이트)
  const login = async ({ email, password }: { email: string; password: string }): Promise<any> => {
    try {
      const response = await axios.post(AUTH_URL, { email, password });
      if (response.data.success) {
        await SecureStore.setItemAsync(TOKEN_KEY, response.data.token);
        await SecureStore.setItemAsync(EMAIL_KEY, email);
        setAuthToken(response.data.token);
        setUser(response.data.user);
        const accountInfoResponse = await getAccountInfo(response.data.user.email);
        setUserInfo({
          email: response.data.user.email,
          nickname: accountInfoResponse.data.nickname,
          realname: accountInfoResponse.data.realname,
          birthdate: accountInfoResponse.data.birthdate,
          position: accountInfoResponse.data.position,
          gender: accountInfoResponse.data.gender,
        });
        return { success: true, message: "로그인 성공", user: response.data.user };
      } else {
        await logout();
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      return { success: false, message: "서버 오류 발생" };
    }
  };

  // ✅ 로그아웃 함수 (토큰 삭제 및 Context 상태 업데이트)
  const logout = async () => {
    try {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
      await SecureStore.deleteItemAsync(EMAIL_KEY);
      setAuthToken("");
      setUser(null); // ✅ 로그아웃 시 `user` 초기화
      setUserInfo(null); // ✅ 로그아웃 시 `userInfo` 초기화
      return true;
    } catch (error) {
      console.error("🔴 로그아웃 실패:", error);
      return false;
    }
  };

  // ✅ 계정 삭제 함수
  const deleteAccount = async (): Promise<void> => {
    try {
      const token = await SecureStore.getItemAsync(TOKEN_KEY);
      if (!token) throw new Error("토큰이 존재하지 않습니다.");
      const userEmail = await SecureStore.getItemAsync(EMAIL_KEY);
      if (!userEmail) throw new Error("이메일이 존재하지 않습니다.");
      const response = await axios.delete(AUTH_URL, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        data: { email: userEmail },
      });
      if (!response.data.success) throw new Error("계정 삭제 실패:", response.data.message);
    } catch (error: any) {
      throw new Error("계정 삭제 요청 중 오류 발생:", error.message);
    }
  };

  // ✅ 저장된 이메일 가져오기
  const getCurrentUserEmail = async (): Promise<string | null> => {
    try {
      return await SecureStore.getItemAsync(EMAIL_KEY);
    } catch (error) {
      console.error("🔴 이메일 불러오기 실패:", error);
      return null;
    }
  };

  const getRecommendedUserName = () => {
    if (userInfo) {
      if (userInfo.nickname) return userInfo.nickname;
      if (userInfo.realname) return userInfo.realname;
      if (userInfo.email) return userInfo.email;
    }
    return "";
  };

  const value = {
    login,
    logout,
    delete: deleteAccount,
    getCurrentUserEmail,
    getRecommendedUserName,
    getAccountInfo,
    token: authToken,
    isLogin: !!authToken,
    user: user,
    userInfo: userInfo,
    setUserInfo: setUserInfo,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
