import { apiRequest } from "../api";
import { SERVICE_CREATE, SERVICE_DELETE, SERVICE_SET, SERVICE_UPDATE } from "../constants/serviceConstants";

const getToken = (getState) => getState().userState.userInfo?.access;

export const fetchServices = () => async (dispatch) => {
  const services = await apiRequest("/services/list/");
  dispatch({ type: SERVICE_SET, payload: services });
};

export const createService = (serviceData) => async (dispatch, getState) => {
  const payload = {
    service_name: serviceData.service_name,
    description: serviceData.description,
    price: serviceData.price,
    duration_of_service: serviceData.duration_of_service,
  };

  const createdService = await apiRequest("/services/manage/", {
    method: "POST",
    body: payload,
    token: getToken(getState),
  });

  dispatch({ type: SERVICE_CREATE, payload: createdService });
};

export const updateService = (serviceId, serviceData) => async (dispatch, getState) => {
  const updatedService = await apiRequest(`/services/manage/${serviceId}/`, {
    method: "PUT",
    body: serviceData,
    token: getToken(getState),
  });

  dispatch({ type: SERVICE_UPDATE, payload: updatedService });
};

export const deleteService = (serviceId) => async (dispatch, getState) => {
  await apiRequest(`/services/manage/${serviceId}/`, {
    method: "DELETE",
    token: getToken(getState),
  });

  dispatch({ type: SERVICE_DELETE, payload: serviceId });
};
