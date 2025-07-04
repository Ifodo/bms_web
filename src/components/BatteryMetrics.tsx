'use client';

import { useState, useEffect } from 'react';
import { BsBatteryCharging, BsBell } from 'react-icons/bs';
import { IoMdBatteryFull } from 'react-icons/io';
import { TbBatteryEco } from 'react-icons/tb';
import { useAuth } from '@/contexts/AuthContext';

interface AlertsResponse {
  success: boolean;
  message: string;
  code: number;
  returnStatus: string;
  count: number;
  change?: number;
}

interface BatteryResponse {
  success: boolean;
  message: string;
  code: number;
  returnStatus: string;
  data: any[];
  meta: {
    totalItems: number;
    count: number;
    itemsPerPage: string;
    currentPage: string;
    totalPages: number;
  };
}

export default function BatteryMetrics() {
  const [alerts, setAlerts] = useState<AlertsResponse | null>(null);
  const [totalBatteries, setTotalBatteries] = useState<number>(0);
  const [healthyBatteries, setHealthyBatteries] = useState<number>(0);
  const { getToken } = useAuth();
  
  // Dummy data for demonstration
  const metrics = {
    averageSOC: 72, // 72%
  };

  useEffect(() => {
    fetchAlerts();
    fetchBatteries();
  }, []);

  const fetchBatteries = async () => {
    try {
      const token = getToken();
      if (!token) return;

      const response = await fetch('https://api.bms.autotrack.ng/devices?page=1&limit=1000', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch batteries');
      }

      const data: BatteryResponse = await response.json();
      if (data.success) {
        setTotalBatteries(data.meta.totalItems);
        // Count batteries with good health (isActive and no critical alerts)
        const healthy = data.data.filter(battery => 
          battery.isActive && !battery.hasAlerts
        ).length;
        setHealthyBatteries(healthy);
      }
    } catch (error) {
      console.error('Error fetching batteries:', error);
    }
  };

  const fetchAlerts = async () => {
    try {
      const token = getToken();
      if (!token) return;

      const response = await fetch('https://api.bms.autotrack.ng/api/alerts/active', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch alerts');
      }

      const data: AlertsResponse = await response.json();
      if (data.success) {
        setAlerts(data);
      }
    } catch (error) {
      console.error('Error fetching alerts:', error);
    }
  };

  const getAlertColor = (count: number) => {
    if (count === 0) return 'text-green-400';
    if (count <= 2) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getHealthyPercentage = () => {
    if (totalBatteries === 0) return 0;
    return Math.round((healthyBatteries / totalBatteries) * 100);
  };

  const getHealthColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-400';
    if (percentage >= 50) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Total Batteries Card */}
      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gray-700/50 rounded-lg">
              <IoMdBatteryFull className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Total Batteries</p>
              <p className="text-xl font-semibold text-blue-400">
                {totalBatteries}
              </p>
            </div>
          </div>
          <div className="text-xs text-gray-500">
            Battery Count
          </div>
        </div>
      </div>

      {/* Healthy Batteries Card */}
      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gray-700/50 rounded-lg">
              <TbBatteryEco className={`w-6 h-6 ${getHealthColor(getHealthyPercentage())}`} />
            </div>
            <div>
              <p className="text-sm text-gray-400">Healthy Batteries</p>
              <div className="flex items-baseline space-x-2">
                <p className={`text-xl font-semibold ${getHealthColor(getHealthyPercentage())}`}>
                  {healthyBatteries}
                </p>
                <span className="text-xs text-gray-400">
                  ({getHealthyPercentage()}%)
                </span>
              </div>
            </div>
          </div>
          <div className="text-xs text-gray-500">
            System Health
          </div>
        </div>
      </div>

      {/* Active Alerts Card */}
      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gray-700/50 rounded-lg">
              <BsBell className={`w-6 h-6 ${alerts?.count ? 'text-red-400 animate-pulse' : 'text-blue-400'}`} />
            </div>
            <div>
              <p className="text-sm text-gray-400">Active Alerts</p>
              <div className="flex items-center space-x-2">
                <p className={`text-xl font-semibold ${alerts ? getAlertColor(alerts.count) : 'text-gray-400'}`}>
                  {alerts?.count || 0}
                </p>
                {alerts?.change && alerts.change > 0 && (
                  <span className="text-xs text-red-400">+{alerts.change}</span>
                )}
              </div>
            </div>
          </div>
          <div className="text-xs text-gray-500">
            System Alerts
          </div>
        </div>
      </div>
    </div>
  );
} 