'use client';

import { useEffect, useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface BatteryDistribution {
  totalBatteries: number;
  distribution: {
    level: string;
    count: number;
  }[];
}

export default function BatteryDistribution() {
  const router = useRouter();
  const { getToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [distribution, setDistribution] = useState<BatteryDistribution | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const token = getToken();
      if (!token) {
        router.push('/');
        return;
      }

      const response = await fetch('https://api.bms.autotrack.ng/api/batteries/distribution', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch battery distribution');
      }

      const data = await response.json();
      setDistribution(data);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load battery distribution data';
      console.error('Battery distribution error:', error);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [getToken, router]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, [fetchData]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!distribution) {
    return <div>No data available</div>;
  }

  return (
    <div>
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Total Batteries: {distribution.totalBatteries}</h3>
      </div>
      <div className="space-y-4">
        {distribution.distribution.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <span>{item.level}</span>
            <span>{item.count} batteries</span>
          </div>
        ))}
      </div>
    </div>
  );
} 