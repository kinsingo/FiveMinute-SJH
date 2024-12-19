// Material Kit 2 PRO React Base Styles
import borders from "../../base/borders";

// Material Kit 2 PRO React Helper Functions
import pxToRem from "../../functions/pxToRem";

const { borderRadius } = borders;

const cardMedia = {
  styleOverrides: {
    root: {
      borderRadius: borderRadius.xl,
      margin: `${pxToRem(16)} ${pxToRem(16)} 0`,
    },

    media: {
      width: "auto",
    },
  },
};

export default cardMedia;
