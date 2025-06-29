'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getRecentAlerts } from '@/services/alertService';
import type { Alert } from '@/types/alert';
import { BsExclamationTriangle, BsArrowClockwise } from 'react-icons/bs';
import { formatDistanceToNow } from 'date-fns';

const getSeverityStyles = (severity: string) => {
  switch (severity) {
    case 'high':
      return 'bg-red-500/10 text-red-500';
    case 'medium':
      return 'bg-yellow-500/10 text-yellow-500';
    case 'low':
      return 'bg-blue-500/10 text-blue-500';
    default:
      return 'bg-gray-500/10 text-gray-500';
  }
};

export default function RecentAlerts() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { getToken } = useAuth();

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = getToken();
      if (!token) {
        router.push('/');
        return;
      }

      const data = await getRecentAlerts();
      setAlerts(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load recent alerts';
      console.error('Recent alerts error:', err);
      setError(errorMessage);
      
      if (errorMessage.includes('Unauthorized')) {
        router.push('/');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.push('/');
      return;
    }

    fetchAlerts();
    // Refresh data every 30 seconds
    const interval = setInterval(fetchAlerts, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h2 className="text-lg font-semibold text-white mb-4">Recent Alerts</h2>
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-4 p-3 rounded-lg bg-gray-700/50">
              <div className="h-10 w-10 bg-gray-600 rounded"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-600 rounded w-3/4"></div>
                <div className="h-3 bg-gray-600 rounded w-1/4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <div className="flex flex-col items-center justify-center space-y-4">
          <h2 className="text-lg font-semibold text-white">Recent Alerts</h2>
          <p className="text-red-500 text-center">{error}</p>
          <button
            onClick={fetchAlerts}
            className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            <BsArrowClockwise className="h-4 w-4" />
            <span>Retry</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-white">Recent Alerts</h2>
        <button
          onClick={fetchAlerts}
          className="p-2 text-gray-400 hover:text-white transition-colors"
          title="Refresh alerts"
        >
          <BsArrowClockwise className="h-5 w-5" />
        </button>
      </div>
      <div className="space-y-4">
        {alerts.length === 0 ? (
          <p className="text-gray-400 text-center">No recent alerts</p>
        ) : (
          alerts.map((alert) => (
            <div
              key={alert.id}
              className="flex items-center gap-4 p-3 rounded-lg bg-gray-700/50"
            >
              <div className={`p-2 rounded-lg ${getSeverityStyles(alert.severity)}`}>
                <BsExclamationTriangle className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-white">{alert.message}</p>
                  {alert.isActive && (
                    <span className="px-2 py-1 text-xs font-medium bg-green-500/10 text-green-500 rounded-full">
                      Active
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-xs text-gray-400">{alert.deviceName}</p>
                  <span className="text-gray-600">•</span>
                  <p className="text-xs text-gray-400">
                    {formatDistanceToNow(new Date(alert.timestamp), { addSuffix: true })}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
} 