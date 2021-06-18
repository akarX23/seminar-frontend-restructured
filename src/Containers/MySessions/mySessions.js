import { makeStyles } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import SessionCard from "../../Components/SessionCard/SessionCard";
import { getCollegeSubscribedSessions } from "../../helpers/Apis/college";
import {
  getCollegeSponsoredSessions,
  getStudRegSessions,
} from "../../helpers/Apis/student";
import { userTypes } from "../../helpers/utils";
import Loading from "../../WidgetsUI/Loading/loading";

const useStyles = makeStyles((theme) => ({
  heading: {
    fontSize: 40,
    margin: "80px 0 80px",
    fontWeight: theme.typography.fontWeightMedium,
  },
}));

const MySessions = ({ user: { details, type } }) => {
  const classes = useStyles();

  const [sessions, setSessions] = useState([]);
  const [dislpaySessions, setDislpaySessions] = useState([]);
  const [clgSubscribed, setClgSubscribed] = useState([]);
  const [clgSponsored, setClgSponsored] = useState([]);
  const [studentSub, setStudentSub] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (type === userTypes.COLLEGE) {
      getCollegeSubscribedSessions(details.id, (sessionIds, sessions) => {
        setClgSubscribed([...sessionIds]);
        setSessions([...sessions]);
        setDislpaySessions([...sessions]);
        setLoading(false);
      });
    } else if (type === userTypes.STUDENT) {
      getStudRegSessions(details.id, (sessions) => {
        getCollegeSponsoredSessions(details.collegeId, details.id, (sesIds) => {
          setSessions([...sessions]);
          setDislpaySessions([...sessions]);
          setClgSponsored([...sesIds]);
          setStudentSub([...sessions.map((session) => session.id)]);
          setLoading(false);
        });
      });
    } else {
      setLoading(false);
    }
  }, []);

  const changeSubscribedList = (filteredSessionIds) => {
    let newSessions = [
      ...sessions.filter((session) => filteredSessionIds.includes(session.id)),
    ];
    setClgSubscribed([...filteredSessionIds]);
    setSessions([...newSessions]);
    setDislpaySessions([...newSessions]);
  };

  const changeStudentSessions = (filteredSessionIds) => {
    console.log(studentSub);
    let newSessions = [
      ...sessions.filter((session) => filteredSessionIds.includes(session.id)),
    ];
    console.log(filteredSessionIds);
    setStudentSub([...filteredSessionIds]);
    setSessions([...newSessions]);
    setDislpaySessions([...newSessions]);
  };

  return (
    <div className="padding-alignment">
      <h1 className={classes.heading}>
        You are subscribed to the following sessions:
      </h1>

      {loading ? (
        <Loading />
      ) : (
        <div className={`sessions_wrapper`}>
          {dislpaySessions !== undefined && dislpaySessions.length !== 0 ? (
            dislpaySessions.map((session, i) => {
              return (
                <SessionCard
                  key={session.id}
                  {...session}
                  sessionsRegistered={clgSubscribed}
                  setSessionsRegistered={changeSubscribedList}
                  collegeSessions={clgSponsored}
                  studentSubscribedSessions={studentSub}
                  changeStudentSessions={changeStudentSessions}
                />
              );
            })
          ) : (
            <>
              <h4>You haven't subscribed to any sessions!</h4>
            </>
          )}
        </div>
      )}
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({}, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(MySessions);
