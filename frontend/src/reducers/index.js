import { combineReducers } from "redux";

import { chatReducer } from "./chatReducers";
import { orderReducer } from "./orderReducers";
import { serviceReducer } from "./serviceReducers";
import { subscriptionReducer } from "./subscriptionReducers";
import { userReducer } from "./userReducers";

const rootReducer = combineReducers({
  userState: userReducer,
  serviceState: serviceReducer,
  orderState: orderReducer,
  subscriptionState: subscriptionReducer,
  chatState: chatReducer,
});

export default rootReducer;
