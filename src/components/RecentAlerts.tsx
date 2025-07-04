'use client';

import React from 'react';
import { useEffect, useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { BsArrowClockwise } from 'react-icons/bs';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, Label } from 'recharts';

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
  [key: string]: Alert | boolean | string | number;
  success: boolean;
  message: string;
  code: number;
  returnStatus: string;
}

interface AlertTypeCount {
  name: string;
  value: number;
  color: string;
}

export default function RecentAlerts() {
  const router = useRouter();
  const { getToken, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [alertTypes, setAlertTypes] = useState<AlertTypeCount[]>([]);

  const ALERT_COLORS: { [key: string]: string } = {
    communication_error: '#F87171', // brighter red
    temperature_warning: '#FBBF24', // brighter yellow
    voltage_warning: '#60A5FA', // brighter blue
    default: '#6B7280', // gray
  };

  const ALERT_NAMES: { [key: string]: string } = {
    communication_error: 'Communication Errors',
    temperature_warning: 'Temperature Warnings',
    voltage_warning: 'Voltage Warnings',
    default: 'Other Alerts'
  };

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
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 401) {
        await logout();
        router.push('/');
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to fetch recent alerts');
      }

      const responseData: AlertsResponse = await response.json();
      
      if (!responseData.success) {
        throw new Error(responseData.message || 'Failed to fetch alerts');
      }

      // Extract alerts from numbered keys
      const alertsArray: Alert[] = Object.entries(responseData)
        .filter(([key]) => !isNaN(Number(key)))
        .map(([_, value]) => value as Alert);
      
      // Calculate alert type distribution
      const typeCounts = alertsArray.reduce((acc: { [key: string]: number }, alert) => {
        acc[alert.type] = (acc[alert.type] || 0) + 1;
        return acc;
      }, {});

      const typeData: AlertTypeCount[] = Object.entries(typeCounts).map(([type, count]) => ({
        name: type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
        value: count,
        color: ALERT_COLORS[type] || ALERT_COLORS.default
      }));

      setAlertTypes(typeData);
      
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
  }, [fetchAlerts]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-gray-800 p-3 rounded-lg border border-gray-700 shadow-lg">
          <p className="text-white font-medium">{data.name}</p>
          <p className="text-gray-300">
            Count: <span className="font-medium text-white">{data.value}</span>
          </p>
          <p className="text-gray-400 text-sm">
            {((data.value / alertTypes.reduce((sum, type) => sum + type.value, 0)) * 100).toFixed(1)}% of total
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomLegend = ({ payload }: any) => {
    if (payload && payload.length) {
      return (
        <div className="grid grid-cols-2 gap-3 mt-4">
          {payload.map((entry: any, index: number) => {
            // Simplify the alert type name by removing directory path
            const simpleName = entry.value.split('/').pop()?.split('_')
              .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(' ');
            
            return (
              <div key={`legend-${index}`} className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: entry.color }} />
                <div className="flex flex-col">
                  <span className="text-gray-300 text-sm">{simpleName}</span>
                  <span className="text-gray-400 text-xs">
                    {alertTypes.find(type => type.name === entry.value)?.value || 0} alerts
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-400">Loading alerts data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
        <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-lg">
          <p className="text-red-400">{error}</p>
          <button 
            onClick={fetchAlerts}
            className="mt-3 px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors flex items-center space-x-2"
          >
            <BsArrowClockwise className="w-4 h-4" />
            <span>Try again</span>
          </button>
        </div>
      </div>
    );
  }

  if (alertTypes.length === 0) {
    return (
      <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
        <div className="flex flex-col items-center justify-center py-8">
          <p className="text-gray-400 mb-3">No active alerts</p>
          <button
            onClick={fetchAlerts}
            className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors flex items-center space-x-2"
          >
            <BsArrowClockwise className="w-4 h-4" />
            <span>Refresh</span>
          </button>
        </div>
      </div>
    );
  }

  const totalAlerts = alertTypes.reduce((sum, type) => sum + type.value, 0);

  return (
    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-lg font-medium text-white">Alert Distribution</h3>
          <p className="text-gray-400 text-sm mt-1">Total alerts: {totalAlerts}</p>
        </div>
        <button
          onClick={fetchAlerts}
          disabled={loading}
          className="p-2 hover:bg-gray-700 rounded-full transition-colors relative group"
        >
          <BsArrowClockwise className={`w-4 h-4 text-gray-400 ${loading ? 'animate-spin' : 'group-hover:text-white'}`} />
          <span className="absolute hidden group-hover:block right-full mr-2 whitespace-nowrap bg-gray-700 text-gray-300 text-sm py-1 px-2 rounded">
            Refresh data
          </span>
        </button>
      </div>
      <div className="h-60">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={alertTypes}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={6}
              dataKey="value"
              startAngle={90}
              endAngle={450}
            >
              {alertTypes.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.color}
                  stroke="transparent"
                  className="hover:opacity-80 transition-opacity"
                />
              ))}
              <Label
                value={totalAlerts}
                position="center"
                className="text-base font-medium fill-current text-gray-300"
              />
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="grid grid-cols-2 gap-2 mt-3">
        {alertTypes.map((type, index) => (
          <div key={`legend-${index}`} className="flex items-center space-x-2">
            <div className={`w-2.5 h-2.5 rounded-full`} style={{ backgroundColor: type.color }} />
            <div className="flex flex-col">
              <span className="text-gray-300 text-xs">{type.name}</span>
              <span className="text-gray-400 text-xs">
                {type.value} alerts
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}