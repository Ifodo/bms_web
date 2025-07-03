'use client';

import AlertList from '@/components/AlertList';

export default function AlertsPage() {
  return (
    <div className="p-6 bg-gray-900 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Alerts</h1>
        <p className="text-gray-400 mt-1">Monitor and manage battery alerts</p>
      </div>
      
      <AlertList />
    </div>
  );
} 