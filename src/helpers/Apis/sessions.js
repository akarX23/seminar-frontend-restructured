import { extractSessions } from "../utils";
import api from "./index";

const getAllSessions = async (cb) => {
  return await api
    .get(`/course/all`)
    .then((result) => {
      const sessions = extractSessions(result.data);
      return cb(sessions);
    })
    .catch((err) => {
      console.log(err.message);
      return cb(null);
    });
};

const getSessionData = async (id, cb) => {
  return await api
    .get(`/session/get_one?id=${id}`)
    .then((result) => {
      return cb(result.data);
    })
    .catch((err) => {
      console.log(err);
      return cb(null);
    });
};

export { getAllSessions, getSessionData };
