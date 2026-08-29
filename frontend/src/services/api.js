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
  analyzeDocument: (docData) => request('/documents/analyze', { method: 'POST', body: JSON.stringify(docData) }),
  createDocument: (docData) => request('/documents', { method: 'POST', body: JSON.stringify(docData) }),
  updateDocument: (id, docData) => request(`/documents/${id}`, { method: 'PUT', body: JSON.stringify(docData) }),
  deleteDocument: (id) => request(`/documents/${id}`, { method: 'DELETE' }),

  // Document Sharing Permissions
  shareDocumentWithFamily: (docId, targetUserId) => request(`/documents/${docId}/share`, { method: 'PUT', body: JSON.stringify({ targetUserId }) }),
  unshareDocumentWithFamily: (docId, targetUserId) => request(`/documents/${docId}/unshare`, { method: 'PUT', body: JSON.stringify({ targetUserId }) }),

  // LifeFlow Action Engine & Goals
  analyzeGoal: (userRequest) => request('/goals/analyze', { method: 'POST', body: JSON.stringify({ userRequest }) }),
  analyzeExistingGoal: (id) => request(`/goals/${id}/analyze`, { method: 'POST' }),
  getGoals: () => request('/goals'),
  getGoal: (id) => request(`/goals/${id}`),
  createGoal: (goalData) => request('/goals', { method: 'POST', body: JSON.stringify(goalData) }),
  updateGoal: (id, goalData) => request(`/goals/${id}`, { method: 'PUT', body: JSON.stringify(goalData) }),
  updateActionStatus: (goalId, actionId, status) => request(`/goals/${goalId}/actions/${actionId}`, { method: 'PUT', body: JSON.stringify({ status }) }),
  deleteGoal: (id) => request(`/goals/${id}`, { method: 'DELETE' }),

  // Reminders
  getReminders: () => request('/reminders'),
  createReminder: (reminderData) => request('/reminders', { method: 'POST', body: JSON.stringify(reminderData) }),
  updateReminder: (id, reminderData) => request(`/reminders/${id}`, { method: 'PUT', body: JSON.stringify(reminderData) }),
  deleteReminder: (id) => request(`/reminders/${id}`, { method: 'DELETE' }),

  // Notifications
  getNotifications: () => request('/notifications'),
  markNotificationRead: (id) => request(`/notifications/${id}/read`, { method: 'PUT' }),

  // Family Connection System
  getFamily: () => request('/family'),
  connectFamilyByEmail: (email, relationship) => request('/family/connect', { method: 'POST', body: JSON.stringify({ email, relationship }) }),
  createFamilyInvite: (recipientEmail, relationship) => request('/family/invite', { method: 'POST', body: JSON.stringify({ recipientEmail, relationship }) }),
  acceptFamilyRequest: (connectionId) => request(`/family/requests/${connectionId}/accept`, { method: 'PUT' }),
  declineFamilyRequest: (connectionId) => request(`/family/requests/${connectionId}/decline`, { method: 'PUT' }),
  removeFamilyConnection: (connectionId) => request(`/family/connections/${connectionId}`, { method: 'DELETE' }),
  getSharedDocumentsFromMember: (memberId) => request(`/family/${memberId}/shared-documents`),
  createManualFamilyMember: (memberData) => request('/family/manual', { method: 'POST', body: JSON.stringify(memberData) }),
};
