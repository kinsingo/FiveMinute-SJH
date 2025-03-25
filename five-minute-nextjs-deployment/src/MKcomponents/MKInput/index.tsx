import { forwardRef } from "react";

// Custom styles for MKInput
import MKInputRoot from "@/MKcomponents/MKInput/MKInputRoot";

import { StandardTextFieldProps } from "@mui/material";

interface Props extends StandardTextFieldProps  {
  error?: boolean;
  success?: boolean;
  disabled?: boolean;
}

const MKInput = forwardRef<HTMLInputElement, Props>(({ error = false, success = false, disabled = false, ...rest }, ref) => (
  <MKInputRoot {...rest} ref={ref} ownerState={{ error, success, disabled }} />
));

// Set display name for debugging purposes
MKInput.displayName = "MKInput";


export default MKInput;
