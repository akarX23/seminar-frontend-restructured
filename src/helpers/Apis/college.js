import { extractCourses, extractSessionIds, extractSessions } from "../utils";
import api from "./index";

const addSessions = async (sessions_bought, collegeId, cb) => {
  return await api
    .put(`/college/buy_sessions?collegeId=${collegeId}`, {
      sessions_bought,
    })
    .then((result) => {
      return cb(result.data[0]);
    })
    .catch((err) => {
      console.log(err);
      return cb(null);
    });
};

const getUnivCoursesAndSessions = async (univId, cb) => {
  return await api
    .get(`/college/univ_courses?univId=${univId}`)
    .then((result) => {
      const courses = extractCourses(result.data);
      const sessions = extractSessions(result.data);
      cb([...courses], [...sessions]);
    })
    .catch((error) => {
      console.log(error);
      return cb(null);
    });
};

const getCollegeSubscribedSessions = async (collegeId, cb) => {
  return await api
    .get(`/course/col_sub_sessions?collegeId=${collegeId}`)
    .then((result) => {
      const sessionIds = extractSessionIds(result.data);
      const sessions = extractSessions(result.data);
      return cb(sessionIds, sessions);
    })
    .catch((err) => {
      console.log(err);
      return cb(null);
    });
};

const collegeSubscribeSesion = async (collegeId, courseId, sesId, cb) => {
  return await api
    .post("/college/subscribe_session", { collegeId, courseId, sesId })
    .then((result) => {
      if (result.data) {
        return cb(true);
      } else cb(false);
    })
    .catch((err) => {
      console.log(err);
      return cb(null);
    });
};

const unsubSession = async (collegeId, sesId, cb) => {
  return await api
    .delete(`/college/unsub_session?collegeId=${collegeId}&sesId=${sesId}`)
    .then((result) => {
      return cb(result.data);
    })
    .catch((err) => {
      console.log(err);
      return cb(null);
    });
};

const getAllUnivs = async (cb) => {
  return await api
    .get("/univ/all")
    .then((result) => {
      return cb(result.data);
    })
    .catch((err) => {
      console.log(err);
      return cb(null);
    });
};

const getAllColleges = async (cb) => {
  return await api
    .get(`/college/all`)
    .then((result) => {
      return cb(result.data);
    })
    .catch((err) => {
      console.log(err);
      return cb(null);
    });
};

const uploadCSV = async (students, courseId, collegeId, cb) => {
  return await api
    .post(
      `/college/upload_csv_to_course?courseId=${courseId}&collegeId=${collegeId}`,
      { students }
    )
    .then((result) => {
      return cb(result.data);
    })
    .catch((err) => {
      console.log(err);
      return cb(err);
    });
};

export {
  addSessions,
  getUnivCoursesAndSessions,
  getCollegeSubscribedSessions,
  collegeSubscribeSesion,
  unsubSession,
  getAllUnivs,
  getAllColleges,
  uploadCSV,
};
