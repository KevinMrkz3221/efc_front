
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchNotificaciones, marcarNotificacionComoVista } from '../api/notificaciones';

export default function NotificationBell() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [showPanel, setShowPanel] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchNotificaciones({ page: 1, pageSize: 50 })
      .then(data => {
        setNotifications(data.results);
        setUnreadCount(data.results.filter(n => !n.visto).length);
      })
      .catch(err => {
        setError('Error al cargar notificaciones');
      })
      .finally(() => setLoading(false));
  }, []);

  // Opcional: aquí podrías hacer una petición PATCH/POST si es necesario
  const markAsRead = async (notificationId) => {
    try {
      await marcarNotificacionComoVista(notificationId);
      setNotifications(prev =>
        prev.map(notification =>
          notification.id === notificationId
            ? { ...notification, visto: true }
            : notification
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (e) {
      // Opcional: mostrar error
    }
  };

  const markAllAsRead = async () => {
    const notVistas = notifications.filter(n => !n.visto);
    try {
      await Promise.all(notVistas.map(n => marcarNotificacionComoVista(n.id)));
      setNotifications(prev => prev.map(notification => ({ ...notification, visto: true })));
      setUnreadCount(0);
    } catch (e) {
      // Opcional: mostrar error
    }
  };

  const getNotificationIcon = (tipo) => {
    switch (tipo) {
      case 'success':
        return (
          <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
      case 'warning':
        return (
          <div className="flex-shrink-0 w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
    }
  };

  const formatTimestamp = (isoString) => {
    const timestamp = new Date(isoString);
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (minutes < 1) return 'Ahora';
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    return `${days}d`;
  };

  return (
    <>
      {/* Campanita flotante */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setShowPanel(!showPanel)}
          className="relative bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-5-5v5zM4 4h5l-5 5v-5z" />
          </svg>
          
          {/* Contador de notificaciones no leídas */}
          {unreadCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>
      </div>

      {/* Panel de notificaciones */}
      {showPanel && (
        <div className="fixed bottom-20 right-6 z-50 w-80 bg-white rounded-lg shadow-xl border border-gray-200">
          {/* Header del panel */}
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Notificaciones</h3>
            <div className="flex items-center space-x-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  Marcar todas como leídas
                </button>
              )}
              <button
                onClick={() => setShowPanel(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Lista de notificaciones */}
          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="p-6 text-center text-blue-500">Cargando notificaciones...</div>
            ) : error ? (
              <div className="p-6 text-center text-red-500">{error}</div>
            ) : notifications.length === 0 ? (
              <div className="p-6 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-5 5v-5zM13 3l-4 9h6l-4 9" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No hay notificaciones</h3>
                <p className="mt-1 text-sm text-gray-500">Cuando tengas nuevas notificaciones aparecerán aquí.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                      !notification.visto ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex space-x-3">
                      {getNotificationIcon(notification.tipo?.tipo)}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className={`text-sm font-medium ${
                            !notification.visto ? 'text-gray-900' : 'text-gray-700'
                          }`}>
                            {notification.tipo?.descripcion || notification.tipo?.tipo || 'Notificación'}
                          </p>
                          <span className="text-xs text-gray-500">
                            {formatTimestamp(notification.fecha_envio || notification.created_at)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{notification.mensaje}</p>
                        {!notification.visto && (
                          <div className="mt-2">
                            <span className="inline-block w-2 h-2 bg-blue-600 rounded-full"></span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer del panel */}
          {notifications.length > 0 && (
            <div className="p-3 border-t border-gray-200 bg-gray-50 rounded-b-lg">
              <button
                className="w-full text-center text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                onClick={() => {
                  setShowPanel(false);
                  navigate('/notificaciones');
                }}
              >
                Ver todas las notificaciones
              </button>
            </div>
          )}
        </div>
      )}

      {/* Overlay para cerrar el panel al hacer clic fuera */}
      {showPanel && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowPanel(false)}
        />
      )}
    </>
  );
}
