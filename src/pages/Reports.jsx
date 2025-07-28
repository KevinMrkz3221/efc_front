import React, { useState, useEffect } from 'react';
export default function Reports() {
  const tabs = [
    { key: 'pedimentos', label: 'Generar Reporte de Pedimentos' },
    { key: 'datastage', label: 'Generar Reporte de Datastage' },
    { key: 'minimos', label: 'Generar Reporte de Mínimos' },
    { key: 'coves', label: 'Generar Reporte de COVES' },
  ];

  // Columnas por tipo de reporte y tipo de registro para datastage
  const columnasPorTab = {
    pedimentos: [
      { key: 'id', label: 'ID' },
      { key: 'nombre', label: 'Nombre' },
      { key: 'pedimento', label: 'Pedimento' },
      { key: 'fecha', label: 'Fecha' },
      { key: 'estado', label: 'Estado' },
    ],
    datastage: {
      entrada: [
        { key: 'id', label: 'ID' },
        { key: 'nombre', label: 'Nombre' },
        { key: 'fecha', label: 'Fecha' },
        { key: 'usuario', label: 'Usuario' },
        { key: 'entrada', label: 'Entrada' },
      ],
      salida: [
        { key: 'id', label: 'ID' },
        { key: 'nombre', label: 'Nombre' },
        { key: 'fecha', label: 'Fecha' },
        { key: 'usuario', label: 'Usuario' },
        { key: 'salida', label: 'Salida' },
      ],
      proceso: [
        { key: 'id', label: 'ID' },
        { key: 'nombre', label: 'Nombre' },
        { key: 'fecha', label: 'Fecha' },
        { key: 'usuario', label: 'Usuario' },
        { key: 'proceso', label: 'Proceso' },
      ],
      default: [
        { key: 'id', label: 'ID' },
        { key: 'nombre', label: 'Nombre' },
        { key: 'fecha', label: 'Fecha' },
        { key: 'usuario', label: 'Usuario' },
      ],
    },
    minimos: [
      { key: 'id', label: 'ID' },
      { key: 'nombre', label: 'Nombre' },
      { key: 'minimo', label: 'Mínimo' },
      { key: 'fecha', label: 'Fecha' },
    ],
    coves: [
      { key: 'id', label: 'ID' },
      { key: 'nombre', label: 'Nombre' },
      { key: 'cove', label: 'COVE' },
      { key: 'fecha', label: 'Fecha' },
    ],
  };

  const [activeTab, setActiveTab] = useState('pedimentos');
  const [nombreReporte, setNombreReporte] = useState('');
  const [columnas, setColumnas] = useState(['id', 'nombre']);
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [pedimento, setPedimento] = useState('');
  const [tipoRegistro, setTipoRegistro] = useState('');

  const handleColumnaChange = (col) => {
    setColumnas((prev) =>
      prev.includes(col)
        ? prev.filter((c) => c !== col)
        : [...prev, col]
    );
  };

  const handleGenerarReporte = (e) => {
    e.preventDefault();
    alert(`Generando reporte: ${nombreReporte}\nTipo: ${activeTab}\nColumnas: ${columnas.join(', ')}\nPedimento: ${pedimento}\nFecha: ${fechaInicio} a ${fechaFin}`);
  };

  // Reset columnas al cambiar de tab o tipo de registro en datastage
  useEffect(() => {
    if (activeTab === 'datastage') {
      if (tipoRegistro && columnasPorTab.datastage[tipoRegistro]) {
        setColumnas(['id', 'nombre']);
      } else {
        setColumnas(['id', 'nombre']);
      }
    } else {
      setColumnas(['id', 'nombre']);
    }
  }, [activeTab, tipoRegistro]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header decorativo */}
        <div className="mb-8 relative overflow-hidden rounded-2xl shadow bg-gradient-to-r from-blue-50 via-white to-indigo-50 border border-blue-100 p-8 flex items-center gap-6">
          <div className="flex-shrink-0 bg-blue-100 rounded-full p-4 shadow-md animate-bounce-slow">
            <svg className="h-10 w-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <h1 className="text-4xl font-extrabold text-blue-900 tracking-tight mb-1 flex items-center gap-2">
              Reportes
            </h1>
            <p className="text-lg text-blue-700/80 font-medium">Consulta y descarga reportes relacionados con el sistema.</p>
          </div>
          {/* Efecto decorativo de fondo */}
          <div className="absolute -top-10 -right-10 opacity-30 pointer-events-none select-none">
            <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
              <circle cx="60" cy="60" r="50" fill="url(#grad1)" />
              <defs>
                <linearGradient id="grad1" x1="0" y1="0" x2="120" y2="120" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#3b82f6" stopOpacity="0.15" />
                  <stop offset="1" stopColor="#6366f1" stopOpacity="0.10" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
        {/* Animación personalizada para el icono */}
        <style>{`
          @keyframes bounce-slow {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-8px); }
          }
          .animate-bounce-slow {
            animation: bounce-slow 2.2s infinite;
          }
        `}</style>

        {/* Tabs y formulario en tarjeta */}
        <div className="mb-8 bg-white shadow-lg rounded-xl border border-gray-200">
          <div className="flex gap-2 mb-4 px-6 pt-6">
            {tabs.map(tab => (
              <button
                key={tab.key}
                className={`px-4 py-2 rounded-t font-semibold border-b-2 transition-all ${activeTab === tab.key ? 'bg-white border-blue-700 text-blue-800' : 'bg-blue-100 border-transparent text-blue-500 hover:bg-blue-200'}`}
                onClick={() => setActiveTab(tab.key)}
                type="button"
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="px-6 pb-6 min-h-[340px] flex flex-col justify-between">
            <h2 className="text-xl font-bold text-blue-800 mb-2">{tabs.find(t => t.key === activeTab)?.label}</h2>
            <p className="text-gray-600 mb-4">Selecciona los campos y filtros que deseas incluir en tu reporte personalizado.</p>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleGenerarReporte}>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Nombre del reporte</label>
                <input type="text" value={nombreReporte} onChange={e => setNombreReporte(e.target.value)} placeholder="Ej: Reporte personalizado" className="border rounded px-3 py-2 w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" />
              </div>
              {/* Pedimento y fechas para cada tab según requerimiento */}
              {activeTab === 'pedimentos' && (
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Pedimento específico</label>
                  <input type="text" value={pedimento} onChange={e => setPedimento(e.target.value)} placeholder="Ej: 12345678" className="border rounded px-3 py-2 w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" />
                </div>
              )}
              {activeTab === 'datastage' && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Pedimento</label>
                    <input type="text" value={pedimento} onChange={e => setPedimento(e.target.value)} placeholder="Ej: 12345678" className="border rounded px-3 py-2 w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Fecha inicial</label>
                    <input type="date" value={fechaInicio} onChange={e => setFechaInicio(e.target.value)} className="border rounded px-3 py-2 w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Fecha final</label>
                    <input type="date" value={fechaFin} onChange={e => setFechaFin(e.target.value)} className="border rounded px-3 py-2 w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Tipo de registro</label>
                    <select
                      className="border rounded px-3 py-2 w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                      value={tipoRegistro}
                      onChange={e => setTipoRegistro(e.target.value)}
                    >
                      <option value="">Selecciona...</option>
                      <option value="entrada">Entrada</option>
                      <option value="salida">Salida</option>
                      <option value="proceso">Proceso</option>
                      {/* Agrega más opciones según los registros disponibles */}
                    </select>
                  </div>
                </>
              )}
              {activeTab === 'coves' && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Pedimento</label>
                    <input type="text" value={pedimento} onChange={e => setPedimento(e.target.value)} placeholder="Ej: 12345678" className="border rounded px-3 py-2 w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Fecha inicial</label>
                    <input type="date" value={fechaInicio} onChange={e => setFechaInicio(e.target.value)} className="border rounded px-3 py-2 w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Fecha final</label>
                    <input type="date" value={fechaFin} onChange={e => setFechaFin(e.target.value)} className="border rounded px-3 py-2 w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" />
                  </div>
                </>
              )}
              {activeTab === 'minimos' && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Pedimento</label>
                    <input type="text" value={pedimento} onChange={e => setPedimento(e.target.value)} placeholder="Ej: 12345678" className="border rounded px-3 py-2 w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Fecha inicial</label>
                    <input type="date" value={fechaInicio} onChange={e => setFechaInicio(e.target.value)} className="border rounded px-3 py-2 w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Fecha final</label>
                    <input type="date" value={fechaFin} onChange={e => setFechaFin(e.target.value)} className="border rounded px-3 py-2 w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" />
                  </div>
                </>
              )}
              {/* Columnas a incluir solo si no es minimos */}
              {activeTab !== 'minimos' && (
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Columnas a incluir</label>
                  <div className="flex flex-wrap gap-4">
                    {activeTab === 'datastage'
                      ? (columnasPorTab.datastage[tipoRegistro] || columnasPorTab.datastage.default).map(col => (
                          <label key={col.key} className="inline-flex items-center">
                            <input
                              type="checkbox"
                              className="mr-2"
                              checked={columnas.includes(col.key)}
                              onChange={() => handleColumnaChange(col.key)}
                            />
                            {col.label}
                          </label>
                        ))
                      : columnasPorTab[activeTab].map(col => (
                          <label key={col.key} className="inline-flex items-center">
                            <input
                              type="checkbox"
                              className="mr-2"
                              checked={columnas.includes(col.key)}
                              onChange={() => handleColumnaChange(col.key)}
                            />
                            {col.label}
                          </label>
                        ))}
                  </div>
                </div>
              )}
              {/* Fechas para los demás tabs - ya incluidas arriba */}
              <div className="md:col-span-2 flex justify-end mt-2">
                <button type="submit" className="bg-blue-700 text-white px-6 py-2 rounded shadow hover:bg-blue-800 transition">Generar reporte</button>
              </div>
            </form>
          </div>
        </div>

        {/* Tabla de reportes de ejemplo */}
        <div className="bg-white shadow-lg rounded-xl border border-gray-200 mt-8">
          <div className="flex justify-between items-center mb-4 px-6 pt-6">
            <h2 className="text-lg font-bold text-blue-800">Resultados</h2>
            <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
              Descargar Excel
            </button>
          </div>
          <div className="overflow-x-auto px-6 pb-6">
            <table className="min-w-full text-sm text-left">
              <thead>
                <tr className="bg-blue-100 text-blue-900">
                  <th className="py-2 px-4 font-semibold">ID</th>
                  <th className="py-2 px-4 font-semibold">Nombre</th>
                  <th className="py-2 px-4 font-semibold">Tipo</th>
                  <th className="py-2 px-4 font-semibold">Pedimento</th>
                  <th className="py-2 px-4 font-semibold">Fecha</th>
                  <th className="py-2 px-4 font-semibold">Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b hover:bg-blue-50">
                  <td className="py-2 px-4">1</td>
                  <td className="py-2 px-4">Reporte de usuarios</td>
                  <td className="py-2 px-4">Usuarios</td>
                  <td className="py-2 px-4">12345678</td>
                  <td className="py-2 px-4">2025-07-22</td>
                  <td className="py-2 px-4">
                    <button className="text-blue-600 hover:underline">Ver</button>
                  </td>
                </tr>
                <tr className="border-b hover:bg-blue-50">
                  <td className="py-2 px-4">2</td>
                  <td className="py-2 px-4">Reporte de documentos</td>
                  <td className="py-2 px-4">Documentos</td>
                  <td className="py-2 px-4">87654321</td>
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
