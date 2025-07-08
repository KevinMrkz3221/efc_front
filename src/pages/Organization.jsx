import React, { useEffect, useState } from 'react';
import { fetchOrganizationUsage } from '../api/organizacion';
import { useNotification } from '../context/NotificationContext';

export default function Organization() {
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { showMessage } = useNotification();

  useEffect(() => {
    const token = localStorage.getItem('access');
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
        {/* Header */}
        <div className="mb-8">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-navy-900 to-navy-700 bg-clip-text text-transparent mb-2">
              Mi Organización
            </h1>
            <p className="text-gray-600">Información y métricas de uso de tu organización</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Información General */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-navy-500 to-navy-600 rounded-lg flex items-center justify-center shadow-lg mr-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Información General</h2>
            </div>
            
            <div className="grid grid-cols-1 gap-6">
              <div className="bg-gradient-to-br from-navy-50 to-navy-100 p-4 rounded-lg border border-navy-200">
                <dt className="text-sm font-medium text-navy-700 mb-1">Organización</dt>
                <dd className="text-xl font-bold text-navy-900">{info?.organizacion}</dd>
              </div>
              
              <div className="bg-gradient-to-br from-primary-50 to-primary-100 p-4 rounded-lg border border-primary-200">
                <dt className="text-sm font-medium text-primary-700 mb-1">Total de Usuarios</dt>
                <dd className="text-xl font-bold text-primary-900">{info?.total_usuarios}</dd>
              </div>
              
              <div className="bg-gradient-to-br from-success-50 to-success-100 p-4 rounded-lg border border-success-200">
                <dt className="text-sm font-medium text-success-700 mb-1">Total de Pedimentos</dt>
                <dd className="text-xl font-bold text-success-900">{info?.total_pedimentos}</dd>
              </div>
              
              <div className="bg-gradient-to-br from-warning-50 to-warning-100 p-4 rounded-lg border border-warning-200">
                <dt className="text-sm font-medium text-warning-700 mb-1">Total de Documentos</dt>
                <dd className="text-xl font-bold text-warning-900">{info?.total_documentos}</dd>
              </div>
            </div>
          </div>

          {/* Almacenamiento */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-accent-500 to-accent-600 rounded-lg flex items-center justify-center shadow-lg mr-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Uso del Almacenamiento</h2>
            </div>
            
            {/* Barra de progreso */}
            <div className="mb-6">
              <div className="flex justify-between text-sm font-semibold text-gray-900 mb-3">
                <span>Espacio utilizado</span>
                <span className="text-accent-600">{info?.porcentaje_utilizado}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4 shadow-inner">
                <div 
                  className="bg-gradient-to-r from-accent-500 to-accent-600 h-4 rounded-full transition-all duration-500 shadow-lg"
                  style={{ width: `${info?.porcentaje_utilizado}%` }}
                ></div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="bg-gradient-to-br from-light-gray-50 to-light-gray-100 p-4 rounded-lg border border-light-gray-200">
                <dt className="text-sm font-medium text-light-gray-700 mb-1">Límite de Almacenamiento</dt>
                <dd className="text-xl font-bold text-light-gray-900">{info?.limite_almacenamiento_gb} GB</dd>
              </div>
              
              <div className="bg-gradient-to-br from-warning-50 to-warning-100 p-4 rounded-lg border border-warning-200">
                <dt className="text-sm font-medium text-warning-700 mb-1">Espacio Utilizado</dt>
                <dd className="text-xl font-bold text-warning-900">{info?.espacio_utilizado_gb?.toFixed(2)} GB</dd>
              </div>
              
              <div className="bg-gradient-to-br from-success-50 to-success-100 p-4 rounded-lg border border-success-200">
                <dt className="text-sm font-medium text-success-700 mb-1">Espacio Disponible</dt>
                <dd className="text-xl font-bold text-success-900">
                  {info?.espacio_disponible_bytes ? (info.espacio_disponible_bytes / (1024 * 1024 * 1024)).toFixed(2) : 0} GB
                </dd>
              </div>
            </div>
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
