'use client';

import { useState } from 'react';
import BatteryList from '@/components/BatteryList';
import BatteryDetails from '@/components/BatteryDetails';

export default function CellsPage() {
  const [selectedBatteryId, setSelectedBatteryId] = useState<string | null>(null);

  const handleViewDetails = (batteryId: string) => {
    setSelectedBatteryId(batteryId);
  };

  const handleBack = () => {
    setSelectedBatteryId(null);
  };

  return (
    <div className="p-6 bg-gray-900 min-h-screen">
      {selectedBatteryId ? (
        <BatteryDetails
          batteryId={selectedBatteryId}
          onBack={handleBack}
        />
      ) : (
        <BatteryList onViewDetails={handleViewDetails} />
      )}
    </div>
  );
} 