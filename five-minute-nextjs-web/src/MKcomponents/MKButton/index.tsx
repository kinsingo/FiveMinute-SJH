import { forwardRef , ReactNode} from "react";

// @mui material components
import { ButtonProps } from "@mui/material";

// Custom styles for MKButton
import MKButtonRoot from "@/MKcomponents/MKButton/MKButtonRoot";

export type MKButtonColorType = "white" | "primary" | "secondary" | "info" | "success" | "warning" | "error" | "light" | "dark" | "default";
export type MKButtonBariantType = "text" | "contained" | "outlined" | "gradient";
export type MKButtonSizeType = "small" | "medium" | "large";

interface Props extends Omit<ButtonProps, "color" | "variant"> {
  color?:MKButtonColorType | MUIColor;
  variant?: MKButtonBariantType;
  size?: MKButtonSizeType;
  circular?: boolean;
  iconOnly?: boolean;
  children?: ReactNode;
}

const MKButton = forwardRef<HTMLButtonElement, Props>(
  (
    {
      color = "white",
      variant = "contained",
      size = "medium",
      circular = false,
      iconOnly = false,
      children,
      ...rest
    },
    ref
  ) => (
    <MKButtonRoot
      {...rest}
      ref={ref}
      color="primary"
      variant={variant === "gradient" ? "contained" : variant}
      size={size}
      ownerState={{ color, variant, size, circular, iconOnly }}
    >
      {children}
    </MKButtonRoot>
  )
);

// Set display name for debugging purposes
MKButton.displayName = "MKButton";

export default MKButton;
