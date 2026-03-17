import { SUBSCRIPTION_SET } from "../constants/subscriptionConstants";

export const subscribeTier = (tier) => (dispatch, getState) => {
  const { subscriptions } = getState().subscriptionState;
  const { userInfo } = getState().userState;

  const newSubscription = {
    id: Date.now(),
    user_id: userInfo.id,
    user: `${userInfo.first_name} ${userInfo.last_name}`,
    tier: tier.name,
    max_usage: tier.max_usage,
    usage_left: tier.max_usage,
    is_active: true,
    subscription_date: new Date().toISOString(),
  };

  const filtered = subscriptions.filter((item) => item.user_id !== userInfo.id);
  const updatedSubscriptions = [...filtered, newSubscription];
  localStorage.setItem("subscriptions", JSON.stringify(updatedSubscriptions));
  dispatch({ type: SUBSCRIPTION_SET, payload: updatedSubscriptions });
};

export const consumeChatUsage = () => (dispatch, getState) => {
  const { subscriptions } = getState().subscriptionState;
  const { userInfo } = getState().userState;

  const updatedSubscriptions = subscriptions.map((item) => {
    if (item.user_id === userInfo.id && item.is_active && item.usage_left > 0) {
      return { ...item, usage_left: item.usage_left - 1 };
    }
    return item;
  });

  localStorage.setItem("subscriptions", JSON.stringify(updatedSubscriptions));
  dispatch({ type: SUBSCRIPTION_SET, payload: updatedSubscriptions });
};
