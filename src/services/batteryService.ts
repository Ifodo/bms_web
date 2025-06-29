import type { BatteryDistribution, BatteryDistributionResponse, ProcessedBatteryDistribution } from '@/types/battery';

export async function getBatteryDistribution(): Promise<ProcessedBatteryDistribution> {
  const response = await fetch('https://api.bms.autotrack.ng/api/batteries/distribution', {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch battery distribution');
  }

  const data: BatteryDistributionResponse = await response.json();

  // Process the response to extract battery distribution data
  const distributionData = Object.entries(data)
    .filter(([key]) => !isNaN(Number(key)))
    .map(([_, value]) => value as BatteryDistribution);

  const totalBatteries = distributionData.reduce((sum, item) => sum + item.count, 0);

  return {
    data: distributionData,
    totalBatteries,
  };
} 