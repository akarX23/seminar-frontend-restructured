import React from "react";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";

function AlertUI(props) {
  return <MuiAlert elevation={6} variant="standard" {...props} />;
}

const Alert = ({ showAlert, text, severity, closeAlert }) => {
  return (
    <Snackbar
      open={showAlert}
      autoHideDuration={4000}
      onClose={() => closeAlert({ showAlert: false, text, severity })}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
      <AlertUI
        onClose={() => closeAlert({ showAlert: false, text, severity })}
        severity={severity ? severity : "success"}
      >
        {text}
      </AlertUI>
    </Snackbar>
  );
};

export default Alert;
