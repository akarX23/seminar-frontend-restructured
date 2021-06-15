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
    if (!courseIds.includes(details.course.id)) {
      courseIds.push(details.course.id);
      courses.push(details.course);
    }
  });

  return courses;
};

const extractSessions = (detailedArray) => {
  const sessions = [];
  let sessionIds = [];
  detailedArray.forEach((details) => {
    if (details.session && sessionIds.includes(details.session.id) === false) {
      sessions.push({ ...details.session, courseId: details.courseId });
      sessionIds.push(details.session.id);
    }
  });

  return sessions;
};

const extractSessionIds = (detailedArray) => {
  let sessionIds = [];
  sessionIds = detailedArray.map((details) => details.session.id);
  sessionIds = [...new Set(sessionIds)];
  return sessionIds;
};

export { userTypes, theme, extractCourses, extractSessions, extractSessionIds };
