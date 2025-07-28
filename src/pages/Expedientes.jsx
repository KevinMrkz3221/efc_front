import React, { useEffect, useState, useLayoutEffect, useRef } from 'react';
// Animación fade-in/slide-up para bloques
const fadeInSlideUp = `@keyframes fadein-slideup { 0% { opacity: 0; transform: translateY(40px); } 100% { opacity: 1; transform: translateY(0); } }`;
if (typeof document !== 'undefined' && !document.getElementById('fadein-slideup-documents')) {
  const style = document.createElement('style');
  style.id = 'fadein-slideup-documents';
  style.innerHTML = fadeInSlideUp;
  document.head.appendChild(style);
}
import { fetchDocuments } from '../api/expedientes.ts';
import { useNotification } from '../context/NotificationContext';
import { usePolling } from '../hooks/usePolling';
import { Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_EFC_API_URL;

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
  if (setSuccess) setSuccess('Descarga exitosa');useEffect
};

export default function Documents() {
  const focusKeeperRef = useRef(null);
  const [success, setSuccess] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [alertaFilter, setAlertaFilter] = useState('all'); // all, true, false
  const [expedienteFilter, setExpedienteFilter] = useState('all'); // all, true, false
  const [contribuyenteFilter, setContribuyenteFilter] = useState('');
  const [contribuyenteInput, setContribuyenteInput] = useState('');
  const [fechaPagoFilter, setFechaPagoFilter] = useState('');
  const [pedimentoFilter, setPedimentoFilter] = useState('');
  const [searchFilter, setSearchFilter] = useState('');
  const [curpApoderadoFilter, setCurpApoderadoFilter] = useState('');
  const [patenteFilter, setPatenteFilter] = useState('');
  const [aduanaFilter, setAduanaFilter] = useState('');
  const [tipoOperacionFilter, setTipoOperacionFilter] = useState('');
  const [clavePedimentoFilter, setClavePedimentoFilter] = useState('');
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

  // Fetching usando la función tipada de TypeScript
  const fetchPedimentosData = async (page = currentPage, pageSize = itemsPerPage) => {
    const token = localStorage.getItem('access');
    // Construir objeto de filtros
    const filters = {
      search: searchFilter || undefined,
      pedimento: pedimentoFilter || undefined,
      existe_expediente: expedienteFilter === 'all' ? undefined : expedienteFilter,
      alerta: alertaFilter === 'all' ? undefined : alertaFilter,
      contribuyente: contribuyenteFilter || undefined,
      curp_apoderado: curpApoderadoFilter || undefined,
      fecha_pago: fechaPagoFilter || undefined,
      patente: patenteFilter || undefined,
      aduana: aduanaFilter || undefined,
      tipo_operacion: tipoOperacionFilter || undefined,
      clave_pedimento: clavePedimentoFilter || undefined,
    };
    return await fetchDocuments(token, page, pageSize, filters);
  };

  // Hook de polling que se ejecuta cada 30 segundos
  const { data: pedimentos, loading, error, refetch } = usePolling(
    () => fetchPedimentosData(currentPage, itemsPerPage),
    30000, // 30 segundos
    [currentPage, itemsPerPage, searchFilter, pedimentoFilter, expedienteFilter, alertaFilter, contribuyenteFilter, curpApoderadoFilter, fechaPagoFilter, patenteFilter, aduanaFilter, tipoOperacionFilter, clavePedimentoFilter]
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

  // Cálculos de paginación usando la estructura tipada
  const documentsArray = pedimentos && pedimentos.results ? pedimentos.results : [];
  const totalDocuments = pedimentos && typeof pedimentos.count === 'number' ? pedimentos.count : 0;
  const totalPages = totalDocuments > 0 ? Math.ceil(totalDocuments / itemsPerPage) : 1;
  const currentDocuments = documentsArray;

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
              Expedientes
              <span className="inline-block bg-blue-200 text-blue-800 text-xs font-semibold px-2 py-0.5 rounded-full ml-2 animate-fade-in">{totalDocuments}</span>
            </h1>
            <p className="text-lg text-blue-700/80 font-medium">Gestiona y descarga los documentos de tus pedimentos.</p>
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
            {/* Filtros avanzados */}
            <div className="mb-4 flex flex-wrap gap-4 items-end">
              {/* Search global */}
              <div className="flex flex-col">
                <label className="text-xs font-semibold text-gray-700 mb-1">Buscar</label>
                <input
                  type="text"
                  value={searchFilter}
                  onChange={e => setSearchFilter(e.target.value)}
                  placeholder="Buscar pedimento, contribuyente, agente aduanal..."
                  className="w-44 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                />
              </div>
              {/* Pedimento */}
              <div className="flex flex-col">
                <label className="text-xs font-semibold text-gray-700 mb-1">Pedimento</label>
                <input
                  type="text"
                  value={pedimentoFilter}
                  onChange={e => setPedimentoFilter(e.target.value)}
                  placeholder="Buscar pedimento..."
                  className="w-36 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                />
              </div>
              {/* Alerta */}
              <div className="flex flex-col">
                <label className="text-xs font-semibold text-gray-700 mb-1">Alerta</label>
                <select value={alertaFilter} onChange={e => setAlertaFilter(e.target.value)}
                  className="w-36 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50">
                  <option value="all">Todos</option>
                  <option value="true">Sí</option>
                  <option value="false">No</option>
                </select>
              </div>
              {/* Expediente */}
              <div className="flex flex-col">
                <label className="text-xs font-semibold text-gray-700 mb-1">Expediente</label>
                <select value={expedienteFilter} onChange={e => setExpedienteFilter(e.target.value)}
                  className="w-36 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50">
                  <option value="all">Todos</option>
                  <option value="true">Sí</option>
                  <option value="false">No</option>
                </select>
              </div>
              {/* Contribuyente combobox */}
              <div className="flex flex-col relative">
                <label className="text-xs font-semibold text-gray-700 mb-1">Contribuyente</label>
                <input
                  type="text"
                  value={contribuyenteInput}
                  onChange={e => {
                    setContribuyenteInput(e.target.value);
                    setContribuyenteFilter('');
                  }}
                  placeholder="Buscar o escribir..."
                  className="w-44 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                  autoComplete="off"
                />
                {/* Dropdown de sugerencias */}
                {contribuyenteInput && (
                  <div className="absolute top-14 left-0 w-44 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-40 overflow-auto">
                    {contribuyentes.filter(c => c.toLowerCase().includes(contribuyenteInput.toLowerCase())).length === 0 ? (
                      <div className="px-3 py-2 text-sm text-gray-500">Sin coincidencias</div>
                    ) : (
                      contribuyentes.filter(c => c.toLowerCase().includes(contribuyenteInput.toLowerCase())).map(c => (
                        <button
                          key={c}
                          type="button"
                          className="w-full text-left px-3 py-2 hover:bg-blue-50 text-sm"
                          onClick={() => {
                            setContribuyenteFilter(c);
                            setContribuyenteInput('');
                          }}
                        >
                          {c}
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>
              {/* CURP Apoderado */}
              <div className="flex flex-col">
                <label className="text-xs font-semibold text-gray-700 mb-1">CURP Apoderado</label>
                <input
                  type="text"
                  value={curpApoderadoFilter}
                  onChange={e => setCurpApoderadoFilter(e.target.value)}
                  placeholder="CURP del apoderado..."
                  className="w-44 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                />
              </div>
              {/* Fecha de pago */}
              <div className="flex flex-col">
                <label className="text-xs font-semibold text-gray-700 mb-1">Fecha de pago</label>
                <input type="date" value={fechaPagoFilter} onChange={e => setFechaPagoFilter(e.target.value)}
                  className="w-44 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50" />
              </div>
              {/* Patente */}
              <div className="flex flex-col">
                <label className="text-xs font-semibold text-gray-700 mb-1">Patente</label>
                <input
                  type="text"
                  value={patenteFilter}
                  onChange={e => setPatenteFilter(e.target.value)}
                  placeholder="Patente..."
                  className="w-36 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                />
              </div>
              {/* Aduana */}
              <div className="flex flex-col">
                <label className="text-xs font-semibold text-gray-700 mb-1">Aduana</label>
                <input
                  type="text"
                  value={aduanaFilter}
                  onChange={e => setAduanaFilter(e.target.value)}
                  placeholder="Aduana..."
                  className="w-36 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                />
              </div>
              {/* Tipo de operación */}
              <div className="flex flex-col">
                <label className="text-xs font-semibold text-gray-700 mb-1">Tipo de operación</label>
                <input
                  type="text"
                  value={tipoOperacionFilter}
                  onChange={e => setTipoOperacionFilter(e.target.value)}
                  placeholder="ID tipo operación..."
                  className="w-36 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                />
              </div>
              {/* Clave pedimento */}
              <div className="flex flex-col">
                <label className="text-xs font-semibold text-gray-700 mb-1">Clave pedimento</label>
                <input
                  type="text"
                  value={clavePedimentoFilter}
                  onChange={e => setClavePedimentoFilter(e.target.value)}
                  placeholder="Clave pedimento..."
                  className="w-36 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                🔄 Actualización automática cada 30 segundos
              </span>
              <button 
                onClick={refetch} 
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Actualizar Ahora
              </button>
              
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
            <div className="overflow-x-auto" id="tabla-documentos">
              <div style={{ minHeight: 'calc(7 * 56px)', maxHeight: 'calc(7 * 56px)', overflowY: currentDocuments.length > 8 ? 'auto' : 'hidden', position: 'relative' }}>
                <table className="min-w-full divide-y divide-gray-200 rounded-lg overflow-hidden sticky text-xs">
                  <thead className="bg-gray-50 sticky top-0 z-20 shadow">
                    <tr>
                      <th className="px-2 py-2 text-left font-bold uppercase tracking-wider border-b border-gray-200 whitespace-nowrap">Pedimento</th>
                      <th className="px-2 py-2 text-left font-bold uppercase tracking-wider border-b border-gray-200 whitespace-nowrap">Fecha de pago</th>
                      <th className="px-2 py-2 text-left font-bold uppercase tracking-wider border-b border-gray-200 whitespace-nowrap">Contribuyente</th>
                      <th className="px-2 py-2 text-left font-bold uppercase tracking-wider border-b border-gray-200 whitespace-nowrap">Alerta</th>
                      <th className="px-2 py-2 text-left font-bold uppercase tracking-wider border-b border-gray-200 whitespace-nowrap">CURP Apoderado</th>
                      <th className="px-2 py-2 text-left font-bold uppercase tracking-wider border-b border-gray-200 whitespace-nowrap">Importe total</th>
                      <th className="px-2 py-2 text-left font-bold uppercase tracking-wider border-b border-gray-200 whitespace-nowrap">Saldo disponible</th>
                      <th className="px-2 py-2 text-left font-bold uppercase tracking-wider border-b border-gray-200 whitespace-nowrap">Importe pedimento</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expediente</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200" style={{ position: 'relative', minHeight: 'calc(8 * 56px)' }}>
                    {/* Loader/Error/Empty state dentro del área de la tabla, sin cambiar el layout */}
                    {loading ? (
                      <tr>
                        <td colSpan={9} style={{ height: 'calc(8 * 56px)', padding: 0 }}>
                          <div className="flex items-center justify-center h-full w-full absolute left-0 top-0" style={{ minHeight: 'calc(8 * 56px)', background: 'rgba(255,255,255,0.7)', zIndex: 10 }}>
                            <span className="text-gray-500 text-lg">Cargando documentos...</span>
                          </div>
                        </td>
                      </tr>
                    ) : error ? (
                      <tr>
                        <td colSpan={9} style={{ height: 'calc(8 * 56px)', padding: 0 }}>
                          <div className="flex items-center justify-center h-full w-full absolute left-0 top-0" style={{ minHeight: 'calc(8 * 56px)', background: 'rgba(255,255,255,0.7)', zIndex: 10 }}>
                            <span className="text-danger-600 text-lg">Error: {error.message || 'Error al cargar documentos'}</span>
                          </div>
                        </td>
                      </tr>
                    ) : currentDocuments.length > 0 ? (
                      <>
                        {currentDocuments.map(ped => (
                          <tr key={ped.id} className="hover:bg-blue-50 transition-all duration-300 hover:scale-[1.02] hover:shadow-md">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <Link 
                                to={`/expedientes/pedimento/${ped.id}`}
                                className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
                              >
                                {ped.pedimento}
                              </Link>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{ped.fechapago}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{ped.contribuyente}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
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
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                ped.existe_expediente 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-gray-100 text-gray-800'
                              }`}>
                                {ped.existe_expediente ? 'Sí' : 'No'}
                              </span>
                            </td>
                          </tr>
                        ))}
                        {/* Rellenar con filas vacías si hay menos de 8 */}
                        {currentDocuments.length < 8 && !loading && !error && Array.from({length: 8 - currentDocuments.length}).map((_, idx) => (
                          <tr key={`empty-${idx}`} className="">
                            <td className="px-6 py-4 whitespace-nowrap" colSpan={9}>&nbsp;</td>
                          </tr>
                        ))}
                      </>
                    ) : (
                      <tr>
                        <td colSpan={9} style={{ height: 'calc(8 * 56px)', padding: 0 }}>
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
