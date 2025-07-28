
import React, { useEffect, useState } from 'react';
import { fetchProcesamientoPedimentos } from '../api/procesos.ts';
const API_URL = import.meta.env.VITE_EFC_API_URL;
const MICROSERVICE_URL = import.meta.env.VITE_EFC_MICROSERVICE_URL;

// Estado para loading de ejecución de servicio
// y función para ejecutar el servicio según el tipo de proceso



export default function Procesos() {
  const [procesos, setProcesos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  // Filtros
  const [pedimentoPedimentoFilter, setPedimentoPedimentoFilter] = useState('');
  const [estadoFilter, setEstadoFilter] = useState('');
  const [servicioFilter, setServicioFilter] = useState('');

  // Estado para loading de ejecución de servicio
  const [executingId, setExecutingId] = useState(null);

  // Dropdown state: id del proceso abierto o null
  const [openDropdownId, setOpenDropdownId] = useState(null);


  // Función para ejecutar el servicio según el tipo de proceso
  const handleEjecutarServicio = async (proc) => {
    setExecutingId(proc.id);
    let endpoint = '';
    // Determinar endpoint según el tipo de servicio
    switch (proc.servicio) {
      case 4: // Partidas
        endpoint = '/services/partidas';
        break;
      case 5: // Remesas
        endpoint = '/services/remesas';
        break;
      case 6: // Acuse
        endpoint = '/services/acuse';
        break;
      case 8: // Acuse Cove
        endpoint = '/services/acuseCove';
        break;
      default:
        alert('Servicio no soportado para ejecución directa.');
        setExecutingId(null);
        return;
    }
    try {
      const token = localStorage.getItem('access');
      const headers = {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      };
      const body = JSON.stringify({
        pedimento: typeof proc.pedimento === 'object' && proc.pedimento !== null ? proc.pedimento.id : proc.pedimento,
        organizacion: proc.organizacion_id || proc.organizacion || proc.organizacionId,
      });
      const res = await fetch(`${MICROSERVICE_URL}${endpoint}`, {
        method: 'POST',
        headers,
        body,
      });
      if (!res.ok) throw new Error('Error al ejecutar el servicio');
      alert('Servicio ejecutado correctamente');
      setOpenDropdownId(null);
    } catch (err) {
      alert('Error al ejecutar el servicio: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setExecutingId(null);
    }
  };

  // Cierra el dropdown si se hace click fuera
  useEffect(() => {
    if (openDropdownId === null) return;
    function handleClick(e) {
      const el = document.getElementById(`dropdown-acciones-${openDropdownId}`);
      if (el && !el.contains(e.target)) {
        setOpenDropdownId(null);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [openDropdownId]);

  useEffect(() => {
    async function fetchProcesos() {
      setLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('access');
        // Construir query params
        const params = new URLSearchParams();
        params.append('page', String(page));
        params.append('page_size', String(itemsPerPage));
        if (pedimentoPedimentoFilter) params.append('pedimento__pedimento', pedimentoPedimentoFilter);
        if (estadoFilter) params.append('estado', estadoFilter);
        if (servicioFilter) params.append('servicio', servicioFilter);
        // ...existing code...
        const API_URL = import.meta.env.VITE_EFC_API_URL;
        const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
        const res = await fetch(`${API_URL}/customs/procesamientopedimentos/?${params.toString()}`, { headers });
        if (!res.ok) throw new Error('Error al obtener procesamiento de pedimentos');
        const data = await res.json();
        setProcesos(data.results || []);
        setCount(data.count || 0);
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    }
    fetchProcesos();
  }, [page, itemsPerPage, pedimentoPedimentoFilter, estadoFilter, servicioFilter]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 relative overflow-hidden rounded-2xl shadow bg-gradient-to-r from-blue-50 via-white to-indigo-50 border border-blue-100 p-8 flex items-center gap-6 animate-fadein-slideup opacity-0" style={{ animation: 'fadein-slideup 0.7s cubic-bezier(0.22,1,0.36,1) 0.05s forwards' }}>
          <div className="flex-shrink-0 bg-blue-100 rounded-full p-4 shadow-md animate-bounce-slow">
            <svg className="h-10 w-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-blue-900 tracking-tight mb-1 flex items-center gap-2">
              Procesos del Sistema
            </h1>
            <p className="text-lg text-blue-700/80 font-medium">Estado actual de los procesos de la agencia aduanal</p>
          </div>
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
          <style>{`
            @keyframes bounce-slow {
              0%, 100% { transform: translateY(0); }
              50% { transform: translateY(-8px); }
            }
            .animate-bounce-slow {
              animation: bounce-slow 2.2s infinite;
            }
            @keyframes fadein-slideup {
              0% { opacity: 0; transform: translateY(40px); }
              100% { opacity: 1; transform: translateY(0); }
            }
            .animate-fadein-slideup {
              animation: fadein-slideup 0.7s cubic-bezier(0.22,1,0.36,1) 0.05s forwards;
            }
          `}</style>
        </div>
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 animate-fadein-slideup opacity-0" style={{ animation: 'fadein-slideup 0.7s cubic-bezier(0.22,1,0.36,1) 0.15s forwards' }}>
          <h2 className="text-2xl font-bold text-blue-800 mb-6">Procesamiento de Pedimentos</h2>
          {/* Filtros */}
          <div className="mb-4 flex flex-wrap gap-4 items-end justify-between">
            <div className="flex flex-col flex-1 min-w-[150px]">
              <label className="text-xs font-semibold text-gray-700 mb-1">Pedimento</label>
              <input
                type="text"
                value={pedimentoPedimentoFilter}
                onChange={e => setPedimentoPedimentoFilter(e.target.value)}
                placeholder="Buscar por pedimento..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
              />
            </div>
            <div className="flex flex-col flex-1 min-w-[150px]">
              <label className="text-xs font-semibold text-gray-700 mb-1">Estado</label>
              <select
                value={estadoFilter}
                onChange={e => setEstadoFilter(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
              >
                <option value="">Todos</option>
                <option value="1">En Espera</option>
                <option value="2">Procesando</option>
                <option value="3">Finalizado</option>
                <option value="4">Error</option>
              </select>
            </div>
            <div className="flex flex-col flex-1 min-w-[150px]">
              <label className="text-xs font-semibold text-gray-700 mb-1">Servicio</label>
              <select
                value={servicioFilter}
                onChange={e => setServicioFilter(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
              >
                <option value="">Todos</option>
                <option value="1">Estado de pedimento</option>
                <option value="2">Listado de pedimentos</option>
                <option value="3">Pedimento Completo</option>
                <option value="4">Pedimento Partidas</option>
                <option value="5">Pedimento Remesas</option>
                <option value="6">Acuse</option>
                <option value="7">EDocument</option>
                <option value="8">Cove</option>
              </select>
            </div>
            {/* ...filtros anteriores... */}
          </div>
          {loading ? (
            <div className="text-center text-gray-500 py-8">Cargando procesos...</div>
          ) : error ? (
            <div className="text-center text-danger-600 py-8">{error}</div>
          ) : (
            <div className="overflow-x-auto">
              <div style={{ minHeight: 'calc(6 * 56px)', maxHeight: 'calc(6 * 56px)', overflowY: 'auto', position: 'relative' }}>
                <table className="min-w-full divide-y divide-gray-200 rounded-lg overflow-hidden sticky text-xs">
                  <thead className="bg-gradient-to-r from-gray-50 sticky top-0 z-20">
                    <tr>
                    <th className="px-2 py-2 text-center font-bold text-blue-700 uppercase tracking-wider border-b border-gray-200 whitespace-nowrap">ID</th>
                    <th className="px-2 py-2 text-left font-bold uppercase tracking-wider border-b border-gray-200 whitespace-nowrap">Organización</th>
                    <th className="px-2 py-2 text-left font-bold uppercase tracking-wider border-b border-gray-200 whitespace-nowrap">Estado</th>
                    <th className="px-2 py-2 text-left font-bold uppercase tracking-wider border-b border-gray-200 whitespace-nowrap">Pedimento</th>
                    <th className="px-2 py-2 text-left font-bold uppercase tracking-wider border-b border-gray-200 whitespace-nowrap">Servicio</th>
                    <th className="px-2 py-2 text-center font-bold text-blue-700 uppercase tracking-wider border-b border-gray-200 whitespace-nowrap">Acciones</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100" style={{ position: 'relative', minHeight: 'calc(12 * 40px)' }}>
                  {procesos.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="text-center py-8 text-gray-500">No hay registros</td>
                    </tr>
                  ) : (
                    procesos.map((proc) => (
                      <tr key={proc.id} className="transition-all duration-200 hover:bg-blue-100 hover:shadow-lg">
                        <td className="px-2 py-2 text-center align-middle whitespace-nowrap">{proc.id}</td>
                        <td className="px-2 py-2 whitespace-nowrap align-middle">{proc.organizacion_name || '-'}</td>
                        <td className="px-2 py-2 whitespace-nowrap align-middle">{
                          proc.estado === 1 ? 'En Espera'
                          : proc.estado === 2 ? 'Procesando'
                          : proc.estado === 3 ? 'Finalizado'
                          : proc.estado === 4 ? 'Error'
                          : String(proc.estado)
                        }</td>
                        <td className="px-2 py-2 whitespace-nowrap align-middle">{
                          typeof proc.pedimento === 'object' && proc.pedimento !== null
                            ? proc.pedimento.pedimento || JSON.stringify(proc.pedimento)
                            : proc.pedimento
                        }</td>
                        <td className="px-2 py-2 whitespace-nowrap align-middle">{
                          proc.servicio === 1 ? 'Estado de pedimento'
                          : proc.servicio === 2 ? 'Listado de pedimentos'
                          : proc.servicio === 3 ? 'Pedimento Completo'
                          : proc.servicio === 4 ? 'Pedimento Partidas'
                          : proc.servicio === 5 ? 'Pedimento Remesas'
                          : proc.servicio === 6 ? 'Acuse'
                          : proc.servicio === 7 ? 'EDocument'
                          : proc.servicio === 8 ? 'Cove'
                          : String(proc.servicio)
                        }</td>
                        <td className="px-2 py-2 text-center align-middle whitespace-nowrap">
                          <div className="relative inline-block text-left" id={`dropdown-acciones-${proc.id}`}> 
                            <button
                              className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-3 py-1 bg-white text-xs font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-105"
                              type="button"
                              onClick={() => setOpenDropdownId(openDropdownId === proc.id ? null : proc.id)}
                            >
                              Acciones
                              <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                            </button>
                            {openDropdownId === proc.id && (
                              <div className="absolute right-0 mt-2 w-32 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-20">
                                <div className="py-1">
                                  <button
                                    className="block w-full text-left px-4 py-2 text-xs text-blue-700 hover:bg-blue-100 disabled:opacity-60"
                                    onClick={() => handleEjecutarServicio(proc)}
                                    disabled={executingId === proc.id}
                                  >
                                    {executingId === proc.id ? 'Ejecutando...' : 'Ejecutar Servicio'}
                                  </button>
                                  <button className="block w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-blue-100">Pasar a espera</button>
                                  <button className="block w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-blue-100">Editar</button>
                                </div>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
                </table>
              </div>
              {/* Paginación igual a Documents.jsx */}
              {count > 0 && (
                <div className="bg-white px-4 py-3 flex flex-col sm:flex-row items-center justify-between border-t border-gray-200">
                  {(() => {
                    const totalPages = Math.max(1, Math.ceil(count / itemsPerPage));
                    const maxPagesToShow = 5;
                    let startPage = Math.max(1, page - Math.floor(maxPagesToShow / 2));
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
                            onChange={e => { setItemsPerPage(Number(e.target.value)); setPage(1); }}
                            className="border border-gray-300 rounded px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                          >
                            {[5, 8, 12, 20, 50, 100].map(size => (
                              <option key={size} value={size}>{size}</option>
                            ))}
                          </select>
                        </div>
                        <div className="flex items-center gap-1 flex-wrap">
                          <button
                            type="button"
                            onClick={e => { e.preventDefault(); setPage(1); }}
                            disabled={page === 1}
                            className={`px-2 py-1 rounded border text-xs font-semibold transition-colors duration-150 ${page === 1 ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' : 'bg-white text-blue-700 border-blue-200 hover:bg-blue-50 hover:text-blue-900'}`}
                          >
                            «
                          </button>
                          <button
                            type="button"
                            onClick={e => { e.preventDefault(); setPage(p => Math.max(1, p - 1)); }}
                            disabled={page === 1}
                            className={`px-2 py-1 rounded border text-xs font-semibold transition-colors duration-150 ${page === 1 ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' : 'bg-white text-blue-700 border-blue-200 hover:bg-blue-50 hover:text-blue-900'}`}
                          >
                            ‹
                          </button>
                          {pageNumbers.map(num => (
                            <button
                              type="button"
                              key={num}
                              onClick={e => { e.preventDefault(); setPage(num); }}
                              className={`px-2 py-1 rounded border text-xs font-semibold transition-colors duration-150 ${num === page ? 'bg-blue-600 text-white border-blue-700 cursor-default' : 'bg-white text-blue-700 border-blue-200 hover:bg-blue-50 hover:text-blue-900'}`}
                              disabled={num === page}
                            >
                              {num}
                            </button>
                          ))}
                          <button
                            type="button"
                            onClick={e => { e.preventDefault(); setPage(p => p + 1); }}
                            disabled={page >= totalPages}
                            className={`px-2 py-1 rounded border text-xs font-semibold transition-colors duration-150 ${(page >= totalPages) ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' : 'bg-white text-blue-700 border-blue-200 hover:bg-blue-50 hover:text-blue-900'}`}
                          >
                            ›
                          </button>
                          <button
                            type="button"
                            onClick={e => { e.preventDefault(); setPage(totalPages); }}
                            disabled={page >= totalPages}
                            className={`px-2 py-1 rounded border text-xs font-semibold transition-colors duration-150 ${(page >= totalPages) ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' : 'bg-white text-blue-700 border-blue-200 hover:bg-blue-50 hover:text-blue-900'}`}
                          >
                            »
                          </button>
                          <span className="ml-3 text-xs text-gray-500">Página <span className="font-bold">{page}</span> de <span className="font-bold">{totalPages}</span></span>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
