import {
  CHANGE_SESSION_COUNT,
  LOGIN,
  SUBSCRIBE_PLAN,
  UPDATE_SESSIONS,
  USER_AUTH,
} from "../helpers/ACTION_TYPES";

const initialState = { details: null, type: null };

export default (state = { ...initialState }, { type, payload }) => {
  switch (type) {
    case USER_AUTH:
      return { ...state, ...payload };
    case UPDATE_SESSIONS: {
      return {
        ...state,
        details: {
          ...state.details,
          session_count: payload,
        },
      };
    }
    case CHANGE_SESSION_COUNT:
      return {
        ...state,
        details: { ...state.details, session_count: payload },
      };
    case SUBSCRIBE_PLAN:
      return {
        ...state,
        details: {
          ...state.details,
          session_count: payload.newSesCount,
          planId: payload.planId,
        },
      };
    case LOGIN:
      return { ...state, ...payload };
    default:
      return { ...state };
  }
};
