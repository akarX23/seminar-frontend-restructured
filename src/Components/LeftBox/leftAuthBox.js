import { makeStyles, Button } from "@material-ui/core";
import { grey } from "@material-ui/core/colors";
import React from "react";

const useStyles = makeStyles((theme) => ({
  box: {
    backgroundColor: grey[800],
    textAlign: "center",
    padding: "100px 0",
    color: theme.palette.common.white,
    "& h4": {
      fontSize: 22,
      fontWeight: theme.typography.fontWeightMedium,
      margin: 0,
      marginBottom: 30,
    },
    width: 500,
  },
  toggle: {
    borderColor: "white !important",
    "&:hover": {
      backgroundColor: theme.palette.common.white,
      color: theme.palette.common.black,
    },
    fontWeight: theme.typography.fontWeightBold,
    letterSpacing: "0.1em",
  },
}));

const LeftAuthBox = ({ loginActive, toggleAuthState }) => {
  const classes = useStyles();

  return (
    <div className={classes.box}>
      <h4>
        {loginActive ? "Don't have an account?" : "Already have an account?"}
      </h4>
      <Button
        variant="outlined"
        onClick={toggleAuthState}
        classes={{ root: classes.toggle }}
      >
        {loginActive ? "Sign Up" : "Sign In"}
      </Button>
    </div>
  );
};

export default LeftAuthBox;
