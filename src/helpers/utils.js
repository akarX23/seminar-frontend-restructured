import { createMuiTheme } from "@material-ui/core";
var formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "INR",

  // These options are needed to round to whole numbers if that's what you want.
  //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
  maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
});

const userTypes = {
  COLLEGE: "college",
  SPEAKER: "speaker",
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

const paymentPlans = [
  {
    planName: "Basic Plus (B+)",
    price: 2000,
    students: 75,
    faculties: 2,
    features: [
      "Live Online Session",
      "Calendar Invites",
      "Reminder mail to students",
      "Pre-reading material",
      "Quiz & Assessment",
      "Interactive Q & A with speaker",
    ],
  },
  {
    planName: "Advance (A)",
    price: 3000,
    students: 100,
    faculties: 5,
    features: [
      "All features in B+",
      "Social Media Branding Poster",
      "Student Attendance Report",
      "Student Certificate",
      "Follow-up reading material",
      "Session's Report (Accreditation Purpose)",
    ],
  },
  {
    planName: "Advance Plus (A+)",
    price: 5000,
    students: 150,
    faculties: 10,
    features: [
      "All features in A",
      "Breakout sessions",
      "Session's Recording",
      "Thanking mail to speaker",
      "Monthly Reports",
    ],
  },
];

const getFormattedPrice = (price) => {
  let formattedPrice = formatter.format(price);
  return formattedPrice[0] + " " + formattedPrice.substring(1);
};

export {
  userTypes,
  theme,
  extractCourses,
  extractSessions,
  extractSessionIds,
  extractCourseIds,
  sesCreditAmount,
  paymentPlans,
  getFormattedPrice,
};
