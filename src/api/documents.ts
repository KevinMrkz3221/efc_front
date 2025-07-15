

export interface Document {
  id: string;
  organizacion: string;
  pedimento: string;
  archivo: string;
  document_type: number;
  size: number;
  extension: string;
  created_at: string;
  updated_at: string;
}

export interface DocumentsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Document[];
}

import { refreshToken } from './auth';

const API_URL = import.meta.env.VITE_EFC_API_URL;
// Obtiene la lista de documentos (pedimentos)
export async function fetchDocuments(token: string, page: number = 1, pageSize: number = 10): Promise<DocumentsResponse> {
  let res = await fetch(`${API_URL}/customs/pedimentos/?page=${page}&page_size=${pageSize}`, {
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
        res = await fetch(`${API_URL}/customs/pedimentos/?page=${page}&page_size=${pageSize}`, {
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
// Obtiene los documentos por id de pedimento
export async function fetchDocumentById(token: string, id: string): Promise<DocumentsResponse> {
  let res = await fetch(`${API_URL}/record/documents/?page=1&page_size=10&pedimento=${id}/`, {
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
        res = await fetch(`${API_URL}/record/documents/?page=1&page_size=10&pedimento=${id}/`, {
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
