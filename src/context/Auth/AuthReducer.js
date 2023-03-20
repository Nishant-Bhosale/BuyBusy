import {
  LOGIN_FAIL,
  LOGIN_SUCCESS,
  LOGOUT,
  CLEAR_ERROR_MESSAGE,
  SIGNUP_SUCCESS,
  SIGNUP_FAIL,
  SET_AUTH_USER,
  TOGGLE_LOADING,
} from "./types";

export default (state, action) => {
  switch (action.type) {
    case LOGIN_SUCCESS:
      localStorage.setItem("user", JSON.stringify(action.payload.user));
      return {
        ...state,
        user: action.payload,
        error: false,
        loading: false,
      };
    case LOGOUT:
      localStorage.clear();
      return {
        user: null,
        error: false,
        message: action.payload,
        loading: false,
      };
    case LOGIN_FAIL:
      localStorage.clear();
      return {
        user: null,
        error: true,
        message: action.payload,
        loading: false,
      };
    case SET_AUTH_USER:
      return {
        ...state,
        user: action.payload,
      };
    case CLEAR_ERROR_MESSAGE:
      return {
        ...state,
        error: false,
        message: "",
      };
    case SIGNUP_SUCCESS:
      localStorage.setItem("user", JSON.stringify(action.payload.user));
      return {
        ...state,
        user: action.payload,
        error: false,
        loading: false,
      };
    case SIGNUP_FAIL:
      return {
        ...state,
        error: true,
        message: action.payload,
        loading: false,
      };
    case TOGGLE_LOADING:
      return {
        ...state,
        loading: !state.loading,
      };
    default:
      return state;
  }
};
