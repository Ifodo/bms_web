'use client';

import { useState } from 'react';
import { 
  BsExclamationTriangle, 
  BsThermometerHigh, 
  BsBatteryFull, 
  BsLightning,
  BsCheck2Circle,
  BsFilter,
  BsChevronDown,
  BsChevronUp,
  BsClock,
  BsX,
  BsArrowLeft,
  BsChevronRight
} from 'react-icons/bs';

type AlertSeverity = 'critical' | 'warning' | 'info';
type AlertType = 'overvoltage' | 'overheating' | 'lowSoc' | 'fault';

interface Alert {
  id: string;
  type: AlertType;
  severity: AlertSeverity;
  message: string;
  cellId: string;
  timestamp: string;
  acknowledged: boolean;
  details: string;
  affectedBatteries: Battery[];
}

interface Battery {
  id: number;
  sku: string;
  imei: string;
  soc: number;
  voltage: number;
  temperature: number;
  current: string;
  status: 'Active' | 'Warning';
  lastUpdate: string;
}

// Mock data for alerts with affected batteries
const mockAlerts: Alert[] = [
  {
    id: '1',
    type: 'overvoltage',
    severity: 'critical',
    message: 'Cell voltage exceeds maximum threshold',
    cellId: 'BMS-1001-C12',
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    acknowledged: false,
    details: 'Voltage: 4.25V (Max: 4.2V)\nImmediate action required to prevent cell damage.',
    affectedBatteries: [
      {
        id: 1,
        sku: 'BMS-1001',
        imei: '865432100001',
        soc: 85,
        voltage: 4.25,
        temperature: 35,
        current: '2.1',
        status: 'Warning',
        lastUpdate: new Date(Date.now() - 1000 * 60 * 5).toLocaleString(),
      },
      {
        id: 2,
        sku: 'BMS-1002',
        imei: '865432100002',
        soc: 82,
        voltage: 4.22,
        temperature: 34,
        current: '1.9',
        status: 'Warning',
        lastUpdate: new Date(Date.now() - 1000 * 60 * 10).toLocaleString(),
      },
    ],
  },
  {
    id: '2',
    type: 'overheating',
    severity: 'warning',
    message: 'High temperature detected',
    cellId: 'BMS-1002-C08',
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    acknowledged: false,
    details: 'Temperature: 45°C (Warning: >40°C)\nCheck cooling system and reduce load if necessary.',
    affectedBatteries: [
      {
        id: 3,
        sku: 'BMS-1003',
        imei: '865432100003',
        soc: 78,
        voltage: 3.95,
        temperature: 45,
        current: '1.5',
        status: 'Warning',
        lastUpdate: new Date(Date.now() - 1000 * 60 * 15).toLocaleString(),
      },
    ],
  },
  {
    id: '3',
    type: 'lowSoc',
    severity: 'warning',
    message: 'Low State of Charge',
    cellId: 'BMS-1003-C04',
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    acknowledged: true,
    details: 'SOC: 15% (Warning: <20%)\nConnect to charger to prevent deep discharge.',
    affectedBatteries: [
      {
        id: 4,
        sku: 'BMS-1004',
        imei: '865432100004',
        soc: 15,
        voltage: 3.45,
        temperature: 28,
        current: '-0.5',
        status: 'Warning',
        lastUpdate: new Date(Date.now() - 1000 * 60 * 30).toLocaleString(),
      },
    ],
  },
  {
    id: '4',
    type: 'fault',
    severity: 'critical',
    message: 'Communication error with cell',
    cellId: 'BMS-1004-C16',
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    acknowledged: false,
    details: 'Cell not responding to queries\nCheck physical connections and restart if necessary.',
    affectedBatteries: [
      {
        id: 5,
        sku: 'BMS-1005',
        imei: '865432100005',
        soc: 65,
        voltage: 3.85,
        temperature: 32,
        current: '0.0',
        status: 'Warning',
        lastUpdate: new Date(Date.now() - 1000 * 60 * 45).toLocaleString(),
      },
    ],
  },
  // Add more mock alerts as needed
];

const getAlertIcon = (type: AlertType) => {
  switch (type) {
    case 'overvoltage':
      return <BsLightning className="w-5 h-5" />;
    case 'overheating':
      return <BsThermometerHigh className="w-5 h-5" />;
    case 'lowSoc':
      return <BsBatteryFull className="w-5 h-5" />;
    case 'fault':
      return <BsExclamationTriangle className="w-5 h-5" />;
  }
};

const getSeverityColor = (severity: AlertSeverity) => {
  switch (severity) {
    case 'critical':
      return 'bg-red-500/10 text-red-500 border-red-500/50';
    case 'warning':
      return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/50';
    case 'info':
      return 'bg-blue-500/10 text-blue-500 border-blue-500/50';
  }
};

const getSeverityBadgeColor = (severity: AlertSeverity) => {
  switch (severity) {
    case 'critical':
      return 'bg-red-500/20 text-red-500';
    case 'warning':
      return 'bg-yellow-500/20 text-yellow-500';
    case 'info':
      return 'bg-blue-500/20 text-blue-500';
  }
};

export default function AlertsPage() {
  const [expandedAlerts, setExpandedAlerts] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState<AlertSeverity | 'all'>('all');
  const [showAcknowledged, setShowAcknowledged] = useState(true);
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [selectedBattery, setSelectedBattery] = useState<Battery | null>(null);

  const toggleExpand = (alertId: string) => {
    const newExpanded = new Set(expandedAlerts);
    if (newExpanded.has(alertId)) {
      newExpanded.delete(alertId);
    } else {
      newExpanded.add(alertId);
    }
    setExpandedAlerts(newExpanded);
  };

  const handleAcknowledge = (alertId: string) => {
    // In a real app, this would make an API call
    console.log('Acknowledging alert:', alertId);
  };

  const handleAlertClick = (alert: Alert) => {
    setSelectedAlert(alert);
    setSelectedBattery(null);
  };

  const handleBatteryClick = (battery: Battery) => {
    setSelectedBattery(battery);
  };

  const handleBack = () => {
    if (selectedBattery) {
      setSelectedBattery(null);
    } else {
      setSelectedAlert(null);
    }
  };

  const filteredAlerts = mockAlerts.filter(alert => {
    if (!showAcknowledged && alert.acknowledged) return false;
    if (filter === 'all') return true;
    return alert.severity === filter;
  });

  if (selectedAlert) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <div className="flex items-center gap-4">
            <button
              onClick={handleBack}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <BsArrowLeft className="w-5 h-5 text-gray-400" />
            </button>
            <div>
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                {getAlertIcon(selectedAlert.type)}
                {selectedAlert.message}
              </h2>
              <p className="text-sm text-gray-400 mt-1">
                {selectedAlert.affectedBatteries.length} batteries affected
              </p>
            </div>
          </div>
        </div>

        {selectedBattery ? (
          // Battery Details View
          <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-white">{selectedBattery.sku}</h3>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  selectedBattery.status === 'Warning' 
                    ? 'bg-yellow-500/20 text-yellow-500' 
                    : 'bg-green-500/20 text-green-500'
                }`}>
                  {selectedBattery.status}
                </span>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-gray-700/50 rounded-lg p-3">
                  <p className="text-sm text-gray-400">IMEI</p>
                  <p className="text-white font-medium">{selectedBattery.imei}</p>
                </div>
                <div className="bg-gray-700/50 rounded-lg p-3">
                  <p className="text-sm text-gray-400">Voltage</p>
                  <p className="text-white font-medium">{selectedBattery.voltage}V</p>
                </div>
                <div className="bg-gray-700/50 rounded-lg p-3">
                  <p className="text-sm text-gray-400">Temperature</p>
                  <p className="text-white font-medium">{selectedBattery.temperature}°C</p>
                </div>
                <div className="bg-gray-700/50 rounded-lg p-3">
                  <p className="text-sm text-gray-400">Current</p>
                  <p className="text-white font-medium">{selectedBattery.current}A</p>
                </div>
              </div>

              <div className="bg-gray-700/50 rounded-lg p-4 mt-4">
                <h4 className="text-white font-medium mb-2">Alert Details</h4>
                <pre className="text-sm text-gray-300 font-mono whitespace-pre-line bg-gray-800/50 rounded p-3">
                  {selectedAlert.details}
                </pre>
              </div>
            </div>
          </div>
        ) : (
          // Affected Batteries List
          <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
            <div className="space-y-3">
              {selectedAlert.affectedBatteries.map(battery => (
                <div
                  key={battery.id}
                  onClick={() => handleBatteryClick(battery)}
                  className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors"
                >
                  <div>
                    <h3 className="text-white font-medium">{battery.sku}</h3>
                    <p className="text-sm text-gray-400">IMEI: {battery.imei}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm text-gray-400">Voltage</p>
                      <p className="text-white">{battery.voltage}V</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-400">Temperature</p>
                      <p className="text-white">{battery.temperature}°C</p>
                    </div>
                    <BsChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <BsExclamationTriangle className="w-5 h-5 text-yellow-500" />
            Alerts & Notifications
          </h2>
          <div className="flex flex-wrap gap-3">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as AlertSeverity | 'all')}
              className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Severities</option>
              <option value="critical">Critical</option>
              <option value="warning">Warning</option>
              <option value="info">Info</option>
            </select>
            <button
              onClick={() => setShowAcknowledged(!showAcknowledged)}
              className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${
                showAcknowledged
                  ? 'bg-blue-500/10 text-blue-500 border-blue-500/50'
                  : 'bg-gray-700 text-gray-400 border-gray-600'
              }`}
            >
              Show Acknowledged
            </button>
          </div>
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-4">
        {filteredAlerts.map((alert) => (
          <div
            key={alert.id}
            className={`bg-gray-800 rounded-xl border transition-all duration-200 ${
              getSeverityColor(alert.severity)
            } ${
              expandedAlerts.has(alert.id) ? 'shadow-lg shadow-current/5' : ''
            }`}
          >
            {/* Alert Header */}
            <div
              className="p-4 flex items-start gap-4 cursor-pointer"
              onClick={() => handleAlertClick(alert)}
            >
              <div className={`p-2 rounded-lg ${getSeverityColor(alert.severity)}`}>
                {getAlertIcon(alert.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-medium text-white">{alert.message}</h3>
                    <p className="text-sm text-gray-400 mt-1">
                      Cell ID: {alert.cellId} • {alert.affectedBatteries.length} batteries affected
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${getSeverityBadgeColor(alert.severity)}`}>
                      {alert.severity}
                    </span>
                    <div className="flex items-center gap-1 text-gray-400 text-sm">
                      <BsClock className="w-4 h-4" />
                      <span>{new Date(alert.timestamp).toLocaleTimeString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {filteredAlerts.length === 0 && (
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 text-center">
            <p className="text-gray-400">No alerts match the current filters</p>
          </div>
        )}
      </div>
    </div>
  );
} 