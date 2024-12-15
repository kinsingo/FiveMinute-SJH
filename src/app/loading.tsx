import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

export default function Loading() {
  return (
    <>
      <main>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          minHeight="20vh"
          textAlign="center"
        >
          <CircularProgress size="4rem" color="info" />
        </Box>
      </main>
    </>
  );
}
