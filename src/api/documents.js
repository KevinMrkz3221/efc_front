
/**
 * @typedef {Object} Document
 * @property {string} id
 * @property {string} organizacion
 * @property {string} pedimento
 * @property {string} archivo
 * @property {number} document_type
 * @property {number} size
 * @property {string} extension
 * @property {string} created_at
 * @property {string} updated_at
 */

/**
 * @typedef {Object} DocumentsResponse
 * @property {number} count
 * @property {string|null} next
 * @property {string|null} previous
 * @property {Document[]} results
 */

import { refreshToken } from './auth';

const API_URL = import.meta.env.VITE_EFC_API_URL;
/**
 * Obtiene la lista de documentos (pedimentos)
 * @param {string} token
 * @returns {Promise<DocumentsResponse>}
 */
export async function fetchDocuments(token, queryString = '') {
  let url = `${API_URL}/customs/pedimentos/`;
  if (queryString) {
    url += `?${queryString}`;
  }
  let res = await fetch(url, {
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
        res = await fetch(`${API_URL}/customs/pedimentos/`, {
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
  return res.json(); // Tipado por JSDoc: Promise<DocumentsResponse>
}
/**
 * Obtiene los documentos por id de pedimento
 * @param {string} token
 * @param {string} id
 * @returns {Promise<DocumentsResponse>}
 */
export async function fetchDocumentById(token, id) {
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
  return res.json(); // Tipado por JSDoc: Promise<DocumentsResponse>
}
