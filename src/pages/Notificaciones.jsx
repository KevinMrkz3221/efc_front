import React, { useEffect, useState } from 'react';
import { fetchNotificaciones, fetchAllNotifications, marcarNotificacionComoVista } from '../api/notificaciones';

export default function Notificaciones() {
  const [notificaciones, setNotificaciones] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const pageSize = 15;
  const [count, setCount] = useState(0);
  const [filtroVisto, setFiltroVisto] = useState('todos');

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      let data;
      if (filtroVisto === 'todos') {
        data = await fetchAllNotifications({ page, pageSize });
      } else {
        const params = { page, pageSize };
        if (filtroVisto === 'visto') params.visto = true;
        else if (filtroVisto === 'novisto') params.visto = false;
        data = await fetchNotificaciones(params);
      }
      setNotificaciones(data.results);
      setCount(data.count);
    } catch (e) {
      setError('Error al cargar notificaciones');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, [page, filtroVisto]);

  const handleActualizarTodas = async () => {
    setLoading(true);
    try {
      await Promise.all(
        notificaciones.filter(n => !n.visto).map(n => marcarNotificacionComoVista(n.id))
      );
      fetchData();
    } catch (e) {
      setError('Error al actualizar notificaciones');
    } finally {
      setLoading(false);
    }
  };

  const handleFiltroChange = (e) => {
    setFiltroVisto(e.target.value);
    setPage(1);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
        <h1 className="text-2xl font-bold">Notificaciones</h1>
        <div className="flex gap-2 items-center">
          <select
            className="border rounded px-2 py-1"
            value={filtroVisto}
            onChange={handleFiltroChange}
          >
            <option value="todos">Todas</option>
            <option value="visto">Vistas</option>
            <option value="novisto">No vistas</option>
          </select>
          <button
            onClick={handleActualizarTodas}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded shadow"
            disabled={loading}
          >
            Actualizar todas como leídas
          </button>
        </div>
      </div>
      {loading ? (
        <div className="text-blue-500 py-8 text-center">Cargando...</div>
      ) : error ? (
        <div className="text-red-500 py-8 text-center">{error}</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-gradient-to-r from-gray-50 sticky top-0 z-20">
              <tr>
                <th className="px-6 py-3 text-center text-xs font-bold text-blue-700 uppercase tracking-wider border-b border-gray-200">ID</th>
                <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider border-b border-gray-200">Tipo</th>
                <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider border-b border-gray-200">Mensaje</th>
                <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider border-b border-gray-200">Fecha</th>
                <th className="px-6 py-3 text-center text-xs font-bold text-blue-700 uppercase tracking-wider border-b border-gray-200">Visto</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100" style={{ position: 'relative', minHeight: 'calc(8 * 56px)' }}>
              {Array.from({ length: pageSize }).map((_, idx) => {
                const n = notificaciones[idx];
                if (n) {
                  return (
                    <tr key={n.id} className={`transition-all duration-200 hover:bg-blue-100 hover:shadow-lg ${n.visto ? '' : 'bg-blue-50'}`}>
                      <td className="px-6 py-4 text-center align-middle">{n.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap align-middle font-medium text-blue-900">{n.tipo?.descripcion || n.tipo?.tipo}</td>
                      <td className="px-6 py-4 whitespace-nowrap align-middle text-gray-800">{n.mensaje}</td>
                      <td className="px-6 py-4 whitespace-nowrap align-middle text-gray-700">{new Date(n.fecha_envio || n.created_at).toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-center align-middle">
                        {n.visto ? (
                          <span className="text-green-600 font-semibold">Sí</span>
                        ) : (
                          <span className="text-red-600 font-semibold">No</span>
                        )}
                      </td>
                    </tr>
                  );
                } else {
                  return (
                    <tr key={"empty-" + idx}>
                      <td className="px-6 py-4 text-center text-gray-300">-</td>
                      <td className="px-6 py-4 text-gray-300">-</td>
                      <td className="px-6 py-4 text-gray-300">-</td>
                      <td className="px-6 py-4 text-gray-300">-</td>
                      <td className="px-6 py-4 text-center text-gray-300">-</td>
                    </tr>
                  );
                }
              })}
            </tbody>
          </table>
        </div>
      )}
      {/* Paginación */}
      <div className="flex justify-between items-center mt-4">
        <div>
          Página {page} de {Math.ceil(count / pageSize) || 1}
        </div>
        <div className="flex gap-2 items-center">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            Anterior
          </button>
          <button
            onClick={() => setPage((p) => (p * pageSize < count ? p + 1 : p))}
            disabled={page * pageSize >= count}
            className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            Siguiente
          </button>
          <span className="ml-2 text-sm text-gray-500">15 por página</span>
        </div>
      </div>
    </div>
  );
}
