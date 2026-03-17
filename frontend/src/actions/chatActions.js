import { apiRequest } from "../api";
import { CHAT_ADD_MESSAGE, CHAT_CLEAR_MESSAGES } from "../constants/chatConstants";
import { SUBSCRIPTION_MY_SET } from "../constants/subscriptionConstants";

export const askChatbot = (message) => async (dispatch, getState) => {
  dispatch({ type: CHAT_ADD_MESSAGE, payload: { sender: "user", text: message } });

  const { reply, usage_left } = await apiRequest("/chat/ask/", {
    method: "POST",
    body: { message },
    token: getState().userState.userInfo?.access,
  });

  dispatch({ type: CHAT_ADD_MESSAGE, payload: { sender: "bot", text: reply } });
  dispatch({
    type: SUBSCRIPTION_MY_SET,
    payload: {
      ...getState().subscriptionState.mySubscription,
      usage_left,
    },
  });
};

export const clearChatMessages = () => ({ type: CHAT_CLEAR_MESSAGES });
