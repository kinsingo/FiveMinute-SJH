import { forwardRef } from "react";

// @mui material components
import { BoxProps } from "@mui/material";

// Custom styles for MKBox
import MKBoxRoot from "@/MKcomponents/MKBox/MKBoxRoot";

export type MKBoxColorType = "primary" | "secondary" | "info" | "success" | "warning" | "error" | "light" | "dark" | "white" | "inherit" | "transparent" | "none";

interface Props extends BoxProps {
  variant?: "contained" | "gradient";
  bgColor?: MKBoxColorType;
  color?: MKBoxColorType;
  opacity?: number;
  borderRadius?: string;
  shadow?: string;
  coloredShadow?: MKBoxColorType
  component?: React.ElementType; // component 속성 추가
  href?: string; // href 속성 추가
  target?: string; // target 속성 추가
  alginItems? : "flex-start" | "center" | "flex-end" | "stretch" | "baseline"; // alginItems 속성 추가
  src?: string; // src 속성 추가
  alt?: string; // alt 속성 추가
}

const MKBox = forwardRef<HTMLDivElement, Props>(
  (
    {
      variant = "contained",
      bgColor = "transparent",
      color = "dark",
      opacity = 1,
      borderRadius = "none",
      shadow = "none",
      coloredShadow = "none",
      ...rest
    },
    ref
  ) => (
    <MKBoxRoot
      {...rest}
      ref={ref}
      ownerState={{
        variant,
        bgColor,
        color,
        opacity,
        borderRadius,
        shadow,
        coloredShadow,
      }}
    />
  )
);

// Set display name for debugging purposes
MKBox.displayName = "MKBox";

export default MKBox;
