'use client';

import { useState, useEffect } from 'react';
import { Battery, BatteryResponse } from '@/types/battery';
import { useAuth } from '@/contexts/AuthContext';
import { FiSearch } from 'react-icons/fi';

interface BatteryListProps {
  onViewDetails?: (deviceId: string) => void;
}

export default function BatteryList({ onViewDetails = () => {} }: BatteryListProps) {
  const [batteries, setBatteries] = useState<Battery[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [meta, setMeta] = useState<BatteryResponse['meta'] | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { getToken, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      fetchBatteries();
    }
  }, [currentPage, isAuthenticated]);

  const fetchBatteries = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = getToken();
      
      console.log('Fetching batteries - Auth state:', { isAuthenticated, hasToken: !!token });
      
      if (!token) {
        setError('Authentication required');
        return;
      }

      const response = await fetch(
        `https://api.bms.autotrack.ng/devices?page=${currentPage}&limit=5`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        console.error('API Error:', response.status, response.statusText);
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const data: BatteryResponse = await response.json();
      console.log('API Response:', data);

      if (data.success) {
        console.log('Setting batteries:', data.data);
        setBatteries(data.data);
        setMeta(data.meta);
        setError(null);
      } else {
        console.log('Error from API:', data.message);
        setError(data.message || 'Failed to fetch batteries');
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch batteries');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const filteredBatteries = batteries.filter(battery => {
    if (!searchQuery) return true;
    const searchLower = searchQuery.toLowerCase();
    return (
      battery.deviceName.toLowerCase().includes(searchLower) ||
      battery.deviceType.toLowerCase().includes(searchLower) ||
      battery.deviceId.toLowerCase().includes(searchLower)
    );
  });

  const getStatusBadge = (isActive: boolean) => {
    return (
      <span
        className={`px-3 py-1 rounded-full text-sm ${
          isActive
            ? 'bg-green-900/20 text-green-400'
            : 'bg-red-900/20 text-red-400'
        }`}
      >
        {isActive ? 'Active' : 'Inactive'}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px] bg-gray-900">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <p className="text-white mt-4">Loading batteries...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[400px] bg-gray-900">
        <div className="text-red-400 text-center py-8">
          <p className="text-xl">Error</p>
          <p className="mt-2">{error}</p>
          <button
            onClick={fetchBatteries}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  console.log('Rendering batteries:', batteries);
  console.log('Filtered batteries:', filteredBatteries);

  return (
    <div className="bg-gray-900 min-h-screen">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white">Battery Cells</h1>
        </div>

        <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 p-6">
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="mb-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by name, type, or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 pl-10 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
              />
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </form>

          {/* Battery List */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="text-left border-b border-gray-700">
                  <th className="pb-3 px-4 text-gray-400 font-medium w-[80px] text-center border-r border-gray-700">No</th>
                  <th className="pb-3 px-4 text-gray-400 font-medium border-r border-gray-700">Battery</th>
                  <th className="pb-3 px-4 text-gray-400 font-medium border-r border-gray-700">Device ID</th>
                  <th className="pb-3 px-4 text-gray-400 font-medium border-r border-gray-700">Type</th>
                  <th className="pb-3 px-4 text-gray-400 font-medium border-r border-gray-700">Status</th>
                  <th className="pb-3 px-4 text-gray-400 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredBatteries.map((battery, index) => (
                  <tr key={battery._id} className="border-b border-gray-700">
                    <td className="py-4 px-4 text-gray-400 text-center font-medium border-r border-gray-700">
                      {(currentPage - 1) * 5 + index + 1}
                    </td>
                    <td className="py-4 px-4 text-white border-r border-gray-700">
                      <div className="flex items-center">
                        <span>{battery.deviceName}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-white border-r border-gray-700">
                      {battery.deviceId}
                    </td>
                    <td className="py-4 px-4 text-white border-r border-gray-700">
                      {battery.deviceType}
                    </td>
                    <td className="py-4 px-4 border-r border-gray-700">
                      {getStatusBadge(battery.isActive)}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <button
                        onClick={() => onViewDetails(battery.deviceId)}
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
          {meta && meta.totalPages > 1 && (
            <div className="mt-6 flex justify-center items-center space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-lg ${
                  currentPage === 1
                    ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                Previous
              </button>
              <span className="text-gray-400">
                Page {currentPage} of {meta.totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(meta.totalPages, prev + 1))}
                disabled={currentPage === meta.totalPages}
                className={`px-4 py-2 rounded-lg ${
                  currentPage === meta.totalPages
                    ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
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