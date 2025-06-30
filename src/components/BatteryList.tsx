'use client';

import { useState } from 'react';
import { BsBatteryFull, BsBatteryHalf, BsBattery } from 'react-icons/bs';

interface Battery {
  id: string;
  sku: string;
  imei: string;
  status: 'normal' | 'warning' | 'critical';
  soc: number;
  lastUpdate: string;
  voltage: number;
  temperature: number;
  manufacturer: string;
  model: string;
}

interface BatteryListProps {
  onViewDetails?: (batteryId: string) => void;
}

export default function BatteryList({ onViewDetails = () => {} }: BatteryListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  // Dummy data for demonstration
  const batteries: Battery[] = [
    {
      id: 'BMS-1000',
      sku: 'BMS-LI-48V-100AH',
      imei: '865432100000001',
      status: 'normal',
      soc: 95,
      lastUpdate: '2024-03-28 14:30:22',
      voltage: 48.2,
      temperature: 25.6,
      manufacturer: 'AutoTrack',
      model: 'AT-100-48'
    },
    {
      id: 'BMS-1001',
      sku: 'BMS-LI-48V-150AH',
      imei: '865432100000002',
      status: 'warning',
      soc: 42,
      lastUpdate: '2024-03-28 14:28:15',
      voltage: 47.8,
      temperature: 32.4,
      manufacturer: 'AutoTrack',
      model: 'AT-150-48'
    },
    {
      id: 'BMS-1002',
      sku: 'BMS-LI-48V-200AH',
      imei: '865432100000003',
      status: 'critical',
      soc: 15,
      lastUpdate: '2024-03-28 14:25:45',
      voltage: 45.2,
      temperature: 38.9,
      manufacturer: 'AutoTrack',
      model: 'AT-200-48'
    },
    {
      id: 'BMS-1003',
      sku: 'BMS-LI-48V-100AH',
      imei: '865432100000004',
      status: 'normal',
      soc: 88,
      lastUpdate: '2024-03-28 14:29:33',
      voltage: 48.1,
      temperature: 26.2,
      manufacturer: 'AutoTrack',
      model: 'AT-100-48'
    },
    {
      id: 'BMS-1004',
      sku: 'BMS-LI-48V-150AH',
      imei: '865432100000005',
      status: 'normal',
      soc: 92,
      lastUpdate: '2024-03-28 14:31:10',
      voltage: 48.3,
      temperature: 24.8,
      manufacturer: 'AutoTrack',
      model: 'AT-150-48'
    },
    {
      id: 'BMS-1005',
      sku: 'BMS-LI-48V-200AH',
      imei: '865432100000006',
      status: 'warning',
      soc: 35,
      lastUpdate: '2024-03-28 14:27:55',
      voltage: 46.9,
      temperature: 33.7,
      manufacturer: 'AutoTrack',
      model: 'AT-200-48'
    },
    {
      id: 'BMS-1006',
      sku: 'BMS-LI-48V-100AH',
      imei: '865432100000007',
      status: 'normal',
      soc: 78,
      lastUpdate: '2024-03-28 14:30:48',
      voltage: 47.9,
      temperature: 27.3,
      manufacturer: 'AutoTrack',
      model: 'AT-100-48'
    },
    {
      id: 'BMS-1007',
      sku: 'BMS-LI-48V-150AH',
      imei: '865432100000008',
      status: 'critical',
      soc: 12,
      lastUpdate: '2024-03-28 14:26:30',
      voltage: 44.8,
      temperature: 39.5,
      manufacturer: 'AutoTrack',
      model: 'AT-150-48'
    },
    {
      id: 'BMS-1008',
      sku: 'BMS-LI-48V-200AH',
      imei: '865432100000009',
      status: 'normal',
      soc: 85,
      lastUpdate: '2024-03-28 14:29:15',
      voltage: 48.0,
      temperature: 26.8,
      manufacturer: 'AutoTrack',
      model: 'AT-200-48'
    },
    {
      id: 'BMS-1009',
      sku: 'BMS-LI-48V-100AH',
      imei: '865432100000010',
      status: 'warning',
      soc: 45,
      lastUpdate: '2024-03-28 14:28:40',
      voltage: 47.2,
      temperature: 31.9,
      manufacturer: 'AutoTrack',
      model: 'AT-100-48'
    }
  ];

  const itemsPerPage = 5;
  const filteredBatteries = batteries.filter(
    battery =>
      battery.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      battery.imei.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const totalPages = Math.ceil(filteredBatteries.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentBatteries = filteredBatteries.slice(startIndex, endIndex);

  const getBatteryIcon = (soc: number) => {
    if (soc >= 70) return <BsBatteryFull className="w-6 h-6" />;
    if (soc >= 30) return <BsBatteryHalf className="w-6 h-6" />;
    return <BsBattery className="w-6 h-6" />;
  };

  const getStatusColor = (status: Battery['status']) => {
    switch (status) {
      case 'normal':
        return 'text-green-400';
      case 'warning':
        return 'text-yellow-400';
      case 'critical':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white">Battery List</h1>
          <button
            onClick={() => console.log('Export data')}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Export Data
          </button>
        </div>

        <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 p-6">
          {/* Search Bar */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search by SKU or IMEI..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Battery List */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-gray-700">
                  <th className="pb-3 text-gray-400 font-medium">Battery</th>
                  <th className="pb-3 text-gray-400 font-medium">SKU</th>
                  <th className="pb-3 text-gray-400 font-medium">IMEI</th>
                  <th className="pb-3 text-gray-400 font-medium">Status</th>
                  <th className="pb-3 text-gray-400 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentBatteries.map((battery) => (
                  <tr key={battery.id} className="border-b border-gray-700">
                    <td className="py-4">
                      <div className="flex items-center space-x-3">
                        <div className={getStatusColor(battery.status)}>
                          {getBatteryIcon(battery.soc)}
                        </div>
                        <span className="text-white">{battery.id}</span>
                      </div>
                    </td>
                    <td className="py-4 text-white">{battery.sku}</td>
                    <td className="py-4 text-white">{battery.imei}</td>
                    <td className="py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${
                          battery.status === 'normal'
                            ? 'bg-green-900/20 text-green-400'
                            : battery.status === 'warning'
                            ? 'bg-yellow-900/20 text-yellow-400'
                            : 'bg-red-900/20 text-red-400'
                        }`}
                      >
                        {battery.status.charAt(0).toUpperCase() + battery.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-4">
                      <button
                        onClick={() => onViewDetails(battery.id)}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-6">
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="text-gray-400">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 