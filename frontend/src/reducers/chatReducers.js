import { CHAT_ADD_MESSAGE } from "../constants/chatConstants";

export const chatReducer = (state = { messages: [] }, action) => {
  switch (action.type) {
    case CHAT_ADD_MESSAGE:
      return { ...state, messages: [...state.messages, action.payload] };
    default:
      return state;
  }
};
