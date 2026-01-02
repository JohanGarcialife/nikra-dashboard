"use client";

import { useState, useMemo, useEffect } from "react";
import { toast } from "sonner"; // Import toast
import SearchBar from "../_components/SearchBar";
import ActionsDropdown from "./_components/ActionsDropdown";
import {
  getTickets,
  deleteTicket,
  updateTicketStatus,
  formatTicketDate,
  formatTicketAmount,
  getTicketStatusBadge,
} from "@/lib/ticketsServices";

const ITEMS_PER_PAGE = 30;

export default function TicketsPage() {
  const [tickets, setTickets] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalTickets, setTotalTickets] = useState(0);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE);

  // Cargar tickets del backend
  const loadTickets = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getTickets(currentPage, itemsPerPage);
      
      const formattedTickets = data.participations.map((participation) => {
        const ticket = participation.ticket;
        const statusBadge = getTicketStatusBadge(ticket.validated);
        return {
          ...participation,
          ticket: {
            ...ticket,
            formattedDate: formatTicketDate(ticket.fechaTicket),
            formattedAmount: formatTicketAmount(ticket.importeTotal),
            statusLabel: statusBadge.label,
            statusBg: statusBadge.bg,
            statusText: statusBadge.text,
          },
        };
      });
      
      setTickets(formattedTickets);
      setTotalPages(data.pagination.totalPages);
      setTotalTickets(data.pagination.total);
    } catch (err) {
      console.error('Error al cargar tickets:', err);
      setError('Error al cargar los tickets. Por favor, intenta de nuevo.');
      setTickets([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTickets();
  }, [currentPage, itemsPerPage]);

  const filteredTickets = useMemo(() => {
    if (!searchQuery.trim()) return tickets;
    return tickets.filter((participation) =>
      participation.ticket.numeroTicket.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [tickets, searchQuery]);

  // Handlers
  const handleSearch = (query) => setSearchQuery(query);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const handleViewDetails = (ticketId) => {
    setSelectedTicketId(ticketId);
    setIsDetailsModalOpen(true);
  };

  const handleDelete = async (ticketId) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este ticket?")) {
      try {
        await deleteTicket(ticketId);
        toast.success('Ticket eliminado exitosamente');
        await loadTickets(); // Recargar para reflejar la eliminación
      } catch (error) {
        console.error('Error al eliminar ticket:', error);
        toast.error('Error al eliminar el ticket.');
      }
    }
  };

  const handleStatusChange = async (ticketId, newValidatedState) => {
    try {
      // La llamada a la API sigue ocurriendo primero para confirmar el cambio
      await updateTicketStatus(ticketId, newValidatedState);
      
      // Mensaje de éxito
      const message = newValidatedState ? 'Ticket marcado como Validado' : 'Ticket marcado como Pendiente';
      toast.success(message);

      // Actualización visual instantánea sin recargar toda la lista
      setTickets(currentTickets => 
        currentTickets.map(participation => {
          if (participation.ticket.id === ticketId) {
            const newStatusBadge = getTicketStatusBadge(newValidatedState);
            return {
              ...participation,
              ticket: {
                ...participation.ticket,
                validated: newValidatedState,
                statusLabel: newStatusBadge.label,
                statusBg: newStatusBadge.bg,
                statusText: newStatusBadge.text,
              }
            };
          }
          return participation;
        })
      );

    } catch (error) {
      console.error('Error al cambiar el estado del ticket:', error);
      toast.error('Error al cambiar el estado del ticket.');
      // Si hay un error, la UI no se actualiza, lo cual es el comportamiento esperado
    }
  };

  return (
    <div className="w-full">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-primary">Tickets</h1>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <SearchBar
            placeholder="Buscar ticket por número"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Número Ticket</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Asociado ID</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Campaña ID</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Fecha</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Importe</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Estado</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                      <span className="ml-3 text-gray-500">Cargando tickets...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredTickets.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-gray-500">
                    {searchQuery ? 'No se encontraron tickets' : 'No hay tickets disponibles'}
                  </td>
                </tr>
              ) : (
                filteredTickets.map((participation) => (
                  <tr key={participation.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-primary">{participation.ticket.numeroTicket}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-600">{participation.ticket.associateId}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-600">{participation.campaignId}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-600">{participation.ticket.formattedDate}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-600">{participation.ticket.formattedAmount}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`${participation.ticket.statusBg} ${participation.ticket.statusText} text-xs font-medium px-3 py-1 rounded-full`}>
                        {participation.ticket.statusLabel}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center whitespace-nowrap">
                      <ActionsDropdown 
                        ticket={participation.ticket}
                        onStatusChange={handleStatusChange}
                        onViewDetails={() => handleViewDetails(participation.ticket.id)}
                        onDelete={() => handleDelete(participation.ticket.id)}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="border-t border-gray-200 px-6 py-3 flex items-center justify-center gap-4">
            <span className="text-sm text-gray-600">Página</span>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 text-sm text-gray-600 hover:text-primary disabled:opacity-50"
            >
              ‹
            </button>
            <span className="inline-flex items-center justify-center w-8 h-8 bg-primary text-white rounded-full text-sm font-medium">
              {currentPage}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 text-sm text-gray-600 hover:text-primary disabled:opacity-50"
            >
              ›
            </button>
            <select
              className="ml-4 px-2 py-1 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              value={itemsPerPage}
              onChange={handleItemsPerPageChange}
            >
              <option value="30">30</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
            <span className="ml-4 text-sm text-gray-600">
              {totalTickets > 0 ? `Total: ${totalTickets} tickets` : ''}
            </span>
          </div>
        )}
      </div>

      {/* Modal de detalles de ticket (comentado por ahora) */}
      {/* <TicketDetailsModal isOpen={isDetailsModalOpen} onClose={() => setIsDetailsModalOpen(false)} ticketId={selectedTicketId} /> */}
    </div>
  );
}
