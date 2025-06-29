export interface BatteryDistribution {
  range: string;
  count: number;
  percentage: number;
}

export interface BatteryDistributionResponse {
  [key: string]: {
    range: string;
    count: number;
    percentage: number;
  } | boolean | string | number;
  success: boolean;
  message: string;
  code: number;
  returnStatus: string;
}

export interface ProcessedBatteryDistribution {
  data: BatteryDistribution[];
  totalBatteries: number;
} 