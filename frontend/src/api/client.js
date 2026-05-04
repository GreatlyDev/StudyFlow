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

  forgotPassword(payload) {
    return apiRequest("/auth/forgot-password", {
      method: "POST",
      body: payload,
    });
  },

  resetPassword(payload) {
    return apiRequest("/auth/reset-password", {
      method: "POST",
      body: payload,
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

export const courseApi = {
  list(token) {
    return apiRequest("/courses", {
      method: "GET",
      token,
    });
  },

  create(token, payload) {
    return apiRequest("/courses", {
      method: "POST",
      token,
      body: payload,
    });
  },

  update(token, courseId, payload) {
    return apiRequest(`/courses/${courseId}`, {
      method: "PUT",
      token,
      body: payload,
    });
  },

  remove(token, courseId) {
    return apiRequest(`/courses/${courseId}`, {
      method: "DELETE",
      token,
    });
  },
};

export const assignmentApi = {
  list(token) {
    return apiRequest("/assignments", {
      method: "GET",
      token,
    });
  },

  create(token, payload) {
    return apiRequest("/assignments", {
      method: "POST",
      token,
      body: payload,
    });
  },

  update(token, assignmentId, payload) {
    return apiRequest(`/assignments/${assignmentId}`, {
      method: "PUT",
      token,
      body: payload,
    });
  },

  remove(token, assignmentId) {
    return apiRequest(`/assignments/${assignmentId}`, {
      method: "DELETE",
      token,
    });
  },
};

export const studyMaterialApi = {
  list(token) {
    return apiRequest("/study-materials", {
      method: "GET",
      token,
    });
  },

  create(token, payload) {
    return apiRequest("/study-materials", {
      method: "POST",
      token,
      body: payload,
    });
  },

  update(token, materialId, payload) {
    return apiRequest(`/study-materials/${materialId}`, {
      method: "PUT",
      token,
      body: payload,
    });
  },

  remove(token, materialId) {
    return apiRequest(`/study-materials/${materialId}`, {
      method: "DELETE",
      token,
    });
  },
};

export const flashcardApi = {
  list(token) {
    return apiRequest("/flashcards", {
      method: "GET",
      token,
    });
  },

  create(token, payload) {
    return apiRequest("/flashcards", {
      method: "POST",
      token,
      body: payload,
    });
  },

  generate(token, payload) {
    return apiRequest("/flashcards/generate", {
      method: "POST",
      token,
      body: payload,
    });
  },

  update(token, flashcardId, payload) {
    return apiRequest(`/flashcards/${flashcardId}`, {
      method: "PUT",
      token,
      body: payload,
    });
  },

  remove(token, flashcardId) {
    return apiRequest(`/flashcards/${flashcardId}`, {
      method: "DELETE",
      token,
    });
  },
};

export const reminderApi = {
  list(token) {
    return apiRequest("/reminders", {
      method: "GET",
      token,
    });
  },

  create(token, payload) {
    return apiRequest("/reminders", {
      method: "POST",
      token,
      body: payload,
    });
  },

  update(token, reminderId, payload) {
    return apiRequest(`/reminders/${reminderId}`, {
      method: "PUT",
      token,
      body: payload,
    });
  },

  remove(token, reminderId) {
    return apiRequest(`/reminders/${reminderId}`, {
      method: "DELETE",
      token,
    });
  },
};

export const dashboardApi = {
  getSummary(token) {
    return apiRequest("/dashboard/summary", {
      method: "GET",
      token,
    });
  },
};

export const aiApi = {
  getPlaceholder() {
    return apiRequest("/ai/placeholder", {
      method: "GET",
    });
  },

  getExplanationPlaceholder() {
    return apiRequest("/ai/explanation-placeholder", {
      method: "GET",
    });
  },

  getRecommendations(token) {
    return apiRequest("/ai/recommendations", {
      method: "GET",
      token,
    });
  },
};

export const quizApi = {
  getPlaceholder() {
    return apiRequest("/quizzes/placeholder", {
      method: "GET",
    });
  },
};
