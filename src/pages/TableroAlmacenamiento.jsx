import React, { useState } from 'react';
import { Line, Pie, Doughnut, Bar } from 'react-chartjs-2';


import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend);

export default function TableroAlmacenamiento() {
  // Estado para la tabla de documentos y la opción seleccionada
  const [selectedMetric, setSelectedMetric] = useState('');
  const [documentos, setDocumentos] = useState([
    { nombre: 'Factura_123.pdf', tipo: 'Factura', ext: 'PDF' },
    { nombre: 'Pedimento_456.xml', tipo: 'Pedimento', ext: 'XML' },
    { nombre: 'Manifiesto_789.docx', tipo: 'Manifiesto', ext: 'DOCX' },
  ]);

  // Por ahora solo cambia el estado seleccionado, no fetch
  const handleMetricClick = (metric) => {
    setSelectedMetric(metric);
  };

  // Datos simulados para las nuevas gráficas y KPIs
  const tiposArchivos = [
    { tipo: 'PDF', espacio: 220 },
    { tipo: 'XML', espacio: 120 },
    { tipo: 'DOCX', espacio: 80 },
    { tipo: 'JPG', espacio: 60 },
    { tipo: 'Otros', espacio: 32 },
  ];
  const topArchivos = [
    { nombre: 'Factura_123.pdf', size: 2.5 },
    { nombre: 'Reporte_2024.pdf', size: 2.1 },
    { nombre: 'Pedimento_456.xml', size: 1.8 },
    { nombre: 'Manifiesto_789.docx', size: 1.2 },
    { nombre: 'Imagen_001.jpg', size: 1.0 },
  ];
  const espacioTotal = 1024; // GB
  const espacioOcupado = 512; // GB
  const espacioLibre = espacioTotal - espacioOcupado;
  const usuarios = [
    { nombre: 'Juan', docs: 120 },
    { nombre: 'Ana', docs: 90 },
    { nombre: 'Luis', docs: 70 },
    { nombre: 'Sofía', docs: 60 },
    { nombre: 'Carlos', docs: 40 },
  ];
  const docsEsteMes = 45;
  const docsEliminados = 7;
  const usuariosActivos = 4;
  const porcentajeUsado = Math.round((espacioOcupado / espacioTotal) * 100);

  return (
    <div className="p-6 bg-gray-50 min-h-screen flex flex-col">
      {/* Header animado */}
      <div className="mb-8 animate-fadein-slideup opacity-0" style={{ animation: 'fadein-slideup 0.7s cubic-bezier(0.22,1,0.36,1) 0.05s forwards' }}>
        <div className="max-w-7xl mx-auto relative overflow-hidden rounded-2xl shadow bg-gradient-to-r from-blue-50 via-white to-indigo-50 border border-blue-100 p-8 flex items-center gap-6">
          <div className="flex-shrink-0 bg-blue-100 rounded-full p-4 shadow-md animate-bounce-slow">
            <svg className="h-10 w-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-4xl font-extrabold text-blue-900 tracking-tight mb-1 flex items-center gap-2">
              Uso de Almacenamiento
            </h1>
            <p className="text-lg text-blue-700/80 font-medium">Visualiza y analiza el uso de almacenamiento de la plataforma</p>
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
          <style>{`
            @keyframes bounce-slow {
              0%, 100% { transform: translateY(0); }
              50% { transform: translateY(-8px); }
            }
            .animate-bounce-slow {
              animation: bounce-slow 2.2s infinite;
            }
            @keyframes fadein-slideup {
              0% { opacity: 0; transform: translateY(40px); }
              100% { opacity: 1; transform: translateY(0); }
            }
            .animate-fadein-slideup {
              animation: fadein-slideup 0.7s cubic-bezier(0.22,1,0.36,1) 0.05s forwards;
            }
          `}</style>
        </div>
      </div>

      {/* Filtros */}
      <div className="max-w-7xl mx-auto w-full mb-8 flex flex-col md:flex-row gap-4 animate-fadein-slideup opacity-0" style={{ animation: 'fadein-slideup 0.7s cubic-bezier(0.22,1,0.36,1) 0.12s forwards' }}>
        <select className="border border-gray-300 rounded-lg px-4 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1" defaultValue="">
          <option value="">Organización</option>
          <option value="org1">Organización 1</option>
          <option value="org2">Organización 2</option>
        </select>
        <select className="border border-gray-300 rounded-lg px-4 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1" defaultValue="">
          <option value="">Importador</option>
          <option value="imp1">Importador 1</option>
          <option value="imp2">Importador 2</option>
        </select>
        <input type="date" className="border border-gray-300 rounded-lg px-4 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1" />
        <select className="border border-gray-300 rounded-lg px-4 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1" defaultValue="">
          <option value="">Año</option>
          <option value="2022">2022</option>
          <option value="2023">2023</option>
          <option value="2024">2024</option>
          <option value="2025">2025</option>
        </select>
        <select className="border border-gray-300 rounded-lg px-4 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1" defaultValue="">
          <option value="">Mes</option>
          <option value="01">Enero</option>
          <option value="02">Febrero</option>
          <option value="03">Marzo</option>
          <option value="04">Abril</option>
          <option value="05">Mayo</option>
          <option value="06">Junio</option>
          <option value="07">Julio</option>
          <option value="08">Agosto</option>
          <option value="09">Septiembre</option>
          <option value="10">Octubre</option>
          <option value="11">Noviembre</option>
          <option value="12">Diciembre</option>
        </select>
      </div>

      {/* Cards y KPIs */}
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-6 gap-6 mb-8 animate-fadein-slideup opacity-0" style={{ animation: 'fadein-slideup 0.7s cubic-bezier(0.22,1,0.36,1) 0.18s forwards' }}>
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 flex flex-col items-center shadow hover:scale-105 transition-transform duration-200">
          <span className="text-3xl font-bold text-blue-800 mb-2">1,234</span>
          <span className="text-sm font-semibold text-blue-700">Total de Pedimentos</span>
        </div>
        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-6 flex flex-col items-center shadow hover:scale-105 transition-transform duration-200">
          <span className="text-3xl font-bold text-indigo-800 mb-2">8,765</span>
          <span className="text-sm font-semibold text-indigo-700">Total de Documentos</span>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-xl p-6 flex flex-col items-center shadow hover:scale-105 transition-transform duration-200">
          <span className="text-3xl font-bold text-green-800 mb-2">{espacioOcupado} GB</span>
          <span className="text-sm font-semibold text-green-700">Espacio Utilizado</span>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 flex flex-col items-center shadow hover:scale-105 transition-transform duration-200">
          <span className="text-3xl font-bold text-yellow-800 mb-2">2.5 GB</span>
          <span className="text-sm font-semibold text-yellow-700">Archivo más grande</span>
        </div>
        <div className="bg-pink-50 border border-pink-200 rounded-xl p-6 flex flex-col items-center shadow hover:scale-105 transition-transform duration-200">
          <span className="text-3xl font-bold text-pink-800 mb-2">120 MB</span>
          <span className="text-sm font-semibold text-pink-700">Tamaño promedio</span>
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 flex flex-col items-center shadow hover:scale-105 transition-transform duration-200">
          <span className="text-3xl font-bold text-gray-800 mb-2">{espacioLibre} GB</span>
          <span className="text-sm font-semibold text-gray-700">Espacio Libre</span>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 animate-fadein-slideup opacity-0">
        <div className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col items-center shadow">
          <span className="text-2xl font-bold text-blue-700 mb-1">{porcentajeUsado}%</span>
          <span className="text-xs text-gray-600">% Espacio Usado</span>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col items-center shadow">
          <span className="text-2xl font-bold text-green-700 mb-1">{docsEsteMes}</span>
          <span className="text-xs text-gray-600">Docs subidos este mes</span>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col items-center shadow">
          <span className="text-2xl font-bold text-red-700 mb-1">{docsEliminados}</span>
          <span className="text-xs text-gray-600">Docs eliminados este mes</span>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col items-center shadow">
          <span className="text-2xl font-bold text-indigo-700 mb-1">{usuariosActivos}</span>
          <span className="text-xs text-gray-600">Usuarios activos este mes</span>
        </div>
      </div>

      {/* Gráficas */}
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-3 gap-8 animate-fadein-slideup opacity-0" style={{ animation: 'fadein-slideup 0.7s cubic-bezier(0.22,1,0.36,1) 0.22s forwards' }}>
        {/* Gráfica 1: Espacio utilizado a lo largo del tiempo */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow flex flex-col">
          <h2 className="text-lg font-bold text-blue-800 mb-4">Espacio utilizado a lo largo del tiempo</h2>
          <Line
            data={{
              labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul'],
              datasets: [
                {
                  label: 'Espacio Utilizado (GB)',
                  data: [100, 150, 200, 250, 300, 400, 512],
                  borderColor: '#3b82f6',
                  backgroundColor: 'rgba(59,130,246,0.1)',
                  tension: 0.4,
                  fill: true,
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: {
                legend: { display: true },
                title: { display: false },
              },
              scales: {
                x: { title: { display: true, text: 'Mes' } },
                y: { title: { display: true, text: 'GB' } },
              },
            }}
          />
        </div>
        {/* Gráfica 2: Distribución de tipos de archivo */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow flex flex-col">
          <h2 className="text-lg font-bold text-purple-800 mb-4">Distribución por tipo de archivo</h2>
          <Pie
            data={{
              labels: tiposArchivos.map(t => t.tipo),
              datasets: [
                {
                  data: tiposArchivos.map(t => t.espacio),
                  backgroundColor: ['#3b82f6', '#6366f1', '#f59e42', '#10b981', '#f472b6'],
                },
              ],
            }}
            options={{
              plugins: {
                legend: { display: true, position: 'bottom' },
              },
            }}
          />
        </div>
        {/* Gráfica 3: Espacio ocupado vs libre (donut) */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow flex flex-col">
          <h2 className="text-lg font-bold text-green-800 mb-4">Espacio ocupado vs libre</h2>
          <Doughnut
            data={{
              labels: ['Ocupado', 'Libre'],
              datasets: [
                {
                  data: [espacioOcupado, espacioLibre],
                  backgroundColor: ['#3b82f6', '#d1fae5'],
                },
              ],
            }}
            options={{
              cutout: '70%',
              plugins: {
                legend: { display: true, position: 'bottom' },
              },
            }}
          />
        </div>
      </div>
      {/* Gráficas adicionales */}
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-8 mt-8 animate-fadein-slideup opacity-0">
        {/* Top archivos más grandes */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow flex flex-col">
          <h2 className="text-lg font-bold text-yellow-800 mb-4">Top 5 archivos más grandes</h2>
          <Bar
            data={{
              labels: topArchivos.map(a => a.nombre),
              datasets: [
                {
                  label: 'Tamaño (GB)',
                  data: topArchivos.map(a => a.size),
                  backgroundColor: '#f59e42',
                },
              ],
            }}
            options={{
              indexAxis: 'y',
              plugins: {
                legend: { display: false },
              },
              scales: {
                x: { title: { display: true, text: 'Tamaño (GB)' } },
                y: { title: { display: false } },
              },
            }}
          />
        </div>
        {/* Documentos subidos por usuario */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow flex flex-col">
          <h2 className="text-lg font-bold text-indigo-800 mb-4">Documentos subidos por usuario</h2>
          <Bar
            data={{
              labels: usuarios.map(u => u.nombre),
              datasets: [
                {
                  label: 'Documentos',
                  data: usuarios.map(u => u.docs),
                  backgroundColor: '#6366f1',
                },
              ],
            }}
            options={{
              plugins: {
                legend: { display: false },
              },
              scales: {
                x: { title: { display: false } },
                y: { title: { display: true, text: 'Documentos' } },
              },
            }}
          />
        </div>
      </div>

    </div>
  );
}
