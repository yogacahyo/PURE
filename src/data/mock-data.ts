// ============================================
// PURE — Mock Sensor Data
// ============================================

export interface SensorReading {
  deviceId: string;
  pondId: string;
  timestamp: string;
  temperature: number;
  ph: number;
  dissolvedOxygen: number;
  ammonia: number;
  turbidity: number;
  tds: number;
}

export interface SensorStatus {
  label: string;
  color: string;
  bgColor: string;
}

export type ParameterKey = 'temperature' | 'ph' | 'dissolvedOxygen' | 'ammonia' | 'turbidity' | 'tds';
export type StatusLevel = 'optimal' | 'normal' | 'warning' | 'critical';
export type TrendDirection = 'up' | 'down' | 'stable';

export interface ParameterConfig {
  key: ParameterKey;
  name: string;
  unit: string;
  icon: string;
  optimalMin: number;
  optimalMax: number;
  warningMin: number;
  warningMax: number;
  criticalMin: number;
  criticalMax: number;
  decimals: number;
}

export const parameterConfigs: ParameterConfig[] = [
  {
    key: 'temperature',
    name: 'Suhu Air',
    unit: '°C',
    icon: 'Thermometer',
    optimalMin: 26, optimalMax: 30,
    warningMin: 24, warningMax: 32,
    criticalMin: 20, criticalMax: 35,
    decimals: 1,
  },
  {
    key: 'ph',
    name: 'pH',
    unit: '',
    icon: 'FlaskConical',
    optimalMin: 6.5, optimalMax: 8.0,
    warningMin: 6.0, warningMax: 8.5,
    criticalMin: 5.0, criticalMax: 9.5,
    decimals: 1,
  },
  {
    key: 'dissolvedOxygen',
    name: 'Dissolved Oxygen',
    unit: 'mg/L',
    icon: 'Wind',
    optimalMin: 5.0, optimalMax: 10.0,
    warningMin: 4.0, warningMax: 12.0,
    criticalMin: 2.0, criticalMax: 15.0,
    decimals: 1,
  },
  {
    key: 'ammonia',
    name: 'Amonia',
    unit: 'mg/L',
    icon: 'AlertTriangle',
    optimalMin: 0, optimalMax: 0.02,
    warningMin: 0, warningMax: 0.05,
    criticalMin: 0, criticalMax: 0.1,
    decimals: 3,
  },
  {
    key: 'turbidity',
    name: 'Kekeruhan',
    unit: 'NTU',
    icon: 'Waves',
    optimalMin: 0, optimalMax: 20,
    warningMin: 0, warningMax: 30,
    criticalMin: 0, criticalMax: 50,
    decimals: 0,
  },
  {
    key: 'tds',
    name: 'TDS / EC',
    unit: 'ppm',
    icon: 'Zap',
    optimalMin: 200, optimalMax: 500,
    warningMin: 100, warningMax: 700,
    criticalMin: 50, criticalMax: 1000,
    decimals: 0,
  },
];

export const currentSensorData: SensorReading = {
  deviceId: "PURE-ESP32S3-001",
  pondId: "Tambak A",
  timestamp: "2026-06-28T10:30:00Z",
  temperature: 29.1,
  ph: 7.4,
  dissolvedOxygen: 5.8,
  ammonia: 0.03,
  turbidity: 18,
  tds: 420,
};

// Generate realistic historical data
function generateHistory(hours: number): SensorReading[] {
  const data: SensorReading[] = [];
  const now = new Date();
  const baseValues = {
    temperature: 28.5,
    ph: 7.3,
    dissolvedOxygen: 6.0,
    ammonia: 0.025,
    turbidity: 16,
    tds: 400,
  };

  for (let i = hours * 12; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 5 * 60 * 1000);
    const hourOfDay = time.getHours();
    
    // Simulate daily cycle patterns
    const tempCycle = Math.sin((hourOfDay - 6) * Math.PI / 12) * 2;
    const doCycle = -Math.sin((hourOfDay - 6) * Math.PI / 12) * 1.5;
    
    data.push({
      deviceId: "PURE-ESP32S3-001",
      pondId: "Tambak A",
      timestamp: time.toISOString(),
      temperature: +(baseValues.temperature + tempCycle + (Math.random() - 0.5) * 0.5).toFixed(1),
      ph: +(baseValues.ph + (Math.random() - 0.5) * 0.3).toFixed(1),
      dissolvedOxygen: +(baseValues.dissolvedOxygen + doCycle + (Math.random() - 0.5) * 0.5).toFixed(1),
      ammonia: +(baseValues.ammonia + (Math.random() - 0.3) * 0.01).toFixed(3),
      turbidity: +(baseValues.turbidity + (Math.random() - 0.5) * 5).toFixed(0),
      tds: +(baseValues.tds + (Math.random() - 0.5) * 40).toFixed(0),
    });
  }
  return data;
}

export const sensorHistory = generateHistory(168); // 7 days

export function getParameterStatus(key: ParameterKey, value: number): StatusLevel {
  const config = parameterConfigs.find(p => p.key === key);
  if (!config) return 'normal';

  if (key === 'ammonia' || key === 'turbidity') {
    // Lower is better
    if (value <= config.optimalMax) return 'optimal';
    if (value <= config.warningMax) return 'warning';
    return 'critical';
  }

  if (value >= config.optimalMin && value <= config.optimalMax) return 'optimal';
  if (value >= config.warningMin && value <= config.warningMax) return 'normal';
  return 'critical';
}

export function getStatusConfig(status: StatusLevel): SensorStatus {
  switch (status) {
    case 'optimal':
      return { label: 'Optimal', color: 'text-emerald-600', bgColor: 'bg-emerald-50' };
    case 'normal':
      return { label: 'Normal', color: 'text-blue-600', bgColor: 'bg-blue-50' };
    case 'warning':
      return { label: 'Waspada', color: 'text-amber-600', bgColor: 'bg-amber-50' };
    case 'critical':
      return { label: 'Kritis', color: 'text-red-600', bgColor: 'bg-red-50' };
  }
}

export function getTrend(history: number[]): TrendDirection {
  if (history.length < 3) return 'stable';
  const recent = history.slice(-3);
  const avg1 = (recent[0] + recent[1]) / 2;
  const avg2 = recent[2];
  const diff = avg2 - avg1;
  if (Math.abs(diff) < 0.1) return 'stable';
  return diff > 0 ? 'up' : 'down';
}

// ============================================
// Alert Data
// ============================================

export interface AlertItem {
  id: string;
  title: string;
  parameter: ParameterKey;
  level: 'critical' | 'warning' | 'info';
  timestamp: string;
  value: number;
  threshold: string;
  recommendation: string;
  status: 'active' | 'resolved' | 'monitoring';
}

export const mockAlerts: AlertItem[] = [
  {
    id: 'alert-001',
    title: 'DO Rendah Terdeteksi',
    parameter: 'dissolvedOxygen',
    level: 'critical',
    timestamp: '2026-06-28T09:15:00Z',
    value: 3.8,
    threshold: '< 4.0 mg/L',
    recommendation: 'Segera aktifkan aerator dan pantau DO setiap 30 menit.',
    status: 'active',
  },
  {
    id: 'alert-002',
    title: 'Amonia Meningkat',
    parameter: 'ammonia',
    level: 'warning',
    timestamp: '2026-06-28T08:45:00Z',
    value: 0.045,
    threshold: '> 0.02 mg/L',
    recommendation: 'Evaluasi pemberian pakan dan pertimbangkan pergantian air parsial.',
    status: 'active',
  },
  {
    id: 'alert-003',
    title: 'pH Tidak Stabil',
    parameter: 'ph',
    level: 'warning',
    timestamp: '2026-06-28T07:30:00Z',
    value: 6.2,
    threshold: '< 6.5',
    recommendation: 'Lakukan stabilisasi pH secara bertahap. Hindari perubahan mendadak.',
    status: 'monitoring',
  },
  {
    id: 'alert-004',
    title: 'Kekeruhan Tinggi',
    parameter: 'turbidity',
    level: 'warning',
    timestamp: '2026-06-28T06:00:00Z',
    value: 32,
    threshold: '> 30 NTU',
    recommendation: 'Periksa akumulasi bahan organik dan lakukan sirkulasi air.',
    status: 'resolved',
  },
  {
    id: 'alert-005',
    title: 'Sensor DO Offline',
    parameter: 'dissolvedOxygen',
    level: 'critical',
    timestamp: '2026-06-27T22:00:00Z',
    value: 0,
    threshold: 'Sensor tidak merespons',
    recommendation: 'Periksa koneksi sensor dan restart device jika diperlukan.',
    status: 'resolved',
  },
  {
    id: 'alert-006',
    title: 'Suhu Air Tinggi',
    parameter: 'temperature',
    level: 'warning',
    timestamp: '2026-06-28T10:00:00Z',
    value: 31.5,
    threshold: '> 30°C',
    recommendation: 'Pertimbangkan untuk menambah aerasi atau peneduh pada tambak.',
    status: 'monitoring',
  },
];

// ============================================
// Device Data
// ============================================

export interface DeviceInfo {
  id: string;
  deviceId: string;
  pondId: string;
  pondName: string;
  status: 'online' | 'offline' | 'maintenance';
  lastPing: string;
  firmwareVersion: string;
  powerStatus: 'battery' | 'solar' | 'ac';
  batteryLevel?: number;
  signalStrength: number;
  sensors: {
    name: string;
    type: string;
    status: 'active' | 'inactive' | 'calibrating';
    lastCalibration: string;
  }[];
  location: { lat: number; lng: number };
}

export const mockDevices: DeviceInfo[] = [
  {
    id: '1',
    deviceId: 'PURE-ESP32S3-001',
    pondId: 'pond-a',
    pondName: 'Tambak A',
    status: 'online',
    lastPing: '2026-06-28T10:30:00Z',
    firmwareVersion: 'v2.1.3',
    powerStatus: 'solar',
    batteryLevel: 87,
    signalStrength: -42,
    sensors: [
      { name: 'DS18B20', type: 'Temperature', status: 'active', lastCalibration: '2026-06-15' },
      { name: 'pH Probe', type: 'pH', status: 'active', lastCalibration: '2026-06-20' },
      { name: 'DO Probe', type: 'Dissolved Oxygen', status: 'active', lastCalibration: '2026-06-18' },
      { name: 'Ammonia Sensor', type: 'Ammonia', status: 'active', lastCalibration: '2026-06-22' },
      { name: 'Turbidity Sensor', type: 'Turbidity', status: 'active', lastCalibration: '2026-06-19' },
      { name: 'TDS/EC Probe', type: 'TDS', status: 'active', lastCalibration: '2026-06-21' },
    ],
    location: { lat: -6.9175, lng: 107.6191 },
  },
  {
    id: '2',
    deviceId: 'PURE-ESP32S3-002',
    pondId: 'pond-b',
    pondName: 'Tambak B',
    status: 'online',
    lastPing: '2026-06-28T10:29:55Z',
    firmwareVersion: 'v2.1.3',
    powerStatus: 'solar',
    batteryLevel: 92,
    signalStrength: -38,
    sensors: [
      { name: 'DS18B20', type: 'Temperature', status: 'active', lastCalibration: '2026-06-16' },
      { name: 'pH Probe', type: 'pH', status: 'active', lastCalibration: '2026-06-20' },
      { name: 'DO Probe', type: 'Dissolved Oxygen', status: 'calibrating', lastCalibration: '2026-06-10' },
      { name: 'Ammonia Sensor', type: 'Ammonia', status: 'active', lastCalibration: '2026-06-22' },
      { name: 'Turbidity Sensor', type: 'Turbidity', status: 'active', lastCalibration: '2026-06-19' },
      { name: 'TDS/EC Probe', type: 'TDS', status: 'active', lastCalibration: '2026-06-21' },
    ],
    location: { lat: -6.9180, lng: 107.6195 },
  },
  {
    id: '3',
    deviceId: 'PURE-ESP32S3-003',
    pondId: 'pond-c',
    pondName: 'Tambak C',
    status: 'offline',
    lastPing: '2026-06-28T06:45:00Z',
    firmwareVersion: 'v2.0.8',
    powerStatus: 'battery',
    batteryLevel: 12,
    signalStrength: -78,
    sensors: [
      { name: 'DS18B20', type: 'Temperature', status: 'active', lastCalibration: '2026-06-10' },
      { name: 'pH Probe', type: 'pH', status: 'inactive', lastCalibration: '2026-06-01' },
      { name: 'DO Probe', type: 'Dissolved Oxygen', status: 'inactive', lastCalibration: '2026-06-05' },
      { name: 'TDS/EC Probe', type: 'TDS', status: 'active', lastCalibration: '2026-06-12' },
    ],
    location: { lat: -6.9185, lng: 107.6188 },
  },
  {
    id: '4',
    deviceId: 'PURE-ESP32S3-004',
    pondId: 'pond-d',
    pondName: 'Tambak D',
    status: 'maintenance',
    lastPing: '2026-06-27T14:00:00Z',
    firmwareVersion: 'v2.1.1',
    powerStatus: 'ac',
    signalStrength: -55,
    sensors: [
      { name: 'DS18B20', type: 'Temperature', status: 'calibrating', lastCalibration: '2026-06-25' },
      { name: 'pH Probe', type: 'pH', status: 'calibrating', lastCalibration: '2026-06-25' },
      { name: 'DO Probe', type: 'Dissolved Oxygen', status: 'calibrating', lastCalibration: '2026-06-25' },
      { name: 'Ammonia Sensor', type: 'Ammonia', status: 'calibrating', lastCalibration: '2026-06-25' },
      { name: 'Turbidity Sensor', type: 'Turbidity', status: 'calibrating', lastCalibration: '2026-06-25' },
      { name: 'TDS/EC Probe', type: 'TDS', status: 'calibrating', lastCalibration: '2026-06-25' },
    ],
    location: { lat: -6.9190, lng: 107.6200 },
  },
];

// ============================================
// Corrective Actions
// ============================================

export interface CorrectiveAction {
  id: string;
  condition: string;
  parameter: ParameterKey;
  priority: 'urgent' | 'important' | 'monitoring';
  currentValue?: number;
  threshold: string;
  actions: string[];
  notes?: string;
  isActive: boolean;
}

export const mockCorrectiveActions: CorrectiveAction[] = [
  {
    id: 'ca-001',
    condition: 'DO < 4 mg/L',
    parameter: 'dissolvedOxygen',
    priority: 'urgent',
    currentValue: 3.8,
    threshold: '< 4.0 mg/L',
    actions: [
      'Aktifkan aerator segera',
      'Kurangi kepadatan ikan sementara',
      'Tunda penebaran benih baru',
      'Pantau DO setiap 30 menit',
    ],
    notes: 'Dissolved Oxygen yang rendah dapat menyebabkan kematian massal ikan dalam waktu singkat.',
    isActive: true,
  },
  {
    id: 'ca-002',
    condition: 'Amonia > 0.05 mg/L',
    parameter: 'ammonia',
    priority: 'urgent',
    currentValue: 0.048,
    threshold: '> 0.05 mg/L',
    actions: [
      'Lakukan pergantian air parsial (20-30%)',
      'Evaluasi dan kurangi pemberian pakan',
      'Cek dan perbaiki biofilter',
      'Kurangi sisa bahan organik di dasar tambak',
    ],
    notes: 'Amonia tinggi bersifat toksik bagi ikan dan mengganggu metabolisme.',
    isActive: true,
  },
  {
    id: 'ca-003',
    condition: 'pH < 6.5',
    parameter: 'ph',
    priority: 'important',
    currentValue: 6.2,
    threshold: '< 6.5',
    actions: [
      'Lakukan stabilisasi pH secara bertahap',
      'Hindari perubahan pH mendadak (maks 0.5/jam)',
      'Lakukan pengukuran ulang setelah perlakuan',
      'Evaluasi sumber air masuk',
    ],
    notes: 'pH yang terlalu rendah mengganggu osmoregulasi ikan.',
    isActive: true,
  },
  {
    id: 'ca-004',
    condition: 'Kekeruhan > 30 NTU',
    parameter: 'turbidity',
    priority: 'monitoring',
    currentValue: 25,
    threshold: '> 30 NTU',
    actions: [
      'Periksa akumulasi bahan organik',
      'Lakukan sirkulasi air',
      'Klarifikasi air jika diperlukan',
      'Evaluasi sedimentasi tambak',
    ],
    notes: 'Kekeruhan tinggi dapat mengurangi penetrasi cahaya dan mengganggu fotosintesis.',
    isActive: false,
  },
  {
    id: 'ca-005',
    condition: 'Suhu > 32°C',
    parameter: 'temperature',
    priority: 'important',
    currentValue: 31.5,
    threshold: '> 32°C',
    actions: [
      'Tambahkan aerasi untuk meningkatkan sirkulasi',
      'Pertimbangkan peneduh tambak',
      'Kurangi kepadatan tebar sementara',
      'Pantau suhu setiap jam',
    ],
    notes: 'Suhu tinggi meningkatkan metabolisme dan menurunkan kadar oksigen terlarut.',
    isActive: false,
  },
  {
    id: 'ca-006',
    condition: 'TDS > 700 ppm',
    parameter: 'tds',
    priority: 'monitoring',
    currentValue: 650,
    threshold: '> 700 ppm',
    actions: [
      'Evaluasi mineral terlarut dalam air',
      'Lakukan pergantian air sebagian',
      'Cek sumber air masuk',
      'Pantau TDS secara berkala',
    ],
    notes: 'TDS yang tinggi menandakan tingginya padatan terlarut yang dapat mempengaruhi kualitas air.',
    isActive: false,
  },
];
