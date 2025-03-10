"use client";

// @mui material components
import { styled, Theme } from "@mui/material/styles";
import LinearProgress from "@mui/material/LinearProgress";

const MKProgressRoot = styled(LinearProgress)(
  ({ theme, ownerState }: { theme?: Theme | any; ownerState: any }) => {
    const { palette, functions } = theme;
    const { color, value, variant } = ownerState;

    const { text, gradients } = palette;
    const { linearGradient } = functions;

    // background value
    let backgroundValue;

    if (variant === "gradient") {
      backgroundValue = gradients[color]
        ? linearGradient(gradients[color].main, gradients[color].state)
        : linearGradient(gradients.info.main, gradients.info.state);
    } else {
      backgroundValue = palette[color]
        ? palette[color].main
        : palette.info.main;
    }

    return {
      width: "100%",
      "& .MuiLinearProgress-bar": {
        background: backgroundValue,
        width: `${value}%`,
        color: text.main,
      },
    };
  }
);

export default MKProgressRoot;