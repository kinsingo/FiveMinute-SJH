// Material Kit 2 PRO React base styles
import colors from "../base/colors";

// Material Kit 2 PRO React helper functions
import rgba from "../functions/rgba";
import pxToRem from "../functions/pxToRem";

const { dark, white } = colors;

const divider = {
  styleOverrides: {
    root: {
      background: rgba(dark.main, 0.2),
      height: pxToRem(1),
      margin: `${pxToRem(16)} 0`,
      borderBottom: "none",
      opacity: 0.25,
    },

    vertical: {
      background: rgba(dark.main, 0.2),
      width: pxToRem(1),
      height: "100%",
      margin: `0 ${pxToRem(16)}`,
      borderRight: "none",
    },

    light: {
      background: rgba(white.main, 0.2),

      "&.MuiDivider-vertical": {
        background: rgba(white.main, 0.2),
      },
    },
  },
};

export default divider;