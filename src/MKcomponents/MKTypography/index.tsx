import { forwardRef, ReactNode } from "react";

// prop-types is a library for typechecking of props
import { TypographyProps } from "@mui/material";

// Custom styles for MKTypography
import MKTypographyRoot from "@/MKcomponents/MKTypography/MKTypographyRoot";

export type MKTypographyColorType = "inherit" | "primary" | "secondary" | "info" | "success" | "warning" | "error" | "light" | "dark" | "text" | "white" | "errorBright" | "errorBrightSecond";
export type MKTypographyFontWeightType = "light" | "regular" | "medium" | "bold" ;
export type MKTypographyTextTransformType = "none" | "capitalize" | "uppercase" | "lowercase";
export type MKTypographyVerticalAlignType = "unset" | "baseline" | "sub" | "super" | "text-top" | "text-bottom" | "middle" | "top" | "bottom";

export interface MKTypographyType extends TypographyProps {
  color?:MKTypographyColorType;
  fontWeight?: MKTypographyFontWeightType;
  textTransform?: MKTypographyTextTransformType;
  verticalAlign?:MKTypographyVerticalAlignType;
  textGradient?: boolean;
  children: ReactNode;
  opacity?: number;
  //[key: string]: any;

  href?: string; // href 속성 추가
  target?: string; // target 속성 추가

  onClick?: () => void;
  onMouseEnter?: (event: React.MouseEvent<HTMLElement>) => void;
  onMouseLeave?: (event: React.MouseEvent<HTMLElement>) => void;
}

const MKTypography = forwardRef<HTMLDivElement, MKTypographyType>(
  (
    {
      color = "dark",
      fontWeight = false,
      textTransform = "none",
      verticalAlign = "unset",
      textGradient = false,
      opacity = 1,
      children,
      ...rest
    },
    ref
  ) => (
    <MKTypographyRoot
      {...rest}
      ref={ref}
      ownerState={{
        color,
        textTransform,
        verticalAlign,
        fontWeight,
        opacity,
        textGradient,
      }}
    >
      {children}
    </MKTypographyRoot>
  )
);

// Set display name for debugging purposes
MKTypography.displayName = "MKTypography";

export default MKTypography;
