'use client';

import { useEffect, useState } from 'react';
import type { BatteryDistribution, ProcessedBatteryDistribution } from '@/types/battery';
import { getBatteryDistribution } from '@/services/batteryService';
import { BsBatteryHalf, BsArrowClockwise } from 'react-icons/bs';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

const getColorForRange = (range: string): string => {
  switch (range) {
    case '0-20%':
      return 'bg-red-500';
    case '21-40%':
      return 'bg-orange-500';
    case '41-60%':
      return 'bg-yellow-500';
    case '61-80%':
      return 'bg-blue-500';
    case '81-100%':
      return 'bg-green-500';
    default:
      return 'bg-gray-500';
  }
};

export default function BatteryDistribution() {
  const [distribution, setDistribution] = useState<ProcessedBatteryDistribution | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { getToken } = useAuth();

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Check if we have a token
      const token = getToken();
      if (!token) {
        router.push('/');
        return;
      }

      const data = await getBatteryDistribution();
      setDistribution(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load battery distribution data';
      console.error('Battery distribution error:', err);
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

    fetchData();
    // Refresh data every 30 seconds
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-700 rounded w-1/3"></div>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between">
                  <div className="h-4 bg-gray-700 rounded w-1/4"></div>
                  <div className="h-4 bg-gray-700 rounded w-1/4"></div>
                </div>
                <div className="h-2 bg-gray-700 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
        <div className="flex flex-col items-center justify-center space-y-4">
          <p className="text-red-500 text-center">{error}</p>
          <button
            onClick={fetchData}
            className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            <BsArrowClockwise className="h-4 w-4" />
            <span>Retry</span>
          </button>
        </div>
      </div>
    );
  }

  if (!distribution || distribution.data.length === 0) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
        <p className="text-gray-400 text-center">No battery data available</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">Battery Distribution</h2>
        <div className="flex items-center space-x-4">
          <div className="text-gray-400">
            <span className="text-sm">Total Batteries: </span>
            <span className="text-lg font-semibold text-white">{distribution.totalBatteries}</span>
          </div>
          <button
            onClick={fetchData}
            className="p-2 text-gray-400 hover:text-white transition-colors"
            title="Refresh data"
          >
            <BsArrowClockwise className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {distribution.data.map((item: BatteryDistribution) => (
          <div key={item.range} className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2">
                <BsBatteryHalf className={`h-4 w-4 ${getColorForRange(item.range)}`} />
                <span className="text-gray-300">{item.range}</span>
              </div>
              <div className="text-gray-400">
                {item.count} batteries ({item.percentage}%)
              </div>
            </div>
            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
              <div
                className={`h-full ${getColorForRange(item.range)} transition-all duration-500`}
                style={{ width: `${Math.max(0, Math.min(100, item.percentage))}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 