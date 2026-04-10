const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api";

async function apiRequest(path, options = {}) {
  const { token, body, headers = {}, ...rest } = options;

  const requestHeaders = {
    ...headers,
  };

  if (body) {
    requestHeaders["Content-Type"] = "application/json";
  }

  if (token) {
    requestHeaders.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    headers: requestHeaders,
    body: body ? JSON.stringify(body) : undefined,
  });

  const contentType = response.headers.get("content-type") || "";
  const data = contentType.includes("application/json")
    ? await response.json()
    : null;

  if (!response.ok) {
    const message = data?.detail || "Something went wrong.";
    throw new Error(message);
  }

  return data;
}

export const authApi = {
  register(payload) {
    return apiRequest("/auth/register", {
      method: "POST",
      body: payload,
    });
  },

  login(payload) {
    return apiRequest("/auth/login", {
      method: "POST",
      body: payload,
    });
  },

  getCurrentUser(token) {
    return apiRequest("/auth/me", {
      method: "GET",
      token,
    });
  },
};

export const scheduleApi = {
  list(token) {
    return apiRequest("/schedules", {
      method: "GET",
      token,
    });
  },

  create(token, payload) {
    return apiRequest("/schedules", {
      method: "POST",
      token,
      body: payload,
    });
  },

  update(token, scheduleId, payload) {
    return apiRequest(`/schedules/${scheduleId}`, {
      method: "PUT",
      token,
      body: payload,
    });
  },

  remove(token, scheduleId) {
    return apiRequest(`/schedules/${scheduleId}`, {
      method: "DELETE",
      token,
    });
  },
};
