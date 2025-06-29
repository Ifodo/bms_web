'use client';

import { useState, useMemo } from 'react';
import { 
  BsBatteryFull, 
  BsBatteryHalf, 
  BsBattery, 
  BsX, 
  BsSearch, 
  BsChevronLeft, 
  BsChevronRight,
  BsExclamationTriangle,
  BsClock,
  BsLightning,
  BsArrowLeft
} from 'react-icons/bs';

interface BatteryCell {
  id: string;
  voltage: number;
  temperature: number;
  status: 'normal' | 'warning' | 'critical';
  balanceStatus: 'balanced' | 'balancing' | 'unbalanced';
}

interface BatteryAlert {
  id: string;
  type: 'overvoltage' | 'overheating' | 'lowSoc' | 'fault';
  severity: 'critical' | 'warning' | 'info';
  message: string;
  timestamp: string;
  acknowledged: boolean;
}

interface BatteryFault {
  id: string;
  code: string;
  description: string;
  timestamp: string;
  status: 'active' | 'resolved';
}

interface Battery {
  id: number;
  sku: string;
  imei: string;
  soc: number;
  voltage: number;
  temperature: number;
  current: string;
  cycles: number;
  health: number;
  status: 'Active' | 'Warning';
  lastUpdate: string;
  cellBalanceStatus: 'balanced' | 'balancing' | 'unbalanced';
  cells: BatteryCell[];
  alerts: BatteryAlert[];
  faults: BatteryFault[];
}

// Mock data for batteries
const batteries: Battery[] = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  sku: `BMS-${(1000 + i).toString()}`,
  imei: `865432${(10000000 + i).toString()}`,
  soc: Math.round(30 + Math.random() * 70),
  voltage: 3.7 + Math.random() * 0.6,
  temperature: 25 + Math.random() * 10,
  current: (Math.random() * 2 - 1).toFixed(2),
  cycles: Math.floor(Math.random() * 500),
  health: Math.round(85 + Math.random() * 15),
  status: Math.random() > 0.1 ? 'Active' : 'Warning',
  lastUpdate: new Date(Date.now() - Math.random() * 86400000).toLocaleString(),
  cellBalanceStatus: Math.random() > 0.7 ? 'unbalanced' : Math.random() > 0.4 ? 'balancing' : 'balanced',
  cells: Array.from({ length: 16 }, (_, cellIndex) => ({
    id: `C${cellIndex + 1}`,
    voltage: 3.2 + Math.random() * 0.8,
    temperature: 25 + Math.random() * 5,
    status: Math.random() > 0.9 
      ? 'critical' 
      : Math.random() > 0.8 
        ? 'warning' 
        : 'normal',
    balanceStatus: 'balanced'
  })),
  alerts: [
    {
      id: `A${i}1`,
      type: 'overvoltage',
      severity: 'warning',
      message: 'High voltage detected in cell C12',
      timestamp: new Date(Date.now() - Math.random() * 3600000).toISOString(),
      acknowledged: false
    },
    {
      id: `A${i}2`,
      type: 'overheating',
      severity: 'critical',
      message: 'Critical temperature in cell C8',
      timestamp: new Date(Date.now() - Math.random() * 7200000).toISOString(),
      acknowledged: true
    }
  ],
  faults: [
    {
      id: `F${i}1`,
      code: 'F001',
      description: 'Communication timeout with cell C16',
      timestamp: new Date(Date.now() - Math.random() * 3600000).toISOString(),
      status: 'active'
    },
    {
      id: `F${i}2`,
      code: 'F003',
      description: 'Temperature sensor malfunction in cell C4',
      timestamp: new Date(Date.now() - Math.random() * 7200000).toISOString(),
      status: 'resolved'
    }
  ]
}));

export default function BatteriesPage() {
  const [selectedBattery, setSelectedBattery] = useState<Battery | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const getBatteryIcon = (soc: number) => {
    if (soc >= 75) return <BsBatteryFull className="h-6 w-6 text-green-500" />;
    if (soc >= 50) return <BsBatteryHalf className="h-6 w-6 text-yellow-500" />;
    return <BsBattery className="h-6 w-6 text-red-500" />;
  };

  const getCellStatusColor = (status: BatteryCell['status']) => {
    switch (status) {
      case 'normal':
        return 'bg-green-500/20 border-green-500/50 text-green-500';
      case 'warning':
        return 'bg-yellow-500/20 border-yellow-500/50 text-yellow-500';
      case 'critical':
        return 'bg-red-500/20 border-red-500/50 text-red-500';
    }
  };

  const getBalanceStatusBadge = (status: Battery['cellBalanceStatus']) => {
    switch (status) {
      case 'balanced':
        return 'bg-green-500/20 text-green-500';
      case 'balancing':
        return 'bg-blue-500/20 text-blue-500 animate-pulse';
      case 'unbalanced':
        return 'bg-yellow-500/20 text-yellow-500';
    }
  };

  const BatteryIndicator = ({ voltage, temperature }: { voltage: number; temperature: number }) => {
    const maxVoltage = 4.0;
    const minVoltage = 3.2;
    const percentage = Math.min(100, Math.max(0, ((voltage - minVoltage) / (maxVoltage - minVoltage)) * 100));
    
    const getLineColor = (threshold: number) => {
      if (percentage >= threshold) {
        if (percentage >= 75) return 'bg-green-500';
        if (percentage >= 50) return 'bg-yellow-500';
        return 'bg-red-500';
      }
      return 'bg-gray-600';
    };

    return (
      <div className="flex items-center gap-2 w-full">
        <div className="relative w-8 h-16 sm:w-9 sm:h-[4.5rem]">
          {/* Battery cap */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-1 bg-current rounded-t-sm" />
          
          {/* Battery body */}
          <div className="absolute top-1 w-full h-[calc(100%-4px)] border-2 rounded-md border-current p-[2px]">
            <div className="h-full flex flex-col-reverse gap-[2px]">
              <div className={`h-[30%] rounded-[2px] transition-colors ${getLineColor(30)}`} />
              <div className={`h-[30%] rounded-[2px] transition-colors ${getLineColor(60)}`} />
              <div className={`h-[30%] rounded-[2px] transition-colors ${getLineColor(90)}`} />
            </div>
          </div>
        </div>

        {/* Measurements */}
        <div className="flex flex-col text-[0.65rem] sm:text-xs gap-0.5">
          <div className="flex items-center gap-1">
            <span className="text-gray-400">V:</span>
            <span className="font-medium">{voltage.toFixed(2)}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-gray-400">T:</span>
            <span className="font-medium">{temperature.toFixed(1)}°</span>
          </div>
        </div>
      </div>
    );
  };

  // Filter batteries based on search query
  const filteredBatteries = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return batteries.filter(battery => 
      battery.sku.toLowerCase().includes(query) ||
      battery.imei.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredBatteries.length / itemsPerPage);
  const paginatedBatteries = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredBatteries.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredBatteries, currentPage]);

  if (selectedBattery) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSelectedBattery(null)}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <BsArrowLeft className="w-5 h-5 text-gray-400" />
            </button>
            <div>
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-blue-500/10 text-blue-500">
                  <BsBatteryFull className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                {selectedBattery.sku}
              </h2>
              <p className="text-sm text-gray-400 mt-1">
                IMEI: {selectedBattery.imei}
              </p>
            </div>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-gray-800 rounded-xl p-3 sm:p-4 border border-gray-700">
            <p className="text-xs sm:text-sm text-gray-400 mb-1">State of Charge</p>
            <div className="flex items-center gap-2">
              {getBatteryIcon(selectedBattery.soc)}
              <span className="text-xl sm:text-2xl font-semibold text-white">{selectedBattery.soc}%</span>
            </div>
          </div>
          <div className="bg-gray-800 rounded-xl p-3 sm:p-4 border border-gray-700">
            <p className="text-xs sm:text-sm text-gray-400 mb-1">Total Voltage</p>
            <div className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl font-semibold text-white">{selectedBattery.voltage.toFixed(2)}V</span>
            </div>
          </div>
          <div className="bg-gray-800 rounded-xl p-3 sm:p-4 border border-gray-700">
            <p className="text-xs sm:text-sm text-gray-400 mb-1">Temperature</p>
            <div className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl font-semibold text-white">{selectedBattery.temperature.toFixed(1)}°C</span>
            </div>
          </div>
          <div className="bg-gray-800 rounded-xl p-3 sm:p-4 border border-gray-700">
            <p className="text-xs sm:text-sm text-gray-400 mb-1">Health</p>
            <div className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl font-semibold text-white">{selectedBattery.health}%</span>
            </div>
          </div>
        </div>

        {/* Battery Info */}
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <h4 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">Battery Information</h4>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 text-xs sm:text-sm">
            <div>
              <p className="text-gray-400">IMEI</p>
              <p className="text-white font-medium">{selectedBattery.imei}</p>
            </div>
            <div>
              <p className="text-gray-400">Current</p>
              <p className="text-white font-medium">{selectedBattery.current}A</p>
            </div>
            <div>
              <p className="text-gray-400">Cycle Count</p>
              <p className="text-white font-medium">{selectedBattery.cycles} cycles</p>
            </div>
            <div>
              <p className="text-gray-400">Last Update</p>
              <p className="text-white font-medium">{selectedBattery.lastUpdate}</p>
            </div>
            <div className="lg:col-span-4">
              <p className="text-gray-400">Cell Balance Status</p>
              <div className="flex items-center gap-2 mt-1">
                <span className={`px-2 py-1 rounded-md text-xs font-medium ${getBalanceStatusBadge(selectedBattery.cellBalanceStatus)}`}>
                  {selectedBattery.cellBalanceStatus}
                </span>
                {selectedBattery.cellBalanceStatus === 'unbalanced' && (
                  <span className="text-gray-400">• Action required</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Cells Section */}
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 mb-4">
            <h4 className="text-base sm:text-lg font-semibold text-white">Battery Cells</h4>
            <div className="flex flex-wrap items-center gap-3 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                <span className="text-gray-400">Normal</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
                <span className="text-gray-400">Warning</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                <span className="text-gray-400">Critical</span>
              </div>
            </div>
          </div>
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-1.5 sm:gap-2">
              {selectedBattery.cells.map((cell) => (
                <div
                  key={cell.id}
                  className={`p-1.5 sm:p-2 rounded-lg border ${getCellStatusColor(cell.status)}`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[0.65rem] sm:text-xs font-medium">Cell {cell.id}</span>
                    {cell.status !== 'normal' && (
                      <BsExclamationTriangle className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-center">
                      <BatteryIndicator voltage={cell.voltage} temperature={cell.temperature} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Alerts & Faults Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
          {/* Alerts Panel */}
          <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
            <h4 className="text-base sm:text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <BsExclamationTriangle className="w-5 h-5 text-yellow-500" />
              Active Alerts
            </h4>
            <div className="space-y-2">
              {selectedBattery.alerts.map(alert => (
                <div
                  key={alert.id}
                  className={`p-3 rounded-lg border ${
                    alert.severity === 'critical'
                      ? 'bg-red-500/10 border-red-500/30 text-red-500'
                      : alert.severity === 'warning'
                      ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-500'
                      : 'bg-blue-500/10 border-blue-500/30 text-blue-500'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium">{alert.message}</p>
                      <div className="flex items-center gap-2 mt-1 text-xs opacity-80">
                        <BsClock className="w-3.5 h-3.5" />
                        <span>{new Date(alert.timestamp).toLocaleString()}</span>
                      </div>
                    </div>
                    {alert.acknowledged && (
                      <div className="bg-green-500/20 text-green-500 px-2 py-1 rounded text-xs">
                        Acknowledged
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {selectedBattery.alerts.length === 0 && (
                <p className="text-gray-400 text-center py-4">No active alerts</p>
              )}
            </div>
          </div>

          {/* Faults Panel */}
          <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
            <h4 className="text-base sm:text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <BsLightning className="w-5 h-5 text-red-500" />
              System Faults
            </h4>
            <div className="space-y-2">
              {selectedBattery.faults.map(fault => (
                <div
                  key={fault.id}
                  className={`p-3 rounded-lg border ${
                    fault.status === 'active'
                      ? 'bg-red-500/10 border-red-500/30 text-red-500'
                      : 'bg-gray-600/30 border-gray-600/30 text-gray-400'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm">{fault.code}</span>
                        <span className="font-medium">{fault.description}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-xs opacity-80">
                        <BsClock className="w-3.5 h-3.5" />
                        <span>{new Date(fault.timestamp).toLocaleString()}</span>
                      </div>
                    </div>
                    <div className={`px-2 py-1 rounded text-xs ${
                      fault.status === 'active'
                        ? 'bg-red-500/20 text-red-500'
                        : 'bg-green-500/20 text-green-500'
                    }`}>
                      {fault.status === 'active' ? 'Active' : 'Resolved'}
                    </div>
                  </div>
                </div>
              ))}
              {selectedBattery.faults.length === 0 && (
                <p className="text-gray-400 text-center py-4">No system faults</p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Batteries List */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-white">Batteries</h2>
          
          {/* Search Box */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search by SKU or IMEI..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1); // Reset to first page on search
              }}
              className="w-64 px-4 py-2 pl-10 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <BsSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-gray-400 border-b border-gray-700">
                <th className="pb-3 px-4">SKU</th>
                <th className="pb-3 px-4">IMEI</th>
                <th className="pb-3 px-4">Status</th>
                <th className="pb-3 px-4">SOC</th>
                <th className="pb-3 px-4"></th>
              </tr>
            </thead>
            <tbody>
              {paginatedBatteries.map((battery) => (
                <tr
                  key={battery.id}
                  onClick={() => setSelectedBattery(battery)}
                  className="border-b border-gray-700 hover:bg-gray-700/50 cursor-pointer transition-colors"
                >
                  <td className="py-4 px-4 text-white">{battery.sku}</td>
                  <td className="py-4 px-4 text-white">{battery.imei}</td>
                  <td className="py-4 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      battery.status === 'Active' 
                        ? 'bg-green-500/20 text-green-500' 
                        : 'bg-yellow-500/20 text-yellow-500'
                    }`}>
                      {battery.status}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      {getBatteryIcon(battery.soc)}
                      <span className="text-white">{battery.soc}%</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-blue-400 hover:text-blue-300">
                    View Details
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-400">
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredBatteries.length)} of {filteredBatteries.length} batteries
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg bg-gray-700 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600"
            >
              <BsChevronLeft className="h-5 w-5" />
            </button>
            <span className="text-white px-4">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg bg-gray-700 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600"
            >
              <BsChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 