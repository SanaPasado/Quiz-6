import { SERVICE_CREATE, SERVICE_DELETE, SERVICE_UPDATE } from "../constants/serviceConstants";

export const createService = (serviceData) => (dispatch, getState) => {
  const { services } = getState().serviceState;
  const { userInfo } = getState().userState;

  const newService = {
    id: Date.now(),
    ...serviceData,
    seller_id: userInfo.id,
    name_of_the_expert: `${userInfo.first_name} ${userInfo.last_name}`,
    rating: 4.8,
  };

  const updatedServices = [...services, newService];
  localStorage.setItem("services", JSON.stringify(updatedServices));
  dispatch({ type: SERVICE_CREATE, payload: updatedServices });
};

export const updateService = (serviceId, serviceData) => (dispatch, getState) => {
  const { services } = getState().serviceState;
  const updatedServices = services.map((service) =>
    service.id === serviceId ? { ...service, ...serviceData } : service
  );
  localStorage.setItem("services", JSON.stringify(updatedServices));
  dispatch({ type: SERVICE_UPDATE, payload: updatedServices });
};

export const deleteService = (serviceId) => (dispatch, getState) => {
  const { services } = getState().serviceState;
  const updatedServices = services.filter((service) => service.id !== serviceId);
  localStorage.setItem("services", JSON.stringify(updatedServices));
  dispatch({ type: SERVICE_DELETE, payload: updatedServices });
};
