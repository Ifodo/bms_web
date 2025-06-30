'use client';

import React, { useState } from 'react';
import { BsExclamationTriangle } from 'react-icons/bs';

export default function AlertsPage() {
  const [alerts] = useState([
    {
      id: 1,
      title: 'High Temperature Alert',
      description: 'Battery temperature exceeds normal range',
      severity: 'high',
      timestamp: '2024-02-20T10:30:00Z',
    },
    // Add more mock alerts as needed
  ]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Alerts</h1>
      <div className="grid gap-4">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className="bg-white p-4 rounded-lg shadow flex items-start gap-4"
          >
            <div className="text-red-500">
              <BsExclamationTriangle size={24} />
            </div>
            <div>
              <h2 className="font-semibold">{alert.title}</h2>
              <p className="text-gray-600">{alert.description}</p>
              <p className="text-sm text-gray-500 mt-2">
                {new Date(alert.timestamp).toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 