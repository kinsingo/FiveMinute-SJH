
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";


export default function UnauthorizedAccessPage() {
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
            You are not authorized to view this page
          </Typography>
          <Typography variant="body1" color="text">
            Please contact your administrator for access
          </Typography>
        </Box>
      </main>
    </>
  );
}
