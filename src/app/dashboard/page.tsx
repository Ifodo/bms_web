'use client';

import {
  BsBatteryFull,
  BsThermometer,
  BsHeartPulse,
  BsExclamationTriangle,
  BsBattery,
  BsBatteryHalf,
  BsBatteryCharging,
} from 'react-icons/bs';
import BatteryDistribution from '@/components/BatteryDistribution';
import RecentAlerts from '@/components/RecentAlerts';

const stats = [
  {
    name: 'Average SOC',
    value: '85%',
    icon: BsBatteryFull,
    change: '+2.5%',
    changeType: 'positive',
  },
  {
    name: 'Temperature',
    value: '24°C',
    icon: BsThermometer,
    change: '-1.2°C',
    changeType: 'positive',
  },
  {
    name: 'Average SOH',
    value: '92%',
    icon: BsHeartPulse,
    change: '-0.5%',
    changeType: 'negative',
  },
  {
    name: 'Active Alerts',
    value: '2',
    icon: BsExclamationTriangle,
    change: '+1',
    changeType: 'negative',
  },
];

const batteryLevels = [
  {
    range: '75-100%',
    count: 12,
    icon: BsBatteryFull,
    color: 'green',
  },
  {
    range: '50%',
    count: 5,
    icon: BsBatteryHalf,
    color: 'yellow',
  },
  {
    range: '0-25%',
    count: 3,
    icon: BsBattery,
    color: 'red',
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="max-w-3xl">
        <h1 className="text-2xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-gray-400">Monitor your battery system's performance and status.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Stats Grid */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h2 className="text-lg font-semibold text-white mb-4">Stats</h2>
          <div className="space-y-4">
            {stats.map((stat) => (
              <div
                key={stat.name}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-500/10 rounded-lg">
                    <stat.icon className="h-6 w-6 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-400">{stat.name}</p>
                    <p className="text-2xl font-semibold text-white">{stat.value}</p>
                  </div>
                </div>
                <div
                  className={`text-sm font-medium ${
                    stat.changeType === 'positive' ? 'text-green-500' : 'text-red-500'
                  }`}
                >
                  {stat.change}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Number of Batteries */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h2 className="text-lg font-semibold text-white mb-4">Number of Batteries</h2>
          <div className="space-y-4">
            {batteryLevels.map((level) => (
              <div
                key={level.range}
                className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-${level.color}-500/10`}>
                    <level.icon className={`h-6 w-6 text-${level.color}-500`} />
                  </div>
                  <span className="text-sm font-medium text-white">{level.range}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-white">{level.count}</span>
                  <span className="text-sm text-gray-400">batteries</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Battery Distribution */}
        <BatteryDistribution />

        {/* Recent Alerts */}
        <RecentAlerts />
      </div>
    </div>
  );
} 