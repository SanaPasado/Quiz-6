import {
  SUBSCRIPTION_MY_SET,
  SUBSCRIPTION_SET,
  SUBSCRIPTION_TIERS_SET,
} from "../constants/subscriptionConstants";

export const subscriptionReducer = (
  state = { tiers: [], subscriptions: [], mySubscription: null },
  action
) => {
  switch (action.type) {
    case SUBSCRIPTION_TIERS_SET:
      return { ...state, tiers: action.payload };
    case SUBSCRIPTION_SET:
      return { ...state, subscriptions: action.payload };
    case SUBSCRIPTION_MY_SET:
      return { ...state, mySubscription: action.payload };
    default:
      return state;
  }
};
