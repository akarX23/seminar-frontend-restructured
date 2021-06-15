import { makeStyles } from "@material-ui/core";
import React, { useState } from "react";
import LeftAuthBox from "../../Components/LeftBox/leftAuthBox";
import AuthForm from "../../Components/Forms/authForm";

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 30,
  },
  header: {
    fontSize: 50,
    fontWeight: theme.typography.fontWeightRegular,
    marginTop: 50,
  },
}));

const AuthPage = () => {
  const classes = useStyles();

  const [login, setLogin] = useState(false);

  return (
    <>
      <h1 className={`padding-alignment ${classes.header}`}>
        {login ? "Log In to your account" : "Sign Up for an account"}
      </h1>
      <div className={classes.container}>
        <LeftAuthBox
          loginActive={login}
          toggleAuthState={() => setLogin(!login)}
        />
        <AuthForm loginActive={login} />
      </div>
    </>
  );
};

export default AuthPage;
