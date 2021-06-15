import {
  ADD_SESSIONS,
  CHANGE_SESSION_COUNT,
  LOGIN,
  USER_AUTH,
} from "../helpers/ACTION_TYPES";

const initialState = { details: null, type: null };

export default (state = { ...initialState }, { type, payload }) => {
  switch (type) {
    case USER_AUTH:
      return { ...state, ...payload };
    case ADD_SESSIONS: {
      return {
        ...state,
        details: {
          ...state.details,
          session_count: state.details.session_count + parseInt(payload),
        },
      };
    }
    case CHANGE_SESSION_COUNT:
      return {
        ...state,
        details: { ...state.details, session_count: payload },
      };
    case LOGIN:
      return { ...state, ...payload };
    default:
      return { ...state };
  }
};
