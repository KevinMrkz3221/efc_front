import React, { createContext, useState, useContext } from 'react';
import { colors } from '../theme';

const NotificationContext = createContext();

export function useNotification() {
  return useContext(NotificationContext);
}

export function NotificationProvider({ children }) {
  const [message, setMessage] = useState('');
  const [type, setType] = useState('info'); // 'info', 'error', 'success', 'warning'

  const showMessage = (msg, msgType = 'info') => {
    setMessage(msg);
    setType(msgType);
    setTimeout(() => setMessage(''), 4000);
  };

  const getNotificationStyles = (type) => {
    const baseStyles = {
      position: 'fixed',
      top: 20,
      left: '50%',
      transform: 'translateX(-50%)',
      color: '#FFFFFF',
      padding: '12px 24px',
      borderRadius: '12px',
      zIndex: 9999,
      boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
      fontWeight: '500',
      fontSize: '14px',
      maxWidth: '400px',
      textAlign: 'center',
      animation: 'slideInDown 0.3s ease-out'
    };

    const typeStyles = {
      error: { background: '#C62828' },
      success: { background: '#2E7D32' },
      warning: { background: '#F57C00' },
      info: { background: '#4DA6FF' }
    };

    return { ...baseStyles, ...typeStyles[type] };
  };

  return (
    <NotificationContext.Provider value={{ showMessage }}>
      {children}
      {message && (
        <>
          <div style={getNotificationStyles(type)}>
            <div className="flex items-center justify-center space-x-2">
              {type === 'success' && (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
              {type === 'error' && (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              )}
              {type === 'warning' && (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              )}
              {type === 'info' && (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              )}
              <span>{message}</span>
            </div>
          </div>
          <style jsx>{`
            @keyframes slideInDown {
              from {
                transform: translate(-50%, -100%);
                opacity: 0;
              }
              to {
                transform: translate(-50%, 0);
                opacity: 1;
              }
            }
          `}</style>
        </>
      )}
    </NotificationContext.Provider>
  );
}
