import React, { useEffect, useState } from 'react';
// Animación fade-in/slide-up para cards
const fadeInSlideUp = `@keyframes fadein-slideup {
  0% { opacity: 0; transform: translateY(40px); }
  100% { opacity: 1; transform: translateY(0); }
}`;

// Inyectar animación global si no existe
if (typeof document !== 'undefined' && !document.getElementById('fadein-slideup-admin')) {
  const style = document.createElement('style');
  style.id = 'fadein-slideup-admin';
  style.innerHTML = fadeInSlideUp;
  document.head.appendChild(style);
}
import TestTailwind from '../components/TestTailwind';
import { colors } from '../theme';

const API_URL = import.meta.env.VITE_EFC_API_URL;

export default function Admin() {
  // Estado de servicios
  const [services, setServices] = useState(null);
  // Estado de descargas
  const [downloads, setDownloads] = useState(null);
  // Últimos documentos
  const [latestDocs, setLatestDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  // Estado para análisis de actividad de usuario
  const [userActivity, setUserActivity] = useState(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('access');
        const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

        // Servicios
        const resServices = await fetch(`${API_URL}/cards/services-util-information/`, { headers });
        if (!resServices.ok) throw new Error('Error al obtener estados de servicios');
        const dataServices = await resServices.json();
        setServices(dataServices);

        // Descargas
        const resDownloads = await fetch(`${API_URL}/cards/document-util-information/`, { headers });
        if (!resDownloads.ok) throw new Error('Error al obtener información de descargas');
        const dataDownloads = await resDownloads.json();
        setDownloads(dataDownloads);

        // Últimos documentos
        const resDocs = await fetch(`${API_URL}/cards/downloaded-documents/`, { headers });
        if (!resDocs.ok) throw new Error('Error al obtener últimos documentos');
        const dataDocs = await resDocs.json();
        setLatestDocs(dataDocs.documentos);

        // Análisis de actividad de usuario
        const resUserActivity = await fetch(`${API_URL}/cards/user-activity-analysis/`, { headers });
        if (!resUserActivity.ok) throw new Error('Error al obtener análisis de actividad de usuario');
        const dataUserActivity = await resUserActivity.json();
        setUserActivity(dataUserActivity);
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Helper para nombre de archivo
  // Helper para nombre de archivo
  function getFileName(path) {
    return path.split('/').pop() || path;
  }

  return (
    <div className="p-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header + Estado del Sistema alineados horizontalmente */}
        <div className="mb-8 flex flex-col md:flex-row md:items-stretch md:gap-6">
          {/* Header principal mejorado */}
          <div className="relative overflow-hidden rounded-2xl shadow bg-gradient-to-r from-blue-50 via-white to-indigo-50 border border-blue-100 p-8 flex items-center gap-6 flex-1 min-w-0 md:w-[65%] animate-fadein-slideup opacity-0"
            style={{
              animation: 'fadein-slideup 0.7s cubic-bezier(0.22,1,0.36,1) 0.05s forwards',
            }}
          >
            <div className="flex-shrink-0 bg-blue-100 rounded-full p-4 shadow-md animate-bounce-slow">
              <svg className="h-10 w-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-4xl font-extrabold text-blue-900 tracking-tight mb-1 flex items-center gap-2">
                Panel de Administración
                {services && (
                  <span className="inline-block bg-blue-200 text-blue-800 text-xs font-semibold px-2 py-0.5 rounded-full ml-2 animate-fade-in">
                    {services.en_espera} en espera
                  </span>
                )}
              </h1>
              <p className="text-lg text-blue-700/80 font-medium">
                {typeof window !== 'undefined' && localStorage.getItem('user_is_importador') === 'true'
                  ? 'Dashboard principal para gestión de Expediente electrónico'
                  : 'Dashboard principal para gestión de agencia aduanal'}
              </p>
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
          </div>
          {/* Estado del Sistema card a la derecha */}
          <div className="mt-6 md:mt-0 md:w-[35%] min-w-[270px] flex-shrink-0 animate-fadein-slideup opacity-0"
            style={{
              animation: 'fadein-slideup 0.7s cubic-bezier(0.22,1,0.36,1) 0.15s forwards',
            }}
          >
            <div className="relative overflow-hidden rounded-2xl shadow bg-gradient-to-br from-green-50 via-white to-blue-50 border border-green-100 p-6 h-full flex flex-col justify-between">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-green-100 rounded-full p-3 shadow-md animate-bounce-slow">
                  <svg className="h-7 w-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-extrabold text-green-900 tracking-tight flex-1">Estado del Sistema</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 font-medium">API Backend</span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800 border border-green-200 gap-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    Conectado
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 font-medium">API Servicios</span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800 border border-green-200 gap-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    Conectado
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 font-medium">Última Actualización</span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
                    Hace 2 min
                  </span>
                </div>
              </div>
              {/* Efecto decorativo de fondo */}
              <div className="absolute -top-8 -right-8 opacity-20 pointer-events-none select-none">
                <svg width="80" height="80" viewBox="0 0 120 120" fill="none">
                  <circle cx="60" cy="60" r="50" fill="url(#grad2)" />
                  <defs>
                    <linearGradient id="grad2" x1="0" y1="0" x2="120" y2="120" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#22c55e" stopOpacity="0.18" />
                      <stop offset="1" stopColor="#3b82f6" stopOpacity="0.10" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              {/* Animación personalizada para el icono */}
              <style>{`
                @keyframes bounce-slow {
                  0%, 100% { transform: translateY(0); }
                  50% { transform: translateY(-8px); }
                }
                .animate-bounce-slow {
                  animation: bounce-slow 2.2s infinite;
                }
              `}</style>
            </div>
          </div>
        </div>

        {/* Stats Cards con datos de endpoints */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Estados de servicios */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105 animate-fadein-slideup opacity-0"
            style={{
              animation: 'fadein-slideup 0.7s cubic-bezier(0.22,1,0.36,1) 0.25s forwards',
            }}
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-md">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
              <div className="ml-5">
                <p className="text-sm font-medium text-gray-500">Procesos en Espera</p>
                <p className="text-2xl font-bold text-gray-900">{services ? services.en_espera : '-'}</p>
                <p className="text-sm text-gray-400">Total: {services ? services.procesos_filtrados : '-'}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105 animate-fadein-slideup opacity-0"
            style={{
              animation: 'fadein-slideup 0.7s cubic-bezier(0.22,1,0.36,1) 0.35s forwards',
            }}
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center shadow-md">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-5">
                <p className="text-sm font-medium text-gray-500">En Proceso</p>
                <p className="text-2xl font-bold text-gray-900">{services ? services.en_proceso : '-'}</p>
                <p className="text-sm text-gray-400">Finalizados: {services ? services.finalizados : '-'}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105 animate-fadein-slideup opacity-0"
            style={{
              animation: 'fadein-slideup 0.7s cubic-bezier(0.22,1,0.36,1) 0.45s forwards',
            }}
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center shadow-md">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </div>
              <div className="ml-5">
                <p className="text-sm font-medium text-gray-500">Con Error</p>
                <p className="text-2xl font-bold text-gray-900">{services ? services.con_error : '-'}</p>
                <p className="text-sm text-gray-400">Finalizados: {services ? services.finalizados : '-'}</p>
              </div>
            </div>
          </div>
          {/* Descargas */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105 animate-fadein-slideup opacity-0"
            style={{
              animation: 'fadein-slideup 0.7s cubic-bezier(0.22,1,0.36,1) 0.55s forwards',
            }}
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-700 to-blue-900 rounded-lg flex items-center justify-center shadow-md">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
              <div className="ml-5">
                <p className="text-sm font-medium text-gray-500">Descargados 1 día</p>
                <p className="text-2xl font-bold text-gray-900">{downloads ? downloads.archivos_ultimas_1_dia : '-'}</p>
                <p className="text-sm text-gray-400">7 días: {downloads ? downloads.archivos_ultimos_7_dias : '-'} | 30 días: {downloads ? downloads.archivos_ultimos_30_dias : '-'}</p>
              </div>
            </div>
          </div>
        </div>
        {/* Análisis de actividad de usuario */}
        {!(typeof window !== 'undefined' && localStorage.getItem('user_is_importador') === 'true') && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-4 animate-fadein-slideup opacity-0"
            style={{
              animation: 'fadein-slideup 0.7s cubic-bezier(0.22,1,0.36,1) 0.65s forwards',
            }}
          >
            <h3 className="text-lg font-bold text-gray-900 mb-4">Actividad de Usuarios</h3>
            {loading ? (
              <div className="text-gray-500">Cargando...</div>
            ) : error ? (
              <div className="text-danger-600">{error}</div>
            ) : userActivity ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">Resumen de acciones</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    {Object.entries(userActivity.actions_count).map(([action, count]) => (
                      <li key={action} className="flex justify-between border-b border-gray-100 py-1">
                        <span className="capitalize">{action}</span>
                        <span className="font-mono text-blue-700">{count}</span>
                      </li>
                    ))}
                    <li className="flex justify-between font-semibold pt-2">
                      <span>Total actividades</span>
                      <span className="font-mono text-blue-900">{userActivity.actividades_filtradas}</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">Top usuarios</h4>
                  <ol className="text-sm text-gray-700 space-y-1 list-decimal list-inside">
                    {userActivity.top_users.map((user, idx) => (
                      <li key={user.username} className="flex justify-between border-b border-gray-100 py-1">
                        <span>{user.username}</span>
                        <span className="font-mono text-green-700">{user.activity_count}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            ) : null}
          </div>
        )}

        {/* Tabla de últimos documentos */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-8 animate-fadein-slideup opacity-0"
          style={{
            animation: 'fadein-slideup 0.7s cubic-bezier(0.22,1,0.36,1) 0.75s forwards',
          }}
        >
          <h3 className="text-lg font-bold text-gray-900 mb-4">Últimos documentos agregados</h3>
          {loading ? (
            <div className="text-gray-500">Cargando...</div>
          ) : error ? (
            <div className="text-danger-600">{error}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left font-semibold text-gray-600">Archivo</th>
                    <th className="px-4 py-2 text-left font-semibold text-gray-600">Pedimento</th>
                    <th className="px-4 py-2 text-left font-semibold text-gray-600">Organización</th>
                    <th className="px-4 py-2 text-left font-semibold text-gray-600">Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  {latestDocs.map(doc => (
                    <tr key={doc.id} className="hover:bg-blue-50">
                      <td className="px-4 py-2 font-mono text-blue-800 truncate max-w-xs" title={getFileName(doc.archivo)}>{getFileName(doc.archivo)}</td>
                      <td className="px-4 py-2">{doc.pedimento}</td>
                      <td className="px-4 py-2">{doc.organizacion}</td>
                      <td className="px-4 py-2">{new Date(doc.created_at).toLocaleString('es-MX')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>


      </div>
    </div>
  );
}
