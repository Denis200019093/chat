import React from "react";
import ReactDOM from "react-dom/client";
import { ThemeProvider } from "@mui/material";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";

import App from "./App";
import { theme } from "./configs/theme";
import { setupStore } from "./redux/store";
import { CookiesProvider } from "react-cookie";

import "./index.css";
import CustomSnackbar from "./components/CustomSnackbar";

const store = setupStore();

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <ThemeProvider theme={theme}>
    <Router basename="/">
      <Provider store={store}>
        <CookiesProvider>
          <CustomSnackbar />
          <App />
        </CookiesProvider>
      </Provider>
    </Router>
  </ThemeProvider>
);
