import { CHAT_ADD_MESSAGE } from "../constants/chatConstants";

const allowedKeywords = [
  "notary",
  "document",
  "affidavit",
  "certified",
  "service",
  "seller",
  "subscription",
  "paypal",
];

export const askChatbot = (message) => (dispatch) => {
  const normalized = message.toLowerCase();
  const isAllowed = allowedKeywords.some((keyword) => normalized.includes(keyword));

  const reply = isAllowed
    ? "For notary and document concerns, review service scope, price, and duration on each listing before availing the service."
    : "I only answer inquiries related to notary and document services on this platform.";

  dispatch({ type: CHAT_ADD_MESSAGE, payload: { sender: "user", text: message } });
  dispatch({ type: CHAT_ADD_MESSAGE, payload: { sender: "bot", text: reply } });
};
