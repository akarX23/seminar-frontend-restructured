import {
  UPDATE_SESSIONS,
  CHANGE_SESSION_COUNT,
  LOGIN,
  USER_AUTH,
  SUBSCRIBE_PLAN,
} from "../helpers/ACTION_TYPES.js";
import { addSessions, subscribeToPlan } from "../helpers/Apis/college.js";
import { authDetails, signIn, logout } from "../helpers/Apis/user";

export async function auth() {
  return async function (dispatch) {
    authDetails((err, user) => {
      if (err)
        return dispatch({
          type: USER_AUTH,
          payload: { details: null, type: null },
        });

      return dispatch({
        type: USER_AUTH,
        payload: { details: user.userDetails, type: user.userType },
      });
    });
  };
}

export async function logoutAction() {
  return async function (dispatch) {
    logout((err, data) => {
      if (!err)
        dispatch({
          type: USER_AUTH,
          payload: { details: null, type: null },
        });
    });
  };
}

export async function signInAction(userType, userDetails) {
  return function (dispatch) {
    signIn(userType, userDetails, (user) => {
      console.log(user);
      if (!user) return;
      const details = user.userDetails;
      const type = user.userType;

      return dispatch({ type: LOGIN, payload: { type, details } });
    });
  };
}

export async function collegeAddSessions(collegeId, sessions_bought) {
  return async function (dispatch) {
    let details = JSON.parse(localStorage.getItem("userDetails"));
    let newSesCount =
      parseInt(details.session_count) + parseInt(sessions_bought);

    localStorage.setItem(
      "userDetails",
      JSON.stringify({
        ...details,
        session_count: newSesCount,
      })
    );

    addSessions(sessions_bought, collegeId, (data) => {
      if (data) dispatch({ type: UPDATE_SESSIONS, payload: newSesCount });
    });
  };
}

export async function collegeSubscribesPlan(collegeId, newSesCount, planId) {
  return async function (dispatch) {
    let details = JSON.parse(localStorage.getItem("userDetails"));
    localStorage.setItem(
      "userDetails",
      JSON.stringify({
        ...details,
        session_count: newSesCount,
        planId,
      })
    );

    subscribeToPlan(newSesCount, planId, collegeId, (success) => {
      if (!success) {
        alert("Something went wrong!");
        return;
      }

      dispatch({ type: SUBSCRIBE_PLAN, payload: { newSesCount, planId } });
    });
  };
}

export async function changeSessionCount(newCount) {
  let details = JSON.parse(localStorage.getItem("userDetails"));
  localStorage.setItem(
    "userDetails",
    JSON.stringify({
      ...details,
      session_count: newCount,
    })
  );

  return {
    type: CHANGE_SESSION_COUNT,
    payload: newCount,
  };
}
