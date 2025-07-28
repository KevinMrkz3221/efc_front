// Tipos para la respuesta y registros
export interface ProcesamientoPedimento {
  id: number;
  created_at: string;
  updated_at: string;
  organizacion: string;
  organizacion_name: string;
  estado: number;
  tipo_procesamiento: number;
  pedimento: string;   
  servicio: number;
}

export interface ProcesamientoPedimentosResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: ProcesamientoPedimento[];
}

// API para customs/procesamientopedimentos/
export async function fetchProcesamientoPedimentos(
  token: string | null,
  page: number = 1,
  pageSize: number = 20
): Promise<ProcesamientoPedimentosResponse> {
  const API_URL = import.meta.env.VITE_EFC_API_URL;
  const headers: Record<string, string> = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${API_URL}/customs/procesamientopedimentos/?page=${page}&page_size=${pageSize}`, { headers });
  if (!res.ok) throw new Error('Error al obtener procesamiento de pedimentos');
  return await res.json();
}
