'use client';

import { useEffect, useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';

interface Alert {
  id: string;
  message: string;
  severity: 'low' | 'medium' | 'high';
  timestamp: string;
  isActive: boolean;
}

export default function RecentAlerts() {
  const router = useRouter();
  const { getToken } = useAuth();
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

      if (!response.ok) {
        throw new Error('Failed to fetch recent alerts');
      }

      const data = await response.json();
      setAlerts(data);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load recent alerts';
      console.error('Recent alerts error:', error);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [getToken, router]);

  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, [fetchAlerts]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (alerts.length === 0) {
    return <div>No recent alerts</div>;
  }

  return (
    <div className="space-y-4">
      {alerts.map((alert: Alert) => (
        <div
          key={alert.id}
          className={`p-4 rounded-lg ${
            alert.severity === 'high'
              ? 'bg-red-100 text-red-800'
              : alert.severity === 'medium'
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-blue-100 text-blue-800'
          }`}
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="font-medium">{alert.message}</p>
              <p className="text-sm mt-1">
                {format(new Date(alert.timestamp), 'PPp')}
              </p>
            </div>
            {alert.isActive && (
              <span className="text-green-600 text-sm">Active</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
} 