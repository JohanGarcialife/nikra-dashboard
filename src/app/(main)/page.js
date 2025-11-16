'use client'

import { useRouter } from "next/navigation";
import Image from "next/image";
import apiClient from "@/lib/axios";
import { useEffect, useRef, useState } from "react";
import useAuthStore from "@/store/auth";



export default function Home() {
 const { user, login, logout } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const router = useRouter();





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

   useEffect(() => {
    const fetchUser = async () => {
      try {
        // Asumimos que el backend tiene un endpoint para obtener el perfil del usuario
                const url = `${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`;
        const response = await apiClient.get(url);
        
        if (response.data) {
          login(response.data); // Re-hidrata el store con los datos del usuario
        } else {
          throw new Error("No user data received");
        }
      } catch (error) {
        console.error("Session validation failed:", error);
        logout(); // Limpia el store de Zustand
        document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"; // Limpia la cookie
        router.push("/login"); // Redirige al login
      } finally {
        setLoading(false);
      }
    };

    if (!user) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [user, login, logout, router]);

  return (
      <div className="bg-white  min-h-screen">
        <div className="font-sans items-center justify-items-center min-h-screen p-2 sm:py-20 relative">

          {/* HEADER (siempre visible) */}
          <div  className="sticky w-full top-0 z-30 bg-transparent">
            <div className="flex flex-row w-full justify-between items-center gap-1 mb-4">
              <div onClick={handleLogout} className=" bg-primary p-3 shadow rounded text-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-chevron-compact-left"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M13 20l-3 -8l3 -8" /></svg>
              </div>
              <p className="text-primary font-bold text-4xl">Esto es home</p>
              <div />
            </div>
          </div>
  </div>
            </div>
  );
}
