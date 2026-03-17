import { CHAT_ADD_MESSAGE, CHAT_CLEAR_MESSAGES } from "../constants/chatConstants";

export const chatReducer = (state = { messages: [] }, action) => {
  switch (action.type) {
    case CHAT_ADD_MESSAGE:
      return { ...state, messages: [...state.messages, action.payload] };
    case CHAT_CLEAR_MESSAGES:
      return { ...state, messages: [] };
    default:
      return state;
  }
};
