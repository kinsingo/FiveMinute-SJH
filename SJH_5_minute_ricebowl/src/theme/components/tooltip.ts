// @mui material components
import Fade from "@mui/material/Fade";

// Material Kit 2 PRO React base styles
import colors from "../base/colors";
import typography from "../base/typography";
import borders from "../base/borders";

// Material Kit 2 PRO React helper functions
import pxToRem from "../functions/pxToRem";

const { black, light } = colors;
const { size, fontWeightRegular } = typography;
const { borderRadius } = borders;

const tooltip: any = {
  defaultProps: {
    arrow: true,
    TransitionComponent: Fade,
  },

  styleOverrides: {
    tooltip: {
      maxWidth: pxToRem(200),
      backgroundColor: black.main,
      color: light.main,
      fontSize: size.sm,
      fontWeight: fontWeightRegular,
      textAlign: "center",
      borderRadius: borderRadius.md,
      opacity: 0.7,
      padding: `${pxToRem(5)} ${pxToRem(8)} ${pxToRem(4)}`,
    },

    arrow: {
      color: black.main,
    },

    variants: [], // 추가된 부분
  },
};

export default tooltip;
