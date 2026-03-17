import {
  USER_APPLY_SELLER,
  USER_LIST_UPDATE,
  USER_PROFILE_UPDATE,
  USER_REGISTER,
  USER_SIGNIN,
  USER_SIGNOUT,
} from "../constants/userConstants";
import { apiRequest } from "../api";
import { CHAT_CLEAR_MESSAGES } from "../constants/chatConstants";
import { ORDER_SET } from "../constants/orderConstants";
import { SUBSCRIPTION_MY_SET, SUBSCRIPTION_SET } from "../constants/subscriptionConstants";

const storeUserInfo = (userInfo) => {
  localStorage.setItem("userInfo", JSON.stringify(userInfo));
};

const buildSessionUser = (data) => ({
  ...data.user,
  access: data.access,
  refresh: data.refresh,
});

const getToken = (getState) => getState().userState.userInfo?.access;

export const signin = (email, password) => async (dispatch) => {
  const data = await apiRequest("/users/login/", {
    method: "POST",
    body: { email, password },
  });

  const userInfo = buildSessionUser(data);
  storeUserInfo(userInfo);
  dispatch({ type: USER_SIGNIN, payload: userInfo });
  return userInfo;
};

export const refreshProfile = () => async (dispatch, getState) => {
  const currentUser = getState().userState.userInfo;
  if (!currentUser?.access) {
    return null;
  }

  const profile = await apiRequest("/users/profile/", {
    token: currentUser.access,
  });

  const nextUserInfo = {
    ...profile,
    access: currentUser.access,
    refresh: currentUser.refresh,
  };

  storeUserInfo(nextUserInfo);
  dispatch({ type: USER_PROFILE_UPDATE, payload: nextUserInfo });
  return nextUserInfo;
};

export const signout = () => (dispatch) => {
  localStorage.removeItem("userInfo");
  dispatch({ type: USER_SIGNOUT });
  dispatch({ type: USER_LIST_UPDATE, payload: [] });
  dispatch({ type: USER_APPLY_SELLER, payload: [] });
  dispatch({ type: ORDER_SET, payload: [] });
  dispatch({ type: SUBSCRIPTION_SET, payload: [] });
  dispatch({ type: SUBSCRIPTION_MY_SET, payload: null });
  dispatch({ type: CHAT_CLEAR_MESSAGES });
};

export const register = (formData) => async (dispatch) => {
  await apiRequest("/users/register/", {
    method: "POST",
    body: formData,
  });

  const userInfo = await dispatch(signin(formData.email, formData.password));
  dispatch({ type: USER_REGISTER, payload: userInfo });
  return userInfo;
};

export const fetchAdminUsers = () => async (dispatch, getState) => {
  const users = await apiRequest("/users/admin/users/", {
    token: getToken(getState),
  });
  dispatch({ type: USER_LIST_UPDATE, payload: users });
};

export const updateUser = (userId, payload) => async (dispatch, getState) => {
  await apiRequest(`/users/admin/users/${userId}/`, {
    method: "PUT",
    body: payload,
    token: getToken(getState),
  });
  await dispatch(fetchAdminUsers());
};

export const deleteUser = (userId) => async (dispatch, getState) => {
  await apiRequest(`/users/admin/users/${userId}/`, {
    method: "DELETE",
    token: getToken(getState),
  });
  await dispatch(fetchAdminUsers());
};

export const fetchSellerApplications = () => async (dispatch, getState) => {
  const applications = await apiRequest("/applications/list/", {
    token: getToken(getState),
  });
  dispatch({ type: USER_APPLY_SELLER, payload: applications });
};

export const applySeller = () => async (dispatch, getState) => {
  const createdApplication = await apiRequest("/applications/apply/", {
    method: "POST",
    token: getToken(getState),
  });

  const existingApplications = getState().userState.sellerApplications;
  const nextApplications = existingApplications.some((item) => item.id === createdApplication.id)
    ? existingApplications.map((item) => (item.id === createdApplication.id ? createdApplication : item))
    : [...existingApplications, createdApplication];

  dispatch({ type: USER_APPLY_SELLER, payload: nextApplications });
  return createdApplication;
};

export const approveApplication = (applicationId, merchantId) => async (dispatch, getState) => {
  await apiRequest(`/applications/${applicationId}/approve/`, {
    method: "POST",
    body: { merchant_id: merchantId },
    token: getToken(getState),
  });

  await Promise.all([dispatch(fetchSellerApplications()), dispatch(fetchAdminUsers())]);
};

export const declineApplication = (applicationId, declineReason) => async (dispatch, getState) => {
  await apiRequest(`/applications/${applicationId}/decline/`, {
    method: "POST",
    body: { decline_reason: declineReason },
    token: getToken(getState),
  });

  await dispatch(fetchSellerApplications());
};
