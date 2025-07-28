import React, { useEffect, useState, useLayoutEffect, useRef } from 'react';
import SuccessModal from '../components/SuccessModal.jsx';
// Animación fade-in/slide-up para bloques
const fadeInSlideUp = `@keyframes fadein-slideup { 0% { opacity: 0; transform: translateY(40px); } 100% { opacity: 1; transform: translateY(0); } }`;
if (typeof document !== 'undefined' && !document.getElementById('fadein-slideup-documents')) {
  const style = document.createElement('style');
  style.id = 'fadein-slideup-documents';
  style.innerHTML = fadeInSlideUp;
  document.head.appendChild(style);
}
import { fetchPedimentoDocuments } from '../api/documentos.ts';
import { useNotification } from '../context/NotificationContext';
// import { usePolling } from '../hooks/usePolling';
import { Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_EFC_API_URL;

// Descarga individual
const downloadFile = async (id, filename = 'archivo', setSuccess, setError, showMessage) => {
  const token = localStorage.getItem('access');
  const res = await fetch(`${API_URL}/record/documents/descargar/${id}/`, {
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

// Descarga masiva (bulk)
const downloadBulkZip = async (ids, showMessage, setSuccess, nombreZip = 'documentos') => {
  if (!ids.length) {
    showMessage('Selecciona al menos un documento.', 'error');
    return;
  }
  const token = localStorage.getItem('access');
  const res = await fetch(`${API_URL}/record/documents/bulk-download/`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ document_ids: ids, pedimento_nombre: nombreZip }),
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
  a.download = `${nombreZip || 'documentos'}.zip`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
  if (setSuccess) setSuccess('Descarga(s) completada(s)');
};

export default function Documents() {
  const focusKeeperRef = useRef(null);
  const [success, setSuccess] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [extensionFilter, setExtensionFilter] = useState('');
  const [documentTypeFilter, setDocumentTypeFilter] = useState('');
  const [createdAtFilter, setCreatedAtFilter] = useState('');
  const [pedimentoNumeroFilter, setPedimentoNumeroFilter] = useState('');
  const { showMessage } = useNotification();
  // Estado para controlar la animación de entrada
  const [showAnimation, setShowAnimation] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  useLayoutEffect(() => {
    // Forzar un render antes de activar la animación
    setShowAnimation(true);
  }, []);
  useEffect(() => {
    if (showAnimation && !hasAnimated) {
      const timeout = setTimeout(() => {
        setHasAnimated(true);
        setShowAnimation(false);
      }, 700); // Duración igual a la animación
      return () => clearTimeout(timeout);
    }
  }, [showAnimation, hasAnimated]);

  // Estado local para los datos, loading y error
  const [docsData, setDocsData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch de datos solo al cargar la página o cuando cambian los filtros/paginación
  useEffect(() => {
    let isMounted = true;
    const fetchDocsData = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('access');
        const data = await fetchPedimentoDocuments(token, '', currentPage, itemsPerPage, {
          pedimento_numero: pedimentoNumeroFilter,
          extension: extensionFilter,
          document_type: documentTypeFilter,
          created_at: createdAtFilter,
        });
        if (isMounted) setDocsData(data);
      } catch (err) {
        if (isMounted) setError(err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchDocsData();
    return () => { isMounted = false; };
  }, [currentPage, itemsPerPage, pedimentoNumeroFilter, extensionFilter, documentTypeFilter, createdAtFilter]);

  // Refetch manual (si se quiere usar en el futuro)
  const refetch = () => {
    setCurrentPage(1); // Esto forzará el useEffect a recargar
  };

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


  // Cálculos de paginación usando la estructura tipada
  const documentsArray = docsData && docsData.results ? docsData.results : [];
  const totalDocuments = docsData && typeof docsData.count === 'number' ? docsData.count : 0;
  const totalPages = totalDocuments > 0 ? Math.ceil(totalDocuments / itemsPerPage) : 1;
  const currentDocuments = documentsArray;

  // Selección de documentos
  const [selectedDocs, setSelectedDocs] = useState([]);
  // allSelected: todos los docs de la página actual están seleccionados
  const allSelected = currentDocuments.length > 0 && selectedDocs.length === currentDocuments.length;
  // someSelected: hay al menos uno seleccionado pero no todos
  const someSelected = selectedDocs.length > 0 && selectedDocs.length < currentDocuments.length;

  // Handlers para selección
  const handleSelectOne = (id) => {
    setSelectedDocs(prev => prev.includes(id) ? prev.filter(d => d !== id) : [...prev, id]);
  };
  const handleSelectAll = () => {
    if (allSelected) {
      setSelectedDocs([]);
    } else {
      setSelectedDocs(currentDocuments.map(doc => doc.id));
    }
  };


  // Descargar seleccionados (bulk) con prompt para nombre del zip
  const handleDownloadSelected = async () => {
    const ids = currentDocuments.filter(doc => selectedDocs.includes(doc.id)).map(doc => doc.id);
    if (ids.length === 1) {
      // Si solo hay uno, descarga individual
      const doc = currentDocuments.find(doc => doc.id === ids[0]);
      await downloadFile(doc.id, doc.archivo ? doc.archivo.split('/').pop() : 'archivo', () => {
        setSuccess('Descarga exitosa');
        setShowSuccessModal(true);
      }, null, showMessage);
    } else if (ids.length > 1) {
      let nombreZip = window.prompt('¿Qué nombre quieres para el archivo zip?', 'documentos_seleccionados');
      if (!nombreZip) nombreZip = 'documentos_seleccionados';
      await downloadBulkZip(ids, showMessage, () => {
        setSuccess('Descarga exitosa');
        setShowSuccessModal(true);
      }, nombreZip);
    }
  };

  // Descargar todos los de la página (bulk) con prompt para nombre del zip
  const handleDownloadAll = async () => {
    const ids = currentDocuments.map(doc => doc.id);
    if (ids.length === 1) {
      const doc = currentDocuments[0];
      await downloadFile(doc.id, doc.archivo ? doc.archivo.split('/').pop() : 'archivo', () => {
        setSuccess('Descarga exitosa');
        setShowSuccessModal(true);
      }, null, showMessage);
    } else if (ids.length > 1) {
      let nombreZip = window.prompt('¿Qué nombre quieres para el archivo zip?', 'documentos_pagina');
      if (!nombreZip) nombreZip = 'documentos_pagina';
      await downloadBulkZip(ids, showMessage, () => {
        setSuccess('Descarga exitosa');
        setShowSuccessModal(true);
      }, nombreZip);
    }
  };

  // Limpiar selección al cambiar de página o documentos
  useEffect(() => {
    setSelectedDocs([]);
  }, [currentPage, itemsPerPage, pedimentoNumeroFilter, extensionFilter, documentTypeFilter, createdAtFilter, docsData]);

  // Obtener lista única de contribuyentes para el combobox (de la página actual)
  const contribuyentes = Array.from(new Set(currentDocuments.map(d => d.contribuyente).filter(Boolean)));

  // Refuerza la paginación SPA: nunca recarga la página, solo cambia el estado local
  const handlePageChange = (newPage, e) => {
    if (e && typeof e.preventDefault === 'function') e.preventDefault();
    if (e && typeof e.stopPropagation === 'function') e.stopPropagation();
    if (newPage < 1 || newPage > totalPages || newPage === currentPage) return;
    setCurrentPage(newPage);
    // Quitar el foco del botón activo para evitar salto de scroll
    if (typeof document !== 'undefined' && document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  };

  // Forzar foco al div invisible para evitar saltos por enfoque automático
  useLayoutEffect(() => {
    if (focusKeeperRef.current) {
      focusKeeperRef.current.focus();
    }
  }, [currentPage]);

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset a la primera página
  };


  // El layout principal y la tabla siempre se renderizan, loader/error/empty solo dentro del área de la tabla

  return (
    <div className="p-6 bg-gray-50">
      <div ref={focusKeeperRef} tabIndex={-1} style={{position:'absolute',width:0,height:0,overflow:'hidden',outline:'none'}} aria-hidden="true"></div>
      <div className="max-w-7xl mx-auto">
        {/* Header mejorado y decorativo */}
        <div className={
          "mb-8 relative overflow-hidden rounded-2xl shadow bg-gradient-to-r from-blue-50 via-white to-indigo-50 border border-blue-100 p-8 flex items-center gap-6"+
          (showAnimation && !hasAnimated ? ' animate-fadein-slideup opacity-0' : '')
        }
        style={showAnimation && !hasAnimated ? { animation: 'fadein-slideup 0.7s cubic-bezier(0.22,1,0.36,1) 0.05s forwards' } : undefined}>
          <div className="flex-shrink-0 bg-blue-100 rounded-full p-4 shadow-md animate-bounce-slow">
            <svg className="h-10 w-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <h1 className="text-4xl font-extrabold text-blue-900 tracking-tight mb-1 flex items-center gap-2">
              Documentos
              <span className="inline-block bg-blue-200 text-blue-800 text-xs font-semibold px-2 py-0.5 rounded-full ml-2 animate-fade-in">{totalDocuments}</span>
            </h1>
            <p className="text-lg text-blue-700/80 font-medium">Descarga los documentos de tus pedimentos.</p>
          </div>
          {/* Efecto decorativo de fondo */}
          <div className="absolute -top-10 -right-10 opacity-30 pointer-events-none select-none">
            <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
              <circle cx="60" cy="60" r="50" fill="url(#grad1)" />
              <defs>
                <linearGradient id="grad1" x1="0" y1="0" x2="120" y2="120" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#3b82f6" stopOpacity="0.15" />
                  <stop offset="1" stopColor="#6366f1" stopOpacity="0.10" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
        {/* Animación personalizada para el icono y contador */}
        <style>{`
          @keyframes bounce-slow {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-8px); }
          }
          .animate-bounce-slow {
            animation: bounce-slow 2.2s infinite;
          }
          @keyframes fade-in {
            from { opacity: 0; transform: scale(0.9); }
            to { opacity: 1; transform: scale(1); }
          }
          .animate-fade-in {
            animation: fade-in 0.7s ease;
          }
        `}</style>

        <div className={
          "bg-white shadow-lg rounded-xl border border-gray-200"+
          (showAnimation && !hasAnimated ? ' animate-fadein-slideup opacity-0' : '')
        }
        style={showAnimation && !hasAnimated ? { animation: 'fadein-slideup 0.7s cubic-bezier(0.22,1,0.36,1) 0.15s forwards' } : undefined}>
          <div className="px-6 py-6 border-b border-gray-200">
                        <div className="overflow-x-auto" id="tabla-documentos">
              {/* Header de Documentos Relacionados arriba de los filtros */}
              <div className="px-8 pt-8 pb-2 border-b border-gray-200">
                <h2 className="text-2xl font-extrabold text-blue-800 tracking-tight mb-1">
                  Todos los Documentos
                </h2>
                <div className="h-1 w-10 bg-blue-400 rounded mb-2"></div>
              </div>
              {/* Filtros de query parameters */}
              <div className="px-6 py-6 border-b border-gray-200">
                {/* Filtros avanzados */}
                <div className="mb-4 flex flex-wrap gap-4 items-end justify-between">
                  {/* Pedimento Número */}
                  <div className="flex flex-col flex-1 min-w-[150px]">
                    <label className="text-xs font-semibold text-gray-700 mb-1">Pedimento Número</label>
                    <input
                      type="text"
                      value={pedimentoNumeroFilter}
                      onChange={e => setPedimentoNumeroFilter(e.target.value)}
                      placeholder="Buscar por número de pedimento..."
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                    />
                  </div>
                  {/* Extensión */}
                  <div className="flex flex-col flex-1 min-w-[150px]">
                    <label className="text-xs font-semibold text-gray-700 mb-1">Extensión</label>
                    <select
                      value={extensionFilter}
                      onChange={e => setExtensionFilter(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                    >
                      <option value="">Todas</option>
                      <option value="pdf">PDF</option>
                      <option value="xml">XML</option>
                      <option value="jpg">JPG</option>
                      <option value="jpeg">JPEG</option>
                      <option value="png">PNG</option>
                      <option value="xls">XLS</option>
                      <option value="xlsx">XLSX</option>
                      <option value="doc">DOC</option>
                      <option value="docx">DOCX</option>
                      <option value="txt">TXT</option>
                      <option value="zip">ZIP</option>
                      <option value="rar">RAR</option>
                    </select>
                  </div>
                  {/* Tipo de documento */}
                  <div className="flex flex-col flex-1 min-w-[150px]">
                    <label className="text-xs font-semibold text-gray-700 mb-1">Tipo de documento</label>
                    <select
                      value={documentTypeFilter}
                      onChange={e => setDocumentTypeFilter(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                    >
                      <option value="">Todos</option>
                      <option value="1">Pedimento Partida</option>
                      <option value="2">Pedimento Completo</option>
                      <option value="3">Pedimento Remesas</option>
                      <option value="4">Pedimento Acuse</option>
                      <option value="5">Pedimento EDocument</option>
                      <option value="6">Estado Pedimento</option>
                    </select>
                  </div>
                  {/* Fecha de creación */}
                  <div className="flex flex-col flex-1 min-w-[150px]">
                    <label className="text-xs font-semibold text-gray-700 mb-1">Fecha de creación</label>
                    <input
                      type="date"
                      value={createdAtFilter}
                      onChange={e => setCreatedAtFilter(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                    />
                  </div>
                </div>
                {/* Botón de actualizar eliminado por solicitud */}
                <SuccessModal open={showSuccessModal} onClose={() => setShowSuccessModal(false)} message={success || 'Descarga exitosa'} />
                {/* Botones de descarga */}
                {currentDocuments.length > 0 && (
                  <div className="flex space-x-3 mb-2">
                    <button
                      onClick={handleDownloadAll}
                      disabled={currentDocuments.length === 0}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-105 shadow-lg"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Descargar todos
                    </button>
                    <button
                      onClick={handleDownloadSelected}
                      disabled={selectedDocs.length === 0}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 transform hover:scale-105 shadow-lg"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Descargar seleccionados ({selectedDocs.length})
                    </button>
                  </div>
                )}
              </div>
              <div style={{ minHeight: 'calc(6 * 56px)', maxHeight: 'calc(6 * 56px)', overflowY: currentDocuments.length > 6 ? 'auto' : 'hidden', position: 'relative' }}>
                <table className="min-w-full divide-y divide-gray-200 rounded-lg overflow-hidden text-xs">
                  <thead className="bg-gradient-to-r from-gray-50 sticky top-0 z-20">
                    <tr>
                      <th className="px-2 py-2 text-center font-bold text-blue-700 uppercase tracking-wider border-b border-gray-200 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={allSelected}
                          ref={el => { if (el) el.indeterminate = someSelected; }}
                          onChange={handleSelectAll}
                          className="h-3.5 w-3.5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded align-middle"
                          style={{ minWidth: '14px', minHeight: '14px' }}
                        />
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider border-b border-gray-200">Pedimento</th>
                      <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider border-b border-gray-200">Archivo</th>
                      <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider border-b border-gray-200">Tipo</th>
                      <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider border-b border-gray-200">Tamaño</th>
                      <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider border-b border-gray-200">Extensión</th>
                      <th className="px-6 py-3 text-center text-xs font-bold text-blue-700 uppercase tracking-wider border-b border-gray-200">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100" style={{ position: 'relative', minHeight: 'calc(8 * 56px)' }}>
                    {/* Loader/Error/Empty state dentro del área de la tabla, sin cambiar el layout */}
                    {loading ? (
                      <tr>
                        <td colSpan={10} style={{ height: 'calc(8 * 56px)', padding: 0 }}>
                          <div className="flex items-center justify-center h-full w-full absolute left-0 top-0" style={{ minHeight: 'calc(8 * 56px)', background: 'rgba(255,255,255,0.7)', zIndex: 10 }}>
                            <span className="text-gray-500 text-lg">Cargando documentos...</span>
                          </div>
                        </td>
                      </tr>
                    ) : error ? (
                      <tr>
                        <td colSpan={10} style={{ height: 'calc(8 * 56px)', padding: 0 }}>
                          <div className="flex items-center justify-center h-full w-full absolute left-0 top-0" style={{ minHeight: 'calc(8 * 56px)', background: 'rgba(255,255,255,0.7)', zIndex: 10 }}>
                            <span className="text-danger-600 text-lg">Error: {error.message || 'Error al cargar documentos'}</span>
                          </div>
                        </td>
                      </tr>
                    ) : currentDocuments.length > 0 ? (
                      <>
                        {currentDocuments.map(doc => (
                          <tr key={doc.id} className="transition-all duration-200 hover:bg-blue-100 hover:shadow-lg">
                            <td className="px-2 py-2 text-center align-middle">
                              <input
                                type="checkbox"
                                checked={selectedDocs.includes(doc.id)}
                                onChange={() => handleSelectOne(doc.id)}
                                className="h-3.5 w-3.5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded align-middle"
                                style={{ minWidth: '14px', minHeight: '14px' }}
                              />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap align-middle font-medium text-blue-900">{doc.pedimento_numero}</td>
                            <td className="px-6 py-4 whitespace-nowrap align-middle text-gray-800">{doc.archivo ? doc.archivo.split('/').pop() : ''}</td>
                            <td className="px-6 py-4 whitespace-nowrap align-middle text-gray-700">{
                              (() => {
                                switch (String(doc.document_type)) {
                                  case '1': return 'Pedimento Partida';
                                  case '2': return 'Pedimento Completo';
                                  case '3': return 'Pedimento Remesas';
                                  case '4': return 'Pedimento Acuse';
                                  case '5': return 'Pedimento EDocument';
                                  case '6': return 'Estado Pedimento';
                                  default: return doc.document_type || '';
                                }
                              })()
                            }</td>
                            <td className="px-6 py-4 whitespace-nowrap align-middle text-gray-700">{doc.size}</td>
                            <td className="px-6 py-4 whitespace-nowrap align-middle text-gray-700">{doc.extension}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-center align-middle">
                              <button
                                className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-semibold rounded-md text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-105 shadow"
                                title="Descargar"
                                onClick={async () => {
                                  await downloadFile(
                                    doc.id,
                                    doc.archivo ? doc.archivo.split('/').pop() : 'archivo',
                                    () => {
                                      setSuccess('Descarga exitosa');
                                      setShowSuccessModal(true);
                                    },
                                    null,
                                    showMessage
                                  );
                                }}
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                              </button>
                            </td>
                          </tr>
                        ))}
                        {/* Rellenar con filas vacías si hay menos de 8 */}
                        {currentDocuments.length < 8 && !loading && !error && Array.from({length: 8 - currentDocuments.length}).map((_, idx) => (
                          <tr key={`empty-${idx}`} className="">
                            <td className="px-2 py-4" />
                            <td className="px-6 py-4 whitespace-nowrap" colSpan={5}>&nbsp;</td>
                          </tr>
                        ))}
                      </>
                    ) : (
                      <tr>
                        <td colSpan={10} style={{ height: 'calc(8 * 56px)', padding: 0 }}>
                          <div className="flex flex-col items-center justify-center h-full w-full absolute left-0 top-0" style={{ minHeight: 'calc(8 * 56px)', background: 'rgba(255,255,255,0.7)', zIndex: 10 }}>
                            <div className="mx-auto h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                              <svg className="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay pedimentos</h3>
                            <p className="text-gray-500">Aún no tienes pedimentos registrados.</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Botón de actualizar eliminado por solicitud */}
            <SuccessModal open={showSuccessModal} onClose={() => setShowSuccessModal(false)} message={success || 'Descarga exitosa'} />
          </div>

          <div className="overflow-hidden">

            {/* Paginación con botones numerados y elipsis */}
            {totalDocuments > 0 && (
              <div className="bg-white px-4 py-3 flex flex-col sm:flex-row items-center justify-between border-t border-gray-200">
                {(() => {
                  const totalPages = Math.max(1, Math.ceil(totalDocuments / itemsPerPage));
                  const maxPagesToShow = 5;
                  let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
                  let endPage = startPage + maxPagesToShow - 1;
                  if (endPage > totalPages) {
                    endPage = totalPages;
                    startPage = Math.max(1, endPage - maxPagesToShow + 1);
                  }
                  const pageNumbers = [];
                  for (let i = startPage; i <= endPage; i++) {
                    pageNumbers.push(i);
                  }
                  return (
                    <div className="flex flex-col sm:flex-row sm:items-center w-full gap-2 sm:gap-4 mt-2 sm:mt-0">
                      <div className="flex items-center gap-2">
                        <label htmlFor="itemsPerPage" className="text-xs text-gray-600 font-medium">Registros por página:</label>
                        <select
                          id="itemsPerPage"
                          value={itemsPerPage}
                          onChange={e => handleItemsPerPageChange(Number(e.target.value))}
                          className="border border-gray-300 rounded px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                        >
                          {[5, 10, 20, 50, 100, 200, 400, 800, 1200, 2400, 10000].map(size => (
                            <option key={size} value={size}>{size}</option>
                          ))}
                        </select>
                      </div>
                      <div className="flex items-center gap-1 flex-wrap">
                        <button
                          type="button"
                          onClick={e => handlePageChange(1, e)}
                          disabled={currentPage === 1}
                          className={`px-2 py-1 rounded border text-xs font-semibold transition-colors duration-150 ${currentPage === 1 ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' : 'bg-white text-blue-700 border-blue-200 hover:bg-blue-50 hover:text-blue-900'}`}
                        >
                          «
                        </button>
                        <button
                          type="button"
                          onClick={e => handlePageChange(currentPage - 1, e)}
                          disabled={currentPage === 1}
                          className={`px-2 py-1 rounded border text-xs font-semibold transition-colors duration-150 ${currentPage === 1 ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' : 'bg-white text-blue-700 border-blue-200 hover:bg-blue-50 hover:text-blue-900'}`}
                        >
                          ‹
                        </button>
                        {pageNumbers.map(num => (
                          <button
                            type="button"
                            key={num}
                            onClick={e => handlePageChange(num, e)}
                            className={`px-2 py-1 rounded border text-xs font-semibold transition-colors duration-150 ${num === currentPage ? 'bg-blue-600 text-white border-blue-700 cursor-default' : 'bg-white text-blue-700 border-blue-200 hover:bg-blue-50 hover:text-blue-900'}`}
                            disabled={num === currentPage}
                          >
                            {num}
                          </button>
                        ))}
                        <button
                          type="button"
                          onClick={e => handlePageChange(currentPage + 1, e)}
                          disabled={currentPage >= totalPages}
                          className={`px-2 py-1 rounded border text-xs font-semibold transition-colors duration-150 ${(currentPage >= totalPages) ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' : 'bg-white text-blue-700 border-blue-200 hover:bg-blue-50 hover:text-blue-900'}`}
                        >
                          ›
                        </button>
                        <button
                          type="button"
                          onClick={e => handlePageChange(totalPages, e)}
                          disabled={currentPage >= totalPages}
                          className={`px-2 py-1 rounded border text-xs font-semibold transition-colors duration-150 ${(currentPage >= totalPages) ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' : 'bg-white text-blue-700 border-blue-200 hover:bg-blue-50 hover:text-blue-900'}`}
                        >
                          »
                        </button>
                        <span className="ml-3 text-xs text-gray-500">Página <span className="font-bold">{currentPage}</span> de <span className="font-bold">{totalPages}</span></span>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
