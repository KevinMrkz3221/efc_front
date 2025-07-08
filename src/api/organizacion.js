import { refreshToken } from './auth';

const API_URL = import.meta.env.VITE_EFC_API_URL;

export async function fetchOrganizationUsage(token) {
  let res = await fetch(`${API_URL}/api/v1/organization/uso-almacenamiento/mi_organizacion/`, {
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
        res = await fetch(`${API_URL}/api/v1/organization/uso-almacenamiento/mi_organizacion/`, {
          headers: {
            'Authorization': `Bearer ${data.access}`,
            'Content-Type': 'application/json',
          },
        });
        if (res.status === 401) throw new Error('SESSION_EXPIRED');
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
