import React, { useState } from "react";
import { getFormattedPrice, paymentPlans } from "../../helpers/utils";
import PlanCard from "../../Components/PlanCard/planCard";
import { makeStyles } from "@material-ui/core";
import useRazorpay from "../../helpers/useRazorpay";
import Modal from "../../WidgetsUI/Modal/modal";
import { collegeSubscribesPlan } from "../../actions/user_actions";

import "./paymentsPage.css";

import { grey } from "@material-ui/core/colors";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

const useStyles = makeStyles((theme) => ({
  input: {
    width: 80,
    padding: 10,
    "&:focus": {
      borderColor: "black !important",
    },
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

const PaymentsPage = ({ user: { details, type }, collegeSubscribesPlan }) => {
  const classes = useStyles();
  const handlePayment = useRazorpay();

  const [showDialog, setShowDialog] = useState(false);
  const [planId, setPlanId] = useState(0);
  const [sessionCount, setSessionCount] = useState(0);
  const [paymentInProgress, setPaymentInProgress] = useState(false);

  const getPriceOfOwnedSessions = (newPlanId) => {
    const { planId, session_count } = details;
    if (!planId) return 0;

    const amount =
      session_count *
      (paymentPlans[newPlanId].price - paymentPlans[planId].price);

    return amount;
  };

  const getTotalPrice = () => {
    return (
      sessionCount * paymentPlans[planId].price +
      getPriceOfOwnedSessions(planId)
    );
  };

  const selectPlan = (planId) => {
    setPlanId(planId);
    setShowDialog(true);
  };

  const changeSessionCount = (value) => {
    // && value < 100
    if (value > 0 || value === "") setSessionCount(value);
  };

  const initiateTransaction = async () => {
    if (sessionCount < 1 || sessionCount === "") {
      alert("You need to buy at least one session!");
      return;
    }

    setPaymentInProgress(true);

    const totalPrice = getTotalPrice();
    const newSesCount =
      parseInt(details.session_count) + parseInt(sessionCount);

    handlePayment(
      { amount: totalPrice },
      {
        name: details.name,
        description: `Subscription for ${paymentPlans[planId].planName} Plan`,
        prefill: {
          name: details.rep_name,
          email: details.email,
          contact: details.phone,
        },
      },
      () => {
        setPaymentInProgress(false);
      },
      async (verifiedData) => {
        if (!verifiedData) {
          alert("Your transaction timed out!");
          setPaymentInProgress(true);
          setShowDialog(false);
          return;
        }
        await collegeSubscribesPlan(details.id, newSesCount, planId);
        setShowDialog(false);
        setPaymentInProgress(false);
      }
    );
  };

  const renderPriceDetails = () => {
    const { planName, price, students, faculties } = paymentPlans[planId];

    return (
      <div className={classes.container}>
        <h6>{planName}</h6>
        <p>Students allowed per session = {students}</p>
        <p>Faculties allowed per session = {faculties}</p>
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
              onChange={(event) => changeSessionCount(event.target.value)}
              type="number"
              autoFocus
              placeholder="Add..."
            />
          </p>
        </div>
        {getPriceOfOwnedSessions(planId) !== 0 && (
          <div className="price-calc">
            <p>Extra amount for sessions present</p>
            <p>{getFormattedPrice(getPriceOfOwnedSessions(planId))}</p>
          </div>
        )}
        <div className="price-calc">
          <p>Price to pay</p>
          <p> {getFormattedPrice(getTotalPrice())}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="padding-alignment">
      {details.planId ? (
        <h2>You current plan : {paymentPlans[details.planId].planName}</h2>
      ) : (
        <h2>You haven't subscribed to any plans yet.</h2>
      )}
      <div className="plans-wrapper">
        {paymentPlans.map((plan, i) => (
          <PlanCard
            key={i}
            {...plan}
            selectPlan={selectPlan}
            subPlan={details.planId}
            id={i}
          />
        ))}
      </div>
      <Modal
        open={showDialog}
        closeDialog={setShowDialog}
        heading="Buy Credits as per plan"
        buttonTxt="Complete Payment"
        onSubmit={initiateTransaction}
        actionInProgress={paymentInProgress}
      >
        {renderPriceDetails()}
      </Modal>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({ collegeSubscribesPlan }, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(PaymentsPage);
