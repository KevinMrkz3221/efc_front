import React, { useEffect, useState } from 'react';
import { fetchUsers, createUser, updateUser, deleteUser } from '../api/users.ts';
import { useNotification } from '../context/NotificationContext';

const initialForm = {
  username: '',
  email: '',
  first_name: '',
  last_name: '',
  password: '',
};

export default function Users() {
  // Inyectar animaciones solo una vez en el cliente
  useEffect(() => {
    if (typeof window !== 'undefined' && !document.getElementById('users-animations')) {
      const style = document.createElement('style');
      style.id = 'users-animations';
      style.innerHTML = `
        @keyframes fadeInUpUsers {
          0% { opacity: 0; transform: translateY(32px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .fade-in-up-users { animation: fadeInUpUsers 0.7s cubic-bezier(0.22, 1, 0.36, 1) both; }
      `;
      document.head.appendChild(style);
    }
  }, []);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createType, setCreateType] = useState('agente'); // 'agente' o 'importador'
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // all, active, inactive, admin
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const { showMessage } = useNotification();

  const token = localStorage.getItem('access');

  const loadUsers = () => {
    setLoading(true);
    fetchUsers(token)
      .then(data => {
        setUsers(data);
        setLoading(false);
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
          setError(err.message);
        }
        setLoading(false);
      });
  };

  useEffect(() => {
    // Si no hay token, limpiar y redirigir a login inmediatamente
    if (!token) {
      localStorage.removeItem('access');
      localStorage.removeItem('refresh');
      localStorage.removeItem('username');
      localStorage.removeItem('user_email');
      localStorage.removeItem('user_id');
      localStorage.removeItem('user_groups');
      localStorage.removeItem('user_first_name');
      localStorage.removeItem('user_last_name');
      localStorage.removeItem('user_is_importador');
      window.location.href = '/login';
      return;
    }

    loadUsers();
    // Siempre sincroniza la información del usuario autenticado en localStorage
    fetch(`${import.meta.env.VITE_EFC_API_URL}/user/users/me/`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(async res => {
        if (!res.ok) {
          // Token inválido o expirado, limpiar localStorage y redirigir a login
          console.log('Token inválido o expirado');
          localStorage.removeItem('access');
          localStorage.removeItem('refresh');
          localStorage.removeItem('username');
          localStorage.removeItem('user_email');
          localStorage.removeItem('user_id');
          localStorage.removeItem('user_groups');
          localStorage.removeItem('user_first_name');
          localStorage.removeItem('user_last_name');
          localStorage.removeItem('user_is_importador');
          window.location.href = '/login';
          return null;
        }
        return res.json();
      })
      .then(data => {
        console.log('Respuesta de /api/users/me/:', data);
        if (data && data.username) {
          localStorage.setItem('username', data.username);
          if (data.email) localStorage.setItem('user_email', data.email);
          if (data.id) localStorage.setItem('user_id', String(data.id));
          if (data.groups) localStorage.setItem('user_groups', JSON.stringify(data.groups));
          if (data.first_name) localStorage.setItem('user_first_name', data.first_name);
          if (data.last_name) localStorage.setItem('user_last_name', data.last_name);
          if (typeof data.is_importador !== 'undefined') localStorage.setItem('user_is_importador', String(data.is_importador));
          console.log('Guardado en localStorage: username', data.username);
        } else {
          console.log('No se encontró username en la respuesta');
        }
      })
      .catch((err) => { console.log('Error en fetch /api/users/me/', err); });
    // eslint-disable-next-line
  }, [showMessage]);

  // Debounce para el término de búsqueda
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // (Eliminado duplicado de handleSubmit, ahora solo existe la versión unificada más abajo)
  // Submit para crear usuario (agente o importador)
  const handleSubmit = async e => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingId) {
        await updateUser(token, editingId, form);
        showMessage('Usuario actualizado exitosamente', 'success');
        setShowEditModal(false);
      } else {
        const groups = createType === 'importador' ? [3, 5] : [4, 3];
        const extra = createType === 'importador' ? { is_importador: true } : {};
        await createUser(token, { ...form, groups, ...extra });
        showMessage(createType === 'importador' ? 'Importador creado exitosamente' : 'Usuario creado exitosamente', 'success');
        setShowCreateModal(false);
      }
      setForm(initialForm);
      setEditingId(null);
      loadUsers();
    } catch (err) {
      showMessage(err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!userToDelete) return;
    setSubmitting(true);
    try {
      await deleteUser(token, userToDelete.id);
      showMessage('Usuario eliminado exitosamente', 'success');
      setShowDeleteModal(false);
      setUserToDelete(null);
      loadUsers();
    } catch (err) {
      showMessage(err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    setForm(initialForm);
    setEditingId(null);
    setShowCreateModal(false);
    setShowEditModal(false);
    setShowDeleteModal(false);
    setUserToDelete(null);
  };

  // Función para normalizar texto (quitar acentos y espacios extra)
  const normalizeText = (text) => {
    if (!text) return '';
    return text
      .toString()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // Quitar acentos
      .replace(/\s+/g, ' ') // Espacios múltiples a uno solo
      .trim();
  };

  // Función mejorada para filtrar usuarios
  const filteredUsers = users.filter(user => {
    // Filtro por término de búsqueda
    let matchesSearch = true;
    if (debouncedSearchTerm.trim()) {
      const searchWords = debouncedSearchTerm.trim().split(/\s+/);
      const userSearchableText = normalizeText(`
        ${user.username} 
        ${user.email} 
        ${user.first_name || ''} 
        ${user.last_name || ''} 
        ${user.first_name && user.last_name ? `${user.first_name} ${user.last_name}` : ''} 
        ${user.is_staff || user.is_superuser ? 'admin administrador staff superuser' : 'usuario user'}
        ${user.is_active !== false ? 'activo active' : 'inactivo inactive'}
      `);

      matchesSearch = searchWords.every(word =>
        userSearchableText.includes(normalizeText(word))
      );
    }

    // Filtro por estado
    let matchesStatus = true;
    switch (statusFilter) {
      case 'active':
        matchesStatus = user.is_active !== false;
        break;
      case 'inactive':
        matchesStatus = user.is_active === false;
        break;
      case 'admin':
        matchesStatus = Array.isArray(user.groups) && user.groups.includes(1) && user.groups.includes(3) && user.groups.includes(4);
        break;
      case 'user':
        matchesStatus = !user.is_staff && !user.is_superuser;
        break;
      case 'importador':
        matchesStatus = (Array.isArray(user.groups) && user.groups.includes(3) && user.groups.includes(6)) || user.is_importador === true;
        break;
      default:
        matchesStatus = true;
    }

    return matchesSearch && matchesStatus;
  });

  // Cálculos de paginación
  const totalUsers = filteredUsers.length;
  const totalPages = Math.ceil(totalUsers / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUsers = filteredUsers.slice(startIndex, endIndex);

  // Reset página cuando cambia el filtro
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm, statusFilter]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset a la primera página
  };

  // Función para resaltar términos de búsqueda
  const highlightText = (text, searchTerm) => {
    if (!searchTerm.trim() || !text) return text;

    const words = searchTerm.trim().split(/\s+/);
    let highlightedText = String(text);

    words.forEach(word => {
      if (word.length > 1) { // Solo resaltar palabras de más de 1 carácter
        const regex = new RegExp(`(${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
        highlightedText = highlightedText.replace(regex, '<mark class="bg-yellow-200 px-1 rounded text-yellow-900">$1</mark>');
      }
    });

    return highlightedText;
  };

  // Función para obtener el badge de estado
  const getStatusBadge = () => {
    return 'bg-green-100 text-green-800';
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error al cargar usuarios</h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Cuenta de usuarios verificados y activos
  const verifiedCount = users.filter(u => u.is_verified === true).length;
  const activeCount = users.filter(u => u.is_active === true).length;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header Mejorado */}
      <div className="mb-8 relative overflow-hidden rounded-2xl shadow bg-gradient-to-r from-blue-50 via-white to-indigo-50 border border-blue-100 p-8 flex items-center gap-6">
        <div className="flex-shrink-0 bg-blue-100 rounded-full p-4 shadow-md animate-bounce-slow">
          <svg className="h-10 w-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <div>
          <h1 className="text-4xl font-extrabold text-blue-900 tracking-tight mb-1 flex items-center gap-2">
            Usuarios
            <span className="inline-block bg-blue-200 text-blue-800 text-xs font-semibold px-2 py-0.5 rounded-full ml-2 animate-fade-in">{users.length}</span>
            <span className="inline-block bg-lime-200 text-lime-800 text-xs font-semibold px-2 py-0.5 rounded-full ml-2 animate-fade-in" title="Usuarios activos">
              Activos: {activeCount}
            </span>
          </h1>
          <p className="text-lg text-blue-700/80 font-medium">Gestiona y supervisa los usuarios registrados en el sistema.</p>
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
        @keyframes fade-in {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
          animation: fade-in 0.7s ease;
        }
      `}</style>

      {/* Stats Cards con animación */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white overflow-hidden shadow rounded-lg fade-in-up-users transition-all duration-500 hover:scale-105 hover:shadow-2xl cursor-pointer">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Usuarios</dt>
                  <dd className="text-lg font-medium text-gray-900">{users.length}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg fade-in-up-users transition-all duration-500 hover:scale-105 hover:shadow-2xl cursor-pointer" style={{ animationDelay: '0.08s' }}>
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Activos</dt>
                  <dd className="text-lg font-medium text-gray-900">{activeCount}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg fade-in-up-users transition-all duration-500 hover:scale-105 hover:shadow-2xl cursor-pointer" style={{ animationDelay: '0.16s' }}>
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Con Perfil Completo</dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {users.filter(u => u.first_name && u.last_name).length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg fade-in-up-users transition-all duration-500 hover:scale-105 hover:shadow-2xl cursor-pointer" style={{ animationDelay: '0.24s' }}>
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Última Semana</dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {users.filter(u => u.id % 3 === 0).length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Actions */}
      <div className="bg-white shadow rounded-lg mb-6">
        <div className="px-6 py-4 border-b border-gray-200">
          {/* Barra de búsqueda principal */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
            <div className="flex-1 min-w-0 max-w-md">
              <div className="relative bg-gray-50 rounded-lg border border-gray-200 shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white block w-full pl-10 pr-10 py-3 sm:text-sm border-0 bg-transparent rounded-lg placeholder-gray-500 transition-all duration-200"
                  placeholder="Buscar por nombre, email, estado..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  title="Busca por: nombre de usuario, email, nombre completo, estado (activo, inactivo, admin)"
                />
                {searchTerm && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <button
                      onClick={() => setSearchTerm('')}
                      className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-200"
                      title="Limpiar búsqueda"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className="mt-4 sm:mt-0 sm:ml-4 flex gap-2">
              <button
                onClick={() => { setShowCreateModal(true); setCreateType('agente'); }}
                type="button"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-105"
              >
                <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Nuevo Agente
              </button>
              <button
                onClick={() => { setShowCreateModal(true); setCreateType('importador'); }}
                type="button"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 transform hover:scale-105"
              >
                <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Nuevo Importador
              </button>
            </div>
            {/* Modal para crear usuario (agente o importador) eliminado */}
          </div>

          {/* Filtros avanzados */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-700">Filtrar por:</span>
                <div className="flex flex-wrap gap-2">
                  {[
                    { key: 'all', label: 'Todos', count: users.length },
                    { key: 'agente', label: 'Agente Aduanal', count: users.filter(u => Array.isArray(u.groups) ? u.groups.includes(3) && u.groups.includes(4) : false).length },
                    { key: 'importador', label: 'Importador', count: users.filter(u => (Array.isArray(u.groups) && u.groups.includes(3) && u.groups.includes(6)) || u.is_importador === true).length },
                    { key: 'admin', label: 'Administrador', count: users.filter(u => Array.isArray(u.groups) ? u.groups.includes(1) && u.groups.includes(3) && u.groups.includes(4) : false).length },
                    { key: 'developer', label: 'Developer', count: users.filter(u => Array.isArray(u.groups) ? u.groups.includes(2) && u.groups.includes(3) && u.groups.includes(4) : false).length },
                    { key: 'inactive', label: 'Inactivos', count: users.filter(u => u.is_active === false).length }
                  ].map(filter => (
                    <button
                      key={filter.key}
                      onClick={() => setStatusFilter(filter.key)}
                      className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${statusFilter === filter.key
                        ? 'bg-blue-100 text-blue-800 border-2 border-blue-300 shadow-sm'
                        : 'bg-white text-gray-700 border-2 border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                        }`}
                    >
                      {filter.label}
                      <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-xs font-semibold ${statusFilter === filter.key ? 'bg-blue-200 text-blue-900' : 'bg-gray-200 text-gray-600'
                        }`}>
                        {filter.count}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Información de resultados */}
          {(debouncedSearchTerm || statusFilter !== 'all') && (
            <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg px-4 py-3">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2 text-blue-700">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>
                    Mostrando <strong>{totalUsers}</strong> de <strong>{users.length}</strong> usuarios
                    {debouncedSearchTerm && (
                      <span className="ml-1">
                        para <strong>"{debouncedSearchTerm}"</strong>
                      </span>
                    )}
                  </span>
                </div>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('all');
                  }}
                  className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Limpiar filtros
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Table con animación y layout SPA fijo */}
        <div className="overflow-hidden">
          <div style={{ minHeight: 'calc(8 * 56px)', maxHeight: 'calc(8 * 56px)', overflowY: 'auto', position: 'relative' }}>
            <table className="min-w-full divide-y divide-gray-200 rounded-lg overflow-hidden">
              <thead className="bg-gray-50 sticky top-0 z-20">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuario</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre Completo</th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200" style={{ position: 'relative', minHeight: 'calc(8 * 56px)' }}>
                {/* Loader/Error/Empty state dentro del área de la tabla, sin cambiar el layout */}
                {loading ? (
                  <tr>
                    <td colSpan={5} style={{ height: 'calc(8 * 56px)', padding: 0 }}>
                      <div className="flex items-center justify-center h-full w-full absolute left-0 top-0" style={{ minHeight: 'calc(8 * 56px)', background: 'rgba(255,255,255,0.7)', zIndex: 10 }}>
                        <span className="text-gray-500 text-lg">Cargando usuarios...</span>
                      </div>
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={5} style={{ height: 'calc(8 * 56px)', padding: 0 }}>
                      <div className="flex items-center justify-center h-full w-full absolute left-0 top-0" style={{ minHeight: 'calc(8 * 56px)', background: 'rgba(255,255,255,0.7)', zIndex: 10 }}>
                        <span className="text-danger-600 text-lg">Error: {error}</span>
                      </div>
                    </td>
                  </tr>
                ) : currentUsers.length > 0 ? (
                  <>
                    {currentUsers.map((user, idx) => (
                      <tr
                        key={user.id}
                        className={
                          `transition-all duration-300 hover:scale-[1.025] hover:shadow-lg hover:bg-blue-50 fade-in-up-users` +
                          (idx % 2 === 0 ? ' bg-white' : ' bg-gray-50')
                        }
                        style={{ animationDelay: `${0.05 * idx}s` }}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              {user.profile_picture ? (
                                <img
                                  className="h-10 w-10 rounded-full object-cover"
                                  src={user.profile_picture}
                                  alt="Avatar"
                                />
                              ) : (
                                <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                  <svg className="h-6 w-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                  </svg>
                                </div>
                              )}
                            </div>
                            <div className="ml-4">
                              <div
                                className="text-sm font-medium text-gray-900"
                                dangerouslySetInnerHTML={{
                                  __html: highlightText(user.username, debouncedSearchTerm)
                                }}
                              />
                              <div className="text-sm text-gray-500">ID: {user.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div
                            dangerouslySetInnerHTML={{
                              __html: highlightText(user.email, debouncedSearchTerm)
                            }}
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-wrap gap-1">
                            {user.is_active !== false ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                Activo
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                                Inactivo
                              </span>
                            )}
                            {(user.is_staff || user.is_superuser) && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M9.504 1.132a1 1 0 01.992 0l1.75 1a1 1 0 11-.992 1.736L10 3.152l-1.254.716a1 1 0 11-.992-1.736l1.75-1zM5.618 4.504a1 1 0 01-.372 1.364L5.016 6l.23.132a1 1 0 11-.992 1.736L3 7.723V8a1 1 0 01-2 0V6a.996.996 0 01.52-.878l1.734-.99a1 1 0 011.364.372zm8.764 0a1 1 0 011.364-.372l1.733.99A1.002 1.002 0 0118 6v2a1 1 0 11-2 0v-.277l-1.254.145a1 1 0 11-.992-1.736L14.984 6l-.23-.132a1 1 0 01-.372-1.364zm-7 4a1 1 0 011.364-.372L10 8.848l1.254-.716a1 1 0 11.992 1.736L11 10.723V12a1 1 0 11-2 0v-1.277l-1.246-.855a1 1 0 01-.372-1.364zM3 11a1 1 0 011 1v1.277l1.246.855a1 1 0 11-.992 1.736l-1.75-1A1 1 0 012 14v-2a1 1 0 011-1zm14 0a1 1 0 011 1v2a1.002 1.002 0 01-.504.868l-1.75 1a1 1 0 11-.992-1.736L16 13.277V12a1 1 0 011-1zm-9.618 5.504a1 1 0 011.364-.372l.254.145V16a1 1 0 112 0v.277l.254-.145a1 1 0 11.992 1.736l-1.735.992a.995.995 0 01-1.022 0l-1.735-.992a1 1 0 01-.372-1.364z" clipRule="evenodd" />
                                </svg>
                                Admin
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div
                            dangerouslySetInnerHTML={{
                              __html: user.first_name || user.last_name ?
                                highlightText(`${user.first_name} ${user.last_name}`.trim(), debouncedSearchTerm) :
                                '<span class="text-gray-400 italic">Sin nombre</span>'
                            }}
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <div className="flex justify-center space-x-2">
                            {/* Botón Editar eliminado */}
                            <button
                              onClick={() => { setShowDeleteModal(true); setUserToDelete(user); }}
                              disabled={user.username === localStorage.getItem('username')}
                              className={`inline-flex items-center px-3 py-1.5 border border-red-300 shadow-sm text-xs font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors ${user.username === localStorage.getItem('username') ? 'opacity-50 cursor-not-allowed' : ''}`}
                              title={user.username === localStorage.getItem('username') ? 'No puedes eliminar tu propia cuenta' : 'Eliminar usuario'}
                            >
                              <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              Eliminar
                            </button>
                          </div>
                        </td>
                      </tr>

                    ))}
                    {/* Rellenar con filas vacías si hay menos de 8 */}
                    {currentUsers.length < 8 && !loading && !error && Array.from({ length: 8 - currentUsers.length }).map((_, idx) => (
                      <tr key={`empty-${idx}`} className="">
                        <td className="px-6 py-4 whitespace-nowrap" colSpan={5}>&nbsp;</td>
                      </tr>
                    ))}
                  </>
                ) : (
                  <tr>
                    <td colSpan={5} style={{ height: 'calc(8 * 56px)', padding: 0 }}>
                      <div className="flex flex-col items-center justify-center h-full w-full absolute left-0 top-0" style={{ minHeight: 'calc(8 * 56px)', background: 'rgba(255,255,255,0.7)', zIndex: 10 }}>
                        <div className="mx-auto h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                          <svg className="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No hay usuarios</h3>
                        <p className="text-gray-500">Aún no tienes usuarios registrados.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Paginación */}
        {totalUsers > 0 && (
          <div className="bg-white px-4 py-3 flex flex-col sm:flex-row items-center justify-between border-t border-gray-200">
            <div className="flex items-center mb-4 sm:mb-0">
              <span className="text-sm text-gray-700 mr-4">
                Mostrando <span className="font-semibold">{startIndex + 1}</span> - <span className="font-semibold">{Math.min(endIndex, totalUsers)}</span> de <span className="font-semibold">{totalUsers}</span> usuarios
              </span>
              <select
                value={itemsPerPage}
                onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-navy-500"
              >
                <option value={5}>5 por página</option>
                <option value={10}>10 por página</option>
                <option value={15}>15 por página</option>
                <option value={20}>20 por página</option>
              </select>
            </div>

            {totalPages > 1 && (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-3 py-2 rounded-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                  </svg>
                  Anterior
                </button>

                <div className="hidden sm:flex space-x-1">
                  {[...Array(totalPages)].map((_, index) => {
                    const page = index + 1;
                    const isCurrentPage = page === currentPage;
                    const isNearCurrentPage = Math.abs(page - currentPage) <= 2;
                    const isFirstOrLast = page === 1 || page === totalPages;

                    if (totalPages <= 7 || isNearCurrentPage || isFirstOrLast) {
                      return (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md transition-colors ${isCurrentPage
                            ? 'z-10 bg-navy-600 border-navy-600 text-white'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                            }`}
                        >
                          {page}
                        </button>
                      );
                    } else if (page === currentPage - 3 || page === currentPage + 3) {
                      return (
                        <span key={page} className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                          ...
                        </span>
                      );
                    }
                    return null;
                  })}
                </div>

                <div className="sm:hidden flex items-center space-x-2">
                  <span className="text-sm text-gray-700">
                    Página {currentPage} de {totalPages}
                  </span>
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center px-3 py-2 rounded-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Siguiente
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Empty state */}
      {currentUsers.length === 0 && !loading && (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <div className="max-w-md mx-auto">
            {debouncedSearchTerm || statusFilter !== 'all' ? (
              // Estado cuando hay filtros aplicados
              <>
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <h3 className="mt-4 text-lg font-medium text-gray-900">
                  No se encontraron usuarios
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  {debouncedSearchTerm && statusFilter !== 'all' ? (
                    <>No hay usuarios <strong>{statusFilter === 'active' ? 'activos' : statusFilter === 'inactive' ? 'inactivos' : statusFilter === 'admin' ? 'administradores' : 'regulares'}</strong> que coincidan con <strong>"{debouncedSearchTerm}"</strong></>
                  ) : debouncedSearchTerm ? (
                    <>No hay usuarios que coincidan con <strong>"{debouncedSearchTerm}"</strong></>
                  ) : (
                    <>No hay usuarios <strong>{statusFilter === 'active' ? 'activos' : statusFilter === 'inactive' ? 'inactivos' : statusFilter === 'admin' ? 'administradores' : 'regulares'}</strong></>
                  )}
                </p>
                <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setStatusFilter('all');
                    }}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Limpiar filtros
                  </button>
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-105"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Crear Usuario
                  </button>
                </div>
              </>
            ) : (
              // Estado cuando no hay usuarios en absoluto
              <>
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <h3 className="mt-4 text-lg font-medium text-gray-900">
                  Aún no hay usuarios
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Comienza creando tu primer usuario para gestionar el acceso al sistema.
                </p>
                <div className="mt-6">
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Crear Primer Usuario
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Modales */}
      {/* Modal Crear Usuario */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Crear Nuevo Usuario</h3>
                <button
                  onClick={handleCancel}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>


              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre de usuario *
                    </label>
                    <input
                      type="text"
                      name="username"
                      value={form.username}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm transition-colors"
                      placeholder="nombre_usuario"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm transition-colors"
                      placeholder="usuario@ejemplo.com"
                    />
                  </div>

                  {/* Campo RFC solo para importador */}
                  {createType === 'importador' && (
                    <>
                      <div className="sm:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          RFC del Importador *
                        </label>
                        <input
                          type="text"
                          name="rfc"
                          value={form.rfc || ''}
                          onChange={handleChange}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm transition-colors"
                          placeholder="RFC del importador"
                        />
                      </div>
                      {/* Campo oculto para is_importador */}
                      <input type="hidden" name="is_importador" value="true" />
                    </>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre
                    </label>
                    <input
                      type="text"
                      name="first_name"
                      value={form.first_name}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm transition-colors"
                      placeholder="Nombre"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Apellido
                    </label>
                    <input
                      type="text"
                      name="last_name"
                      value={form.last_name}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm transition-colors"
                      placeholder="Apellido"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Contraseña *
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm transition-colors"
                      placeholder="Contraseña del usuario"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={submitting}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:opacity-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:opacity-50 flex items-center"
                  >
                    {submitting && (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    )}
                    {submitting ? 'Creando...' : 'Crear Usuario'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal Editar Usuario */}
      {showEditModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Editar Usuario</h3>
                <button
                  onClick={handleCancel}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre de usuario *
                    </label>
                    <input
                      type="text"
                      name="username"
                      value={form.username}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm transition-colors"
                      placeholder="nombre_usuario"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm transition-colors"
                      placeholder="usuario@ejemplo.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre
                    </label>
                    <input
                      type="text"
                      name="first_name"
                      value={form.first_name}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm transition-colors"
                      placeholder="Nombre"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Apellido
                    </label>
                    <input
                      type="text"
                      name="last_name"
                      value={form.last_name}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm transition-colors"
                      placeholder="Apellido"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nueva contraseña
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm transition-colors"
                      placeholder="Dejar vacío para mantener actual"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Deja este campo vacío si no deseas cambiar la contraseña
                    </p>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={submitting}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:opacity-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:opacity-50 flex items-center"
                  >
                    {submitting && (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    )}
                    {submitting ? 'Actualizando...' : 'Actualizar Usuario'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal Eliminar Usuario */}
      {showDeleteModal && userToDelete && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Eliminar Usuario</h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500 mb-4">
                  ¿Estás seguro que deseas eliminar al usuario <strong>{userToDelete.username}</strong>?
                </p>
                <div className="bg-gray-50 rounded-md p-3 mb-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      {userToDelete.profile_picture ? (
                        <img
                          className="h-10 w-10 rounded-full object-cover"
                          src={userToDelete.profile_picture}
                          alt="Avatar"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                          <svg className="h-6 w-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="ml-3 text-left">
                      <p className="text-sm font-medium text-gray-900">{userToDelete.username}</p>
                      <p className="text-sm text-gray-500">{userToDelete.email}</p>
                      {(userToDelete.first_name || userToDelete.last_name) && (
                        <p className="text-xs text-gray-400">
                          {`${userToDelete.first_name} ${userToDelete.last_name}`.trim()}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                <p className="text-sm text-red-600">
                  Esta acción no se puede deshacer.
                </p>
              </div>
              <div className="flex justify-center space-x-3 pt-4">
                <button
                  onClick={handleCancel}
                  disabled={submitting}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  disabled={submitting}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors disabled:opacity-50 flex items-center"
                >
                  {submitting && (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  )}
                  {submitting ? 'Eliminando...' : 'Eliminar Usuario'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
