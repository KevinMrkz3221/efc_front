const API_URL = import.meta.env.VITE_EFC_API_URL || 'http://localhost:8000';

async function handleResponse(response, operation = 'operación') {
  if (response.status === 401) {
    throw new Error('SESSION_EXPIRED');
  }
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Error ${response.status}: ${response.statusText}`);
  }
  const contentType = response.headers.get('content-type');
  if (!contentType || !contentType.includes('application/json')) {
    throw new Error('El servidor no devolvió JSON válido');
  }
  return response.json();
}

export async function fetchUsers(token) {
  const url = `${API_URL}/user/users/`;
  const res = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  });
  return handleResponse(res, 'Fetch Users');
}

export async function createUser(token, userData) {
  const url = `${API_URL}/user/users/`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(userData),
  });
  return handleResponse(res, 'Create User');
}

export async function updateUser(token, id, userData) {
  const url = `${API_URL}/user/users/${id}/`;
  const res = await fetch(url, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(userData),
  });
  return handleResponse(res, 'Update User');
}

export async function deleteUser(token, id) {
  const url = `${API_URL}/user/users/${id}/`;
  const res = await fetch(url, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  });
  if (res.status === 401) throw new Error('SESSION_EXPIRED');
  if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
  return true;
}

export async function getCurrentUser(token) {
  const url = `${API_URL}/user/users/me/`;
  const res = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  });
  return handleResponse(res, 'Get Current User');
}
