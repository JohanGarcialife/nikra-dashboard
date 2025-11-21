"use client";

import { Search } from "lucide-react";

/**
 * Componente SearchBar - Barra de búsqueda reutilizable
 * @param {Object} props
 * @param {string} props.placeholder - Texto placeholder del input
 * @param {string} props.value - Valor actual del input
 * @param {Function} props.onChange - Función callback al cambiar el valor
 */
export default function SearchBar({ 
  placeholder = "Buscar...", 
  value = "", 
  onChange 
}) {
  return (
    <div className="relative flex-1">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
      />
    </div>
  );
}

