import React, { useState } from 'react';
import { login } from '../api/auth';
import { Link } from 'react-router-dom';
import { colors } from '../theme';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await login(username, password);
      localStorage.setItem('access', data.access);
      localStorage.setItem('refresh', data.refresh);
      
      // Disparar evento personalizado para que el navbar se actualice
      window.dispatchEvent(new CustomEvent('authStateChanged'));
      
      // Redirigir al dashboard
      window.location.href = '/admin';
    } catch (err) {
      setError('Usuario o contraseña incorrectos');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: '#F2F4F7' }}>
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%231B2A41' fillOpacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>
    
      <div className="relative max-w-md w-full">
        {/* Main Card */}
        <div className="bg-white backdrop-blur-md rounded-3xl shadow-2xl border border-gray-200 overflow-hidden">
          {/* Header with navy background */}
          <div className="px-8 py-10 text-center" style={{ backgroundColor: '#1B2A41' }}>
            <div className="mb-4">
              <Link to="/" className="inline-block">
                <h1 className="text-4xl font-bold text-white">
                  EFC
                </h1>
              </Link>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Bienvenido de vuelta
            </h2>
            <p className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
              Inicia sesión para acceder a tu plataforma aduanal
            </p>
          </div>

          {/* Form */}
          <div className="px-8 py-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Username Field */}
              <div>
                <label htmlFor="username" className="block text-sm font-semibold mb-2" style={{ color: '#333333' }}>
                  Usuario
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5" style={{ color: '#7A7A7A' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    required
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition duration-200"
                    style={{ 
                      color: '#333333',
                      borderColor: '#d1d5db',
                      ':focus': { 
                        ringColor: '#4DA6FF',
                        borderColor: 'transparent' 
                      },
                      ':hover': { 
                        borderColor: '#4DA6FF' 
                      }
                    }}
                    placeholder="Ingresa tu usuario"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    onFocus={(e) => {
                      e.target.style.borderColor = 'transparent';
                      e.target.style.boxShadow = '0 0 0 2px #4DA6FF';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#d1d5db';
                      e.target.style.boxShadow = 'none';
                    }}
                    onMouseEnter={(e) => {
                      if (document.activeElement !== e.target) {
                        e.target.style.borderColor = '#4DA6FF';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (document.activeElement !== e.target) {
                        e.target.style.borderColor = '#d1d5db';
                      }
                    }}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-semibold mb-2" style={{ color: '#333333' }}>
                  Contraseña
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5" style={{ color: '#7A7A7A' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition duration-200"
                    style={{ 
                      color: '#333333',
                      borderColor: '#d1d5db'
                    }}
                    placeholder="Ingresa tu contraseña"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    onFocus={(e) => {
                      e.target.style.borderColor = 'transparent';
                      e.target.style.boxShadow = '0 0 0 2px #4DA6FF';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#d1d5db';
                      e.target.style.boxShadow = 'none';
                    }}
                    onMouseEnter={(e) => {
                      if (document.activeElement !== e.target) {
                        e.target.style.borderColor = '#4DA6FF';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (document.activeElement !== e.target) {
                        e.target.style.borderColor = '#d1d5db';
                      }
                    }}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center transition-colors duration-200"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <svg className="h-5 w-5 hover:opacity-70" style={{ color: '#7A7A7A' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L8.464 8.464m1.414 1.414L12 12m0 0l2.122 2.122m0 0l1.414 1.414" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5 hover:opacity-70" style={{ color: '#7A7A7A' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="rounded-xl bg-red-50 border p-4 animate-pulse" style={{ borderColor: 'rgba(198, 40, 40, 0.2)' }}>
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5" style={{ color: '#C62828' }} viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium" style={{ color: '#C62828' }}>
                        {error}
                      </h3>
                    </div>
                  </div>
                </div>
              )}

              {/* Login Button */}
              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  style={{
                    backgroundColor: '#1B2A41',
                    '--tw-ring-color': '#1B2A41'
                  }}
                  onMouseEnter={(e) => {
                    if (!loading) {
                      e.target.style.backgroundColor = '#162234';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!loading) {
                      e.target.style.backgroundColor = '#1B2A41';
                    }
                  }}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Ingresando...
                    </>
                  ) : (
                    <>
                      <span>Ingresar</span>
                      <svg className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </>
                  )}
                </button>
              </div>

              {/* Additional Links */}
              <div className="text-center space-y-3">
                <div className="text-sm">
                  <a href="#" className="font-medium transition-colors duration-200" style={{ color: '#4DA6FF' }}
                     onMouseEnter={(e) => e.target.style.color = '#1976D2'}
                     onMouseLeave={(e) => e.target.style.color = '#4DA6FF'}
                  >
                    ¿Olvidaste tu contraseña?
                  </a>
                </div>
                <div className="border-t border-gray-200 pt-4">
                  <Link
                    to="/"
                    className="inline-flex items-center text-sm font-medium group transition-colors duration-200"
                    style={{ color: '#4DA6FF' }}
                    onMouseEnter={(e) => e.target.style.color = '#1976D2'}
                    onMouseLeave={(e) => e.target.style.color = '#4DA6FF'}
                  >
                    <svg className="mr-2 w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 17l-5-5m0 0l5-5m-5 5h12" />
                    </svg>
                    Volver al inicio
                  </Link>
                </div>
              </div>
            </form>
          </div>

          {/* Footer */}
          <div className="px-8 py-4 border-t border-gray-200" style={{ backgroundColor: '#F2F4F7' }}>
            <div className="text-center">
              <p className="text-xs" style={{ color: '#7A7A7A' }}>
                Desarrollado por <span className="font-semibold" style={{ color: '#1B2A41' }}>@AduanaSoft</span>
              </p>
              <p className="text-xs mt-1" style={{ color: '#7A7A7A' }}>
                Solución especializada para Agentes Aduanales
              </p>
            </div>
          </div>
        </div>

        {/* Floating elements */}
        <div className="absolute -top-4 -left-4 w-24 h-24 rounded-full blur-xl" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}></div>
        <div className="absolute -bottom-4 -right-4 w-32 h-32 rounded-full blur-xl" style={{ backgroundColor: 'rgba(27, 42, 65, 0.2)' }}></div>
      </div>
    </div>
  );
}
