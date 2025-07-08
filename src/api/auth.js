const API_URL = import.meta.env.VITE_EFC_API_URL;

export async function login(username, password) {
  const response = await fetch(`${API_URL}/api/v1/token/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });

  console.log('API URL:', `${API_URL}/api/v1/token/`);
  if (!response.ok) {
    throw new Error('Credenciales inválidas');
  }
  return response.json(); // { access, refresh }
}

export async function refreshToken(refresh) {
  const res = await fetch(`${API_URL}/api/v1/token/refresh/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh }),
  });
  if (!res.ok) throw new Error('SESSION_EXPIRED');
  return res.json(); // { access: '...' }
}