//MUI 와 충돌 방지를 위해서 CSS 를 Global 하게 적용하지는 말자 .. !
//꼭 필요하면, xxx.module.css 를 통해 지역적으로 적용하고, MUI 가 아닌 다른 component 만 사용
//아래는 기존 react project global css 부분
//import "@/global/css/animate.css";
//import "@/global/css/linearicons.css";
//import "@/global/css/style.css";

//slick import
import "./global.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

//roboto for MUI typography
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

//nextJS15 + MUI6
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Head from "next/head";
import theme from "../theme";
import BMTFooter from "@/components/Footer";
import BMTNavbar from "@/components/Navbar";
import { ReactNode } from "react";

export const metadata = {
  title: "오분덮밥 | Five Minute Rice Bowl",
  description: "Created by Jonghyun Shin",
  keywords: "오분덮밥, 5분덮밥, 오분 덮밥, 5분 덮밥, Five Minute Rice Bowl",
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.ico", type: "image/x-icon" },
      {
        url: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        url: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <Head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      </Head>
      <body>
        <AppRouterCacheProvider options={{ enableCssLayer: true }}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <BMTNavbar />
            {children}
            <BMTFooter />
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
