"use client";

import { Montserrat } from "next/font/google";
import "../globals.css";
import { Toaster } from "sonner";
import { HeroUIProvider } from "@heroui/system";
import { useState } from "react";
import { Menu } from "lucide-react";
import Sidebar from "./_components/Sidebar";
import Image from "next/image";
import { usePathname } from "next/navigation";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

export default function MainLayout({ children }) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  const toggleMobile = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  return (
    <html lang="es">
      <body
        className={`${montserrat.variable} antialiased`}
        suppressHydrationWarning
      >
        <HeroUIProvider>
          <Toaster richColors position="top-right" />
          {/* Imagen de fondo fija - fuera del contenedor para que funcione correctamente */}
          <div className="fixed inset-0 z-0 pointer-events-none">
            <Image
              src="/Group786.png"
              alt="Fondo decorativo"
              fill
              className="object-fill select-none"
              priority
            />
          </div>

          <div
            className={`flex min-h-screen ${
              isHomePage ? "lg:min-h-screen" : "lg:h-screen"
            } ${
              isHomePage ? "" : "lg:overflow-hidden"
            } bg-gray-50 relative z-10`}
          >
            {/* Sidebar - Fijo */}
            <Sidebar isMobileOpen={isMobileOpen} toggleMobile={toggleMobile} />

            {/* Contenido principal */}
            <div
              className={`flex-1 flex flex-col ${
                isHomePage ? "" : "lg:overflow-hidden"
              } ml-0 lg:ml-64 w-full`}
            >
              {/* Header con botón hamburguesa para móvil */}
              <header className="lg:hidden bg-white border-b border-gray-200 p-4 flex items-center gap-4 flex-shrink-0">
                <button
                  onClick={toggleMobile}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label="Abrir menú"
                >
                  <Menu className="w-6 h-6 text-primary" />
                </button>
                <h1 className="text-lg font-bold text-primary">
                  Dashboard CCA
                </h1>
              </header>

              {/* Área de contenido: scroll normal en móvil, scroll interno en desktop (excepto en home) */}
              <main
                className={`flex-1 ${
                  isHomePage
                    ? "overflow-y-auto"
                    : "lg:overflow-hidden overflow-y-auto"
                }`}
              >
                <div
                  className={`p-4 lg:p-8 ${
                    isHomePage ? "" : "lg:h-full"
                  } relative z-20`}
                >
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
