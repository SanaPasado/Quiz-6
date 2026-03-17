import { SERVICE_CREATE, SERVICE_DELETE, SERVICE_UPDATE } from "../constants/serviceConstants";
import { initialServices } from "../data/dummyData";

const storedServices = JSON.parse(localStorage.getItem("services") || "null") || initialServices;

export const serviceReducer = (state = { services: storedServices }, action) => {
  switch (action.type) {
    case SERVICE_CREATE:
    case SERVICE_UPDATE:
    case SERVICE_DELETE:
      return { ...state, services: action.payload };
    default:
      return state;
  }
};
