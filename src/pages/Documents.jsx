import React, { useEffect, useState } from 'react';
import { fetchDocuments } from '../api/documents';
import { useNotification } from '../context/NotificationContext';
import { usePolling } from '../hooks/usePolling';
import { Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_EFC_API_URL;

const downloadFile = async (id, filename = 'archivo', setSuccess, setError, showMessage) => {
  const token = localStorage.getItem('access');
  const res = await fetch(`${API_URL}/api/v1/record/documents/descargar/${id}/`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (res.status === 401) {
    showMessage('Tu sesión ha expirado, por favor inicia sesión de nuevo.', 'error');
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    setTimeout(() => {
      window.location.href = '/login';
    }, 2000);
    return;
  }
  if (!res.ok) {
    alert('No autorizado o error en la descarga');
    return;
  }
  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
  if (setSuccess) setSuccess('Descarga exitosa');
};

export default function Documents() {
  const [success, setSuccess] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const { showMessage } = useNotification();

  // Función que será llamada por el polling
  const fetchPedimentosData = async () => {
    const token = localStorage.getItem('access');
    return await fetchDocuments(token);
  };

  // Hook de polling que se ejecuta cada 30 segundos
  const { data: pedimentos, loading, error, refetch } = usePolling(
    fetchPedimentosData,
    30000, // 30 segundos
    [] // dependencias
  );

  // Manejo de errores de sesión
  useEffect(() => {
    if (error && error.message === 'SESSION_EXPIRED') {
      localStorage.removeItem('access');
      localStorage.removeItem('refresh');
      showMessage('Tu sesión ha expirado, por favor inicia sesión de nuevo.', 'error');
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
    } else if (error) {
      showMessage(error.message, 'error');
    }
  }, [error, showMessage]);

  // Cálculos de paginación
  const totalDocuments = pedimentos ? pedimentos.length : 0;
  const totalPages = Math.ceil(totalDocuments / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentDocuments = pedimentos ? pedimentos.slice(startIndex, endIndex) : [];

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset a la primera página
  };

  if (loading) return (
    <div className="h-full bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <svg className="animate-spin h-12 w-12 text-navy-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="text-gray-600 text-lg">Cargando documentos...</p>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="h-full bg-gray-50 flex items-center justify-center">
      <div className="bg-danger-50 border border-danger-200 rounded-xl p-6 max-w-md shadow-lg">
        <div className="flex items-center">
          <svg className="h-6 w-6 text-danger-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <p className="text-danger-800 font-medium">{error.message || 'Error al cargar documentos'}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">Lista de Pedimentos y Documentos</h1>
          <p className="mt-2 text-gray-600">Gestiona y descarga los documentos de tus pedimentos.</p>
        </div>

        <div className="bg-white shadow-lg rounded-xl border border-gray-200">
          <div className="px-6 py-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <button 
                onClick={refetch} 
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Actualizar Ahora
              </button>
              <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                🔄 Actualización automática cada 30 segundos
              </span>
            </div>
            {success && (
              <div className="mt-4 bg-green-50 border border-green-200 rounded-md p-4">
                <div className="flex">
                  <svg className="h-5 w-5 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <p className="text-green-800">{success}</p>
                </div>
              </div>
            )}
          </div>

          <div className="overflow-hidden">
            {pedimentos && pedimentos.length === 0 ? (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No hay pedimentos</h3>
                <p className="mt-1 text-sm text-gray-500">Aún no tienes pedimentos registrados.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pedimento</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha de pago</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contribuyente</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Alerta</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CURP Apoderado</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Importe total</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Saldo disponible</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Importe pedimento</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expediente</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentDocuments && currentDocuments.map(ped => (
                      <tr key={ped.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Link 
                            to={`/documents/pedimento/${ped.id}`}
                            className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
                          >
                            {ped.pedimento}
                          </Link>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{ped.fechapago}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{ped.contribuyente}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            ped.alerta 
                              ? 'bg-red-100 text-red-800' 
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {ped.alerta ? 'Sí' : 'No'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{ped.curp_apoderado}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">${ped.importe_total}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">${ped.saldo_disponible}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">${ped.importe_pedimento}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            ped.existe_expediente 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {ped.existe_expediente ? 'Sí' : 'No'}
                          </span>
                        </td>
                      </tr>
                    ))}                  </tbody>
                </table>
              </div>
            )}

            {/* Paginación */}
            {totalDocuments > 0 && (
                <div className="bg-white px-4 py-3 flex flex-col sm:flex-row items-center justify-between border-t border-gray-200">
                  <div className="flex items-center mb-4 sm:mb-0">
                    <span className="text-sm text-gray-700 mr-4">
                      Mostrando <span className="font-semibold">{startIndex + 1}</span> - <span className="font-semibold">{Math.min(endIndex, totalDocuments)}</span> de <span className="font-semibold">{totalDocuments}</span> documentos
                    </span>
                    <select
                      value={itemsPerPage}
                      onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                      className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-navy-500"
                    >
                      <option value={10}>10 por página</option>
                      <option value={15}>15 por página</option>
                      <option value={20}>20 por página</option>
                      <option value={50}>50 por página</option>
                    </select>
                  </div>
                  
                  {totalPages > 1 && (
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center px-3 py-2 rounded-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                        </svg>
                        Anterior
                      </button>
                      
                      <div className="hidden sm:flex space-x-1">
                        {[...Array(totalPages)].map((_, index) => {
                          const page = index + 1;
                          const isCurrentPage = page === currentPage;
                          const isNearCurrentPage = Math.abs(page - currentPage) <= 2;
                          const isFirstOrLast = page === 1 || page === totalPages;
                          
                          if (totalPages <= 7 || isNearCurrentPage || isFirstOrLast) {
                            return (
                              <button
                                key={page}
                                onClick={() => handlePageChange(page)}
                                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md transition-colors ${
                                  isCurrentPage
                                    ? 'z-10 bg-navy-600 border-navy-600 text-white'
                                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                }`}
                              >
                                {page}
                              </button>
                            );
                          } else if (page === currentPage - 3 || page === currentPage + 3) {
                            return (
                              <span key={page} className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                                ...
                              </span>
                            );
                          }
                          return null;
                        })}
                      </div>
                      
                      <div className="sm:hidden flex items-center space-x-2">
                        <span className="text-sm text-gray-700">
                          Página {currentPage} de {totalPages}
                        </span>
                      </div>
                      
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="relative inline-flex items-center px-3 py-2 rounded-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Siguiente
                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  );
}
