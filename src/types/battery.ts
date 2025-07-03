interface Battery {
  _id: string;
  deviceId: string;
  deviceName: string;
  userId: string;
  deviceType: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface BatteryResponse {
  success: boolean;
  message: string;
  code: number;
  returnStatus: string;
  data: Battery[];
  meta: {
    totalItems: number;
    count: number;
    itemsPerPage: string;
    currentPage: string;
    totalPages: number;
  };
}

interface BatteryLocation {
  longitude: number;
  latitude: number;
  altitude: number;
  angle: number;
  satellites: number;
  speed: number;
}

interface BatteryPackVI {
  packVoltage1: number;
  packVoltage2: number;
  current1: number;
  current2: number;
}

interface BatteryCellSOC {
  stateOfCharge: number;
  stateOfHealth: number;
}

interface BatteryCellCycleCount {
  cycleCount: number;
  runTime: number;
}

interface BatteryVoltage {
  packVoltage1: number;
  packVoltage2: number;
  current1: number;
  current2: number;
}

interface BMS {
  generalStatus: number;
  batteryPackVI: BatteryPackVI;
  batteryCellVoltagesGroup1: number[];
  batteryCellTemperatures: number[];
  batteryCellSOC: BatteryCellSOC;
  batteryCellCycleCount: BatteryCellCycleCount;
  batteryCellVoltagesGroup2: number[];
  batteryCellVoltagesGroup3: number[];
  batteryCellVoltagesGroup4: number[];
  batteryCellVoltagesGroup5: number[];
  batteryCellVoltagesGroup6: number[];
  batteryVoltage: BatteryVoltage;
  cellVoltages: number[][];
  temperatures: number[];
  stateOfCharge: number;
  stateOfHealth: number;
  cycleCount: number;
  runTime: number;
}

interface BatteryRecord {
  timestamp: string;
  priority: number;
  location: BatteryLocation;
  bms: BMS;
}

interface BatteryData {
  _id: string;
  deviceType: string;
  deviceId: string;
  timestamp: string;
  records: BatteryRecord[];
  createdAt: string;
  updatedAt: string;
}

interface BatteryDataResponse {
  success: boolean;
  message: string;
  code: number;
  returnStatus: string;
  data: BatteryData[];
  meta: {
    totalItems: number;
    count: number;
    itemsPerPage: string;
    currentPage: string;
    totalPages: number;
  };
}

export type {
  Battery,
  BatteryResponse,
  BatteryData,
  BatteryDataResponse,
  BatteryRecord,
  BMS,
  BatteryLocation
}; 