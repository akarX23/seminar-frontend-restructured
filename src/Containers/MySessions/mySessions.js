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
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import { grey } from "@material-ui/core/colors";

const useStyles = makeStyles((theme) => ({
  heading: {
    fontSize: 40,
    margin: "80px 0 80px",
    fontWeight: theme.typography.fontWeightMedium,
  },
  header: {
    display: "flex",
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
  },
  menu: {
    backgroundColor: theme.palette.common.white,
    paddingLeft: "2px",
    paddingRight: "2px",
    boxShadow: "0 0 4px 2px #000",
    marginTop: 5,
  },
  menuItem: {
    color: theme.palette.common.black,
    borderRadius: "5px",
    "&:hover": {
      backgroundColor: grey[300],
    },
    padding: "5px 7px 5px",
  },
  selectedItem: {
    backgroundColor: `${theme.palette.primary.light} !important`,
    color: "white",
  },
  menuContain: {
    color: "white",
    padding: "10px",
    backgroundColor: `${theme.palette.common.white} !important`,
    color: theme.palette.common.black + " !important",
    fontSize: 17,
    boxShadow: "0 0 5px #000",
  },
  field: {
    "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
      borderColor: "black",
    },
  },
}));

const MySessions = ({ user: { details, type } }) => {
  const classes = useStyles();

  const [sessions, setSessions] = useState([]);
  const [dislpaySessions, setDislpaySessions] = useState([]);
  const [clgSubscribed, setClgSubscribed] = useState([]);
  const [clgSponsored, setClgSponsored] = useState([]);
  const [studentSub, setStudentSub] = useState([]);
  const [courses, setCourses] = useState([]);
  const [courseList, setCourseList] = useState(-1);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (type === userTypes.COLLEGE) {
      getCollegeSubscribedSessions(
        details.id,
        (sessionIds, sessions, courses) => {
          console.log(courses);
          setClgSubscribed([...sessionIds]);
          setSessions([...sessions]);
          setDislpaySessions([...sessions]);
          setCourses([
            { text: "All Courses", value: -1 },
            ...courses.map((course) => {
              return { text: course.name, value: course.id };
            }),
          ]);
          setLoading(false);
        }
      );
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
    let newSessions = [
      ...sessions.filter((session) => filteredSessionIds.includes(session.id)),
    ];
    setStudentSub([...filteredSessionIds]);
    setSessions([...newSessions]);
    setDislpaySessions([...newSessions]);
  };

  const updateSessionList = (courseId) => {
    if (courseId === -1) {
      setDislpaySessions([...sessions]);
      setCourseList(courseId);
      return;
    }

    let newDisplay = sessions.filter(
      (session) => session.courseId === courseId
    );
    setDislpaySessions([...newDisplay]);
    setCourseList(courseId);
  };

  const renderFilter = () => (
    <TextField
      select
      value={courseList}
      onChange={(event) => updateSessionList(event.target.value)}
      classes={{ root: classes.field }}
      variant="outlined"
      SelectProps={{
        classes: {
          root: classes.menuContain,
        },
        MenuProps: {
          classes: {
            paper: classes.menu,
          },
          disableScrollLock: true,
          disablePortal: true,
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "right",
          },
          transformOrigin: {
            vertical: "top",
            horizontal: "right",
          },
          getContentAnchorEl: null,
        },
      }}
    >
      {courses.map((course, i) => (
        <MenuItem
          value={course.value}
          key={i}
          classes={{
            root: classes.menuItem,
            selected: classes.selectedItem,
          }}
        >
          {course.text}
        </MenuItem>
      ))}
    </TextField>
  );

  return (
    <div className="padding-alignment">
      <div className={classes.header}>
        <h1 className={classes.heading}>
          You are subscribed to the following sessions:
        </h1>
        {renderFilter()}
      </div>
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
