import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { getCurrentUser } from '../api/users.ts';
import { refreshToken } from '../api/auth.js';

const UserContext = createContext({
  user: null,
  loading: true,
  error: null,
  refreshUser: () => {},
});

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const fetchedOnce = useRef(false);

  const fetchUser = async () => {
    if (fetchedOnce.current && loading) return;
    setLoading(true);
    setError(null);
    let token = localStorage.getItem('access');
    let triedRefresh = false;
    while (true) {
      try {
        if (token) {
          const userData = await getCurrentUser(token);
          setUser(userData);
        } else {
          setUser(null);
        }
        break;
      } catch (err) {
        // Si el token expiró, intenta refrescarlo una vez
        if (!triedRefresh && (err.message === 'SESSION_EXPIRED' || err.message.includes('401'))) {
          triedRefresh = true;
          const refresh = localStorage.getItem('refresh');
          if (refresh) {
            try {
              const data = await refreshToken(refresh);
              if (data.access) {
                localStorage.setItem('access', data.access);
                token = data.access;
                continue; // Reintenta con el nuevo token
              } else {
                throw new Error('No se pudo refrescar el token');
              }
            } catch (refreshErr) {
              setError(refreshErr);
              setUser(null);
              localStorage.removeItem('access');
              localStorage.removeItem('refresh');
              window.dispatchEvent(new CustomEvent('authStateChanged'));
              break;
            }
          } else {
            setUser(null);
            break;
          }
        } else {
          setError(err);
          setUser(null);
          break;
        }
      }
    }
    setLoading(false);
    fetchedOnce.current = true;
  };

  useEffect(() => {
    fetchUser();
    const handler = () => {
      fetchedOnce.current = false;
      fetchUser();
    };
    window.addEventListener('authStateChanged', handler);
    return () => window.removeEventListener('authStateChanged', handler);
  }, []);

  return (
    <UserContext.Provider value={{ user, loading, error, refreshUser: fetchUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
