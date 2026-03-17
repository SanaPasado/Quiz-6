import {
  USER_APPLY_SELLER,
  USER_LIST_UPDATE,
  USER_REGISTER,
  USER_SIGNIN,
  USER_SIGNOUT,
} from "../constants/userConstants";

export const signin = (email, password) => (dispatch, getState) => {
  const { users } = getState().userState;
  const foundUser = users.find((item) => item.email === email && item.password === password);
  if (!foundUser) {
    throw new Error("Invalid email or password.");
  }

  dispatch({ type: USER_SIGNIN, payload: foundUser });
  localStorage.setItem("userInfo", JSON.stringify(foundUser));
};

export const signout = () => (dispatch) => {
  localStorage.removeItem("userInfo");
  dispatch({ type: USER_SIGNOUT });
};

export const register = (formData) => (dispatch, getState) => {
  const { users } = getState().userState;
  const newUser = {
    id: Date.now(),
    ...formData,
    role: "User",
    merchant_id: "",
  };

  const updatedUsers = [...users, newUser];
  localStorage.setItem("users", JSON.stringify(updatedUsers));
  localStorage.setItem("userInfo", JSON.stringify(newUser));
  dispatch({ type: USER_REGISTER, payload: { users: updatedUsers, userInfo: newUser } });
};

export const applySeller = () => (dispatch, getState) => {
  const { userInfo, sellerApplications } = getState().userState;
  if (!userInfo) throw new Error("Sign in required.");

  const exists = sellerApplications.find((item) => item.user_id === userInfo.id && item.status === "Pending");
  if (exists) throw new Error("You already have a pending application.");

  const newApplication = {
    id: Date.now(),
    user_id: userInfo.id,
    first_name: userInfo.first_name,
    last_name: userInfo.last_name,
    email: userInfo.email,
    status: "Pending",
    decline_reason: "",
    created_at: new Date().toISOString(),
  };

  const updatedApplications = [...sellerApplications, newApplication];
  localStorage.setItem("sellerApplications", JSON.stringify(updatedApplications));
  dispatch({ type: USER_APPLY_SELLER, payload: updatedApplications });
};

export const updateUsers = (users) => (dispatch) => {
  localStorage.setItem("users", JSON.stringify(users));
  dispatch({ type: USER_LIST_UPDATE, payload: users });
};

export const updateApplications = (applications) => (dispatch) => {
  localStorage.setItem("sellerApplications", JSON.stringify(applications));
  dispatch({ type: USER_APPLY_SELLER, payload: applications });
};
