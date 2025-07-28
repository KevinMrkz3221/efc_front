import React from "react";

export default function Reportes() {
  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-extrabold mb-2 text-blue-900 tracking-tight">Reportes</h1>
        <p className="mb-6 text-gray-600">Consulta y descarga reportes relacionados con el sistema.</p>
        {/* Filtros de ejemplo */}
        <div className="flex flex-wrap gap-4 mb-6 bg-white p-4 rounded-lg shadow-sm">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Tipo de reporte</label>
            <select className="border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300">
              <option>General</option>
              <option>Usuarios</option>
              <option>Documentos</option>
              <option>Procesos</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Fecha inicio</label>
            <input type="date" className="border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Fecha fin</label>
            <input type="date" className="border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" />
          </div>
          <div className="flex items-end">
            <button className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition">Filtrar</button>
          </div>
        </div>

        {/* Tabla de reportes de ejemplo */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-blue-800">Resultados</h2>
            <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
              Descargar Excel
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left">
              <thead>
                <tr className="bg-blue-100 text-blue-900">
                  <th className="py-2 px-4 font-semibold">ID</th>
                  <th className="py-2 px-4 font-semibold">Nombre</th>
                  <th className="py-2 px-4 font-semibold">Tipo</th>
                  <th className="py-2 px-4 font-semibold">Fecha</th>
                  <th className="py-2 px-4 font-semibold">Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b hover:bg-blue-50">
                  <td className="py-2 px-4">1</td>
                  <td className="py-2 px-4">Reporte de usuarios</td>
                  <td className="py-2 px-4">Usuarios</td>
                  <td className="py-2 px-4">2025-07-22</td>
                  <td className="py-2 px-4">
                    <button className="text-blue-600 hover:underline">Ver</button>
                  </td>
                </tr>
                <tr className="border-b hover:bg-blue-50">
                  <td className="py-2 px-4">2</td>
                  <td className="py-2 px-4">Reporte de documentos</td>
                  <td className="py-2 px-4">Documentos</td>
                  <td className="py-2 px-4">2025-07-21</td>
                  <td className="py-2 px-4">
                    <button className="text-blue-600 hover:underline">Ver</button>
                  </td>
                </tr>
                {/* Más filas de ejemplo aquí */}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
