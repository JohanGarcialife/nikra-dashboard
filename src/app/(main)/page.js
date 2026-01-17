"use client";

import { useRouter } from "next/navigation";
import apiClient from "@/lib/axios";
import { useEffect, useState } from "react";
import useAuthStore from "@/store/auth";

// Importar componente de estadísticas
import DashboardStats from "./_components/DashboardStats";

export default function Home() {
  const { user, login, logout } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const url = `${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`;
        const response = await apiClient.get(url);

        if (response.data) {
          login(response.data);
        } else {
          throw new Error("No user data received");
        }
      } catch (error) {
        console.error("Session validation failed:", error);
        logout();
        document.cookie =
          "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        router.push("/login");
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <DashboardStats />
    </div>
  );
}
