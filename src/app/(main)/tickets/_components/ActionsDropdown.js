"use client";

import { useState, useRef, useEffect } from 'react';
import { MoreVertical, CheckCircle, XCircle, Eye, Trash2 } from 'lucide-react';

export default function ActionsDropdown({ ticket, onStatusChange, onViewDetails, onDelete }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Cierra el menú si se hace clic fuera de él
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleStatusClick = (newStatus) => {
    onStatusChange(ticket.id, newStatus);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          type="button"
          className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          aria-haspopup="true"
          aria-expanded={isOpen}
        >
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>

      {isOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
          <div className="py-1" role="menu" aria-orientation="vertical">
            <p className="px-4 pt-2 pb-1 text-xs text-gray-500">Cambiar Estado</p>
            {ticket.validated ? (
              <button
                onClick={() => handleStatusClick(false)}
                className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                role="menuitem"
              >
                <XCircle className="w-4 h-4 text-yellow-600" />
                Marcar como Pendiente
              </button>
            ) : (
              <button
                onClick={() => handleStatusClick(true)}
                className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                role="menuitem"
              >
                <CheckCircle className="w-4 h-4 text-green-600" />
                Marcar como Validado
              </button>
            )}

            <div className="border-t border-gray-100 my-1"></div>

            <p className="px-4 pt-2 pb-1 text-xs text-gray-500">Otras Acciones</p>
            
            <button
              onClick={() => { onViewDetails(); setIsOpen(false); }}
              className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              role="menuitem"
            >
              <Eye className="w-4 h-4 text-gray-500" />
              Ver Detalles
            </button>
            
            <button
              onClick={() => { onDelete(); setIsOpen(false); }}
              className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              role="menuitem"
            >
              <Trash2 className="w-4 h-4" />
              Eliminar Ticket
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
