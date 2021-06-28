import React from "react";
import { Switch, Route } from "react-router-dom";

//HOC
import Auth from "./hoc/auth";

// PAGES
import Home from "./Containers/Home/home";
import { ThemeProvider } from "@material-ui/core";
import { theme, userTypes } from "./helpers/utils";
import AuthPage from "./Containers/AuthPage/authPage";
import Meeting from "./Containers/Meeting/meeting";
import MyCourses from "./Containers/MyCourses/myCourses";
import MySessions from "./Containers/MySessions/mySessions";
import UploadToDb from "./Containers/UploadToDB/uploadToDb";
import SessionDetails from "./Containers/SessionDetails/sessionDetails";
import PaymentsPage from "./Containers/PaymentPage/paymentsPage";
import MeetingTest from "./Components/MeetingTest/meetingTest";

const Routes = () => {
  return (
    <ThemeProvider theme={theme}>
      <Switch>
        <Route path="/login" exact component={Auth(AuthPage, false)} />
        <Route
          exact
          path="/session/details/:sesId"
          component={Auth(SessionDetails)}
        />
        <Route exact path="/session/:token" component={Meeting} />
        <Route
          exact
          path="/myCourses"
          component={Auth(MyCourses, [userTypes.COLLEGE])}
        />
        <Route
          exact
          path="/mySessions"
          component={Auth(MySessions, [userTypes.COLLEGE, userTypes.STUDENT])}
        />

        <Route
          exact
          path="/payment-plans"
          component={Auth(PaymentsPage, [userTypes.COLLEGE])}
        />

        <Route exact path="/filesToDB" component={UploadToDb} />
        <Route exact path="/test-meet-load" component={MeetingTest} />
        <Route path="/" component={Auth(Home)} />
      </Switch>
    </ThemeProvider>
  );
};

export default Routes;
