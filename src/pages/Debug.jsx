import React from 'react';

export default function Debug() {
  return (
    <div style={{ padding: '20px', backgroundColor: '#f0f0f0', minHeight: '100vh' }}>
      <h1 style={{ color: 'red', fontSize: '24px' }}>🐛 Debug Page</h1>
      <p>Si ves esto, React está funcionando correctamente.</p>
      <p>Fecha y hora: {new Date().toLocaleString()}</p>
      <p>Token en localStorage: {localStorage.getItem('access') ? 'SÍ' : 'NO'}</p>
      <p>URL actual: {window.location.href}</p>
    </div>
  );
}
