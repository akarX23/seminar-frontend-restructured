import { extractSessionIds, extractSessions } from "../utils";
import api from "./index";

const getCollegeSponsoredSessions = async (collegeId, studentId, cb) => {
  return await api
    .get(
      `/course/college_bought_courses?collegeId=${collegeId}&studentId=${studentId}`
    )
    .then((result) => {
      console.log(result.data);
      const sessionIds = extractSessionIds(result.data);
      return cb(sessionIds);
    })
    .catch((err) => cb(null));
};

const studentSubscribeSession = async (data, cb) => {
  return await api.post(`/student/register_session`, data).then((result) => {
    return cb(result.data);
  });
};

const getStudRegSessions = async (studentId, cb) => {
  return await api
    .get(`/student/stud_reg_sessions?studentId=${studentId}`)
    .then((result) => {
      const sessions = extractSessions(result.data);
      return cb(sessions);
    });
};

const studentUnregSession = async ({ studentId, sesId }, cb) => {
  return await api
    .get(`/student/stud_unreg_session?studentId=${studentId}&sesId=${sesId}`)
    .then((result) => {
      console.log(result);
      if (result.data.success) cb(result.data.success);
    });
};

export {
  getCollegeSponsoredSessions,
  studentSubscribeSession,
  getStudRegSessions,
  studentUnregSession,
};
