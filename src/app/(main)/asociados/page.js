"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { 
  Search, 
  ChevronDown, 
  Pencil, 
  Trash2, 
  ChevronLeft, 
  ChevronRight 
} from "lucide-react";
import { getAssociates } from "@/lib/associatesService";

const ITEMS_PER_PAGE = 10;

export default function AssociatesPage() {
  const [associates, setAssociates] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalAssociates, setTotalAssociates] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  


  // Cargar asociados del backend
  const loadAssociates = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAssociates(currentPage, ITEMS_PER_PAGE);
      setAssociates(response.associates || []);
      setTotalPages(response.pagination.totalPages);
      setTotalAssociates(response.pagination.total);
    } catch (err) {
      console.error('Error al cargar asociados:', err);
      setError('Error al cargar los asociados. Por favor, intenta de nuevo.');
      setAssociates([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage]);

  // Cargar asociados al montar el componente y cuando cambie la página
  useEffect(() => {
    loadAssociates();
  }, [loadAssociates]);

  // Filtrar asociados por búsqueda (local)
  const filteredAssociates = useMemo(() => {
    if (!searchQuery.trim()) return associates;

    return associates.filter((associate) =>
      associate.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [associates, searchQuery]);

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
  
  const getStatusColor = (status) => {
    // Assuming status is a boolean `isActive`
    return status ? "text-green-500" : "text-orange-400";
  };
console.log(filteredAssociates);

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden p-8 font-sans">
      {/* Fondo decorativo abstracto */}
      <div className="absolute top-0 right-0 w-2/3 h-96 bg-blue-100 rounded-bl-full opacity-50 -z-10 translate-x-1/4 -translate-y-1/2 pointer-events-none"></div>
      <div className="absolute top-20 right-40 w-20 h-20 bg-white rounded-full opacity-80 -z-10 pointer-events-none"></div>

      {/* Título */}
      <h1 className="text-4xl font-bold text-[#1e2a5e] mb-10 mt-4">Asociados</h1>

      {/* Mensaje de error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 max-w-[1400px] mx-auto">
          {error}
        </div>
      )}

      {/* Contenedor Principal (Tarjeta Blanca) */}
      <div className="bg-white rounded-3xl shadow-xl p-8 max-w-[1400px] mx-auto min-h-[800px] flex flex-col">
        
        {/* Barra de Herramientas Superior */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div className="flex gap-4 w-full md:w-auto">
            {/* Dropdown Categoría */}
            <div className="relative group">
              <button className="flex items-center justify-between w-40 px-4 py-2.5 text-blue-900 bg-white border border-gray-200 rounded-lg hover:border-blue-400 transition-colors">
                <span className="font-medium">Categoría</span>
                <ChevronDown size={18} className="text-blue-900" />
              </button>
            </div>

            {/* Input de Búsqueda */}
            <div className="relative flex-1 md:w-80">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search size={18} className="text-blue-900" />
              </div>
              <input
                type="text"
                className="w-full pl-10 pr-4 py-2.5 text-gray-700 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder-blue-900/70"
                placeholder="Buscar comercio"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Botón Crear */}
          <button className="w-full md:w-auto px-6 py-2.5 bg-[#004e92] hover:bg-[#003b70] text-white font-medium rounded-lg shadow-md transition-colors">
            Crear nuevo asociado
          </button>
        </div>

        {/* Encabezados de la Tabla */}
        <div className="hidden md:grid grid-cols-12 gap-4 px-4 mb-4 text-[#3b5998] font-medium text-sm">
          <div className="col-span-1">Estado</div>
          <div className="col-span-3">Nombre del comercio</div>
          <div className="col-span-2">Dirección</div>
          <div className="col-span-4">Contacto Interno</div>
          <div className="col-span-2 text-right flex justify-end gap-6 pr-4">
            <span>Editar</span>
            <span>Eliminar</span>
          </div>
        </div>

        {/* Lista de Filas */}
        <div className="flex flex-col gap-3">
          {loading ? (
            <div className="text-center py-10 text-gray-500">Cargando asociados...</div>
          ) : error ? (
            <div className="text-center py-10 text-red-500">{/* El error ya se muestra arriba */}</div>
          ) : filteredAssociates.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              {searchQuery ? 'No se encontraron asociados con ese nombre' : 'No hay asociados disponibles'}
            </div>
          ) : (
            filteredAssociates.map((item) => (
              <div
                key={item.id}
                className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center px-4 py-5 bg-white border border-gray-100 rounded-xl hover:shadow-md transition-shadow"
              >
                {/* Estado */}
                <div className={`col-span-1 font-medium ${getStatusColor(item.activo)}`}>
                  {item.activo ? "Activo" : "Bloqueado"}
                </div>

                {/* Nombre */}
                <div className="col-span-3 text-[#1e2a5e] font-medium text-sm uppercase">
                  {item.nombre}
                </div>

                {/* Categoría */}
                <div className="col-span-2 text-[#1e2a5e] text-sm">
                  {item.direccion || 'NAN'}
                </div>

                {/* Contacto */}
                <div className="col-span-4 text-[#1e2a5e] text-sm truncate">
                  {item.telefono  || 'NAN'}
                </div>

                {/* Acciones */}
                <div className="col-span-2 flex justify-end gap-3">
                  <button className="p-2 bg-blue-100/50 hover:bg-blue-100 rounded-full text-[#1e2a5e] transition-colors">
                    <Pencil size={16} />
                  </button>
                  <button className="p-2 bg-red-100/50 hover:bg-red-100 rounded-full text-red-500 transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="mt-auto pt-8 flex justify-center items-center gap-4 text-blue-900 text-sm">
            <span>Page</span>
            <button 
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-1 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={16} />
            </button>
            
            <div className="w-8 h-8 flex items-center justify-center bg-[#004e92] text-white rounded-full font-medium">
              {currentPage}
            </div>
            
            <button 
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-1 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight size={16} />
            </button>
            
            <div className="flex items-center gap-2 ml-2">
              <span>{ITEMS_PER_PAGE}</span>
              <ChevronDown size={14} />
              <div className="w-8 h-[1px] bg-blue-200"></div>
            </div>
             <span className="ml-4 text-sm text-gray-600">
              {totalAssociates > 0 ? `Total: ${totalAssociates} asociados` : ''}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
