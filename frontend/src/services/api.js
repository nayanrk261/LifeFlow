const API_BASE = '/api';

function getHeaders() {
  const token = localStorage.getItem('lifeflow_token');
  const headers = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const config = {
    ...options,
    headers: {
      ...getHeaders(),
      ...options.headers,
    },
  };

  const response = await fetch(url, config);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'An error occurred');
  }

  return data;
}

export const api = {
  // Auth
  signup: (userData) => request('/auth/signup', { method: 'POST', body: JSON.stringify(userData) }),
  login: (credentials) => request('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  getMe: () => request('/auth/me'),
  verifyPassword: (password) => request('/auth/verify-password', { method: 'POST', body: JSON.stringify({ password }) }),

  // Profile
  getProfile: () => request('/profile'),
  updateProfile: (profileData) => request('/profile', { method: 'PUT', body: JSON.stringify(profileData) }),

  // Documents
  getDocuments: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/documents${query ? `?${query}` : ''}`);
  },
  getDocument: (id) => request(`/documents/${id}`),
  createDocument: (docData) => request('/documents', { method: 'POST', body: JSON.stringify(docData) }),
  updateDocument: (id, docData) => request(`/documents/${id}`, { method: 'PUT', body: JSON.stringify(docData) }),
  deleteDocument: (id) => request(`/documents/${id}`, { method: 'DELETE' }),

  // Goals
  getGoals: () => request('/goals'),
  createGoal: (goalData) => request('/goals', { method: 'POST', body: JSON.stringify(goalData) }),
  updateGoal: (id, goalData) => request(`/goals/${id}`, { method: 'PUT', body: JSON.stringify(goalData) }),

  // Reminders
  getReminders: () => request('/reminders'),
  createReminder: (reminderData) => request('/reminders', { method: 'POST', body: JSON.stringify(reminderData) }),
  updateReminder: (id, reminderData) => request(`/reminders/${id}`, { method: 'PUT', body: JSON.stringify(reminderData) }),
  deleteReminder: (id) => request(`/reminders/${id}`, { method: 'DELETE' }),

  // Notifications
  getNotifications: () => request('/notifications'),
  markNotificationRead: (id) => request(`/notifications/${id}/read`, { method: 'PUT' }),

  // Family
  getFamily: () => request('/family'),
  createFamilyMember: (memberData) => request('/family', { method: 'POST', body: JSON.stringify(memberData) }),
  updateFamilyMember: (id, memberData) => request(`/family/${id}`, { method: 'PUT', body: JSON.stringify(memberData) }),
  deleteFamilyMember: (id) => request(`/family/${id}`, { method: 'DELETE' }),
};
