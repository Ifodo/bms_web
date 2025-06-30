'use client';

import { useEffect, useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { BsBatteryFull, BsBatteryHalf, BsBattery } from 'react-icons/bs';

interface BatteryRange {
  range: string;
  count: number;
  percentage: number;
}

interface BatteryDistributionResponse {
  "0": BatteryRange;
  "1": BatteryRange;
  "2": BatteryRange;
  "3": BatteryRange;
  "4": BatteryRange;
  success: boolean;
  message: string;
  code: number;
  returnStatus: string;
}

export default function BatteryDistribution() {
  const router = useRouter();
  const { getToken, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [distribution, setDistribution] = useState<BatteryRange[]>([]);

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

      if (response.status === 401) {
        // Token expired or invalid
        await logout();
        router.push('/');
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to fetch battery distribution');
      }

      const responseData: BatteryDistributionResponse = await response.json();
      
      if (!responseData.success) {
        throw new Error(responseData.message || 'Failed to fetch battery distribution');
      }

      // Convert the object format to array format
      const distributionArray: BatteryRange[] = [
        responseData["0"],
        responseData["1"],
        responseData["2"],
        responseData["3"],
        responseData["4"]
      ];

      setDistribution(distributionArray);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load battery distribution data';
      console.error('Battery distribution error:', error);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [getToken, router, logout]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, [fetchData]);

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
          onClick={fetchData}
          className="mt-2 text-sm text-blue-400 hover:text-blue-300"
        >
          Try again
        </button>
      </div>
    );
  }

  if (!distribution || distribution.length === 0) {
    return (
      <div className="p-4 bg-gray-700 rounded-lg">
        <p className="text-gray-400">No battery data available</p>
      </div>
    );
  }

  const getBatteryIcon = (range: string) => {
    const percentage = parseInt(range.split('-')[1]);
    if (percentage <= 20) return <BsBattery className="w-5 h-5 text-red-400" />;
    if (percentage <= 60) return <BsBatteryHalf className="w-5 h-5 text-yellow-400" />;
    return <BsBatteryFull className="w-5 h-5 text-green-400" />;
  };

  const getRangeColor = (range: string) => {
    const percentage = parseInt(range.split('-')[1]);
    if (percentage <= 20) return 'text-red-400';
    if (percentage <= 60) return 'text-yellow-400';
    return 'text-green-400';
  };

  const totalBatteries = distribution.reduce((sum, item) => sum + item.count, 0);

  return (
    <div>
      <div className="mb-6 bg-gray-700/50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-white">
          Total Batteries: <span className="text-blue-400">{totalBatteries}</span>
        </h3>
      </div>
      
      <div className="space-y-4">
        {distribution.map((item, index) => (
          <div 
            key={index} 
            className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-colors"
          >
            <div className="flex items-center space-x-3">
              {getBatteryIcon(item.range)}
              <span className={`font-medium ${getRangeColor(item.range)}`}>
                {item.range}
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-300">
                {item.count} {item.count === 1 ? 'battery' : 'batteries'}
              </span>
              <span className="text-sm text-gray-400">
                ({item.percentage}%)
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 