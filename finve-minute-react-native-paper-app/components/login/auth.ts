import axios from "axios";
import * as SecureStore from "expo-secure-store";

const AUTH_URL = "https://www.5minbowl.com/api/react-native-app-auth"; // Next.js Auth API 경로
const TOKEN_KEY = "authToken"; // SecureStore에 저장할 토큰 키
const EMAIL_KEY = "userEmail"; // SecureStore에 저장할 이메일 키

// ✅ JWT 저장 함수
const saveTokenAndEmail = async (token:string, email:string) => {
    try {
      await SecureStore.setItemAsync(TOKEN_KEY, token);
      await SecureStore.setItemAsync(EMAIL_KEY, email);
    } catch (error) {
      console.error("🔴 JWT 저장 실패:", error);
    }
  };
  
  // ✅ JWT 가져오기 함수
  const getToken = async () => {
    try {
      return await SecureStore.getItemAsync(TOKEN_KEY);
    } catch (error) {
      return null;
    }
  };

  // ✅ 저장된 Email 가져오기 함수
const getEmail = async () => {
  try {
    return await SecureStore.getItemAsync(EMAIL_KEY);
  } catch (error) {
    return null;
  }
};
  
  // ✅ JWT 삭제 함수 (로그아웃)
  const removeToken = async () => {
    try {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
    } catch (error) {
      console.error("🔴 JWT 삭제 실패:", error);
    }
  };
  
// 로그인 상태 확인 함수
export const IsLogin = async (): Promise<any> => {
    try {
        const token = await getToken();
        if (!token) return { success: false, message: "로그인되지 않음" };
    
        const response = await axios.get(AUTH_URL, {
          headers: { Authorization: `Bearer ${token}` },
        });
    
        return response.data;
      } catch (error : any) {
        if (error.response && error.response.status === 401) {
          await removeToken(); // ✅ 만료된 토큰 자동 삭제 (자동 로그아웃)
        }
        return { success: false, message: "유효하지 않은 토큰" };
      }
};

export const SignIn = async ({ email, password }: { email: string; password: string }): Promise<any> => {
    try {
        const response = await axios.post(AUTH_URL, { email, password });
        if (response.data.success) {
          await saveTokenAndEmail(response.data.token, email); // ✅ JWT 저장
          return { success: true, user: response.data.user };
        } else {
          return { success: false, message: response.data.message };
        }
      } catch (error) {
        return { success: false, message: "서버 오류 발생" };
      }
};

export const Logout = async () => {
    try {
        await removeToken(); // ✅ JWT 삭제 (로그아웃 처리)
        return true;
      } catch (error) {
        return false;
      }
  };

// ✅ 현재 로그인한 유저 이메일 가져오는 함수
export const GetCurrentUserEmail = async () => {
  return await getEmail();
};