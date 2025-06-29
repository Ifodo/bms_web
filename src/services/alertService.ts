import type { Alert, AlertResponse } from '@/types/alert';

export async function getRecentAlerts(): Promise<Alert[]> {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No token found');
  }

  const response = await fetch('https://api.bms.autotrack.ng/api/alerts/recent', {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch recent alerts');
  }

  const data: AlertResponse = await response.json();

  if (!data.success) {
    throw new Error(data.message || 'Failed to fetch recent alerts');
  }

  return data.data || [];
} 