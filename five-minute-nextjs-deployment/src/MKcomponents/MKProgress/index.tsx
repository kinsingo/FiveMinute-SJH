import { forwardRef } from "react";

// Material Kit 2 PRO React components
import MKTypography from "@/MKcomponents/MKTypography";

// Custom styles for MKProgress
import MKProgressRoot from "@/MKcomponents/MKProgress/MKProgressRoot";

export type MKProgressColorType = "primary" | "secondary" | "info" | "success" | "warning" | "error" | "light" | "dark";
export type MKProgressVariantType = "contained" | "gradient";

interface MKProgressProps {
  variant?: MKProgressVariantType;
  color?:MKProgressColorType;
  value?: number;
  label?: boolean;
}

const MKProgress = forwardRef<HTMLDivElement, MKProgressProps>(
  ({ variant = "contained", color = "info", value = 0, label = false, ...rest }, ref) => (
    <>
      {label && (
        <MKTypography variant="button" fontWeight="medium" color="text">
          {value}%
        </MKTypography>
      )}
      <MKProgressRoot
        {...rest}
        ref={ref}
        variant="determinate"
        value={value}
        ownerState={{ color, value, variant }}
      />
    </>
  )
);

// Set display name for debugging purposes
MKProgress.displayName = "MKProgress";

export default MKProgress;
