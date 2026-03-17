import { ORDER_CREATE, ORDER_SET } from "../constants/orderConstants";

export const orderReducer = (state = { orders: [] }, action) => {
  switch (action.type) {
    case ORDER_SET:
      return { ...state, orders: action.payload };
    case ORDER_CREATE:
      return { ...state, orders: [action.payload, ...state.orders] };
    default:
      return state;
  }
};
