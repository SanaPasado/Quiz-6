import { SUBSCRIPTION_SET } from "../constants/subscriptionConstants";
import { initialSubscriptionTiers } from "../data/dummyData";

const storedSubscriptions = JSON.parse(localStorage.getItem("subscriptions") || "null") || [];

export const subscriptionReducer = (
  state = { tiers: initialSubscriptionTiers, subscriptions: storedSubscriptions },
  action
) => {
  switch (action.type) {
    case SUBSCRIPTION_SET:
      return { ...state, subscriptions: action.payload };
    default:
      return state;
  }
};
