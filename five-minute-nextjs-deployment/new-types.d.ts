//여기에 custom types 추가

import "@mui/material/styles";
import { ReactNode } from "react";
import { SvgIconProps } from "@mui/material";
import React from "react";
import "@mui/icons-material";

declare module "@mui/icons-material/Facebook" {
  const FacebookIcon: React.FC<SvgIconProps>;
  export default FacebookIcon;
}

declare module "@mui/icons-material/Twitter" {
  const TwitterIcon: React.FC<SvgIconProps>;
  export default TwitterIcon;
}

declare module "@mui/icons-material/Instagram" {
  const InstagramIcon: React.FC<SvgIconProps>;
  export default InstagramIcon;
}

declare module "@mui/icons-material/Pinterest" {
  const PinterestIcon: React.FC<SvgIconProps>;
  export default PinterestIcon;
}

declare module "@mui/icons-material/GitHub" {
  const GitHubIcon: React.FC<SvgIconProps>;
  export default GitHubIcon;
}

declare module "@mui/material/styles" {
  interface Theme {
    boxShadows: Record<string, string>;
    borders: any;
    functions: any;
  }

  interface ThemeOptions {
    boxShadows?: Record<string, string>;
    borders?: any;
    functions?: any;
  }

  interface Palette {
    white: Palette["primary"];
    dark: Palette["primary"];
    transparent: Palette["primary"];
    gradients: Record<string, { main: string; state: string }>;
    socialMediaColors: Record<string, { main: string; dark: string }>;
    badgeColors: Record<string, { background: string; text: string }>;
    coloredShadows: Record<string, string>;
    inputBorderColor: string;
    tabs: {
      indicator: { boxShadow: string };
    };
  }

  interface PaletteOptions {
    white?: PaletteOptions["primary"];
    dark?: PaletteOptions["primary"];
    transparent?: PaletteOptions["primary"];
    gradients?: Record<string, { main: string; state: string }>;
    socialMediaColors?: Record<string, { main: string; dark: string }>;
    badgeColors?: Record<string, { background: string; text: string }>;
    coloredShadows?: Record<string, string>;
    inputBorderColor?: string;
    tabs?: {
      indicator: { boxShadow: string };
    };
  }
}

declare global {
  interface RouteItem {
    name: string; // 이름
    icon?: ReactNode; // React 컴포넌트 (아이콘)
    route?: string; // 내부 링크
    href?: string; // 외부 링크
    description?: string; // 설명 (선택)
    columns?: number; // 열의 수
    rowsPerColumn?: number; // 열당 행의 수
    collapse?: RouteItem[]; // 하위 라우트 (재귀적 구조)
    dropdown?: boolean; // 드롭다운 메뉴 여부
  }  
  type MUIColor = "primary" | "secondary" | "error" | "info" | "success" | "warning" | "inherit";
}
