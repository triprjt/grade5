import { Box, CircularProgress } from "@mui/material";

export default function Loading(): JSX.Element {
  return (
    <Box
      sx={{
        height: "100%",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <CircularProgress color="secondary" />
    </Box>
  );
}
