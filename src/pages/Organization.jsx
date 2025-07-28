import React, { useState, useEffect } from 'react';
import { fetchOrganizationUsage } from '../api/organization';
import { useNotification } from '../context/NotificationContext';
import '../assets/organization-animations.css';

export default function Organization() {
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { showMessage } = useNotification();
  // Estado para animar el progress bar
  const [animatedPercent, setAnimatedPercent] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem('access');
    if (!token) {
      setError('No se encontró el token de acceso.');
      setLoading(false);
      return;
    }
    fetchOrganizationUsage(token)
      .then(data => {
        setInfo(data);
        setLoading(false);
      })
      .catch(err => {
        if (err.message === 'SESSION_EXPIRED') {
          localStorage.removeItem('access');
          localStorage.removeItem('refresh');
          showMessage('Tu sesión ha expirado, por favor inicia sesión de nuevo.', 'error');
          setTimeout(() => {
            window.location.href = '/login';
          }, 2000);
        } else {
          setError(err.message);
        }
        setLoading(false);
      });
  }, [showMessage]);

  // Animación del progress bar
  useEffect(() => {
    if (!info) return;
    const used = info.espacio_utilizado_gb || 0;
    const limit = info.limite_almacenamiento_gb || 1;
    const percent = Math.min(100, (100 * used / limit));
    let start = 0;
    // Si ya está en el valor correcto, no animar
    if (animatedPercent === percent) return;
    // Animar de 0 a percent
    const step = () => {
      setAnimatedPercent(prev => {
        if (prev < percent) {
          const next = Math.min(prev + 2, percent); // velocidad de animación
          if (next < percent) {
            setTimeout(step, 10);
          }
          return next;
        } else {
          return percent;
        }
      });
    };
    setAnimatedPercent(0);
    setTimeout(step, 200); // pequeño delay para que se note la animación
    // eslint-disable-next-line
  }, [info]);

  if (loading) return (
    <div className="h-full bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <svg className="animate-spin h-12 w-12 text-navy-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="text-gray-600 text-lg">Cargando información de la organización...</p>
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

  return (
    <div className="bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header mejorado y decorativo */}
        <div className="mb-8 relative overflow-hidden rounded-2xl shadow bg-gradient-to-r from-blue-50 via-white to-indigo-50 border border-blue-100 p-8 flex items-center gap-6 animate-fadein-slideup opacity-0" style={{ animation: 'fadein-slideup 0.7s cubic-bezier(0.22,1,0.36,1) 0.05s forwards' }}>
          <div className="flex-shrink-0 bg-blue-100 rounded-full p-4 shadow-md animate-bounce-slow">
            <svg className="h-10 w-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M3 7c0 2.21 3.582 4 8 4s8-1.79 8-4M3 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
            </svg>
          </div>
          <div>
            <h1 className="text-4xl font-extrabold text-blue-900 tracking-tight mb-1 flex items-center gap-2">
              Mi Organización
              {info && (
                <span className="inline-block bg-blue-200 text-blue-800 text-xs font-semibold px-2 py-0.5 rounded-full ml-2 animate-fade-in">
                  {info.total_usuarios} usuarios
                </span>
              )}
            </h1>
            <p className="text-lg text-blue-700/80 font-medium">Información y métricas de uso de tu organización</p>
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
        
        {/* Barra de almacenamiento con color y progress bar */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <svg className="w-6 h-6 text-success-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
            </svg>
            Uso de Almacenamiento
          </h2>
          <div className="relative w-full h-8 bg-gray-200 rounded-full overflow-hidden shadow-inner">
            {/* Progress bar de color dinámico según porcentaje */}
            {(() => {
              const used = info?.espacio_utilizado_gb || 0;
              const limit = info?.limite_almacenamiento_gb || 1;
              const percent = Math.min(100, (100 * used / limit));
              let barColor = 'linear-gradient(90deg, #22c55e 0%, #16a34a 100%)'; // verde
              if (animatedPercent >= 80) {
                barColor = 'linear-gradient(90deg, #ef4444 0%, #b91c1c 100%)'; // rojo
              } else if (animatedPercent >= 50) {
                barColor = 'linear-gradient(90deg, #f59e42 0%, #d97706 100%)'; // naranja
              }
              return (
                <div
                  className="absolute left-0 top-0 h-8 rounded-full shadow-lg transition-all duration-700"
                  style={{ width: `${animatedPercent}%`, background: barColor }}
                ></div>
              );
            })()}
            {/* Etiquetas sobre la barra */}
            <div className="absolute left-0 top-0 w-full h-8 flex items-center justify-between px-4 text-sm font-semibold z-10">
              <span className="text-success-700 flex items-center">
                <span className="inline-block w-3 h-3 rounded-full bg-gradient-to-br from-green-400 to-green-600 mr-2"></span>
                {info?.espacio_utilizado_gb?.toFixed(2)} GB usados
              </span>
              <span className="text-gray-700">{info?.espacio_disponible_bytes ? (info.espacio_disponible_bytes / (1024 * 1024 * 1024)).toFixed(2) : 0} GB libres</span>
              <span className="text-gray-500">{info?.limite_almacenamiento_gb} GB límite</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {/* Tarjeta Organización */}
          <div className="bg-white rounded-lg shadow-md border border-navy-200 p-4 flex flex-col items-center min-w-0 opacity-0 translate-y-6 animate-fadein-slideup transition-all duration-500 hover:scale-110 hover:shadow-2xl" style={{ animationDelay: '0ms', animationFillMode: 'forwards', transitionTimingFunction: 'cubic-bezier(0.22,1,0.36,1)' }}>
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center shadow-md mb-2">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M3 7c0 2.21 3.582 4 8 4s8-1.79 8-4M3 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
              </svg>
            </div>
            <span className="text-navy-700 font-semibold mb-1">Organización</span>
            <span className="text-2xl font-bold text-navy-900">{info?.organizacion}</span>
          </div>
          {/* Tarjeta Usuarios */}
          <div className="bg-white rounded-lg shadow-md border border-primary-200 p-4 flex flex-col items-center min-w-0 opacity-0 translate-y-6 animate-fadein-slideup transition-all duration-500 hover:scale-110 hover:shadow-2xl" style={{ animationDelay: '50ms', animationFillMode: 'forwards', transitionTimingFunction: 'cubic-bezier(0.22,1,0.36,1)' }}>
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-700 rounded-lg flex items-center justify-center shadow-md mb-2">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m9-4a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <span className="text-primary-700 font-semibold mb-1">Usuarios</span>
            <span className="text-2xl font-bold text-primary-900">{info?.total_usuarios}</span>
          </div>
          {/* Tarjeta Pedimentos */}
          <div className="bg-white rounded-lg shadow-md border border-success-200 p-4 flex flex-col items-center min-w-0 opacity-0 translate-y-6 animate-fadein-slideup transition-all duration-500 hover:scale-110 hover:shadow-2xl" style={{ animationDelay: '100ms', animationFillMode: 'forwards', transitionTimingFunction: 'cubic-bezier(0.22,1,0.36,1)' }}>
            <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center shadow-md mb-2">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-6a2 2 0 012-2h2a2 2 0 012 2v6m-4 0h4" />
              </svg>
            </div>
            <span className="text-success-700 font-semibold mb-1">Pedimentos</span>
            <span className="text-2xl font-bold text-success-900">{info?.total_pedimentos}</span>
          </div>
          {/* Tarjeta Documentos */}
          <div className="bg-white rounded-lg shadow-md border border-warning-200 p-4 flex flex-col items-center min-w-0 opacity-0 translate-y-6 animate-fadein-slideup transition-all duration-500 hover:scale-110 hover:shadow-2xl" style={{ animationDelay: '150ms', animationFillMode: 'forwards', transitionTimingFunction: 'cubic-bezier(0.22,1,0.36,1)' }}>
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center shadow-md mb-2">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h10M7 11h10M7 15h6M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="text-warning-700 font-semibold mb-1">Documentos</span>
            <span className="text-2xl font-bold text-warning-900">{info?.total_documentos}</span>
          </div>
          {/* Tarjeta Límite de Almacenamiento */}
          <div className="bg-white rounded-lg shadow-md border border-light-gray-200 p-4 flex flex-col items-center min-w-0 opacity-0 translate-y-6 animate-fadein-slideup transition-all duration-500 hover:scale-110 hover:shadow-2xl" style={{ animationDelay: '200ms', animationFillMode: 'forwards', transitionTimingFunction: 'cubic-bezier(0.22,1,0.36,1)' }}>
            <div className="w-12 h-12 bg-gradient-to-br from-gray-400 to-gray-600 rounded-lg flex items-center justify-center shadow-md mb-2">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <span className="text-light-gray-700 font-semibold mb-1">Límite de Almacenamiento</span>
            <span className="text-2xl font-bold text-light-gray-900">{info?.limite_almacenamiento_gb} GB</span>
          </div>
          {/* Tarjeta Espacio Utilizado */}
          <div className="bg-white rounded-lg shadow-md border border-warning-200 p-4 flex flex-col items-center min-w-0 opacity-0 translate-y-6 animate-fadein-slideup transition-all duration-500 hover:scale-110 hover:shadow-2xl" style={{ animationDelay: '250ms', animationFillMode: 'forwards', transitionTimingFunction: 'cubic-bezier(0.22,1,0.36,1)' }}>
            <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-pink-600 rounded-lg flex items-center justify-center shadow-md mb-2">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v8m0 0a4 4 0 100-8 4 4 0 000 8z" />
              </svg>
            </div>
            <span className="text-warning-700 font-semibold mb-1">Espacio Utilizado</span>
            <span className="text-2xl font-bold text-warning-900">{info?.espacio_utilizado_gb?.toFixed(2)} GB</span>
          </div>
          {/* Tarjeta Espacio Disponible */}
          <div className="bg-white rounded-lg shadow-md border border-success-200 p-4 flex flex-col items-center min-w-0 opacity-0 translate-y-6 animate-fadein-slideup transition-all duration-500 hover:scale-110 hover:shadow-2xl" style={{ animationDelay: '300ms', animationFillMode: 'forwards', transitionTimingFunction: 'cubic-bezier(0.22,1,0.36,1)' }}>
            <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center shadow-md mb-2">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 20V4m0 0a8 8 0 110 16 8 8 0 010-16z" />
              </svg>
            </div>
            <span className="text-success-700 font-semibold mb-1">Espacio Disponible</span>
            <span className="text-2xl font-bold text-success-900">{info?.espacio_disponible_bytes ? (info.espacio_disponible_bytes / (1024 * 1024 * 1024)).toFixed(2) : 0} GB</span>
          </div>
          {/* Tarjeta Porcentaje Utilizado */}
          <div className="bg-white rounded-lg shadow-md border border-accent-200 p-4 flex flex-col items-center min-w-0 opacity-0 translate-y-6 animate-fadein-slideup transition-all duration-500 hover:scale-110 hover:shadow-2xl" style={{ animationDelay: '350ms', animationFillMode: 'forwards', transitionTimingFunction: 'cubic-bezier(0.22,1,0.36,1)' }}>
            <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-700 rounded-lg flex items-center justify-center shadow-md mb-2">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" strokeWidth="2" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6l4 2" />
              </svg>
            </div>
            <span className="text-accent-700 font-semibold mb-1">Porcentaje Utilizado</span>
            <span className="text-2xl font-bold text-accent-900">{info?.porcentaje_utilizado}%</span>
          </div>
        </div>


        {/* Acciones */}
        <div className="mt-8 bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center shadow-lg mr-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Acciones</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200 transform hover:scale-105 shadow-lg">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Editar Organización
            </button>
            
            <button className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200 transform hover:scale-105 shadow-lg">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Ver Reportes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
