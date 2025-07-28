// PUT para marcar una notificación como vista
export async function marcarNotificacionComoVista(id: number): Promise<Notificacion> {
  const token = localStorage.getItem('access');
  const url = `${API_URL}/notificaciones/notificaciones/${id}/`;
  const headers = new Headers();
  if (token) headers.append('Authorization', `Bearer ${token}`);
  headers.append('Content-Type', 'application/json');
  const res = await fetch(url, {
    method: 'PUT',
    headers,
    body: JSON.stringify({ visto: true })
  });
  if (!res.ok) throw new Error('Error al actualizar notificación');
  return await res.json();
}
// src/api/notificaciones.ts

export interface TipoNotificacion {
  id: number;
  tipo: string;
  descripcion: string;
}

export interface Notificacion {
  id: number;
  tipo: TipoNotificacion;
  dirigido: string;
  mensaje: string;
  fecha_envio: string;
  created_at: string;
  visto: boolean;
}

export interface NotificacionesResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Notificacion[];
}

const API_URL = import.meta.env.VITE_EFC_API_URL;

export async function fetchNotificaciones({ page = 1, pageSize = 10, visto = false } = {}): Promise<NotificacionesResponse> {
  const token = localStorage.getItem('access');
  const url = `${API_URL}/notificaciones/notificaciones/?page=${page}&page_size=${pageSize}&visto=${visto}`;
  const headers = new Headers();
  if (token) headers.append('Authorization', `Bearer ${token}`);
  headers.append('Content-Type', 'application/json');
  const res = await fetch(url, {
    headers,
  });
  if (!res.ok) throw new Error('Error al obtener notificaciones');
  return await res.json();
}


export async function fetchAllNotifications({page = 1, page_size=10}): Promise<NotificacionesResponse>{
    const token = localStorage.getItem('access');
    const url = `${API_URL}/notificaciones/notificaciones/?page=${page}&page_size=${page_size}`;
    const headers = new Headers();
    if (token) headers.append('Authorization', `Bearer ${token}`);
    headers.append('Content-Type', 'application/json');
    const res = await fetch(url, {
        headers,
    });
    if (!res.ok) throw new Error('Error al obtener notificaciones');
    return await res.json();
}