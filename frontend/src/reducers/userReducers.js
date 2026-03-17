import {
  USER_APPLY_SELLER,
  USER_LIST_UPDATE,
  USER_REGISTER,
  USER_SIGNIN,
  USER_SIGNOUT,
} from "../constants/userConstants";
import { initialUsers } from "../data/dummyData";

const storedUsers = JSON.parse(localStorage.getItem("users") || "null") || initialUsers;
const storedUserInfo = JSON.parse(localStorage.getItem("userInfo") || "null");
const storedApplications = JSON.parse(localStorage.getItem("sellerApplications") || "null") || [];

const initialState = {
  users: storedUsers,
  userInfo: storedUserInfo,
  sellerApplications: storedApplications,
};

export const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case USER_SIGNIN:
      return { ...state, userInfo: action.payload };
    case USER_SIGNOUT:
      return { ...state, userInfo: null };
    case USER_REGISTER:
      return { ...state, users: action.payload.users, userInfo: action.payload.userInfo };
    case USER_APPLY_SELLER:
      return { ...state, sellerApplications: action.payload };
    case USER_LIST_UPDATE:
      return { ...state, users: action.payload };
    default:
      return state;
  }
};
