'use client'

import { deleteUser, getActiveUsers, getUsers } from '@/lib/usersServices';
import { UserCog, Plus, Search, Shield, Users } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Eye, Trash2 } from "lucide-react";

const ITEMS_PER_PAGE = 30;

export default function UsuariosPage() {
  const [users, setUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalUsers, setTotalUsers] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE);

  // Cargar usuarios del backend
  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getUsers(currentPage, itemsPerPage);
    
      
      // Formatear usuarios con estado y fechas
      const formattedUsers = data.users.map((user) => ({
        ...user,
        // estado: calculateUserStatus(user),
        // fechas: formatUserDateRange(user.fechaInicio, user.fechaFin),
      }));
      
      setUsers(formattedUsers);
      setTotalPages(data.pagination.totalPages);
      setTotalUsers(data.pagination.total);
    } catch (err) {
      console.error('Error al cargar usuarios:', err);
      setError('Error al cargar las usuarios. Por favor, intenta de nuevo.');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  console.log(users[1]);
  
  

  // Cargar usuarios al montar el componente y cuando cambie la página o items por página
  useEffect(() => {
    loadUsers();
  }, [currentPage, itemsPerPage]);

  // Filtrar usuarios por búsqueda (local)
  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) return users;

    return users.filter((user) =>
      user.fullName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [users, searchQuery]);

  // Handlers
  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset a primera página al cambiar items por página
  };

 

  const handleViewDetails = (userId) => {
    setSelectedUserId(userId);
    setIsDetailsModalOpen(true);
  };

  const handleDelete = async (userId) => {
    // Confirmación antes de eliminar
    if (
      window.confirm(
        "¿Estás seguro de que deseas eliminar este usuario? Esta acción no se puede deshacer."
      )
    ) {
      try {
        await deleteUser(userId);
        // Recargar usuarios después de eliminar
        await loadUsers();
        alert('Usuario eliminado exitosamente');
      } catch (error) {
        console.error('Error al eliminar usuario:', error);
        alert('Error al eliminar el usuario. Por favor, intenta de nuevo.');
      }
    }
  };
  
  // Total de usuarios activos (isActive === true)
  const totalActiveUsers = useMemo(() => {
    if (!Array.isArray(users)) return 0;
    return users.filter((u) => u && u.isActive === true).length;
  }, [users]);

  // const handleCreateUser= async (formData, imageFile) => {
  //   try {
  //     // 1. Subir la imagen primero
  //     const uploadResponse = await uploadCampaignImage(imageFile);
  //     const filename = uploadResponse.filename;

  //     // 2. Crear la campaña con la URL de la imagen
  //     const campaignData = {
  //       nombre: formData.nombre,
  //       descripcion: formData.descripcion || '',
  //       imagenUrl: filename, // Solo el filename, el backend construirá la URL
  //       isActive: formData.isActive !== undefined ? formData.isActive : true,
  //       fechaInicio: new Date(formData.fechaInicio).toISOString(),
  //       fechaFin: new Date(formData.fechaFin).toISOString(),
  //     };

  //     await createCampaign(campaignData);
      
  //     // 3. Recargar campañas después de crear
  //     await loadCampaigns();
  //     setIsModalOpen(false);
  //     alert('Campaña creada exitosamente');
  //   } catch (error) {
  //     console.error('Error al crear campaña:', error);
  //     throw error; // Re-lanzar el error para que el modal lo maneje
  //   }
  // };


  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-primary mb-2">Usuarios</h1>
        <p className="text-gray-600">Administra los usuarios del sistema y sus permisos</p>
      </div>

      {/* Acciones */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar usuario..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl text-black focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
        <button onClick={() => handleSearch(searchQuery)} className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl hover:bg-primary/90 transition-colors font-medium">
          <Search className="w-5 h-5" />
         Buscar Usuario
        </button>
      </div>

      {/* Grid de estadísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-2xl shadow-md p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-blue-50 p-3 rounded-xl">
              <UserCog className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Usuarios</p>
              <p className="text-2xl font-bold text-gray-900">{totalUsers}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-md p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-green-50 p-3 rounded-xl">
              <Shield className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Administradores</p>
              <p className="text-2xl font-bold text-gray-900">-</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-md p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-purple-50 p-3 rounded-xl">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Usuarios Activos</p>
              <p className="text-2xl font-bold text-gray-900">{totalActiveUsers} </p>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido placeholder */}
      <div className="bg-white rounded-2xl shadow-md p-12">
        {users.length > 0 ?  <>
        
          {/* Tabla de campañas */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Nombre 
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    DNI
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">
                    Email
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">
                    Teléfono
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">
                    Eliminar
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center">
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        <span className="ml-3 text-gray-500">Cargando usuarios...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                      {searchQuery ? 'No se encontraron usuarios con ese nombre' : 'No hay usuarios disponibles'}
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-3">
                        {getStatusBadge(user.isActive)}
                      </td>
                      <td className="px-6 py-3">
                        <span className="text-sm font-medium text-primary">
                          {user.fullName}
                        </span>
                      </td>
                      <td className="px-6 py-3">
                        <span className="text-sm text-gray-600">
                          {user.dni}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-center">
                        <span
                          className="inline-flex items-center gap-2  text-primary text-sm font-medium"
                        >
                          {user.email}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-center">
                       <span
                          className="inline-flex items-center gap-2  text-primary text-sm font-medium"
                        >
                          {user.phone}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-center">
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="inline-flex items-center justify-center w-9 h-9 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                          title="Eliminar usuario"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
  
          {/* Paginación */}
          {totalPages > 1 && (
            <div className="border-t border-gray-200 px-6 py-3 flex items-center justify-center gap-4">
              <span className="text-sm text-gray-600">Page</span>
  
              {/* Botón anterior */}
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm text-gray-600 hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ‹
              </button>
  
              {/* Número de página actual */}
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center justify-center w-8 h-8 bg-primary text-white rounded-full text-sm font-medium">
                  {currentPage}
                </span>
              </div>
  
              {/* Botón siguiente */}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-sm text-gray-600 hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ›
              </button>
  
              {/* Select de items por página */}
              <select
                className="ml-4 px-2 py-1 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                value={itemsPerPage}
                onChange={handleItemsPerPageChange}
              >
                <option value="30">30</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
              
              {/* Info de paginación */}
              <span className="ml-4 text-sm text-gray-600">
                {totalUsers > 0 ? `Total: ${totalUsers} usuarios` : ''}
              </span>
            </div>
          )} 
        </>
        
        : <div className="text-center">
          <div className="bg-blue-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserCog className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Gestión de Usuarios
          </h2>
          <p className="text-gray-600 mb-4 max-w-md mx-auto">
            Administra los usuarios del sistema, asigna roles y permisos, y controla el acceso al dashboard.
          </p>
          <p className="text-sm text-gray-500">
            Esta funcionalidad estará disponible próximamente.
          </p>
        </div>}
      </div>
    </div>
  );
}

// Función helper para obtener los estilos del badge según el estado
function getStatusBadge(isActive) {
  const statusConfig = {
    NoActiva: {
      bg: "bg-red-100",
      text: "text-red-800",
      label: "No activa",
    },
    Activa: {
      bg: "bg-green-100",
      text: "text-green-800",
      label: "Activa",
    },
  };

  // Normalizar distintos tipos de input (boolean, string, number)
  let active = false;
  if (typeof isActive === "boolean") {
    active = isActive;
  } else if (typeof isActive === "string") {
    const v = isActive.trim().toLowerCase();
    active = v === "true" || v === "activa" || v === "active" || v === "1";
  } else if (typeof isActive === "number") {
    active = isActive === 1;
  }

  const config = active ? statusConfig.Activa : statusConfig.NoActiva;

  return (
    <span
      className={`${config.bg} ${config.text} text-xs font-medium px-3 py-1 rounded-full whitespace-nowrap`}
    >
      {config.label}
    </span>
  );
}
