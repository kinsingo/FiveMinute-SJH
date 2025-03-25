'use client';

import { useState, ReactNode } from "react";

// @mui material components
import Fade from "@mui/material/Fade";

// Material Kit 2 PRO React components
import MKBox from "@/MKcomponents/MKBox";

// Custom styles for the MKAlert
import MKAlertRoot from "@/MKcomponents/MKAlert/MKAlertRoot";
import MKAlertCloseIcon from "@/MKcomponents/MKAlert/MKAlertCloseIcon";

export type MKAlertColorType ="primary" | "secondary" | "info" | "success" | "warning" | "error" | "light" | "dark";

interface Props {
  color?: MKAlertColorType;
  dismissible?: boolean;
  children: ReactNode;
}

function MKAlert({ color = "info", dismissible = false, children, ...rest }: Props) {
  const [alertStatus, setAlertStatus] = useState("mount");

  const handleAlertStatus = () => setAlertStatus("fadeOut");

  // The base template for the alert
  const alertTemplate = (mount = true) => (
    <Fade in={mount} timeout={300}>
      <MKAlertRoot ownerState={{ color }} {...rest}>
        <MKBox
          display="flex"
          alignItems="center"
          fontSize="1rem"
          fontWeight="regular"
          color={color === "light" ? "dark" : "white"}
        >
          {children}
        </MKBox>
        {dismissible ? (
          <MKAlertCloseIcon onClick={mount ? handleAlertStatus : undefined}>&times;</MKAlertCloseIcon>
        ) : null}
      </MKAlertRoot>
    </Fade>
  );

  switch (true) {
    case alertStatus === "mount":
      return alertTemplate();
    case alertStatus === "fadeOut":
      setTimeout(() => setAlertStatus("unmount"), 400);
      return alertTemplate(false);
    default:
      alertTemplate();
      break;
  }

  return null;
}

// Set display name for debugging purposes
MKAlert.displayName = "MKAlert";

export default MKAlert;
