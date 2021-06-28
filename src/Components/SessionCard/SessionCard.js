import React, { useState } from "react";
import "./sessionCard.css";
import img1 from "../../assets/images/img1.png";
import { userTypes } from "../../helpers/utils";
import {
  collegeSubscribeSesion,
  unsubSession,
} from "../../helpers/Apis/college";
import {
  studentSubscribeSession,
  studentUnregSession,
} from "../../helpers/Apis/student";
import { changeSessionCount } from "../../actions/user_actions";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { Button, makeStyles } from "@material-ui/core";
import Loading from "../../WidgetsUI/Loading/loading";
import { blueGrey } from "@material-ui/core/colors";
import { useHistory } from "react-router-dom";
import Alert from "../../WidgetsUI/Alert/alert";

const useStyles = makeStyles((theme) => ({
  link: {
    color: theme.palette.info.main,
    textDecoration: "underline !important",
    "&:hover": { color: theme.palette.info.dark },
    fontSize: 15,
  },
  action: {
    borderRadius: 6,
    padding: "3px 7px",
    backgroundColor: theme.palette.secondary.main,
    fontSize: 15,
    color: "white",
    boxShadow: theme.shadows[10],
    "&:hover": {
      backgroundColor: theme.palette.secondary.dark,
    },
  },
  loaderStyles: {
    color: blueGrey[800],
  },
}));

const SessionCard = ({
  id,
  desc,
  start_time,
  schedule_info,
  price,
  topic,
  speaker,
  sessionsRegistered,
  setSessionsRegistered,
  courseId,
  subject,
  collegeSessions,
  user: { details, type },
  changeSessionCount,
  studentSubscribedSessions,
  changeStudentSessions,
  key,
}) => {
  const classes = useStyles();

  const history = useHistory();

  const [actionLoad, setActionLoad] = useState(false);
  const [alertInfo, setAlertInfo] = useState({
    text: "",
    showAlert: false,
    severity: "",
  });

  const subscribeSession = async (sessionId) => {
    setActionLoad(true);
    const { session_count } = details;
    if (session_count < 1) {
      setAlertInfo({
        showAlert: true,
        text: "You don't have enough credits!",
        severity: "warning",
      });
      setActionLoad(false);
      return;
    }

    await collegeSubscribeSesion(
      details.id,
      courseId,
      sessionId,
      async (subscribed) => {
        if (subscribed) {
          await changeSessionCount(session_count - 1);
          setSessionsRegistered([...sessionsRegistered, sessionId]);
          setAlertInfo({
            showAlert: true,
            text: "Subscription Successful!",
          });
        } else
          setAlertInfo({
            showAlert: true,
            text: "Something went wrong! Please try again later.",
            severity: "error",
          });
        setActionLoad(false);
      }
    );
  };

  const studentRegisterSession = async (sesId) => {
    setActionLoad(true);
    await studentSubscribeSession(
      { sesId, courseId, studentId: details.id },
      (response) => {
        if (response.success) {
          setAlertInfo({
            showAlert: true,
            text: "Subscription Successful!",
          });
          changeStudentSessions([...studentSubscribedSessions, sesId]);
        } else
          setAlertInfo({
            showAlert: true,
            text: "Something went wrong! Please try again later.",
            severity: "error",
          });
        setActionLoad(false);
      }
    );
  };

  const studentUnregisterSession = (sesId) => {
    setActionLoad(true);
    studentUnregSession({ sesId, studentId: details.id }, (success) => {
      if (!success) {
        setAlertInfo({
          showAlert: true,
          text: "Something went wrong! Please try again later.",
          severity: "error",
        });
        setActionLoad(false);
        return;
      }

      let filteredSessions = studentSubscribedSessions.filter(
        (sessionId) => sesId !== sessionId
      );
      setAlertInfo({
        showAlert: true,
        text: "You have unsubscribed from the session.",
      });
      changeStudentSessions(filteredSessions);
      setActionLoad(false);
    });
  };

  const clgUnsubSession = async (sesId) => {
    const { session_count } = details;
    setActionLoad(true);

    await unsubSession(details.id, sesId, async (deleteResponse) => {
      if (deleteResponse) {
        let filteredSessions = sessionsRegistered.filter(
          (sessionId) => sesId !== sessionId
        );
        setAlertInfo({
          showAlert: true,
          text: "You have unsubscribed from the session.",
        });
        changeSessionCount(session_count + 1);
        setSessionsRegistered([...filteredSessions]);
      } else {
        setAlertInfo({
          showAlert: true,
          text: "Something went wrong! Please try again later.",
          severity: "error",
        });
      }
      setActionLoad(false);
    });
  };

  const sessionAction = () => {
    if (!details)
      return (
        <p>
          <a className={classes.link} href="/login">
            Log In
          </a>{" "}
          to register
        </p>
      );

    const sessionJoined = sessionsRegistered?.includes(id);
    const studSub = studentSubscribedSessions?.includes(id);

    if (type === userTypes.COLLEGE && !sessionJoined) {
      return (
        <Button className={classes.action} onClick={() => subscribeSession(id)}>
          Add
        </Button>
      );
    } else if (type === userTypes.COLLEGE && sessionJoined) {
      return (
        <Button className={classes.action} onClick={() => clgUnsubSession(id)}>
          Unsubscribe
        </Button>
      );
    } else if (type === userTypes.STUDENT && !studSub) {
      return (
        <Button
          className={classes.action}
          onClick={() => studentRegisterSession(id)}
        >
          Register
        </Button>
      );
    } else if (type === userTypes.STUDENT && studSub) {
      return (
        <Button
          className={classes.action}
          onClick={() => studentUnregisterSession(id)}
        >
          Unregister
        </Button>
      );
    }
  };

  const combineDescription = () => {
    let descString = "";
    if (desc.some((item) => item !== null)) {
      desc.forEach((item) => {
        if (item) descString = descString + item + " ";
      });
    }

    if (descString) return <p className="ses-info-text desc">{descString}</p>;
  };

  const getPriceType = () => {
    let priceText = "";

    if (type === userTypes.STUDENT && collegeSessions.includes(id))
      priceText = "Sponsored";
    else if (!price) priceText = "Free";
    else priceText = "Paid";

    return (
      <div className="ses-info-price">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="price-tag-icon"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z"
            clipRule="evenodd"
          />
        </svg>
        <p>{priceText}</p>
      </div>
    );
  };

  const redirect = () => history.push(`/session/details/${id}`);

  return (
    <div className="ses-card-wrapper" key={key}>
      <img
        src={img1}
        className="ses-card-img right-margin"
        onClick={redirect}
      />
      <div className="ses-card-content">
        <div onClick={redirect}>
          <h5 className="ses-info-topic">
            <b>{topic.trim()}</b>
          </h5>
          <hr />
        </div>
        <div className="ses-info" onClick={redirect}>
          {/* {combineDescription()} */}
          <p className="ses-info-text">{speaker && speaker.name}</p>
          {subject && (
            <p className="ses-info-text">
              {/* <b>Subject : </b> */}
              {subject}
            </p>
          )}
          {/* <p>
            <b>Start Time : </b> {start_time ? start_time : "Not yet Scheduled"}
          </p> */}
          <p className="ses-info-text">
            <b>Schedule Info : </b>
            {schedule_info ? schedule_info : "Not yet Scheduled"}
          </p>
        </div>
        <div className="ses-action-wrapper">
          {getPriceType()}
          {actionLoad ? (
            <div>
              <Loading loaderStyles={classes.loaderStyles} size={19} />
            </div>
          ) : (
            sessionAction()
          )}
        </div>
      </div>
      <Alert {...alertInfo} closeAlert={setAlertInfo} />
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators(
    {
      changeSessionCount,
    },
    dispatch
  ),
});

export default connect(mapStateToProps, mapDispatchToProps)(SessionCard);
