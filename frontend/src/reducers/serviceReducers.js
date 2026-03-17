import { SERVICE_CREATE, SERVICE_DELETE, SERVICE_SET, SERVICE_UPDATE } from "../constants/serviceConstants";

export const serviceReducer = (state = { services: [] }, action) => {
  switch (action.type) {
    case SERVICE_SET:
      return { ...state, services: action.payload };
    case SERVICE_CREATE:
      return { ...state, services: [...state.services, action.payload] };
    case SERVICE_UPDATE:
      return {
        ...state,
        services: state.services.map((service) =>
          service.id === action.payload.id ? action.payload : service
        ),
      };
    case SERVICE_DELETE:
      return { ...state, services: state.services.filter((service) => service.id !== action.payload) };
    default:
      return state;
  }
};
