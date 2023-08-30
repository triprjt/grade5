import { Box } from "@mui/material";
import { Login } from "@pages/auth";
import { Suspense } from "react";
import { Outlet } from "react-router-dom";

import { Sdk } from "@/services/sdk.service";

import Loading from "../UI/loading";
import MenuAppBar from "../UI/navbar";

export default function PrimaryLayout(): JSX.Element {
  const isAuth = Sdk.auth.isAuth();

  if (!isAuth) return <Login />;
  return (
    <Box height={"100vh"} overflow={"auto"}>
      <MenuAppBar />
      <Suspense fallback={<Loading />}>
        <Outlet />
      </Suspense>
    </Box>
  );
}
