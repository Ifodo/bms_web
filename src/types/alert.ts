export interface Alert {
  id: string;
  deviceId: string;
  deviceName: string;
  type: string;
  severity: 'low' | 'medium' | 'high';
  message: string;
  timestamp: string;
  isActive: boolean;
}

export interface AlertResponse {
  success: boolean;
  message: string;
  code: number;
  returnStatus: string;
  data: Alert[];
} 