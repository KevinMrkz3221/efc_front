

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
export interface PedimentosFilters {
  search?: string;
  pedimento?: string;
  existe_expediente?: string | boolean;
  alerta?: string | boolean;
  contribuyente?: string;
  curp_apoderado?: string;
  fecha_pago?: string;
  patente?: string;
  aduana?: string;
  tipo_operacion?: string;
  clave_pedimento?: string;
}

export async function fetchDocuments(
  token: string,
  page: number = 1,
  pageSize: number = 10,
  filters: PedimentosFilters = {}
): Promise<DocumentsResponse> {
  const params = new URLSearchParams();
  params.append('page', String(page));
  params.append('page_size', String(pageSize));
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.append(key, String(value));
    }
  });
  let res = await fetch(`${API_URL}/customs/pedimentos/?${params.toString()}`, {
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
