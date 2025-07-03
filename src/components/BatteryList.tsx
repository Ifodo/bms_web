'use client';

import { useState, useEffect } from 'react';
import { Battery, BatteryResponse } from '@/types/battery';
import { useAuth } from '@/contexts/AuthContext';
import { FiSearch } from 'react-icons/fi';

interface BatteryListProps {
  onViewDetails?: (batteryId: string) => void;
}

export default function BatteryList({ onViewDetails = () => {} }: BatteryListProps) {
  const [batteries, setBatteries] = useState<Battery[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [meta, setMeta] = useState<BatteryResponse['meta'] | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { getToken } = useAuth();

  useEffect(() => {
    fetchBatteries();
  }, [currentPage]);

  const fetchBatteries = async () => {
    try {
      setLoading(true);
      const token = getToken();
      
      if (!token) {
        setError('Authentication required');
        return;
      }

      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        limit: '5',
      });

      const response = await fetch(
        `https://api.bms.autotrack.ng/devices?${queryParams}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      
      const data: BatteryResponse = await response.json();

      if (data.success) {
        setBatteries(data.data);
        setMeta(data.meta);
        setError(null);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to fetch batteries');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const filteredBatteries = batteries.filter(battery => {
    const searchLower = searchQuery.toLowerCase();
    return (
      battery.deviceName.toLowerCase().includes(searchLower) ||
      battery.deviceType.toLowerCase().includes(searchLower)
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

  const renderPaginationButtons = () => {
    if (!meta) return null;

    const totalPages = parseInt(meta.totalPages.toString());
    const currentPageNum = parseInt(meta.currentPage);
    const buttons = [];

    // Previous button
    buttons.push(
      <button
        key="prev"
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
    );

    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 || // First page
        i === totalPages || // Last page
        (i >= currentPageNum - 1 && i <= currentPageNum + 1) // Pages around current
      ) {
        buttons.push(
          <button
            key={i}
            onClick={() => setCurrentPage(i)}
            className={`px-4 py-2 rounded-lg ${
              i === currentPageNum
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-white hover:bg-blue-500'
            }`}
          >
            {i}
          </button>
        );
      } else if (
        i === currentPageNum - 2 ||
        i === currentPageNum + 2
      ) {
        // Add ellipsis
        buttons.push(
          <span key={`ellipsis-${i}`} className="px-3 py-2 text-gray-400">
            ...
          </span>
        );
      }
    }

    // Next button
    buttons.push(
      <button
        key="next"
        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
        disabled={currentPage === totalPages}
        className={`px-4 py-2 rounded-lg ${
          currentPage === totalPages
            ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
            : 'bg-blue-500 text-white hover:bg-blue-600'
        }`}
      >
        Next
      </button>
    );

    return buttons;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-400 text-center py-8">
        {error}
      </div>
    );
  }

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
                placeholder="Search batteries..."
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
                  <th className="pb-3 px-4 text-gray-400 font-medium w-1/4 border-r border-gray-700">Battery</th>
                  <th className="pb-3 px-4 text-gray-400 font-medium w-1/4 border-r border-gray-700">Type</th>
                  <th className="pb-3 px-4 text-gray-400 font-medium w-1/4 border-r border-gray-700">Status</th>
                  <th className="pb-3 px-4 text-gray-400 font-medium w-1/4 text-right">Actions</th>
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
                    <td className="py-4 px-4 text-white border-r border-gray-700">{battery.deviceType}</td>
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

          {/* Enhanced Pagination */}
          {meta && meta.totalPages > 1 && (
            <div className="mt-6 flex justify-center items-center space-x-2">
              {renderPaginationButtons()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 