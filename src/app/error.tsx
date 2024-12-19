'use client';//없으면 에러 발생, MUI 가 error 에서는 use client 동작 필요한듯

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

interface ErrorPageProps {
  error: { message: string };
}

export default function ErrorPage({ error }: ErrorPageProps) {
  const title = "An error occurred";
  const message = (error && error.message)? error.message : "Something went wrong";
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
