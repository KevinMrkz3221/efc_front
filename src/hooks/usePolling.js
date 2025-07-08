import { useState, useEffect, useRef } from 'react';

export function usePolling(fetchFunction, interval = 30000, dependencies = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const intervalRef = useRef(null);
  const isActiveRef = useRef(true);

  const fetchData = async (showLoading = false) => {
    if (showLoading) setLoading(true);
    setError(null);
    
    try {
      const result = await fetchFunction();
      if (isActiveRef.current) {
        setData(result);
        setLoading(false);
      }
    } catch (err) {
      if (isActiveRef.current) {
        setError(err);
        setLoading(false);
      }
    }
  };

  const startPolling = () => {
    if (intervalRef.current) return; // Ya está corriendo
    
    fetchData(true); // Fetch inicial
    intervalRef.current = setInterval(() => {
      if (isActiveRef.current) {
        fetchData(false); // Fetch sin loading para no molestar al usuario
      }
    }, interval);
  };

  const stopPolling = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const refetch = () => {
    fetchData(true);
  };

  useEffect(() => {
    isActiveRef.current = true;
    startPolling();

    // Parar polling cuando el componente se desmonta o la pestaña no está visible
    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopPolling();
      } else {
        startPolling();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      isActiveRef.current = false;
      stopPolling();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, dependencies);

  return { data, loading, error, refetch, startPolling, stopPolling };
}
