'use client';

import { useState, useEffect } from 'react';
import { BsArrowLeft, BsBatteryFull, BsBatteryHalf, BsBattery, BsExclamationTriangle, BsCheckCircle } from 'react-icons/bs';
import { FaBolt } from 'react-icons/fa';
import { useAuth } from '@/contexts/AuthContext';
import { BatteryDataResponse, BatteryData, BatteryRecord } from '@/types/battery';

interface BatteryCell {
  id: string;
  voltage: number;
  temperature: number;
  status: 'normal' | 'warning' | 'critical';
}

interface Alert {
  id: string;
  message: string;
  timestamp: string;
  type: 'warning' | 'critical';
  status: 'active' | 'acknowledged' | 'resolved';
}

interface SystemFault {
  id: string;
  code: string;
  message: string;
  timestamp: string;
  status: 'active' | 'resolved';
}

interface BatteryInfo {
  id: string;
  imei: string;
  sku: string;
  manufacturer: string;
  model: string;
  soc: number;
  voltage: number;
  temperature: number;
  health: number;
  current: number;
  cycleCount: number;
  lastUpdate: string;
  cells: BatteryCell[];
}

interface BatteryDetailsProps {
  batteryId: string;
  onBack: () => void;
}

export default function BatteryDetails({ batteryId, onBack }: BatteryDetailsProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [batteryData, setBatteryData] = useState<BatteryData | null>(null);
  const [currentRecord, setCurrentRecord] = useState<BatteryRecord | null>(null);
  const { getToken } = useAuth();

  useEffect(() => {
    fetchBatteryDetails();
  }, [batteryId]);

  const fetchBatteryDetails = async () => {
    try {
      setLoading(true);
      const token = getToken();
      
      if (!token) {
        setError('Authentication required');
        return;
      }

      const response = await fetch(
        `https://api.bms.autotrack.ng/devices/${batteryId}/data?page=1&limit=1`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      
      const data: BatteryDataResponse = await response.json();

      if (data.success && data.data.length > 0) {
        setBatteryData(data.data[0]);
        setCurrentRecord(data.data[0].records[0]);
        setError(null);
      } else {
        setError(data.message || 'Failed to fetch battery details');
      }
    } catch (err) {
      setError('Failed to fetch battery details');
    } finally {
      setLoading(false);
    }
  };

  const getCellStatus = (voltage: number, temperature: number): BatteryCell['status'] => {
    if (voltage > 3.7 || temperature > 30) {
      return 'critical';
    } else if (voltage > 3.65 || temperature > 28) {
      return 'warning';
    }
    return 'normal';
  };

  const getStatusColor = (status: BatteryCell['status']) => {
    switch (status) {
      case 'normal':
        return 'bg-green-900/20 border-green-500/30';
      case 'warning':
        return 'bg-yellow-900/20 border-yellow-500/30';
      case 'critical':
        return 'bg-red-900/20 border-red-500/30';
      default:
        return 'bg-gray-900/20 border-gray-500/30';
    }
  };

  const getStatusTextColor = (status: BatteryCell['status']) => {
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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !batteryData || !currentRecord) {
    return (
      <div className="text-red-400 text-center py-8">
        {error || 'No data available'}
      </div>
    );
  }

  const { bms } = currentRecord;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
        >
          <BsArrowLeft className="w-5 h-5 text-gray-400" />
        </button>
        <div>
          <h2 className="text-xl font-bold text-white">{batteryData.deviceType}</h2>
          <p className="text-sm text-gray-400">Device ID: {batteryData.deviceId}</p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
          <p className="text-sm text-gray-400">State of Charge</p>
          <div className="flex items-center space-x-2 mt-1">
            <BsBatteryFull className="w-5 h-5 text-green-400" />
            <span className="text-2xl font-bold text-white">{bms.stateOfCharge.toFixed(1)}%</span>
          </div>
        </div>

        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
          <p className="text-sm text-gray-400">Total Voltage</p>
          <div className="flex items-center space-x-2 mt-1">
            <FaBolt className="w-5 h-5 text-blue-400" />
            <span className="text-2xl font-bold text-white">{bms.batteryVoltage.packVoltage1.toFixed(1)}V</span>
          </div>
        </div>

        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
          <p className="text-sm text-gray-400">Temperature</p>
          <div className="flex items-center space-x-2 mt-1">
            <span className="text-2xl font-bold text-white">{bms.temperatures[0].toFixed(1)}°C</span>
          </div>
        </div>

        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
          <p className="text-sm text-gray-400">Health</p>
          <div className="flex items-center space-x-2 mt-1">
            <BsCheckCircle className="w-5 h-5 text-green-400" />
            <span className="text-2xl font-bold text-white">{bms.stateOfHealth.toFixed(1)}%</span>
          </div>
        </div>
      </div>

      {/* Battery Information */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Battery Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <p className="text-sm text-gray-400">Device ID</p>
            <p className="text-white">{batteryData.deviceId}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Current</p>
            <p className="text-white">{bms.batteryVoltage.current1.toFixed(2)}A</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Cycle Count</p>
            <p className="text-white">{bms.cycleCount} cycles</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Last Update</p>
            <p className="text-white">{new Date(currentRecord.timestamp).toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Battery Cells Grid */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Battery Cells</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {[
            ...bms.batteryCellVoltagesGroup1,
            ...bms.batteryCellVoltagesGroup2,
            ...bms.batteryCellVoltagesGroup3,
            ...bms.batteryCellVoltagesGroup4,
            ...bms.batteryCellVoltagesGroup5,
            ...bms.batteryCellVoltagesGroup6,
          ].map((voltage, index) => {
            const temperature = bms.batteryCellTemperatures[index % bms.batteryCellTemperatures.length];
            const status = getCellStatus(voltage, temperature);
            
            return (
              <div
                key={`cell-${index + 1}`}
                className={`p-3 rounded-lg border ${getStatusColor(status)} relative`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">Cell {index + 1}</span>
                  {status !== 'normal' && (
                    <BsExclamationTriangle className={`w-4 h-4 ${getStatusTextColor(status)}`} />
                  )}
                </div>
                <div className="space-y-1">
                  <p className="text-sm">
                    <span className="text-gray-400">V: </span>
                    <span className="text-white">{voltage.toFixed(2)}V</span>
                  </p>
                  <p className="text-sm">
                    <span className="text-gray-400">T: </span>
                    <span className="text-white">{temperature.toFixed(1)}°C</span>
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
} 