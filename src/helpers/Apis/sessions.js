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
      console.log(err);
      return cb(null);
    });
};

export { getAllSessions };
