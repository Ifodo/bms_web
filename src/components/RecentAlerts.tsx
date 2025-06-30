'use client';

import { useEffect, useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';
import { BsBatteryFull, BsBatteryHalf, BsBattery, BsExclamationTriangle } from 'react-icons/bs';

interface Alert {
  id: string;
  deviceId: string;
  deviceName: string;
  type: string;
  severity: 'low' | 'medium' | 'high';
  message: string;
  timestamp: string;
  isActive: boolean;
}

interface AlertsResponse {
  success: boolean;
  message: string;
  code: number;
  returnStatus: string;
}

export default function RecentAlerts() {
  const router = useRouter();
  const { getToken, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);

  const fetchAlerts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const token = getToken();
      if (!token) {
        router.push('/');
        return;
      }

      const response = await fetch('https://api.bms.autotrack.ng/api/alerts/recent', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status === 401) {
        // Token expired or invalid
        await logout();
        router.push('/');
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to fetch recent alerts');
      }

      const responseData: AlertsResponse & { data?: Alert[] } = await response.json();
      
      if (!responseData.success) {
        throw new Error(responseData.message || 'Failed to fetch alerts');
      }

      // Handle the case where data might be in the response or the response itself might be an array
      const alertsData = Array.isArray(responseData) ? responseData : (responseData.data || []);
      setAlerts(alertsData);
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load recent alerts';
      console.error('Recent alerts error:', error);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [getToken, router, logout]);

  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, [fetchAlerts]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-6">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-lg">
        <p className="text-red-500">{error}</p>
        <button 
          onClick={fetchAlerts}
          className="mt-2 text-sm text-blue-400 hover:text-blue-300"
        >
          Try again
        </button>
      </div>
    );
  }

  if (!Array.isArray(alerts) || alerts.length === 0) {
    return (
      <div className="p-4 bg-gray-700 rounded-lg">
        <p className="text-gray-400">No recent alerts</p>
      </div>
    );
  }

  const getAlertIcon = (type: string, severity: string) => {
    if (type === 'low_soc') {
      switch (severity) {
        case 'high':
          return <BsBattery className="w-5 h-5 text-red-400" />;
        case 'medium':
          return <BsBatteryHalf className="w-5 h-5 text-yellow-400" />;
        default:
          return <BsBatteryFull className="w-5 h-5 text-blue-400" />;
      }
    }
    return <BsExclamationTriangle className="w-5 h-5 text-yellow-400" />;
  };

  const getSeverityStyles = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-red-500/10 border-red-500/30 text-red-400';
      case 'medium':
        return 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400';
      case 'low':
        return 'bg-blue-500/10 border-blue-500/30 text-blue-400';
      default:
        return 'bg-gray-700 border-gray-600 text-gray-400';
    }
  };

  return (
    <div className="space-y-4">
      {alerts.map((alert: Alert) => (
        <div
          key={alert.id}
          className={`p-4 rounded-lg border ${getSeverityStyles(alert.severity)}`}
        >
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                {getAlertIcon(alert.type, alert.severity)}
                <span className="font-medium">{alert.deviceName}</span>
              </div>
              <p className="text-gray-300">{alert.message}</p>
              <div className="flex items-center space-x-2 mt-2">
                <span className="text-sm text-gray-400">
                  {format(new Date(alert.timestamp), 'PPp')}
                </span>
                <span className="text-sm text-gray-400">•</span>
                <span className="text-sm text-gray-400">
                  ID: {alert.deviceId}
                </span>
              </div>
            </div>
            {alert.isActive && (
              <span className="px-2 py-1 text-xs font-medium bg-green-500/10 text-green-400 rounded-full border border-green-500/30">
                Active
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
} 