// prop-types is a library for typechecking of props
import Grid from "@mui/material/Grid";
import Image from "next/image";
import Box from "@mui/material/Box";
import React from "react";

function AuthLayout({ children }:{children: React.ReactNode}) {
  return (
    <Box height="calc(100vh - 1rem)" position="relative">
      <Box
        width="calc(100% - 2rem)"
        minHeight="35vh"
        borderRadius="xl"
        mx={2}
        pt={6}
        pb={28}
      />
      <Image
        src="/images/Five-Min-Auth-Transparent.png"
        alt="Background Image"
        fill
        style={{ zIndex: -1, objectFit: "cover" }}
        priority // Preload the image
      />
      <Box
        mt={{ xs: -20, lg: -15 }}
        px={1}
        width="calc(100% - 2rem)"
        mx="auto"
      >
        <Grid container spacing={1} justifyContent="center">
          <Grid item xs={11} sm={9} md={5} lg={4} xl={3}>
            {children}
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

export default AuthLayout;
