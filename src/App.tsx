import React, { useEffect, lazy } from "react";
import { CircularProgress, Grid } from "@mui/material";
import { useCookies } from "react-cookie";
import { Navigate, Route, Routes } from "react-router-dom";

import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import Messenger from "./pages/Messenger";
import NotFound from "./pages/NotFound/NotFound";
import { useAppDispatch } from "./hooks/useRedux";
import { getMe } from "./redux/slices/usersSlice";
import { useGetMeQuery } from "./redux/features/auth.api";
import WatchStream from "./pages/Messenger/WatchStream";
import StartStream from "./pages/Messenger/StartStream";

const Chat = lazy(() => import("./pages/Messenger/Chat"));

const PublicRoutes = () => (
  <Routes>
    <Route path="/" element={<Navigate to="/auth" />}>
      <Route
        path="chatroom/:id"
        element={
          <React.Suspense fallback={<CircularProgress />}>
            <Chat />
          </React.Suspense>
        }
      />
    </Route>
    <Route path="/auth" element={<Auth />} />
    <Route path="*" element={<NotFound />} />
  </Routes>
);

const PrivateRoutes = () => (
  <Routes>
    <Route path="/" element={<Messenger />}>
      <Route
        path="chatroom/:id"
        element={
          <React.Suspense fallback={<CircularProgress />}>
            <Chat />
          </React.Suspense>
        }
      >
        <Route path="watch/:streamerName" element={<WatchStream />} />
        <Route path="stream-manager" element={<StartStream />} />
      </Route>
    </Route>
    <Route path="/profile" element={<Profile />} />
    <Route path="*" element={<NotFound />} />
  </Routes>
);

const App: React.FC = () => {
  const { data: me } = useGetMeQuery();

  const [cookies] = useCookies(["token"]);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (me?.username.length) {
      dispatch(getMe(me));
    }
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
        <PublicRoutes />
      </Grid>
    );
  }

  return (
    <Grid
      container
      item
      sx={{ height: "100vh", bgcolor: "#1B1C21", overflow: "hidden" }}
      justifyContent="center"
      alignItems="center"
    >
      <PrivateRoutes />
    </Grid>
  );
};

export default App;
