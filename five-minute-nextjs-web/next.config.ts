import type { NextConfig } from "next";
import { PHASE_DEVELOPMENT_SERVER } from "next/constants";

// Define the Next.js configuration function
const nextConfig = (phase: string): NextConfig => {
  // Check if the current phase is development or production
  const isDev = phase === PHASE_DEVELOPMENT_SERVER;
  const vercelUrl = "www.5minbowl.com/"
  return {
    // 클라이언트에서 사용할 환경 변수를 env 에 정의
    env: {
      NEXTAUTH_SECRET: process.env.FIVE_MIN_NEXTAUTH_SECRET,
      SMTP_USER: process.env.FIVE_MIN_SMTP_USER,
      SMTP_PASS: process.env.FIVE_MIN_SMTP_PASS,
      MONGO_URI: isDev ? process.env.FIVE_MIN_MONGO_URI_DEV : process.env.FIVE_MIN_MONGO_URI_PROD,
      BASE_URL: isDev
        ? "http://localhost:3000" // 로컬 개발 환경 기본값
        : `https://${vercelUrl}`, // Vercel 배포 환경
    },
  };
};

export default nextConfig;
