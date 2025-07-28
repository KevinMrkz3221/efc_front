// src/api/pedimentoDocuments.ts

export interface PedimentoDocument {
  id: string;
  organizacion: string;
  pedimento: string;
  pedimento_numero:string;
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
  pedimentoId: string = '',
  page: number = 1,
  pageSize: number = 10,
  filters: {
    pedimento_numero?: string;
    extension?: string;
    document_type?: string | number;
    created_at?: string;
  } = {}
): Promise<PedimentoDocumentsResponse> {
  const params = new URLSearchParams();
  params.append('page', String(page));
  params.append('page_size', String(pageSize));
  if (pedimentoId) params.append('pedimento', pedimentoId);
  if (filters.pedimento_numero) params.append('pedimento_numero', filters.pedimento_numero);
  if (filters.extension) params.append('extension', filters.extension);
  if (filters.document_type) params.append('document_type', String(filters.document_type));
  if (filters.created_at) params.append('created_at', filters.created_at);

  const res = await fetch(
    `${API_URL}/record/documents/?${params.toString()}`,
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
