import React, { useState } from "react";
import Dialog from "@material-ui/core/Dialog";
import { makeStyles } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { grey } from "@material-ui/core/colors";

const useStyles = makeStyles((theme) => ({
  dialog: {
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.common.black,
    minWidth: "500px",
    boxShadow: "none",
    paddingBottom: 10,
    width: "100%",
    boxSizing: "border-box",
    paddingLeft: 20,
  },
  dialogTitle: {
    width: "100%",
    boxSizing: "border-box",
    fontSize: 30,
  },
  closeIcon: {
    position: "absolute",
    top: 0,
    right: 0,
    color: "black",
  },
  inputWrapper: {
    width: "100%",
    display: "flex",
    justifyContent: "space-evenly",
    marginBottom: 20,
  },
  input: {
    "&::placeholder": {
      textOverflow: "ellipsis !important",
      color: grey,
    },
    color: theme.palette.common.black,
    ...theme.typography.h5,
    textAlign: "center",
  },
}));

const BuySessions = ({ open, buySessions, closeDialog }) => {
  const classes = useStyles();

  const [sessionCount, setSessionCount] = useState("");

  return (
    <Dialog
      open={open}
      classes={{ paper: classes.dialog }}
      onClose={(event) => closeDialog(false)}
    >
      <div className={classes.dialogTitle}>
        <p>Buy Session Credits</p>
        <IconButton
          className={classes.closeIcon}
          onClick={(event) => closeDialog(false)}
        >
          <CloseIcon />
        </IconButton>
      </div>
      <div className={classes.inputWrapper}>
        <TextField
          placeholder="Add..."
          classes={{ root: classes.input }}
          InputProps={{ classes: { input: classes.input } }}
          value={sessionCount}
          onChange={(event) => setSessionCount(event.target.value)}
          type="number"
        />
        <Button
          onClick={() => buySessions(sessionCount)}
          color="primary"
          variant="contained"
        >
          buy
        </Button>
      </div>
    </Dialog>
  );
};

export default BuySessions;
