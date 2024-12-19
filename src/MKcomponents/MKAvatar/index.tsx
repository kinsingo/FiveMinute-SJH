import { forwardRef } from "react";

// prop-types is a library for typechecking of props
import { AvatarProps } from "@mui/material";

// Custom styles for MKAvatar
import MKAvatarRoot from "@/MKcomponents/MKAvatar/MKAvatarRoot";

export type MKAvatarColorType = "transparent" | "primary" | "secondary" | "info" | "success" | "warning" | "error" | "light" | "dark";
export type MKAvatarSizeType = "xs" | "sm" | "md" | "lg" | "xl" | "xxl";
export type MKAvatarShadowType = "none" | "xs" | "sm" | "md" | "lg" | "xl" | "xxl" | "inset";

interface Props extends AvatarProps {
  bgColor?: MKAvatarColorType;
  size?: MKAvatarSizeType;
  shadow?: MKAvatarShadowType;
  name?: string;
}

const MKAvatar = forwardRef<HTMLDivElement, Props>(
  ({ bgColor = "transparent", size = "md", shadow = "none", ...rest }, ref) => (
    <MKAvatarRoot ref={ref} ownerState={{ shadow, bgColor, size }} {...rest} />
  )
);

// Set display name for debugging purposes
MKAvatar.displayName = "MKAvatar";

export default MKAvatar;
