import { ORDER_CREATE } from "../constants/orderConstants";

export const createOrder = (orderData) => (dispatch, getState) => {
  const { orders } = getState().orderState;
  const { userInfo } = getState().userState;

  const newOrder = {
    id: Date.now(),
    buyer_id: userInfo.id,
    buyer_name: `${userInfo.first_name} ${userInfo.last_name}`,
    ...orderData,
    date_purchased: new Date().toISOString(),
  };

  const updatedOrders = [...orders, newOrder];
  localStorage.setItem("orders", JSON.stringify(updatedOrders));
  dispatch({ type: ORDER_CREATE, payload: updatedOrders });
};
