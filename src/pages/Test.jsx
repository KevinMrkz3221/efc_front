import React from 'react';

export default function Test() {
  console.log('🟢 Test component loaded');
  
  return (
    <div style={{
      padding: '50px',
      backgroundColor: '#ff0000',
      color: 'white',
      fontSize: '30px',
      textAlign: 'center',
      minHeight: '100vh'
    }}>
      <h1>🚨 TEST PAGE 🚨</h1>
      <p>Si ves esto, React funciona!</p>
      <p>Hora: {new Date().toLocaleTimeString()}</p>
    </div>
  );
}
