import React from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
import "./loading.css";
import { makeStyles } from "@material-ui/core";
import { blueGrey } from "@material-ui/core/colors";

const useStyles = makeStyles((theme) => ({
  loading: {
    color: blueGrey[800],
    marginTop: 30,
  },
}));

const Loading = ({ fullPage, loaderStyles, size }) => {
  const classes = useStyles();

  return (
    <div className={fullPage ? "full-page-loading" : "part-loading"}>
      <CircularProgress
        size={size ? size : 35}
        className={loaderStyles ? loaderStyles : classes.loading}
      />
    </div>
  );
};

export default Loading;
