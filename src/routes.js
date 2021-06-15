import React from "react";
import { Switch, Route } from "react-router-dom";

//HOC
import Auth from "./hoc/auth";

// PAGES
import Home from "./Containers/Home/home";
import { ThemeProvider } from "@material-ui/core";
import { theme } from "./helpers/utils";
import AuthPage from "./Containers/AuthPage/authPage";
import Meeting from "./Containers/Meeting/meeting";

const Routes = () => {
  return (
    <ThemeProvider theme={theme}>
      <Switch>
        <Route path="/login" exact component={Auth(AuthPage, false, false)} />
        <Route exact path="/session/:token" component={Meeting} />
        <Route path="/" component={Auth(Home)} />
      </Switch>
    </ThemeProvider>
  );
};

export default Routes;
