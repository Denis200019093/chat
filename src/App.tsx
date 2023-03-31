import React from "react";
import { CircularProgress, Grid } from "@mui/material";
import { useCookies } from "react-cookie";
import { Navigate, Route, Routes } from "react-router-dom";

import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import Messenger from "./pages/Messenger";
import NotFound from "./pages/NotFound/NotFound";
import Chat from "./pages/Messenger/components/Chat";
import CreateRoom from "./pages/Messenger/components/Chat/components/CreateRoom";
// import RoomProfile from "./pages/Messenger/components/Chat/components/RoomProfile";
import { useGetMeQuery } from "./redux/features/auth.api";
import { getMe } from "./redux/slices/usersSlice";
import { useAppDispatch } from "./hooks/useRedux";

const RoomProfile = React.lazy(
  () => import("./pages/Messenger/components/Chat/components/RoomProfile")
);

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
          <Route path="/" element={<Navigate to="/auth" />}>
            <Route path="chatroom/:id" element={<Chat />} />
          </Route>
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
        <Route path="/" element={<Messenger />}>
          <Route path="chatroom/:id" element={<Chat />}>
            <Route
              path=""
              element={
                <React.Suspense fallback={<CircularProgress />}>
                  <RoomProfile />
                </React.Suspense>
              }
            />
          </Route>
        </Route>
        <Route path="/auth" element={<Navigate to="/" />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      {/* <CreateRoom /> */}
    </Grid>
  );
};

export default App;
