'use client';

import { BsBatteryCharging, BsThermometerHalf } from 'react-icons/bs';
import { RiHealthBookLine } from 'react-icons/ri';

export default function BatteryMetrics() {
  // Dummy data for demonstration
  const metrics = {
    averageSOH: 85, // 85%
    averageSOC: 72, // 72%
    averageTemp: 28, // 28°C
  };

  const getHealthColor = (value: number) => {
    if (value >= 80) return 'text-green-400';
    if (value >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getChargeColor = (value: number) => {
    if (value >= 70) return 'text-green-400';
    if (value >= 30) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getTempColor = (value: number) => {
    if (value <= 30 && value >= 20) return 'text-green-400';
    if (value <= 35 && value >= 15) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Average SOH Card */}
      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gray-700/50 rounded-lg">
              <RiHealthBookLine className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Average SOH</p>
              <p className={`text-xl font-semibold ${getHealthColor(metrics.averageSOH)}`}>
                {metrics.averageSOH}%
              </p>
            </div>
          </div>
          <div className="text-xs text-gray-500">
            State of Health
          </div>
        </div>
      </div>

      {/* Average SOC Card */}
      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gray-700/50 rounded-lg">
              <BsBatteryCharging className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Average SOC</p>
              <p className={`text-xl font-semibold ${getChargeColor(metrics.averageSOC)}`}>
                {metrics.averageSOC}%
              </p>
            </div>
          </div>
          <div className="text-xs text-gray-500">
            State of Charge
          </div>
        </div>
      </div>

      {/* Average Temperature Card */}
      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gray-700/50 rounded-lg">
              <BsThermometerHalf className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Average Temp</p>
              <p className={`text-xl font-semibold ${getTempColor(metrics.averageTemp)}`}>
                {metrics.averageTemp}°C
              </p>
            </div>
          </div>
          <div className="text-xs text-gray-500">
            Temperature
          </div>
        </div>
      </div>
    </div>
  );
} 