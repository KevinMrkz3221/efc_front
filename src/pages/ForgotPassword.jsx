import React, { useState } from 'react';

const API_URL = import.meta.env.VITE_EFC_API_URL;

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);
    try {
      const res = await fetch(`${API_URL}/user/password-reset/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.detail || 'No se pudo enviar el correo.');
      } else {
        setSuccess(true);
      }
    } catch (err) {
      setError('Error de red. Intenta de nuevo.');
    }
    setLoading(false);
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
              <a href="/" className="inline-block">
                <h1 className="text-4xl font-bold text-white">
                  EFC
                </h1>
              </a>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Recuperar contraseña
            </h2>
            <p className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
              Ingresa tu usuario y correo para recibir el enlace de recuperación
            </p>
          </div>
          {/* Form */}
          <div className="px-8 py-8">
            {success ? (
              <div className="text-green-700 bg-green-50 border border-green-200 rounded p-4 text-center mb-4">
                Si el correo está registrado, recibirás un enlace para restablecer tu contraseña.
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: '#333333' }}>
                    Usuario
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5" style={{ color: '#7A7A7A' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      required
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition duration-200"
                      style={{ color: '#333333', borderColor: '#d1d5db' }}
                      placeholder="Tu usuario"
                      value={username}
                      onChange={e => setUsername(e.target.value)}
                      onFocus={e => {
                        e.target.style.borderColor = 'transparent';
                        e.target.style.boxShadow = '0 0 0 2px #4DA6FF';
                      }}
                      onBlur={e => {
                        e.target.style.borderColor = '#d1d5db';
                        e.target.style.boxShadow = 'none';
                      }}
                      onMouseEnter={e => {
                        if (document.activeElement !== e.target) {
                          e.target.style.borderColor = '#4DA6FF';
                        }
                      }}
                      onMouseLeave={e => {
                        if (document.activeElement !== e.target) {
                          e.target.style.borderColor = '#d1d5db';
                        }
                      }}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: '#333333' }}>
                    Correo electrónico
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5" style={{ color: '#7A7A7A' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12H8m8 0a4 4 0 11-8 0 4 4 0 018 0zm-4 4v2m0-6V8" />
                      </svg>
                    </div>
                    <input
                      type="email"
                      required
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition duration-200"
                      style={{ color: '#333333', borderColor: '#d1d5db' }}
                      placeholder="tucorreo@ejemplo.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      onFocus={e => {
                        e.target.style.borderColor = 'transparent';
                        e.target.style.boxShadow = '0 0 0 2px #4DA6FF';
                      }}
                      onBlur={e => {
                        e.target.style.borderColor = '#d1d5db';
                        e.target.style.boxShadow = 'none';
                      }}
                      onMouseEnter={e => {
                        if (document.activeElement !== e.target) {
                          e.target.style.borderColor = '#4DA6FF';
                        }
                      }}
                      onMouseLeave={e => {
                        if (document.activeElement !== e.target) {
                          e.target.style.borderColor = '#d1d5db';
                        }
                      }}
                    />
                  </div>
                </div>
                {error && <div className="rounded-xl bg-red-50 border p-4 animate-pulse text-danger-600 text-sm text-center" style={{ borderColor: 'rgba(198, 40, 40, 0.2)' }}>{error}</div>}
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  style={{ backgroundColor: '#1B2A41', '--tw-ring-color': '#1B2A41' }}
                  onMouseEnter={e => {
                    if (!loading) {
                      e.target.style.backgroundColor = '#162234';
                    }
                  }}
                  onMouseLeave={e => {
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
                      Enviando...
                    </>
                  ) : (
                    <>
                      <span>Enviar enlace de recuperación</span>
                      <svg className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </>
                  )}
                </button>
              </form>
            )}
            <div className="mt-6 text-center">
              <a href="/login" className="text-blue-600 hover:underline text-sm">Volver al inicio de sesión</a>
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
