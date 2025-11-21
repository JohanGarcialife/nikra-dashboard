'use client'

import { Montserrat } from "next/font/google";
import "../globals.css";
import { Toaster } from "sonner";
import { HeroUIProvider } from "@heroui/system";
import { useState } from "react";
import { Menu } from "lucide-react";
import Sidebar from "./_components/Sidebar";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

export default function MainLayout({ children }) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const toggleMobile = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  return (
    <html lang="es">
      <body className={`${montserrat.variable} antialiased`}>
        <HeroUIProvider>
          <Toaster richColors position="top-right" />
          <div className="flex h-screen overflow-hidden bg-gray-50">
            {/* Sidebar */}
            <Sidebar isMobileOpen={isMobileOpen} toggleMobile={toggleMobile} />

            {/* Contenido principal */}
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Header con botón hamburguesa para móvil */}
              <header className="lg:hidden bg-white border-b border-gray-200 p-4 flex items-center gap-4">
                <button
                  onClick={toggleMobile}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label="Abrir menú"
                >
                  <Menu className="w-6 h-6 text-primary" />
                </button>
                <h1 className="text-lg font-bold text-primary">Dashboard CCA</h1>
              </header>

              {/* Área de contenido con scroll */}
              <main className="flex-1 overflow-y-auto overflow-x-hidden">
                <div className="p-4 lg:p-8">
                  {children}
                </div>
              </main>
            </div>
          </div>
        </HeroUIProvider>
      </body>
    </html>
  );
}
