'use client';

import { useState } from 'react';
import { BsArrowLeft, BsBatteryFull, BsBatteryHalf, BsBattery, BsExclamationTriangle, BsCheckCircle } from 'react-icons/bs';
import { FaBolt } from 'react-icons/fa';

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
  // Dummy data for demonstration
  const batteryInfo: BatteryInfo = {
    id: 'BMS-1000',
    imei: '865432100000001',
    sku: 'BMS-LI-48V-100AH',
    manufacturer: 'AutoTrack',
    model: 'AT-100-48',
    soc: 95,
    voltage: 48.2,
    temperature: 25.6,
    health: 96,
    current: 0.26,
    cycleCount: 207,
    lastUpdate: '2024-03-28 14:30:22',
    cells: Array.from({ length: 16 }, (_, i) => {
      const baseVoltage = 3.0;
      const randomVoltage = Math.random() * 0.5;
      const baseTemp = 25;
      const randomTemp = Math.random() * 5;
      const voltage = baseVoltage + randomVoltage;
      const temperature = baseTemp + randomTemp;
      
      let status: BatteryCell['status'] = 'normal';
      if (voltage > 3.6 || temperature > 35) {
        status = 'critical';
      } else if (voltage > 3.5 || temperature > 30) {
        status = 'warning';
      }

      return {
        id: `Cell ${i + 1}`,
        voltage: Number(voltage.toFixed(2)),
        temperature: Number(temperature.toFixed(1)),
        status
      };
    })
  };

  const alerts: Alert[] = [
    {
      id: 'alert1',
      message: 'High voltage detected in cell C12',
      timestamp: '2024-03-28 14:28:45',
      type: 'warning',
      status: 'active'
    },
    {
      id: 'alert2',
      message: 'Critical temperature in cell C8',
      timestamp: '2024-03-28 14:25:03',
      type: 'critical',
      status: 'acknowledged'
    },
    {
      id: 'alert3',
      message: 'Low voltage warning in cell C15',
      timestamp: '2024-03-28 14:20:15',
      type: 'warning',
      status: 'active'
    }
  ];

  const faults: SystemFault[] = [
    {
      id: 'fault1',
      code: 'F001',
      message: 'Communication timeout with cell C16',
      timestamp: '2024-03-28 14:27:54',
      status: 'active'
    },
    {
      id: 'fault2',
      code: 'F003',
      message: 'Temperature sensor malfunction in cell C4',
      timestamp: '2024-03-28 14:15:54',
      status: 'resolved'
    },
    {
      id: 'fault3',
      code: 'F002',
      message: 'Voltage sensor calibration error in cell C10',
      timestamp: '2024-03-28 14:22:30',
      status: 'active'
    }
  ];

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
          <h2 className="text-xl font-bold text-white">{batteryInfo.id}</h2>
          <p className="text-sm text-gray-400">IMEI: {batteryInfo.imei}</p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
          <p className="text-sm text-gray-400">State of Charge</p>
          <div className="flex items-center space-x-2 mt-1">
            <BsBatteryFull className="w-5 h-5 text-green-400" />
            <span className="text-2xl font-bold text-white">{batteryInfo.soc}%</span>
          </div>
        </div>

        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
          <p className="text-sm text-gray-400">Total Voltage</p>
          <div className="flex items-center space-x-2 mt-1">
            <FaBolt className="w-5 h-5 text-blue-400" />
            <span className="text-2xl font-bold text-white">{batteryInfo.voltage}V</span>
          </div>
        </div>

        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
          <p className="text-sm text-gray-400">Temperature</p>
          <div className="flex items-center space-x-2 mt-1">
            <span className="text-2xl font-bold text-white">{batteryInfo.temperature}°C</span>
          </div>
        </div>

        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
          <p className="text-sm text-gray-400">Health</p>
          <div className="flex items-center space-x-2 mt-1">
            <BsCheckCircle className="w-5 h-5 text-green-400" />
            <span className="text-2xl font-bold text-white">{batteryInfo.health}%</span>
          </div>
        </div>
      </div>

      {/* Battery Information */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Battery Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <p className="text-sm text-gray-400">IMEI</p>
            <p className="text-white">{batteryInfo.imei}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Current</p>
            <p className="text-white">{batteryInfo.current}A</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Cycle Count</p>
            <p className="text-white">{batteryInfo.cycleCount} cycles</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Last Update</p>
            <p className="text-white">{batteryInfo.lastUpdate}</p>
          </div>
        </div>
      </div>

      {/* Battery Cells Grid */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Battery Cells</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {batteryInfo.cells.map((cell, index) => (
            <div
              key={cell.id}
              className={`p-3 rounded-lg border ${getStatusColor(cell.status)} relative`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">{cell.id}</span>
                {cell.status !== 'normal' && (
                  <BsExclamationTriangle className={`w-4 h-4 ${getStatusTextColor(cell.status)}`} />
                )}
              </div>
              <div className="space-y-1">
                <p className="text-sm text-white">V: {cell.voltage.toFixed(2)}</p>
                <p className="text-sm text-white">T: {cell.temperature.toFixed(1)}°</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Alerts and Faults */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Active Alerts */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Active Alerts</h3>
          <div className="space-y-4">
            {alerts.map(alert => (
              <div
                key={alert.id}
                className={`p-4 rounded-lg ${
                  alert.type === 'critical' ? 'bg-red-900/20 border-red-500/30' : 'bg-yellow-900/20 border-yellow-500/30'
                } border`}
              >
                <p className={`${alert.type === 'critical' ? 'text-red-400' : 'text-yellow-400'}`}>
                  {alert.message}
                </p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm text-gray-400">{alert.timestamp}</span>
                  <span className={`text-sm px-2 py-1 rounded-full ${
                    alert.status === 'active' ? 'bg-red-500/10 text-red-400' :
                    alert.status === 'acknowledged' ? 'bg-green-500/10 text-green-400' :
                    'bg-gray-500/10 text-gray-400'
                  }`}>
                    {alert.status.charAt(0).toUpperCase() + alert.status.slice(1)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Faults */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">System Faults</h3>
          <div className="space-y-4">
            {faults.map(fault => (
              <div
                key={fault.id}
                className={`p-4 rounded-lg ${
                  fault.status === 'active' ? 'bg-red-900/20 border-red-500/30' : 'bg-gray-800 border-gray-600'
                } border`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">{fault.code}</span>
                  <span className={`text-sm px-2 py-1 rounded-full ${
                    fault.status === 'active' ? 'bg-red-500/10 text-red-400' : 'bg-green-500/10 text-green-400'
                  }`}>
                    {fault.status.charAt(0).toUpperCase() + fault.status.slice(1)}
                  </span>
                </div>
                <p className="text-white mt-1">{fault.message}</p>
                <p className="text-sm text-gray-400 mt-2">{fault.timestamp}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 