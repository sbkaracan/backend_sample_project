const API_BASE = '/api';

function authHeaders() {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function handleResponse(res) {
  if (!res.ok) {
    let msg = `Request failed: ${res.status}`;
    try {
      const body = await res.json();
      if (body.detail) {
        msg = Array.isArray(body.detail)
          ? body.detail.map((e) => e.msg).join(', ')
          : body.detail;
      }
    } catch (_) {}
    throw new Error(msg);
  }
  return res.json();
}

export const api = {
  async login(username, password) {
    const form = new URLSearchParams();
    form.append('username', username);
    form.append('password', password);
    const res = await fetch(`${API_BASE}/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: form,
    });
    return handleResponse(res);
  },

  async register(email, username, password) {
    const res = await fetch(`${API_BASE}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, username, password }),
    });
    return handleResponse(res);
  },

  async getMe() {
    const res = await fetch(`${API_BASE}/users/me`, { headers: authHeaders() });
    return handleResponse(res);
  },

  async getRecipes() {
    const res = await fetch(`${API_BASE}/recipes`, { headers: authHeaders() });
    return handleResponse(res);
  },

  async getRecipe(id) {
    const res = await fetch(`${API_BASE}/recipes/${id}`, { headers: authHeaders() });
    return handleResponse(res);
  },

  async createRecipe(data) {
    const res = await fetch(`${API_BASE}/recipes`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  async deleteRecipe(id) {
    const res = await fetch(`${API_BASE}/recipes/${id}`, {
      method: 'DELETE',
      headers: authHeaders(),
    });
    return handleResponse(res);
  },
};
