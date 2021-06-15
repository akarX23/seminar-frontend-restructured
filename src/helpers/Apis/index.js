import axios from "axios";

const api = axios.create({
  baseURL:
    process.env.REACT_APP_SERVER_DOMAIN + ":" + process.env.REACT_APP_PORT,
});

export default api;
