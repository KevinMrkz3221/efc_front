import React, { useEffect, useState } from 'react';
import hljs from 'highlight.js/lib/core';
import xml from 'highlight.js/lib/languages/xml';
import 'highlight.js/styles/github.css';
hljs.registerLanguage('xml', xml);
// import type removed for JSX compatibility
import { fetchPedimentoDocuments } from '../api/pedimentoDocuments';
import { useParams, Link } from 'react-router-dom';
import { useNotification } from '../context/NotificationContext';

const API_URL = import.meta.env.VITE_EFC_API_URL;

const downloadFile = async (id, filename = 'archivo', showMessage) => {
  const token = localStorage.getItem('access');
  const res = await fetch(`${API_URL}/record/documents/descargar/${id}/`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (res.status === 401) {
    showMessage('Tu sesión ha expirado, por favor inicia sesión de nuevo.', 'error');
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    setTimeout(() => {
      window.location.href = '/login';
    }, 2000);
    return;
  }
  if (!res.ok) {
    alert('No autorizado o error en la descarga');
    return;
  }
  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
};

const downloadBulkZip = async (ids, showMessage, pedimentoNombre) => {
  if (!ids.length) {
    showMessage('Selecciona al menos un documento.', 'error');
    return;
  }
  const token = localStorage.getItem('access');
  const res = await fetch(`${API_URL}/record/documents/bulk-download/`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ document_ids: ids, pedimento_nombre: pedimentoNombre }),
  });
  if (res.status === 401) {
    showMessage('Tu sesión ha expirado, por favor inicia sesión de nuevo.', 'error');
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    setTimeout(() => {
      window.location.href = '/login';
    }, 2000);
    return;
  }
  if (!res.ok) {
    showMessage('No autorizado o error en la descarga masiva', 'error');
    return;
  }
  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${pedimentoNombre || 'documentos'}.zip`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
};

export default function PedimentoDetail() {
  // Función para formatear XML (pretty print)
  function formatXml(xml) {
    const PADDING = '  ';
    const reg = /(>)(<)(\/*)/g;
    let formatted = '';
    let pad = 0;
    xml = xml.replace(reg, '$1\r\n$2$3');
    xml.split(/\r?\n/).forEach((node) => {
      let indent = 0;
      if (node.match(/.+<\/\w[^>]*>$/)) {
        indent = 0;
      } else if (node.match(/^<\/\w/)) {
        if (pad !== 0) pad -= 1;
      } else if (node.match(/^<\w[^>]*[^\/]>/)) {
        indent = 1;
      }
      formatted += PADDING.repeat(pad) + node + '\r\n';
      pad += indent;
    });
    return formatted.trim();
  }
  // Helper para obtener el nombre legible del tipo de documento
  const getDocumentTypeName = (type) => {
    const found = documentTypeOptions.find(opt => String(opt.value) === String(type));
    return found ? found.label : 'Documento';
  };
  // Estado para modal de preview
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const [previewType, setPreviewType] = useState('');
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState('');
  const [previewXml, setPreviewXml] = useState('');
  const [previewXmlHtml, setPreviewXmlHtml] = useState('');
  // Filtros y ordenamiento
  const [fileNameFilter, setFileNameFilter] = useState('');
  const [extensionFilter, setExtensionFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [orderBy, setOrderBy] = useState('');
  const [orderDir, setOrderDir] = useState('asc');
  const { id } = useParams();
  const [pedimento, setPedimento] = useState(null);
  const [docsLoading, setDocsLoading] = useState(true);
  const [docsError, setDocsError] = useState('');
const [documents, setDocuments] = useState([]);
  const [docsCount, setDocsCount] = useState(0);
const [docsNext, setDocsNext] = useState(null);
const [docsPrev, setDocsPrev] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState([]);
  const [downloading, setDownloading] = useState(false);
  const [documentTypeFilter, setDocumentTypeFilter] = useState('');
  const documentTypeOptions = [
    { value: '', label: 'Todos' },
    { value: 1, label: 'Pedimento Partida' },
    { value: 2, label: 'Pedimento Completo' },
    { value: 3, label: 'Pedimento Remesas' },
    { value: 4, label: 'Pedimento Acuse' },
    { value: 5, label: 'Pedimento EDocument' },
    { value: 6, label: 'Estado Pedimento' },
  ];
  const { showMessage } = useNotification();

  useEffect(() => {
    const token = localStorage.getItem('access');
    fetch(`${API_URL}/customs/pedimentos/${id}/`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then(res => {
        if (res.status === 401) {
          localStorage.removeItem('access');
          localStorage.removeItem('refresh');
          showMessage('Tu sesión ha expirado, por favor inicia sesión de nuevo.', 'error');
          setTimeout(() => {
            window.location.href = '/login';
          }, 2000);
          return null;
        }
        if (!res.ok) throw new Error('No autorizado o error en la petición');
        return res.json();
      })
      .then(data => {
        setPedimento(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [id, showMessage]);

  // Fetch paginated documents
  useEffect(() => {
    if (!id) return;
    const token = localStorage.getItem('access');
    setDocsLoading(true);
    setDocsError('');
    fetchPedimentoDocuments(token, id, page, pageSize)
      .then((data) => {
        setDocuments(data.results);
        setDocsCount(data.count);
        setDocsNext(data.next);
        setDocsPrev(data.previous);
        setDocsLoading(false);
      })
      .catch(err => {
        if (err.message === 'SESSION_EXPIRED') {
          localStorage.removeItem('access');
          localStorage.removeItem('refresh');
          showMessage('Tu sesión ha expirado, por favor inicia sesión de nuevo.', 'error');
          setTimeout(() => {
            window.location.href = '/login';
          }, 2000);
        } else {
          setDocsError(err.message);
        }
        setDocsLoading(false);
      });
  }, [id, page, pageSize, showMessage]);

  if (loading) return (
    <div className="h-full bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <svg className="animate-spin h-12 w-12 text-navy-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="text-gray-600 text-lg">Cargando detalle de pedimento...</p>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="h-full bg-gray-50 flex items-center justify-center">
      <div className="bg-danger-50 border border-danger-200 rounded-xl p-6 max-w-md shadow-lg">
        <div className="flex items-center">
          <svg className="h-6 w-6 text-danger-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <p className="text-danger-800 font-medium">{error}</p>
        </div>
      </div>
    </div>
  );
  if (!pedimento) return null;

  const allDocIds = documents.map(doc => doc.id);
  const allSelected = selected.length === allDocIds.length && allDocIds.length > 0;

  const handleSelect = (id) => {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleSelectAll = () => {
    if (allSelected) setSelected([]);
    else setSelected(allDocIds);
  };

  const handleBulkDownload = async (ids) => {
    setDownloading(true);
    await downloadBulkZip(ids, showMessage, pedimento?.pedimento);
    setDownloading(false);
  };

  // Vista previa de documento
  const handlePreview = async (doc) => {
    setPreviewLoading(true);
    setPreviewError('');
    setPreviewUrl('');
    setPreviewType('');
    setPreviewXml('');
    setPreviewOpen(true);
    try {
      const token = localStorage.getItem('access');
      const res = await fetch(`${API_URL}/record/documents/descargar/${doc.id}/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (res.status === 401) {
        setPreviewError('Tu sesión ha expirado, por favor inicia sesión de nuevo.');
        setPreviewLoading(false);
        return;
      }
      if (!res.ok) {
        setPreviewError('No autorizado o error en la descarga');
        setPreviewLoading(false);
        return;
      }
      // Detectar tipo de archivo
      let type = '';
      if (doc.extension) {
        if (doc.extension.toLowerCase() === 'pdf') type = 'pdf';
        else if (["jpg","jpeg","png","gif","bmp","webp"].includes(doc.extension.toLowerCase())) type = 'img';
        else if (doc.extension.toLowerCase() === 'xml') type = 'xml';
        else type = 'other';
      }
      setPreviewType(type);
      if (type === 'xml') {
        const text = await res.text();
        const prettyText = formatXml(text);
        setPreviewXml(prettyText);
        // Formatear y resaltar XML
        try {
          const highlighted = hljs.highlight(prettyText, { language: 'xml' }).value;
          setPreviewXmlHtml(highlighted);
        } catch (e) {
          setPreviewXmlHtml(prettyText);
        }
        setPreviewLoading(false);
      } else {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        setPreviewUrl(url);
        setPreviewLoading(false);
      }
    } catch (err) {
      setPreviewError('Error al obtener el archivo');
      setPreviewLoading(false);
    }
  };

  // Cerrar modal y limpiar blob
  const handleClosePreview = () => {
    setPreviewOpen(false);
    if (previewUrl) window.URL.revokeObjectURL(previewUrl);
    setPreviewUrl('');
    setPreviewType('');
    setPreviewError('');
    setPreviewXml('');
    setPreviewXmlHtml('');
  };

  return (
    <div className="p-6 bg-gray-50 h-full flex flex-col">
      {/* Modal de vista previa resizable */}
      {previewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div
            className="bg-white rounded-xl shadow-2xl resize overflow-auto relative flex flex-col border border-blue-200"
            style={{ minWidth: '350px', minHeight: '300px', maxWidth: '600px', maxHeight: '90vh', width: '500px', height: '80vh', display: 'flex', flexDirection: 'column' }}
          >
            {/* Header mejorado del modal */}
            <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-200 rounded-t-xl">
              <div className="flex items-center gap-3">
                <div className="bg-blue-200 rounded-full p-2 flex items-center justify-center">
                  <svg className="h-6 w-6 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-extrabold text-blue-900 tracking-tight">Vista previa de documento</h3>
              </div>
              <button
                onClick={handleClosePreview}
                className="ml-2 text-blue-600 hover:text-blue-800 bg-blue-100 hover:bg-blue-200 rounded-full p-2 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                title="Cerrar"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            {/* Contenido del modal */}
            <div className="flex-1 flex flex-col">
              {previewLoading ? (
                <div className="text-center py-8 text-gray-500 flex-1 flex items-center justify-center">Cargando documento...</div>
              ) : previewError ? (
                <div className="text-center py-8 text-danger-600 flex-1 flex items-center justify-center">{previewError}</div>
              ) : previewType === 'pdf' ? (
                <iframe src={previewUrl} title="PDF Preview" className="border rounded flex-1" style={{ width: '100%', height: '100%' }} />
              ) : previewType === 'img' ? (
                <img src={previewUrl} alt="Vista previa" className="max-w-full max-h-full mx-auto flex-1" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              ) : previewType === 'xml' ? (
                <div className="bg-white border rounded p-0 overflow-auto flex-1" style={{ fontFamily: 'Fira Mono, monospace', fontSize: '13px', width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <div className="bg-gray-100 px-3 py-2 text-xs text-gray-800 border-b border-gray-200 flex items-center justify-between" style={{ flexShrink: 0 }}>
                    <span>Vista XML</span>
                    <button
                      className="text-xs text-blue-600 hover:text-blue-800 px-2 py-1 rounded border border-blue-300 bg-blue-100"
                      onClick={() => {
                        navigator.clipboard.writeText(previewXml);
                      }}
                    >Copiar</button>
                  </div>
                  <pre
                    className="hljs language-xml p-4 text-xs text-gray-900 flex-1"
                    style={{
                      background: 'white',
                      margin: 0,
                      overflow: 'auto',
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-all',
                      width: '100%',
                      height: '100%'
                    }}
                    dangerouslySetInnerHTML={{ __html: previewXmlHtml }}
                  />
                </div>
              ) : previewUrl ? (
                <a href={previewUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Descargar archivo</a>
              ) : null}
            </div>
          </div>
        </div>
      )}
      {/* Header mejorado */}
      <div className="mb-8 bg-white rounded-lg shadow-sm p-8 flex-shrink-0 border-b-4 border-blue-600">
      <Link 
        to="/documents"
        className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-200 mb-6"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
        </svg>
        <span className="font-semibold text-base">Volver a la lista</span>
      </Link>
      <h1 className="text-4xl font-extrabold text-blue-900 tracking-tight mb-2">Detalle de Pedimento</h1>
      <div className="h-1 w-16 bg-blue-600 rounded mb-4"></div>
      <p className="text-lg text-gray-700 font-medium">Información completa del pedimento y documentos asociados</p>
      </div>

      {/* Contenido scrolleable */}
      <div className="flex-1 ">
        <div className="max-w-7xl mx-auto">

        {/* Información del Pedimento */}
        <div className="bg-white shadow-lg rounded-xl border border-gray-200 mb-8">
          <div className="px-8 py-6 border-b border-gray-200 flex items-center gap-4">
            <h2 className="text-2xl font-extrabold text-blue-800 tracking-tight">Información General</h2>
            <div className="h-1 w-10 bg-blue-400 rounded"></div>
          </div>
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 shadow-sm">
                <dt className="text-sm font-semibold text-gray-700 mb-2">Pedimento</dt>
                <dd className="text-2xl font-bold text-gray-900">{pedimento.pedimento}</dd>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 shadow-sm">
                <dt className="text-sm font-semibold text-gray-700 mb-2">Contribuyente</dt>
                <dd className="text-2xl font-bold text-gray-900">{pedimento.contribuyente}</dd>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 shadow-sm">
                <dt className="text-sm font-semibold text-gray-700 mb-2">Fecha de Pago</dt>
                <dd className="text-2xl font-bold text-gray-900">{pedimento.fechapago}</dd>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 shadow-sm">
                <dt className="text-sm font-semibold text-gray-700 mb-2">Importe Total</dt>
                <dd className="text-2xl font-bold text-gray-900">${pedimento.importe_total || 'N/A'}</dd>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 shadow-sm">
                <dt className="text-sm font-semibold text-gray-700 mb-2">Saldo Disponible</dt>
                <dd className="text-2xl font-bold text-gray-900">${pedimento.saldo_disponible || 'N/A'}</dd>
              </div>
              
              <div className={`p-6 rounded-xl border shadow-sm ${pedimento.existe_expediente 
                ? 'bg-green-50 border-green-200' 
                : 'bg-red-50 border-red-200'
              }`}>
                <dt className={`text-sm font-semibold mb-2 ${pedimento.existe_expediente ? 'text-green-700' : 'text-red-700'}`}>
                  Expediente
                </dt>
                <dd className={`text-2xl font-bold flex items-center ${pedimento.existe_expediente ? 'text-green-900' : 'text-red-900'}`}>
                  <svg className={`w-6 h-6 mr-2 ${pedimento.existe_expediente ? 'text-green-600' : 'text-red-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {pedimento.existe_expediente ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    )}
                  </svg>
                  {pedimento.existe_expediente ? 'Disponible' : 'No disponible'}
                </dd>
              </div>
            </div>
          </div>
        </div>

      {/* Sección de Documentos */}
      <div className="bg-white shadow-lg rounded-xl border border-gray-200">
        <div className="px-8 py-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-extrabold text-blue-800 tracking-tight mb-1">
                Documentos Relacionados
              </h2>
              <div className="h-1 w-10 bg-blue-400 rounded mb-2"></div>
              <div className="flex items-center mt-1">
                <span className="text-sm text-gray-600 bg-blue-50 px-3 py-1 rounded-full font-semibold">
                  📄 {docsCount} documentos
                </span>
              </div>
              {/* Filtro de tipo de documento */}
              <div className="mt-4">
                {/* Filtros avanzados */}
                <div className="mb-4 flex flex-wrap gap-4 items-end">
                  {/* Archivo */}
                  <div className="flex flex-col">
                    <label className="text-xs font-semibold text-gray-700 mb-1">Archivo</label>
                    <input
                      type="text"
                      value={fileNameFilter}
                      onChange={e => setFileNameFilter(e.target.value)}
                      placeholder="Buscar archivo..."
                      className="w-44 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                    />
                  </div>
                  {/* Extensión */}
                  <div className="flex flex-col">
                    <label className="text-xs font-semibold text-gray-700 mb-1">Extensión</label>
                    <select
                      value={extensionFilter}
                      onChange={e => setExtensionFilter(e.target.value)}
                      className="w-32 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                    >
                      <option value="">Todas</option>
                      {[...new Set(documents.map(d => d.extension).filter(Boolean))].map(ext => (
                        <option key={ext} value={ext}>{ext}</option>
                      ))}
                    </select>
                  </div>
                  {/* Fecha */}
                  <div className="flex flex-col">
                    <label className="text-xs font-semibold text-gray-700 mb-1">Fecha</label>
                    <input
                      type="date"
                      value={dateFilter}
                      onChange={e => setDateFilter(e.target.value)}
                      className="w-36 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                    />
                  </div>
                </div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Tipo de documento</label>
                <select
                  value={documentTypeFilter}
                  onChange={e => setDocumentTypeFilter(e.target.value)}
                  className="w-64 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                >
                  {documentTypeOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>
            {allDocIds.length > 0 && (
              <div className="flex space-x-3">
                <button 
                  onClick={() => handleBulkDownload(allDocIds)} 
                  disabled={downloading}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-105 shadow-lg"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  {downloading ? 'Descargando...' : 'Descargar todos'}
                </button>
                
                <button 
                  onClick={() => handleBulkDownload(selected)} 
                  disabled={selected.length === 0 || downloading}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 transform hover:scale-105 shadow-lg"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Descargar seleccionados ({selected.length})
                </button>
              </div>
            )}
          </div>
        </div>
          {/* Paginación y estado de carga/error */}
          <div className="px-6 pb-4 flex items-center justify-between">
            <div>
              <button
                className="px-3 py-1 mr-2 rounded bg-gray-200 text-gray-700 disabled:opacity-50"
                disabled={page === 1 || docsLoading}
                onClick={() => setPage(page - 1)}
              >Anterior</button>
              <button
                className="px-3 py-1 rounded bg-gray-200 text-gray-700 disabled:opacity-50"
                disabled={!docsNext || docsLoading}
                onClick={() => setPage(page + 1)}
              >Siguiente</button>
              <span className="ml-4 text-sm text-gray-500">Página {page}</span>
            </div>
            <div>
              <label className="mr-2 text-sm text-gray-700">Tamaño de página:</label>
              <select
                value={pageSize}
                onChange={e => { setPageSize(Number(e.target.value)); setPage(1); }}
                className="border rounded px-2 py-1 text-sm"
                disabled={docsLoading}
              >
                {[10, 20, 50, 100, 200, 500, 1000].map(size => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="overflow-hidden">
            {docsLoading ? (
              <div className="text-center py-8 text-gray-500">Cargando documentos...</div>
            ) : docsError ? (
              <div className="text-center py-8 text-danger-600">Error: {docsError}</div>
            ) : documents.length > 0 ? (
              <>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 rounded-lg overflow-hidden">
                    <thead className="bg-gray-50 sticky top-0 z-20">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          <input 
                            type="checkbox" 
                            checked={allSelected} 
                            onChange={handleSelectAll}
                            className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none" onClick={() => {
                          setOrderBy('archivo');
                          setOrderDir(orderBy === 'archivo' && orderDir === 'asc' ? 'desc' : 'asc');
                        }}>
                          Archivo {orderBy === 'archivo' && (<span className="ml-1">{orderDir === 'asc' ? '▲' : '▼'}</span>)}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none" onClick={() => {
                          setOrderBy('document_type');
                          setOrderDir(orderBy === 'document_type' && orderDir === 'asc' ? 'desc' : 'asc');
                        }}>
                          Tipo {orderBy === 'document_type' && (<span className="ml-1">{orderDir === 'asc' ? '▲' : '▼'}</span>)}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none" onClick={() => {
                          setOrderBy('extension');
                          setOrderDir(orderBy === 'extension' && orderDir === 'asc' ? 'desc' : 'asc');
                        }}>
                          Extensión {orderBy === 'extension' && (<span className="ml-1">{orderDir === 'asc' ? '▲' : '▼'}</span>)}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none" onClick={() => {
                          setOrderBy('size');
                          setOrderDir(orderBy === 'size' && orderDir === 'asc' ? 'desc' : 'asc');
                        }}>
                          Tamaño {orderBy === 'size' && (<span className="ml-1">{orderDir === 'asc' ? '▲' : '▼'}</span>)}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none" onClick={() => {
                          setOrderBy('created_at');
                          setOrderDir(orderBy === 'created_at' && orderDir === 'asc' ? 'desc' : 'asc');
                        }}>
                          Fecha {orderBy === 'created_at' && (<span className="ml-1">{orderDir === 'asc' ? '▲' : '▼'}</span>)}
                        </th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Acción</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {documents
                        // Filtro por tipo de documento
                        .filter(doc => {
                          if (!documentTypeFilter) return true;
                          return String(doc.document_type) === String(documentTypeFilter);
                        })
                        // Filtro por nombre de archivo
                        .filter(doc => {
                          if (!fileNameFilter) return true;
                          const fileName = doc.archivo ? doc.archivo.split('/').pop().toLowerCase() : '';
                          return fileName.includes(fileNameFilter.toLowerCase());
                        })
                        // Filtro por extensión
                        .filter(doc => {
                          if (!extensionFilter) return true;
                          return doc.extension === extensionFilter;
                        })
                        // Filtro por fecha
                        .filter(doc => {
                          if (!dateFilter) return true;
                          if (!doc.created_at) return false;
                          const docDate = new Date(doc.created_at).toISOString().slice(0, 10);
                          return docDate === dateFilter;
                        })
                        // Ordenamiento
                        .sort((a, b) => {
                          if (!orderBy) return 0;
                          let aVal = a[orderBy];
                          let bVal = b[orderBy];
                          // Para archivo, usar solo el nombre
                          if (orderBy === 'archivo') {
                            aVal = a.archivo ? a.archivo.split('/').pop().toLowerCase() : '';
                            bVal = b.archivo ? b.archivo.split('/').pop().toLowerCase() : '';
                          }
                          // Para fecha, convertir a Date
                          if (orderBy === 'created_at') {
                            aVal = a.created_at ? new Date(a.created_at) : new Date(0);
                            bVal = b.created_at ? new Date(b.created_at) : new Date(0);
                          }
                          // Para tamaño, convertir a número
                          if (orderBy === 'size') {
                            aVal = Number(a.size) || 0;
                            bVal = Number(b.size) || 0;
                          }
                          // Para document_type, convertir a número
                          if (orderBy === 'document_type') {
                            aVal = Number(a.document_type) || 0;
                            bVal = Number(b.document_type) || 0;
                          }
                          if (aVal < bVal) return orderDir === 'asc' ? -1 : 1;
                          if (aVal > bVal) return orderDir === 'asc' ? 1 : -1;
                          return 0;
                        })
                        .map((doc, index) => (
                          <tr key={doc.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <input 
                                type="checkbox" 
                                checked={selected.includes(doc.id)} 
                                onChange={() => handleSelect(doc.id)}
                                className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 max-w-xs">
                              <span className="truncate font-medium" title={doc.archivo || 'Sin nombre'}>
                                {doc.archivo ? doc.archivo.split('/').pop() : 'Sin nombre'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                {getDocumentTypeName(doc.document_type)}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {doc.extension || 'N/A'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                              {doc.size || 'N/A'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                              {doc.created_at ? new Date(doc.created_at).toLocaleDateString('es-ES', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              }) : 'N/A'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-center">
                              <div className="flex justify-center space-x-2">
                                <button 
                                  onClick={() => handlePreview(doc)}
                                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                                  title="Vista previa"
                                >
                                  <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                  </svg>
                                  Preview
                                </button>
                                <button 
                                  onClick={() => downloadFile(doc.id, doc.archivo ? doc.archivo.split('/').pop() : `documento_${doc.id}`, showMessage)}
                                  className="inline-flex items-center px-3 py-1.5 border border-blue-300 shadow-sm text-xs font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                                  title="Descargar"
                                >
                                  <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                  </svg>
                                  Descargar
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>

              </>
            ) : (
              <div className="text-center py-16">
                <div className="mx-auto h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Sin documentos</h3>
                <p className="text-gray-500">No hay documentos relacionados con este pedimento.</p>
              </div>
            )}
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
