import React, { useState } from "react";
import { makeStyles } from "@material-ui/core";
import { grey } from "@material-ui/core/colors";
import useRazorpay from "../../helpers/useRazorpay";
import { getFormattedPrice, paymentPlans } from "../../helpers/utils";
import Modal from "../../WidgetsUI/Modal/modal";
import Alert from "../../WidgetsUI/Alert/alert";

const useStyles = makeStyles((theme) => ({
  input: {
    "&::placeholder": {
      textOverflow: "ellipsis !important",
      color: grey,
    },
    color: theme.palette.common.black,
    ...theme.typography.h5,
    textAlign: "center",
  },
  container: {
    paddingRight: 20,
    "& h6": {
      marginTop: 0,
      fontSize: 30,
      marginBottom: 0,
      fontWeight: 550,
      color: grey[900],
    },
  },
}));

const BuySessions = ({ open, onTransactionComplete, closeDialog, details }) => {
  const classes = useStyles();
  const handlePayment = useRazorpay();

  const [sessionCount, setSessionCount] = useState(0);
  const [alertInfo, setAlertInfo] = useState({
    text: "",
    showAlert: false,
    severity: "",
  });

  const initiateSessionTransaction = () => {
    if (sessionCount < 1) {
      setAlertInfo({
        showAlert: true,
        text: "You need to buy at least one session.",
        severity: "info",
      });
      return;
    }

    handlePayment(
      // amount and receipt_id required
      {
        amount: paymentPlans[details.planId].price * sessionCount,
      },
      // Properties of the modal
      {
        name: details.name,
        description: "Buy Session Credits",
        prefill: {
          name: details.rep_name,
          email: details.email,
          contact: details.phone,
        },
      },
      // When user closes the modal, this function has to be called
      () => closeDialog(false),
      // On successfull payment this is called
      (verifiedData) => onTransactionComplete(sessionCount, verifiedData)
    );
  };

  const renderModalContent = () => {
    if (!paymentPlans[details.planId]) return;
    const { planName, price } = paymentPlans[details.planId];

    return (
      <div className={classes.container}>
        <h6>{planName}</h6>
        <div className="price-calc">
          <p>Price per session</p>
          <p> {getFormattedPrice(price)}</p>
        </div>
        <div className="price-calc">
          <p>Number of sessions you want to buy</p>
          <p>
            <input
              className="session-count"
              value={sessionCount === 0 ? "" : sessionCount}
              onChange={(event) => setSessionCount(event.target.value)}
              type="number"
              autoFocus
              placeholder="Add..."
            />
          </p>
        </div>
        <div className="price-calc">
          <p>Price to pay</p>
          <p> {getFormattedPrice(price * sessionCount)}</p>
        </div>
      </div>
    );
  };

  return (
    <>
      <Modal
        open={open}
        closeDialog={closeDialog}
        heading="Buy Session Credits"
        buttonTxt="Buy"
        onSubmit={initiateSessionTransaction}
      >
        {renderModalContent()}
      </Modal>
      <Alert {...alertInfo} closeAlert={setAlertInfo} />
    </>
  );
};

export default BuySessions;
