import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../api/users';

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    
    // Disparar evento para actualizar el navbar
    window.dispatchEvent(new CustomEvent('authStateChanged'));
    
    navigate('/login');
  };

  // Cargar información del usuario al montar el componente
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const token = localStorage.getItem('access');
        console.log('Token encontrado:', token ? 'Sí' : 'No');
        
        if (token) {
          console.log('Haciendo petición a /me...');
          const userData = await getCurrentUser(token);
          console.log('Datos del usuario obtenidos:', userData);
          setCurrentUser(userData);
        }
      } catch (error) {
        console.error('Error al cargar datos del usuario:', error);
        if (error.message === 'SESSION_EXPIRED') {
          handleLogout();
        }
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []); // Sin dependencias para evitar bucles

  const menuSections = [
    {
      title: 'Organización',
      items: [
        {
          name: 'Home',
          path: '/admin',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          )
        },
        {
          name: 'Mi Organización',
          path: '/organization',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          )
        }
      ]
    },
    {
      title: 'Documentación',
      items: [
        {
          name: 'Reportes',
          path: '/reports',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          )
        },
        {
          name: 'Documentos',
          path: '/documents',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          )
        }
      ]
    },
    {
      title: 'Acceso a Usuarios',
      items: [
        {
          name: 'Usuarios',
          path: '/users',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
          )
        },
        {
          name: 'Importadores',
          path: '/importers',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          )
        }
      ]
    }
  ];

  return (
    <div className={`bg-slate-900 text-white transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'} h-screen flex flex-col shadow-xl`}>
      {/* Header - Logo y colapsar */}
      <div className="p-4 border-b border-slate-700 flex-shrink-0">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center">
              {/* Logo de la organización */}
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mr-3 shadow-lg">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h1 className="text-lg font-bold text-white">EFC Dashboard</h1>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 rounded-lg hover:bg-slate-700 transition-all duration-200 hover:shadow-md"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isCollapsed ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-4 overflow-y-auto overflow-x-hidden">
        {menuSections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="space-y-1">
            {/* Título de la sección */}
            {!isCollapsed && (
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 py-1">
                {section.title}
              </h3>
            )}
            
            {/* Items de la sección */}
            <div className="space-y-1">
              {section.items.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center px-3 py-2.5 text-sm rounded-lg transition-all duration-200 group relative ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg transform scale-[1.02]'
                        : 'text-gray-300 hover:bg-slate-700 hover:text-white hover:transform hover:scale-[1.01]'
                    }`}
                    title={isCollapsed ? item.name : ''}
                  >
                    {/* Indicador activo lateral */}
                    {isActive && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-cyan-400 rounded-r-full"></div>
                    )}
                    <div className="flex-shrink-0">
                      {item.icon}
                    </div>
                    {!isCollapsed && (
                      <span className="ml-3 font-medium">{item.name}</span>
                    )}
                  </Link>
                );
              })}
            </div>
            
            {/* Línea separadora entre secciones (excepto la última) */}
            {!isCollapsed && sectionIndex < menuSections.length - 1 && (
              <div className="border-b border-slate-600 mx-3 my-3"></div>
            )}
          </div>
        ))}
      </nav>

      {/* Configuración */}
      <div className="p-3 border-t border-slate-700 flex-shrink-0">
        <Link
          to="/settings"
          className={`flex items-center px-3 py-2.5 text-sm rounded-lg transition-all duration-200 group ${
            location.pathname === '/settings'
              ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
              : 'text-gray-300 hover:bg-slate-700 hover:text-white hover:shadow-md'
          }`}
          title={isCollapsed ? 'Configuración' : ''}
        >
          <div className="flex-shrink-0">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          {!isCollapsed && (
            <span className="ml-3 font-medium">Configuración</span>
          )}
        </Link>
      </div>

      {/* Footer - Perfil del Usuario */}
      <div className="p-3 border-t border-slate-700 flex-shrink-0">
        {!isCollapsed ? (
          <div className="space-y-3">
            {/* Información del usuario */}
            <div className="flex items-center space-x-3 p-2 bg-slate-800 rounded-lg">
              <div className="flex-shrink-0">
                {currentUser?.profile_picture ? (
                  <img
                    className="w-10 h-10 rounded-full ring-2 ring-blue-500 shadow-lg"
                    src={currentUser.profile_picture}
                    alt="Avatar del usuario"
                  />
                ) : (
                  <div className="w-10 h-10 bg-gradient-to-br from-gray-500 to-gray-600 rounded-full ring-2 ring-blue-500 flex items-center justify-center shadow-lg">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                {loading ? (
                  <div className="animate-pulse">
                    <div className="h-4 bg-slate-600 rounded w-24 mb-1"></div>
                    <div className="h-3 bg-slate-700 rounded w-16"></div>
                  </div>
                ) : currentUser ? (
                  <>
                    <p className="text-sm font-medium text-white truncate">
                      {currentUser.first_name} {currentUser.last_name}
                    </p>
                    <p className="text-xs text-gray-400 truncate">
                      {currentUser.username}
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-sm font-medium text-white truncate">
                      Usuario
                    </p>
                    <p className="text-xs text-gray-400 truncate">
                      Sin datos
                    </p>
                  </>
                )}
                {/* Debug temporal */}
                {process.env.NODE_ENV === 'development' && (
                  <div className="text-xs text-orange-400 mt-1">
                    Debug: {loading ? 'Cargando...' : currentUser ? 'Datos OK' : 'Sin datos'}
                  </div>
                )}
              </div>
            </div>
            
            {/* Botón de logout más pequeño */}
            <div className="pt-1">
              <button 
                onClick={handleLogout}
                className="w-full inline-flex items-center justify-center px-3 py-2.5 border border-transparent text-xs font-medium rounded-lg text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 focus:ring-offset-slate-900 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Cerrar sesión
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-3">
            {/* Avatar pequeño */}
            {currentUser?.profile_picture ? (
              <img
                className="w-10 h-10 rounded-full ring-2 ring-blue-500 shadow-lg hover:ring-blue-400 transition-all duration-200"
                src={currentUser.profile_picture}
                alt="Avatar del usuario"
                title={currentUser ? `${currentUser.first_name} ${currentUser.last_name} - ${currentUser.username}` : 'Usuario'}
              />
            ) : (
              <div 
                className="w-10 h-10 bg-gradient-to-br from-gray-500 to-gray-600 rounded-full ring-2 ring-blue-500 flex items-center justify-center shadow-lg hover:ring-blue-400 transition-all duration-200"
                title={currentUser ? `${currentUser.first_name} ${currentUser.last_name} - ${currentUser.username}` : 'Usuario'}
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            )}
            {/* Botón de logout compacto */}
            <button 
              onClick={handleLogout}
              className="p-2 text-gray-300 hover:text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              title="Cerrar sesión"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
