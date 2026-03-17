const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://127.0.0.1:8000/api/v1";

const getErrorMessage = (payload) => {
  if (!payload) {
    return "Request failed.";
  }

  if (typeof payload === "string") {
    return payload;
  }

  if (payload.detail) {
    return payload.detail;
  }

  const firstValue = Object.values(payload)[0];
  if (Array.isArray(firstValue)) {
    return firstValue[0];
  }

  if (typeof firstValue === "string") {
    return firstValue;
  }

  return "Request failed.";
};

export async function apiRequest(path, options = {}) {
  const { body, headers = {}, token, ...rest } = options;
  const requestHeaders = { ...headers };

  if (!(body instanceof FormData)) {
    requestHeaders["Content-Type"] = requestHeaders["Content-Type"] || "application/json";
  }

  if (token) {
    requestHeaders.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    headers: requestHeaders,
    body: body === undefined ? undefined : body instanceof FormData ? body : JSON.stringify(body),
  });

  const contentType = response.headers.get("content-type") || "";
  const payload = contentType.includes("application/json") ? await response.json() : await response.text();

  if (!response.ok) {
    throw new Error(getErrorMessage(payload));
  }

  return payload;
}
