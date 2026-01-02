'use client'

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import { useState } from 'react';
import { BarChart3, Users, UserCog, FolderOpen, Ticket, X, LogOut } from 'lucide-react';
import useAuthStore from '@/store/auth';
import apiClient from '@/lib/axios';

/**
 * Componente Sidebar - Panel lateral de navegación
 * @param {Object} props
 * @param {boolean} props.isMobileOpen - Estado de apertura en móvil
 * @param {Function} props.toggleMobile - Función para alternar el sidebar en móvil
 */
export default function Sidebar({ isMobileOpen = false, toggleMobile = () => {} }) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuthStore();

  const handleLogout = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
      if (apiUrl) {
        await apiClient.post(`${apiUrl}/api/auth/logout`, {});
      }
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      logout();
      document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      router.push("/login");
    }
  };

  const menuItems = [
    {
      id: 'campana-activa',
      label: 'Campaña Activa',
      icon: BarChart3,
      href: '/',
    },
    {
      id: 'asociados',
      label: 'Asociados',
      icon: Users,
      href: '/asociados',
    },
    {
      id: 'usuarios',
      label: 'Usuarios',
      icon: UserCog,
      href: '/usuarios',
    },
    {
      id: 'campanas',
      label: 'Campañas',
      icon: FolderOpen,
      href: '/campanas',
    },
     {
      id: 'tickets',
      label: 'Tickets',
      icon: Ticket,
      href: '/tickets',
    },
  ];

  return (
    <>
      {/* Overlay para móvil */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={toggleMobile}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-screen bg-white z-50
          transition-transform duration-300 ease-in-out
          w-64 shadow-lg
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:static lg:shadow-none
        `}
        aria-label="Navegación principal"
      >
        {/* Logo y botón de cerrar */}
        <div className="flex items-center justify-center p-6 border-b border-gray-200">
          <div className="flex items-center justify-center gap-2">
            <Image
              src="/CCA-800X600-(2).png"
              alt="CCA Ceuta Logo"
              width={120}
              height={40}
              className="object-contain"
              priority
            />
          </div>
          <button
            onClick={toggleMobile}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Cerrar menú"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Menú de navegación */}
        <nav className="flex-1 p-4" role="navigation">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <li key={item.id}>
                  <Link
                    href={item.href}
                    onClick={() => {
                      if (window.innerWidth < 1024) {
                        toggleMobile();
                      }
                    }}
                    className={`
                      flex items-center gap-3 px-4 py-3 rounded-lg
                      transition-all duration-200
                      ${
                        isActive
                          ? 'bg-primary text-white shadow-md'
                          : 'text-gray-700 hover:bg-gray-100 hover:text-primary'
                      }
                    `}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Botón de cerrar sesión */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
            aria-label="Cerrar sesión"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Cerrar Sesión</span>
          </button>
        </div>
      </aside>
    </>
  );
}

