import {
  USER_APPLY_SELLER,
  USER_LIST_UPDATE,
  USER_PROFILE_UPDATE,
  USER_REGISTER,
  USER_SIGNIN,
  USER_SIGNOUT,
} from "../constants/userConstants";

const storedUserInfo = JSON.parse(localStorage.getItem("userInfo") || "null");

const initialState = {
  users: [],
  userInfo: storedUserInfo,
  sellerApplications: [],
};

export const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case USER_SIGNIN:
    case USER_PROFILE_UPDATE:
      return { ...state, userInfo: action.payload };
    case USER_SIGNOUT:
      return { ...initialState, userInfo: null };
    case USER_REGISTER:
      return { ...state, userInfo: action.payload };
    case USER_APPLY_SELLER:
      return { ...state, sellerApplications: action.payload };
    case USER_LIST_UPDATE:
      return { ...state, users: action.payload };
    default:
      return state;
  }
};
