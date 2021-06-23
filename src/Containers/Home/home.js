import { Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import TextField from "@material-ui/core/TextField";
import { grey } from "@material-ui/core/colors";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import Filters from "./homePageFilters";
import "./home.css";
import { userTypes } from "../../helpers/utils";
import {
  getCollegeSubscribedSessions,
  getUnivCoursesAndSessions,
} from "../../helpers/Apis/college";
import { getAllSessions } from "../../helpers/Apis/sessions";
import {
  getCollegeSponsoredSessions,
  getStudRegSessions,
} from "../../helpers/Apis/student";
import SessionCard from "../../Components/SessionCard/SessionCard";
import InputAdornment from "@material-ui/core/InputAdornment";
import SearchIcon from "@material-ui/icons/Search";
import Loading from "../../WidgetsUI/Loading/loading";

const useStyles = makeStyles((theme) => ({
  header: {
    backgroundColor: theme.palette.primary.main,
    lineHeight: 2,
    width: "100%",
  },
  h1: {
    color: theme.palette.common.white,
    fontSize: "60px",
    margin: "20px 0",
  },
  para: {
    color: theme.palette.common.white,
    fontSize: "25px",
    width: "70%",
    lineHeight: "30px",
    letterSpacing: "0.01em",
  },
  search: {
    width: "70%",
    marginTop: "50px",
    marginBottom: 70,
    backgroundColor: theme.palette.background.paper,
    borderRadius: "30px",
    "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
      border: "none",
    },
    overflow: "hidden",
  },
  searchInput: {
    backgroundColor: theme.palette.background.paper,
    "&::placeholder": {
      textOverflow: "ellipsis !important",
      color: grey[800],
    },
    ...theme.typography.subtitle1,
    color: theme.palette.common.black,
    padding: 13,
    borderRadius: "10px",
  },
  sesHeading: {
    fontSize: 40,
    color: theme.palette.common.black,
    fontWeight: theme.typography.fontWeightRegular,
  },
  bodyHeader: {
    display: "flex",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
  },
  searchIcon: {
    color: theme.palette.common.black,
  },
  loading: {
    marginTop: 50,
  },
}));

const Home = ({ user: { details, type } }) => {
  const classes = useStyles();

  const [sessions, setSessions] = useState([]);
  const [dislpaySessions, setDisplaySessions] = useState([]);
  const [clgSubscribed, setClgSubscribed] = useState([]);
  const [clgSponsored, setClgSponsored] = useState([]);
  const [courses, setCourses] = useState([]);
  const [studentSub, setStudentSub] = useState([]);

  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (type === userTypes.COLLEGE) {
      getUnivCoursesAndSessions(details.univId, (courses, sessions) => {
        getCollegeSubscribedSessions(details.id, (sessionIds) => {
          setCourses(courses);
          setSessions(sessions);
          formatSessionList(sessions);
          setClgSubscribed(sessionIds);
          setLoading(false);
        });
      });
    } else {
      getAllSessions((sessions) => {
        if (type === userTypes.STUDENT) {
          getCollegeSponsoredSessions(
            details.collegeId,
            details.id,
            (sesIds) => {
              getStudRegSessions(details.id, (sessions) => {
                setStudentSub([...sessions.map((session) => session.id)]);
                setClgSponsored(sesIds);
              });
            }
          );
        }
        setSessions(sessions);
        formatSessionList(sessions);
        setLoading(false);
      });
    }
  }, []);

  const formatSessionList = (newList) => {
    console.log(newList);
    let subbedIds = [];
    let modifiedList = [];
    if (type === userTypes.COLLEGE) subbedIds = [...clgSubscribed];
    else if (type === userTypes.STUDENT) subbedIds = [...studentSub];

    modifiedList = [
      ...newList.filter(
        (session) => !session.price && !subbedIds.includes(session.id)
      ),
      ...newList.filter(
        (session) => session.price && !subbedIds.includes(session.id)
      ),
    ];

    setDisplaySessions(modifiedList);
  };

  const changeDisplayList = (type, action, courseId) => {
    if (action === "all") {
      formatSessionList([...sessions]);
      return;
    }

    if (type === "session") {
      let newList;
      if (action === "free")
        newList = sessions.filter((session) => !session.price);
      else if (action === "paid")
        newList = sessions.filter((session) => session.price !== null);
      else if (action === "college")
        newList = sessions.filter((session) =>
          clgSponsored.includes(session.id)
        );

      formatSessionList([...newList]);
    } else {
      console.log(courseId);
      if (!courseId) formatSessionList([...sessions]);
      else
        formatSessionList([
          ...sessions.filter((session) => session.courseId === courseId),
        ]);
    }
  };

  const handleSearch = (event) => {
    event.preventDefault();
    setSearchText(event.target.value);
    formatSessionList(
      sessions.filter(
        (item) => item.topic.toLowerCase().includes(event.target.value) === true
      )
    );
  };

  return (
    <>
      <div className={`padding-alignment ${classes.header}`}>
        <p className={classes.h1}>Dashboard</p>
        <p className={classes.para}>
          Seminar Rooms is an online platform to enhance the teaching-learning
          process with online seminars by experts in their field
        </p>
        {!details && (
          <Button className="how-it-works" href="#">
            HOW IT WORKS &thinsp; &#10095;
          </Button>
        )}
        <p></p>
        <TextField
          placeholder="Search for sessions..."
          variant="outlined"
          className={classes.search}
          value={searchText}
          onChange={handleSearch}
          InputProps={{
            classes: { input: classes.searchInput },
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon className={classes.searchIcon} />
              </InputAdornment>
            ),
          }}
        />
      </div>
      {loading ? (
        <Loading loaderStyles={classes.loading} />
      ) : (
        <>
          <div className={`padding-alignment ${classes.bodyHeader}`}>
            <p className={classes.sesHeading}>Recommended Sessions</p>
            <Filters
              type={type}
              courses={courses}
              changeSessionDisplay={changeDisplayList}
              details={details}
            />
          </div>
          <div className={`padding-alignment sessions_wrapper`}>
            {dislpaySessions !== undefined && dislpaySessions.length !== 0 ? (
              dislpaySessions.map((session, i) => {
                return (
                  <SessionCard
                    {...session}
                    sessionsRegistered={clgSubscribed}
                    setSessionsRegistered={setClgSubscribed}
                    collegeSessions={clgSponsored}
                    studentSubscribedSessions={studentSub}
                    changeStudentSessions={setStudentSub}
                    key={i}
                  />
                );
              })
            ) : (
              <>
                <h4>No sessions to display!</h4>
              </>
            )}
          </div>
        </>
      )}
    </>
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

export default connect(mapStateToProps, mapDispatchToProps)(Home);
