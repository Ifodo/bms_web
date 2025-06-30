import type { BatteryDistribution } from '@/types/battery';

const API_URL = 'https://api.bms.autotrack.ng/api/batteries';

export async function getBatteryDistribution(): Promise<BatteryDistribution> {
  const response = await fetch(`${API_URL}/distribution`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch battery distribution');
  }

  return response.json();
} 