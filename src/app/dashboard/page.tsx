import React from 'react';
import BatteryDistribution from '@/components/BatteryDistribution';
import RecentAlerts from '@/components/RecentAlerts';

export default function DashboardPage() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Battery Distribution</h2>
          <BatteryDistribution />
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Recent Alerts</h2>
          <RecentAlerts />
        </div>
      </div>

      <div className="mt-6 bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">System Status</h2>
        <p className="text-gray-600">The system&apos;s current status is operational.</p>
      </div>
    </div>
  );
} 