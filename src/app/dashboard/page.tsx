'use client';

import React from 'react';
import BatteryDistribution from '@/components/BatteryDistribution';
import RecentAlerts from '@/components/RecentAlerts';
import BatteryMetrics from '@/components/BatteryMetrics';

export default function DashboardPage() {
  return (
    <div className="p-6 bg-gray-900 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-white">Dashboard Overview</h1>
      
      <div className="mb-6">
        <BatteryMetrics />
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-white">Battery Distribution</h2>
          <BatteryDistribution />
        </div>

        <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-white">Recent Alerts</h2>
          <RecentAlerts />
        </div>
      </div>

      <div className="mt-6 bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
        <h2 className="text-xl font-semibold mb-4 text-white">System Status</h2>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <p className="text-gray-300">System is operational</p>
        </div>
      </div>
    </div>
  );
} 