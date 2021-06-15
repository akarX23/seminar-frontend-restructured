import {
  ADD_SESSIONS,
  CHANGE_SESSION_COUNT,
  LOGIN,
  USER_AUTH,
} from "../helpers/ACTION_TYPES.js";
import { addSessions } from "../helpers/Apis/college.js";
import { signIn } from "../helpers/Apis/user";

export async function auth() {
  const details = JSON.parse(localStorage.getItem("userDetails"));
  const type = localStorage.getItem("userType");

  return {
    type: USER_AUTH,
    payload: { details, type },
  };
}

export async function logout() {
  localStorage.removeItem("userType");
  localStorage.removeItem("userDetails");

  return {
    type: USER_AUTH,
    payload: { details: null, type: null },
  };
}

export async function signInAction(userType, userDetails) {
  return function (dispatch) {
    signIn(userType, userDetails, (details) => {
      if (!details) return;

      localStorage.setItem("userDetails", JSON.stringify(details));
      localStorage.setItem("userType", userType);

      return dispatch({ type: LOGIN, payload: { type: userType, details } });
    });
  };
}

export async function collegeAddSessions(collegeId, sessions_bought) {
  return async function (dispatch) {
    let details = JSON.parse(localStorage.getItem("userDetails"));
    localStorage.setItem(
      "userDetails",
      JSON.stringify({
        ...details,
        session_count:
          parseInt(details.session_count) + parseInt(sessions_bought),
      })
    );

    addSessions(sessions_bought, collegeId, (data) => {
      if (data) dispatch({ type: ADD_SESSIONS, payload: sessions_bought });
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
