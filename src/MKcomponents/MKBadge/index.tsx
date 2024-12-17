import { forwardRef, ReactNode } from "react";

// @mui material components
import { BadgeProps } from "@mui/material";

// Custom styles for the MKBadge
import MKBadgeRoot from "@/MKcomponents/MKBadge/MKBadgeRoot";


export type MKBadgeColorType = "primary" | "secondary" | "info" | "success" | "warning" | "error" | "light" | "dark";
export type MKBadgeVariantType = "gradient" | "contained";
export type MKBadgeSizeType = "xs" | "sm" | "md" | "lg";

// declaring props types for MDBadge
interface Props extends Omit<BadgeProps, "color" | "variant"> {
  color?: MKBadgeColorType;
  variant?: MKBadgeVariantType;
  size?: MKBadgeSizeType;
  circular?: boolean;
  indicator?: boolean;
  border?: boolean;
  children?: ReactNode;
  container?: boolean;
}


const MKBadge = forwardRef<HTMLDivElement, Props>(
  (
    {
      color = "info",
      variant = "gradient",
      size = "sm",
      circular = false,
      indicator = false,
      border = false,
      container = false,
      children,
      ...rest
    },
    ref
  ) => (
    <MKBadgeRoot
      {...rest}
      ownerState={{ color, variant, size, circular, indicator, border, container, children }}
      ref={ref}
      color="default"
    >
      {children}
    </MKBadgeRoot>
  )
);

// Set display name for debugging purposes
MKBadge.displayName = "MKBadge";

export default MKBadge;
