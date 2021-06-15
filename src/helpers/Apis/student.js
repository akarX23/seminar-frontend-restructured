import { extractSessionIds } from "../utils";
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

export { getCollegeSponsoredSessions, studentSubscribeSession };
