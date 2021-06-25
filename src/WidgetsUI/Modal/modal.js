import React from "react";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import { makeStyles } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Button from "@material-ui/core/Button";
import { grey } from "@material-ui/core/colors";
import Divider from "@material-ui/core/Divider";
import Loading from "../../WidgetsUI/Loading/loading";

const useStyles = makeStyles((theme) => ({
  dialog: {
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.common.black,
    minWidth: "400px",
    boxShadow: "none",
    paddingBottom: 15,
    width: "100%",
    boxSizing: "border-box",
    paddingLeft: 20,
    paddingTop: 10,
    paddingRight: 10,
  },
  dialogTitle: {
    width: "100%",
    boxSizing: "border-box",
    fontSize: 30,
    margin: "0 0 15px 0px",
    "& p": {
      margin: 0,
    },
    color: grey[800],
  },
  closeIcon: {
    position: "absolute",
    top: 0,
    right: 0,
    color: "black",
  },
  divider: {
    background: grey[700],
  },
  bottomDivider: {
    background: grey[700],
    marginTop: 15,
    marginBottom: 10,
  },
  loaderStyles: {
    float: "right",
  },
}));

const Modal = ({
  open,
  closeDialog,
  heading,
  children,
  buttonTxt,
  onSubmit,
  actionInProgress,
}) => {
  const classes = useStyles();

  return (
    <Dialog
      open={open}
      classes={{ paper: classes.dialog }}
      onClose={(event) => closeDialog(false)}
    >
      <div className={classes.dialogTitle}>
        <p>{heading}</p>
        <IconButton
          className={classes.closeIcon}
          onClick={(event) => closeDialog(false)}
        >
          <CloseIcon />
        </IconButton>
      </div>
      {/* <Divider classes={{ root: classes.divider }} /> */}
      {children}
      {/* <Divider classes={{ root: classes.bottomDivider }} /> */}
      <DialogActions>
        {actionInProgress ? (
          <Loading size={25} loaderStyles={classes.loaderStyles} />
        ) : (
          <Button onClick={onSubmit} color="secondary" variant="contained">
            {buttonTxt}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default Modal;
