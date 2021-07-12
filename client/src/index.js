import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Redirect } from "react-router-dom";

import CssBaseline from "@material-ui/core/CssBaseline";
import { ThemeProvider } from "@material-ui/core/styles";

import theme from "assets/theme/theme.js";

import "assets/plugins/nucleo/css/nucleo.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "assets/scss/dashboard-react.scss";

import Dashboard from "layouts/Dashboard.js";

ReactDOM.render(
  <ThemeProvider theme={theme}>
    {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
    <CssBaseline />
    <BrowserRouter>
      <Route path="/dashboard" render={(props) => <Dashboard {...props} />} />
      <Redirect from="/" to="/dashboard/index" />
    </BrowserRouter>
  </ThemeProvider>,
  document.querySelector("#root")
);
