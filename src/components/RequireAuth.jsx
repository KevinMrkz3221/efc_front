import React from 'react';
import { Navigate } from 'react-router-dom';

// Esta función verifica si el usuario está autenticado (por ejemplo, si hay un token en localStorage)
function isAuthenticated() {
  const token = localStorage.getItem('access');
  console.log('🔐 Verificando autenticación, token:', token ? 'presente' : 'ausente');
  return !!token;
}

export default function RequireAuth({ children }) {
  const authenticated = isAuthenticated();
  console.log('🛡️ RequireAuth - usuario autenticado:', authenticated);
  
  if (!authenticated) {
    console.log('❌ No autenticado, redirigiendo a /login');
    return <Navigate to="/login" replace />;
  }
  
  console.log('✅ Usuario autenticado, mostrando contenido');
  return children;
}
