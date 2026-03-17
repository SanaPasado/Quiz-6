import { ORDER_CREATE } from "../constants/orderConstants";

const storedOrders = JSON.parse(localStorage.getItem("orders") || "null") || [];

export const orderReducer = (state = { orders: storedOrders }, action) => {
  switch (action.type) {
    case ORDER_CREATE:
      return { ...state, orders: action.payload };
    default:
      return state;
  }
};
