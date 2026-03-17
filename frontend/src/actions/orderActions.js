import { apiRequest } from "../api";
import { ORDER_CREATE, ORDER_SET } from "../constants/orderConstants";

const getToken = (getState) => getState().userState.userInfo?.access;

export const fetchOrderHistory = () => async (dispatch, getState) => {
  const orders = await apiRequest("/orders/history/", {
    token: getToken(getState),
  });
  dispatch({ type: ORDER_SET, payload: orders });
};

export const createOrder = (orderData) => async (dispatch, getState) => {
  const newOrder = await apiRequest("/orders/create/", {
    method: "POST",
    body: {
      service: orderData.service_id,
      paypal_transaction_id: orderData.paypal_transaction_id,
      price_paid: orderData.price_paid,
    },
    token: getToken(getState),
  });

  dispatch({ type: ORDER_CREATE, payload: newOrder });
};
