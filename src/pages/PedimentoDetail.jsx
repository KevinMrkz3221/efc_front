import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useNotification } from '../context/NotificationContext';

const API_URL = import.meta.env.VITE_EFC_API_URL;

const downloadFile = async (id, filename = 'archivo', showMessage) => {
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
};

const downloadBulkZip = async (ids, showMessage, pedimentoNombre) => {
  if (!ids.length) {
    showMessage('Selecciona al menos un documento.', 'error');
    return;
  }
  const token = localStorage.getItem('access');
  const res = await fetch(`${API_URL}/api/v1/record/documents/bulk-download/`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ document_ids: ids, pedimento_nombre: pedimentoNombre }),
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
    showMessage('No autorizado o error en la descarga masiva', 'error');
    return;
  }
  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${pedimentoNombre || 'documentos'}.zip`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
};

export default function PedimentoDetail() {
  const { id } = useParams();
  const [pedimento, setPedimento] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState([]);
  const [downloading, setDownloading] = useState(false);
  const { showMessage } = useNotification();

  useEffect(() => {
    const token = localStorage.getItem('access');
    fetch(`${API_URL}/api/v1/customs/pedimentos/${id}/`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then(res => {
        if (res.status === 401) {
          localStorage.removeItem('access');
          localStorage.removeItem('refresh');
          showMessage('Tu sesión ha expirado, por favor inicia sesión de nuevo.', 'error');
          setTimeout(() => {
            window.location.href = '/login';
          }, 2000);
          return null;
        }
        if (!res.ok) throw new Error('No autorizado o error en la petición');
        return res.json();
      })
      .then(data => {
        setPedimento(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [id, showMessage]);

  if (loading) return (
    <div className="h-full bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <svg className="animate-spin h-12 w-12 text-navy-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="text-gray-600 text-lg">Cargando detalle de pedimento...</p>
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
          <p className="text-danger-800 font-medium">{error}</p>
        </div>
      </div>
    </div>
  );
  if (!pedimento) return null;

  const allDocIds = pedimento.documentos ? pedimento.documentos.map(doc => doc.id) : [];
  const allSelected = selected.length === allDocIds.length && allDocIds.length > 0;

  const handleSelect = (id) => {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleSelectAll = () => {
    if (allSelected) setSelected([]);
    else setSelected(allDocIds);
  };

  const handleBulkDownload = async (ids) => {
    setDownloading(true);
    await downloadBulkZip(ids, showMessage, pedimento?.pedimento);
    setDownloading(false);
  };

  return (
    <div className="p-6 bg-gray-50 h-full flex flex-col">
      {/* Header */}
      <div className="mb-8 bg-white rounded-lg shadow-sm p-6 flex-shrink-0">
        <Link 
          to="/documents"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-200 mb-4"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
          </svg>
          <span className="font-medium">Volver a la lista</span>
        </Link>
        
        <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
          Detalle de Pedimento
        </h1>
        <p className="mt-2 text-gray-600">Información completa del pedimento y documentos asociados</p>
      </div>

      {/* Contenido scrolleable */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto">

        {/* Información del Pedimento */}
        <div className="bg-white shadow-lg rounded-xl border border-gray-200 mb-8">
          <div className="px-6 py-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">Información General</h2>
          </div>
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 shadow-sm">
                <dt className="text-sm font-semibold text-gray-700 mb-2">Pedimento</dt>
                <dd className="text-2xl font-bold text-gray-900">{pedimento.pedimento}</dd>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 shadow-sm">
                <dt className="text-sm font-semibold text-gray-700 mb-2">Contribuyente</dt>
                <dd className="text-2xl font-bold text-gray-900">{pedimento.contribuyente}</dd>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 shadow-sm">
                <dt className="text-sm font-semibold text-gray-700 mb-2">Fecha de Pago</dt>
                <dd className="text-2xl font-bold text-gray-900">{pedimento.fechapago}</dd>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 shadow-sm">
                <dt className="text-sm font-semibold text-gray-700 mb-2">Importe Total</dt>
                <dd className="text-2xl font-bold text-gray-900">${pedimento.importe_total || 'N/A'}</dd>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 shadow-sm">
                <dt className="text-sm font-semibold text-gray-700 mb-2">Saldo Disponible</dt>
                <dd className="text-2xl font-bold text-gray-900">${pedimento.saldo_disponible || 'N/A'}</dd>
              </div>
              
              <div className={`p-6 rounded-xl border shadow-sm ${pedimento.existe_expediente 
                ? 'bg-green-50 border-green-200' 
                : 'bg-red-50 border-red-200'
              }`}>
                <dt className={`text-sm font-semibold mb-2 ${pedimento.existe_expediente ? 'text-green-700' : 'text-red-700'}`}>
                  Expediente
                </dt>
                <dd className={`text-2xl font-bold flex items-center ${pedimento.existe_expediente ? 'text-green-900' : 'text-red-900'}`}>
                  <svg className={`w-6 h-6 mr-2 ${pedimento.existe_expediente ? 'text-green-600' : 'text-red-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {pedimento.existe_expediente ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    )}
                  </svg>
                  {pedimento.existe_expediente ? 'Disponible' : 'No disponible'}
                </dd>
              </div>
            </div>
          </div>
        </div>

        {/* Sección de Documentos */}
        <div className="bg-white shadow-lg rounded-xl border border-gray-200">
          <div className="px-6 py-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Documentos Relacionados
                </h2>
                <div className="flex items-center mt-1">
                  <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    📄 {pedimento.documentos ? pedimento.documentos.length : 0} documentos
                  </span>
                </div>
              </div>
              
              {allDocIds.length > 0 && (
                <div className="flex space-x-3">
                  <button 
                    onClick={() => handleBulkDownload(allDocIds)} 
                    disabled={downloading}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:transform-none"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    {downloading ? 'Descargando...' : 'Descargar todos'}
                  </button>
                  
                  <button 
                    onClick={() => handleBulkDownload(selected)} 
                    disabled={selected.length === 0 || downloading}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:transform-none"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Descargar seleccionados ({selected.length})
                  </button>
                </div>
              )}
            </div>
          </div>
          
          <div className="overflow-hidden">
            {pedimento.documentos && pedimento.documentos.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        <input 
                          type="checkbox" 
                          checked={allSelected} 
                          onChange={handleSelectAll}
                          className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Archivo</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Extensión</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Tamaño</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Fecha</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Tipo</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Acción</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {pedimento.documentos.map((doc, index) => (
                      <tr key={doc.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input 
                            type="checkbox" 
                            checked={selected.includes(doc.id)} 
                            onChange={() => handleSelect(doc.id)}
                            className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 max-w-xs">
                          <span className="truncate font-medium" title={doc.archivo || 'Sin nombre'}>
                            {doc.archivo ? doc.archivo.split('/').pop() : 'Sin nombre'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {doc.extension || 'N/A'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {doc.size || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {doc.created_at ? new Date(doc.created_at).toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          }) : 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            {doc.document_type || 'Documento'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button 
                            onClick={() => downloadFile(doc.id, doc.archivo ? doc.archivo.split('/').pop() : `documento_${doc.id}`, showMessage)}
                            className="inline-flex items-center px-3 py-2 border border-transparent text-xs font-medium rounded-md text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                          >
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Descargar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="mx-auto h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Sin documentos</h3>
                <p className="text-gray-500">No hay documentos relacionados con este pedimento.</p>
              </div>
            )}
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
