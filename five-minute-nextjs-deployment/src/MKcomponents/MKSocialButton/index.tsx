import { forwardRef, ReactNode } from "react";

// @mui material components
import { ButtonProps } from "@mui/material";

// Custom styles for MKSocialButton
import MKSocialButtonRoot from "@/MKcomponents/MKSocialButton/MKSocialButtonRoot";


export type MKSocialButtonColorType = "facebook" | "twitter" | "instagram" | "linkedin" | "pinterest" | "youtube" | "github" | "vimeo" | "slack" | "dribbble" | "reddit" | "tumblr";
export type MKSocialButtonSizeType = "small" | "medium" | "large";

interface Props extends Omit<ButtonProps, "color" | "variant"> {
  color?:MKSocialButtonColorType;
  size?: MKSocialButtonSizeType;
  circular?: boolean;
  iconOnly?: boolean;
  children?: ReactNode;
}

const MKSocialButton = forwardRef<HTMLButtonElement, Props>(
  (
    {
      color = "facebook",
      size = "medium",
      iconOnly = false,
      circular = false,
      children,
      ...rest
    },
    ref
  ) => (
    <MKSocialButtonRoot
      {...rest}
      ref={ref}
      variant="contained"
      color="primary"
      size={size}
      ownerState={{ color, size, iconOnly, circular }}
    >
      {children}
    </MKSocialButtonRoot>
  )
);

// Set display name for debugging purposes
MKSocialButton.displayName = "MKSocialButton";

export default MKSocialButton;
