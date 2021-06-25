import api from "./index";

const signUp = async (userType, userDetails, cb) => {
  await api
    .post(`/user/register?type=${userType}`, userDetails)
    .then((response) => {
      console.log(response.data);
      return cb(null);
    })
    .catch((err) => {
      console.log(err);
      return cb(err);
    });
};

const signIn = async (userType, userDetails, cb) => {
  await api
    .post(`/user/login?type=${userType}`, userDetails)
    .then((response) => cb(response.data))
    .catch((err) => {
      console.log(err);
      return cb(null);
    });
};

const authDetails = async (cb) => {
  await api
    .get("/user/auth")
    .then((response) => cb(null, response.data))
    .catch(cb);
};

const logout = async (cb) => {
  await api
    .get("/user/logout")
    .then((response) => cb(null, response.data))
    .catch(cb);
};

export { signUp, signIn, authDetails, logout };
