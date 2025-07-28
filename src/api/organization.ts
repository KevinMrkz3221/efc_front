// organization.ts
// Tipos para la respuesta del endpoint de uso de almacenamiento de organización

export interface OrganizationUsage {
  organizacion: string;
  limite_almacenamiento_gb: number;
  espacio_utilizado_bytes: number;
  espacio_utilizado_gb: number;
  espacio_disponible_bytes: number;
  porcentaje_utilizado: number;
  total_documentos: number;
  total_pedimentos: number;
  total_usuarios: number;
}

const API_URL = import.meta.env.VITE_EFC_API_URL;

// Ejemplo de función para obtener la información tipada
export async function fetchOrganizationUsage(token: string): Promise<OrganizationUsage> {
  const res = await fetch(`${API_URL}/organization/uso-almacenamiento/mi_organizacion/`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  if (res.status === 401) {
    throw new Error('SESSION_EXPIRED');
  }
  if (!res.ok) {
    throw new Error('Error al obtener información de la organización');
  }
  return res.json();
}
