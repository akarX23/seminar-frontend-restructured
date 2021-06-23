import { createMuiTheme } from "@material-ui/core";

const userTypes = {
  COLLEGE: "college",
  SPEAKER: "college",
  ADMIN: "admin",
  STUDENT: "student",
};

const theme = createMuiTheme({
  palette: {
    primary: { main: "#1c375b" },
    secondary: { main: "#d2544a", dark: "#cc3d33" },
    background: { paper: "#ececec" },
    text: { primary: "#fff" },
  },
});

const extractCourses = (detailedArray) => {
  let courseIds = [];
  let courses = [];

  detailedArray.forEach((details) => {
    if (!courseIds.includes(details.courseId)) {
      courseIds.push(details.courseId);
      courses.push(details.course);
    }
  });

  return courses;
};

const extractSessions = (detailedArray) => {
  const sessions = [];
  let sessionIds = [];
  detailedArray.forEach((details) => {
    if (details.session && sessionIds.includes(details.sesId) === false) {
      sessions.push({ ...details.session, courseId: details.courseId });
      sessionIds.push(details.sesId);
    }
  });

  return sessions;
};

const extractSessionIds = (detailedArray) => {
  let sessionIds = [];
  sessionIds = detailedArray.map((details) => details.sesId);
  sessionIds = [...new Set(sessionIds)];
  return sessionIds;
};

const extractCourseIds = (detailedArray) => {
  let courseIds = [];
  courseIds = detailedArray.map((details) => details.courseId);
  courseIds = [...new Set(courseIds)];
  return courseIds;
};

const sesCreditAmount = 200;

export {
  userTypes,
  theme,
  extractCourses,
  extractSessions,
  extractSessionIds,
  extractCourseIds,
  sesCreditAmount,
};
