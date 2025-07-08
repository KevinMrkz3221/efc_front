import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { colors } from '../theme';

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkAuthStatus = () => {
      const token = localStorage.getItem('access');
      setIsLoggedIn(!!token);
    };

    checkAuthStatus();
    window.addEventListener('authStateChanged', checkAuthStatus);
    return () => window.removeEventListener('authStateChanged', checkAuthStatus);
  }, []);

  const logout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    window.dispatchEvent(new CustomEvent('authStateChanged'));
    window.location.href = '/';
  };

  const navLinks = [
    { path: '/', name: 'Inicio', public: true },
    { path: '/admin', name: 'Dashboard', public: false },
    { path: '/documents', name: 'Documentos', public: false },
    { path: '/mi-organizacion', name: 'Organización', public: false },
    { path: '/usuarios', name: 'Usuarios', public: false },
    { path: '/reportes', name: 'Reportes', public: false },
  ];

  const isActiveLink = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-white shadow-xl border-b border-gray-200 sticky top-0 z-50 backdrop-blur-lg bg-white/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center group">
              <div className="w-10 h-10 bg-gradient-to-br from-navy-500 to-navy-600 rounded-xl flex items-center justify-center shadow-lg mr-3 transition-all duration-200 group-hover:shadow-xl group-hover:scale-105">
                <span className="text-lg font-bold text-white">E</span>
              </div>
              <div className="hidden sm:block">
                <span className="text-2xl font-bold bg-gradient-to-r from-navy-900 to-navy-700 bg-clip-text text-transparent">EFC</span>
                <span className="ml-2 text-sm text-text-secondary">
                  Export & Finance Control
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-2">
              {navLinks
                .filter(link => link.public || isLoggedIn)
                .map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActiveLink(link.path)
                        ? 'bg-gradient-to-r from-navy-600 to-navy-700 text-white shadow-lg transform scale-105'
                        : 'text-text-primary hover:bg-gradient-to-r hover:from-light-gray-100 hover:to-light-gray-200 hover:text-navy-700 hover:shadow-md hover:transform hover:scale-105'
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
            </div>
          </div>

          {/* Auth buttons */}
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              {isLoggedIn ? (
                <div className="flex items-center space-x-4">
                  <span className="text-text-secondary text-sm font-medium">
                    Bienvenido
                  </span>
                  <button
                    onClick={logout}
                    className="bg-gradient-to-r from-danger-600 to-danger-700 hover:from-danger-700 hover:to-danger-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span>Salir</span>
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="bg-gradient-to-r from-navy-600 to-navy-700 hover:from-navy-700 hover:to-navy-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span>Ingresar</span>
                </Link>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-text-primary hover:text-navy hover:bg-light-gray focus:outline-none focus:ring-2 focus:ring-inset focus:ring-navy"
            >
              <svg
                className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                stroke="currentColor"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg
                className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                stroke="currentColor"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-light-gray border-t border-gray-200">
          {navLinks
            .filter(link => link.public || isLoggedIn)
            .map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                  isActiveLink(link.path)
                    ? 'bg-navy text-white'
                    : 'text-text-primary hover:bg-white hover:text-navy'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
          
          {/* Mobile auth section */}
          <div className="border-t border-gray-300 pt-4 pb-3">
            {isLoggedIn ? (
              <button
                onClick={() => {
                  logout();
                  setIsMenuOpen(false);
                }}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-error hover:bg-white transition-colors duration-200"
              >
                Salir
              </button>
            ) : (
              <Link
                to="/login"
                className="block px-3 py-2 rounded-md text-base font-medium text-navy hover:bg-white transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Ingresar
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
