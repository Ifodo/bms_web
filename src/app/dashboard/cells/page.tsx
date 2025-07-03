'use client';

import { useState } from 'react';
import BatteryList from '@/components/BatteryList';
import BatteryDetails from '@/components/BatteryDetails';

export default function CellsPage() {
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);

  const handleViewDetails = (deviceId: string) => {
    setSelectedDeviceId(deviceId);
  };

  const handleBack = () => {
    setSelectedDeviceId(null);
  };

  return (
    <div className="p-6 bg-gray-900 min-h-screen">
      {selectedDeviceId ? (
        <BatteryDetails
          batteryId={selectedDeviceId}
          onBack={handleBack}
        />
      ) : (
        <BatteryList onViewDetails={handleViewDetails} />
      )}
    </div>
  );
} 