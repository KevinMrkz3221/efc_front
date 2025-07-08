import { refreshToken } from './auth';

const API_URL = import.meta.env.VITE_EFC_API_URL;

export async function fetchDocuments(token) {
  let res = await fetch(`${API_URL}/api/v1/customs/pedimentos/`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  if (res.status === 401) {
    // Intentar refrescar el token
    const refresh = localStorage.getItem('refresh');
    if (refresh) {
      try {
        const data = await refreshToken(refresh);
        localStorage.setItem('access', data.access);
        // Reintenta la petición con el nuevo access token
        res = await fetch(`${API_URL}/api/v1/customs/pedimentos/`, {
          headers: {
            'Authorization': `Bearer ${data.access}`,
            'Content-Type': 'application/json',
          },
        });
      } catch (err) {
        throw new Error('SESSION_EXPIRED');
      }
    } else {
      throw new Error('SESSION_EXPIRED');
    }
  }
  if (!res.ok) throw new Error('No autorizado o error en la petición');
  return res.json();
}
