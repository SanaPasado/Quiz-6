import { apiRequest } from "../api";
import {
  SUBSCRIPTION_MY_SET,
  SUBSCRIPTION_SET,
  SUBSCRIPTION_TIERS_SET,
} from "../constants/subscriptionConstants";

const getToken = (getState) => getState().userState.userInfo?.access;

export const fetchSubscriptionTiers = () => async (dispatch) => {
  const tiers = await apiRequest("/subscriptions/tiers/");
  dispatch({ type: SUBSCRIPTION_TIERS_SET, payload: tiers });
};

export const fetchMySubscription = () => async (dispatch, getState) => {
  try {
    const subscription = await apiRequest("/subscriptions/mine/", {
      token: getToken(getState),
    });
    dispatch({ type: SUBSCRIPTION_MY_SET, payload: subscription });
  } catch (error) {
    if (error.message === "No subscription found.") {
      dispatch({ type: SUBSCRIPTION_MY_SET, payload: null });
      return;
    }
    throw error;
  }
};

export const fetchAdminSubscriptions = () => async (dispatch, getState) => {
  const subscriptions = await apiRequest("/subscriptions/admin/list/", {
    token: getToken(getState),
  });
  dispatch({ type: SUBSCRIPTION_SET, payload: subscriptions });
};

export const subscribeTier = (tier, paypalSubscriptionId) => async (dispatch, getState) => {
  const subscription = await apiRequest("/subscriptions/subscribe/", {
    method: "POST",
    body: { tier_id: tier.id, paypal_subscription_id: paypalSubscriptionId },
    token: getToken(getState),
  });

  dispatch({ type: SUBSCRIPTION_MY_SET, payload: subscription });
};
