import NextAuth, { User } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import login from "@/app/authentication/lib/login";


export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      type: "credentials",
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        if (!credentials || !credentials.email || !credentials.password)
          return null; // credentials가 없으면 인증 실패

        const { email, password } = credentials as {
          email: string;
          password: string;
        };

        try {
          const user = await login({ email, password });
          return user as User; // 성공 시 사용자 객체를 반환하여 세션에 저장
        } catch {
          return null; // 인증 실패 시 null 반환 (CredentialsSignin 에러 발생), throw Error 말고 반드시 null 로
        }
      },
    }),
  ],
  basePath: "/api/auth",
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "../../authentication/login",
  },
  trustHost: true,

  //Session 을 30일로 
  session: {
    strategy: "jwt", // 세션 전략 설정
    maxAge: 30 * 24 * 60 * 60, // 세션 최대 유지 기간: 30일 (초 단위)
    updateAge: 7 * 24 * 60 * 60, // 7일 마다 세션 갱신
  },
});
