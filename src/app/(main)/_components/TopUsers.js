"use client";

import { Users, Trophy, Award } from "lucide-react";
import { formatNumber } from "@/lib/statsService";

/**
 * Componente TopUsers - Muestra el ranking de top usuarios
 * @param {Object} props
 * @param {Array} props.topUsers - Array de top usuarios
 */
export default function TopUsers({ topUsers }) {
  if (!topUsers || topUsers.length === 0) {
    return null;
  }

  const getRankIcon = (index) => {
    if (index === 0) {
      return <Trophy className="w-5 h-5 text-yellow-500" />;
    } else if (index === 1) {
      return <Award className="w-5 h-5 text-gray-400" />;
    } else if (index === 2) {
      return <Award className="w-5 h-5 text-orange-400" />;
    }
    return (
      <span className="w-6 h-6 flex items-center justify-center text-sm font-bold text-gray-500">
        {index + 1}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
      <div className="flex items-center gap-2 mb-4">
        <Users className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-bold text-primary">Top Usuarios</h3>
      </div>
      <div className="space-y-3">
        {topUsers.map((user, index) => (
          <div
            key={user.userId || index}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center gap-4 flex-1">
              <div className="flex items-center justify-center w-8">
                {getRankIcon(index)}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-800">{user.userName}</p>
                <p className="text-sm text-gray-600">
                  {user.campaignsCount || 0} campaña
                  {user.campaignsCount !== 1 ? "s" : ""}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-6 text-right">
              <div>
                <p className="text-sm text-gray-600">Tickets</p>
                <p className="font-bold text-primary">
                  {formatNumber(user.totalTickets || 0)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Volumen</p>
                <p className="font-bold text-primary">
                  {formatNumber(user.totalAmount || 0)}€
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
