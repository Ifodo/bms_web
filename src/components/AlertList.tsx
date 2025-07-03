import { useState, useEffect } from 'react';
import { Alert, AlertResponse } from '@/types/alert';
import { format } from 'date-fns';
import { FiSearch } from 'react-icons/fi';

export default function AlertList() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      const response = await fetch('https://api.bms.autotrack.ng/api/alerts/recent', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch alerts');
      }

      const data: AlertResponse = await response.json();
      
      // Convert object to array, filtering out non-Alert properties
      const alertArray = Object.entries(data)
        .filter(([key, value]) => !isNaN(Number(key)))
        .map(([_, value]) => value as Alert);

      setAlerts(alertArray);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'high':
        return 'bg-red-900/20 text-red-400';
      case 'medium':
        return 'bg-yellow-900/20 text-yellow-400';
      case 'low':
        return 'bg-green-900/20 text-green-400';
      default:
        return 'bg-gray-900/20 text-gray-400';
    }
  };

  const filteredAlerts = alerts.filter(alert => {
    const searchLower = searchQuery.toLowerCase();
    return (
      alert.deviceName.toLowerCase().includes(searchLower) ||
      alert.type.toLowerCase().includes(searchLower) ||
      alert.message.toLowerCase().includes(searchLower)
    );
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-400 text-center py-8">{error}</div>;
  }

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 p-6">
      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search alerts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 pl-10 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
          />
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-4">
        {filteredAlerts.map((alert) => (
          <div
            key={alert.id}
            onClick={() => setSelectedAlert(alert)}
            className="bg-gray-700 p-4 rounded-lg border border-gray-600 hover:border-blue-500 transition-colors cursor-pointer"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-white">{alert.deviceName}</h3>
                <p className="text-sm text-gray-300 mt-1">{alert.message}</p>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-xs text-gray-400">
                    {format(new Date(alert.timestamp), 'MMM d, yyyy HH:mm:ss')}
                  </span>
                  <span className="text-xs text-gray-400">
                    Type: {alert.type}
                  </span>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm ${getSeverityColor(alert.severity)}`}>
                {alert.severity}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Alert Detail Modal */}
      {selectedAlert && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-lg w-full mx-4 border border-gray-700">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-semibold text-white">{selectedAlert.deviceName}</h2>
              <button
                onClick={() => setSelectedAlert(null)}
                className="text-gray-400 hover:text-gray-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-400">Device ID</label>
                <p className="text-white mt-1">{selectedAlert.deviceId}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-400">Type</label>
                <p className="text-white mt-1">{selectedAlert.type}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-400">Message</label>
                <p className="text-white mt-1">{selectedAlert.message}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-400">Severity</label>
                <span className={`inline-block px-3 py-1 rounded-full text-sm mt-1 ${getSeverityColor(selectedAlert.severity)}`}>
                  {selectedAlert.severity}
                </span>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-400">Status</label>
                <p className="text-white mt-1">{selectedAlert.isActive ? 'Active' : 'Resolved'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-400">Timestamp</label>
                <p className="text-white mt-1">
                  {format(new Date(selectedAlert.timestamp), 'PPpp')}
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedAlert(null)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 