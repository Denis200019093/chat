import React from "react";
import { Grid } from "@mui/material";
import { Navigate, Route, Routes } from "react-router-dom";

import Test from "./pages/Test";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound/NotFound";
import Messenger from "./pages/Messenger";
import Profile from "./pages/Profile";
import { useCookies } from "react-cookie";
import { useGetMeQuery } from "./redux/features/auth.api";
import { getMe } from "./redux/slices/usersSlice";
import { useAppDispatch } from "./hooks/useRedux";

const App: React.FC = () => {
  const { data: me } = useGetMeQuery();

  const [cookies] = useCookies(["token"]);

  const dispatch = useAppDispatch();

  React.useEffect(() => {
    if (me) dispatch(getMe(me));
  }, [dispatch, me]);

  if (!cookies.token) {
    return (
      <Grid
        container
        item
        sx={{ height: "100vh", bgcolor: "rgba(35,35,35,1)" }}
        justifyContent="center"
        alignItems="center"
      >
        <Routes>
          <Route path="/" element={<Navigate to="/auth" />} />
          <Route path="/test" element={<Test />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/profile" element={<Navigate to="/auth" />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Grid>
    );
  }

  return (
    <Grid
      container
      item
      sx={{ height: "100vh", bgcolor: "#1B1C21" }}
      justifyContent="center"
      alignItems="center"
    >
      <Routes>
        <Route path="/" element={<Messenger />} />
        <Route path="/auth" element={<Navigate to="/" />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Grid>
  );
};

export default App;
