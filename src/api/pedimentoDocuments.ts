// src/api/pedimentoDocuments.ts

export interface PedimentoDocument {
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

export interface PedimentoDocumentsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: PedimentoDocument[];
}

const API_URL = import.meta.env.VITE_EFC_API_URL;

export async function fetchPedimentoDocuments(
  token: string,
  pedimentoId: string,
  page: number = 1,
  pageSize: number = 10
): Promise<PedimentoDocumentsResponse> {
  const res = await fetch(
    `${API_URL}/record/documents/?page=${page}&page_size=${pageSize}&pedimento=${pedimentoId}`,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );
  if (res.status === 401) {
    throw new Error('SESSION_EXPIRED');
  }
  if (!res.ok) throw new Error('No autorizado o error en la petición');
  return res.json();
}
