

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";


export default function NotFoundErrorPage() {
  const title = "404 - Page Not Found";
  const message = "The page you are looking for does not exist";
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
          <Typography variant="h1" color="error" gutterBottom>
            {title}
          </Typography>
          <Typography variant="body1" color="text">
            {message}
          </Typography>
        </Box>
      </main>
    </>
  );
}
