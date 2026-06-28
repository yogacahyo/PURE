'use client';

import { useState } from 'react';
import { ClayCard } from '@/components/ui/clay-card';
import { mockDevices } from '@/data/mock-data';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  Cpu, Wifi, WifiOff, Battery, BatteryLow, BatteryCharging,
  Signal, MapPin, RotateCcw, Settings, Eye, Edit, X,
  CheckCircle2, AlertCircle, Loader2, Sun, Plug, CircleDot,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

export default function DevicesPage() {
  const [calibrateDevice, setCalibrateDevice] = useState<string | null>(null);
  const [calibrating, setCalibrating] = useState(false);

  const handleCalibrate = () => {
    setCalibrating(true);
    setTimeout(() => {
      setCalibrating(false);
      setCalibrateDevice(null);
    }, 3000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-pure-dark">Device & Sensor Management</h1>
        <p className="text-sm text-pure-muted mt-1">Kelola node sensor ESP32-S3 dan perangkat IoT</p>
      </div>

      {/* Device Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Devices', value: mockDevices.length, icon: Cpu, color: 'text-pure-primary', bg: 'bg-blue-50' },
          { label: 'Online', value: mockDevices.filter(d => d.status === 'online').length, icon: Wifi, color: 'text-emerald-500', bg: 'bg-emerald-50' },
          { label: 'Offline', value: mockDevices.filter(d => d.status === 'offline').length, icon: WifiOff, color: 'text-red-500', bg: 'bg-red-50' },
          { label: 'Maintenance', value: mockDevices.filter(d => d.status === 'maintenance').length, icon: Settings, color: 'text-amber-500', bg: 'bg-amber-50' },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <ClayCard className="text-center">
                <div className={cn('sensor-bubble mx-auto w-10 h-10 mb-2', stat.bg)}>
                  <Icon className={cn('w-4 h-4', stat.color)} />
                </div>
                <p className="text-2xl font-bold text-pure-dark">{stat.value}</p>
                <p className="text-xs text-pure-muted">{stat.label}</p>
              </ClayCard>
            </motion.div>
          );
        })}
      </div>

      {/* Device Cards */}
      <div className="grid sm:grid-cols-2 gap-4">
        {mockDevices.map((device, i) => (
          <motion.div
            key={device.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <ClayCard className={cn(
              'h-full border-l-4',
              device.status === 'online' && 'border-l-emerald-400',
              device.status === 'offline' && 'border-l-red-400',
              device.status === 'maintenance' && 'border-l-amber-400',
            )}>
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    'sensor-bubble',
                    device.status === 'online' && 'bg-emerald-50',
                    device.status === 'offline' && 'bg-red-50',
                    device.status === 'maintenance' && 'bg-amber-50',
                  )}>
                    <Cpu className={cn(
                      'w-5 h-5',
                      device.status === 'online' && 'text-emerald-500',
                      device.status === 'offline' && 'text-red-500',
                      device.status === 'maintenance' && 'text-amber-500',
                    )} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-pure-dark text-sm">{device.deviceId}</h3>
                    <p className="text-xs text-pure-muted flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {device.pondName}
                    </p>
                  </div>
                </div>
                <span className={cn(
                  'clay-badge text-xs border capitalize',
                  device.status === 'online' && 'bg-emerald-50 text-emerald-600 border-emerald-200',
                  device.status === 'offline' && 'bg-red-50 text-red-600 border-red-200',
                  device.status === 'maintenance' && 'bg-amber-50 text-amber-600 border-amber-200',
                )}>
                  {device.status}
                </span>
              </div>

              {/* Device Info */}
              <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
                <div className="p-2 rounded-xl bg-pure-sky/30">
                  <span className="text-pure-muted">Firmware</span>
                  <p className="font-medium text-pure-dark">{device.firmwareVersion}</p>
                </div>
                <div className="p-2 rounded-xl bg-pure-sky/30">
                  <span className="text-pure-muted">Last Ping</span>
                  <p className="font-medium text-pure-dark">
                    {new Date(device.lastPing).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                <div className="p-2 rounded-xl bg-pure-sky/30 flex items-center gap-2">
                  {device.powerStatus === 'solar' && <Sun className="w-3 h-3 text-amber-500" />}
                  {device.powerStatus === 'ac' && <Plug className="w-3 h-3 text-blue-500" />}
                  {device.powerStatus === 'battery' && <Battery className="w-3 h-3 text-emerald-500" />}
                  <div>
                    <span className="text-pure-muted">Power</span>
                    <p className="font-medium text-pure-dark capitalize">
                      {device.powerStatus}
                      {device.batteryLevel !== undefined && ` (${device.batteryLevel}%)`}
                    </p>
                  </div>
                </div>
                <div className="p-2 rounded-xl bg-pure-sky/30 flex items-center gap-2">
                  <Signal className={cn(
                    'w-3 h-3',
                    device.signalStrength > -50 ? 'text-emerald-500' :
                    device.signalStrength > -70 ? 'text-amber-500' : 'text-red-500',
                  )} />
                  <div>
                    <span className="text-pure-muted">Signal</span>
                    <p className="font-medium text-pure-dark">{device.signalStrength} dBm</p>
                  </div>
                </div>
              </div>

              {/* Sensors */}
              <div className="mb-4">
                <p className="text-xs font-semibold text-pure-dark mb-2">Sensors ({device.sensors.length})</p>
                <div className="flex flex-wrap gap-1.5">
                  {device.sensors.map(sensor => (
                    <span
                      key={sensor.name}
                      className={cn(
                        'clay-badge text-[10px] border',
                        sensor.status === 'active' && 'bg-emerald-50 text-emerald-600 border-emerald-200',
                        sensor.status === 'inactive' && 'bg-red-50 text-red-600 border-red-200',
                        sensor.status === 'calibrating' && 'bg-amber-50 text-amber-600 border-amber-200',
                      )}
                    >
                      {sensor.status === 'active' && <CheckCircle2 className="w-2.5 h-2.5 mr-1 inline" />}
                      {sensor.status === 'inactive' && <AlertCircle className="w-2.5 h-2.5 mr-1 inline" />}
                      {sensor.status === 'calibrating' && <Loader2 className="w-2.5 h-2.5 mr-1 inline animate-spin" />}
                      {sensor.name}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setCalibrateDevice(device.deviceId)}
                  className="clay-button !px-3 !py-1.5 bg-white text-pure-primary border border-blue-100 text-xs hover:bg-pure-sky/50"
                >
                  <CircleDot className="w-3 h-3 mr-1 inline" />
                  Kalibrasi
                </button>
                <button className="clay-button !px-3 !py-1.5 bg-white text-pure-dark border border-blue-100 text-xs hover:bg-pure-sky/50">
                  <RotateCcw className="w-3 h-3 mr-1 inline" />
                  Restart
                </button>
                <button className="clay-button !px-3 !py-1.5 bg-white text-pure-dark border border-blue-100 text-xs hover:bg-pure-sky/50">
                  <Eye className="w-3 h-3 mr-1 inline" />
                  Detail
                </button>
                <button className="clay-button !px-3 !py-1.5 bg-white text-pure-dark border border-blue-100 text-xs hover:bg-pure-sky/50">
                  <Edit className="w-3 h-3 mr-1 inline" />
                  Edit
                </button>
              </div>
            </ClayCard>
          </motion.div>
        ))}
      </div>

      {/* Calibration Modal */}
      <Dialog open={!!calibrateDevice} onOpenChange={() => !calibrating && setCalibrateDevice(null)}>
        <DialogContent className="clay-raised !rounded-3xl border-0 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-pure-dark">Kalibrasi Sensor</DialogTitle>
            <DialogDescription className="text-pure-muted">
              {calibrateDevice && `Kalibrasi sensor pada device ${calibrateDevice}`}
            </DialogDescription>
          </DialogHeader>

          {!calibrating ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm text-pure-dark font-medium">Pilih sensor untuk dikalibrasi:</p>
                {['pH Probe', 'DO Probe', 'Turbidity Sensor', 'TDS/EC Probe'].map(sensor => (
                  <label key={sensor} className="flex items-center gap-3 p-3 rounded-xl bg-pure-sky/30 cursor-pointer hover:bg-pure-sky/50 transition-colors">
                    <input type="checkbox" className="rounded border-blue-200 text-pure-primary focus:ring-pure-primary" />
                    <span className="text-sm text-pure-dark">{sensor}</span>
                  </label>
                ))}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleCalibrate}
                  className="clay-button flex-1 bg-gradient-to-r from-pure-primary to-pure-cyan text-white text-sm"
                >
                  Mulai Kalibrasi
                </button>
                <button
                  onClick={() => setCalibrateDevice(null)}
                  className="clay-button bg-white text-pure-muted border border-blue-100 text-sm"
                >
                  Batal
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <Loader2 className="w-12 h-12 text-pure-primary mx-auto animate-spin mb-4" />
              <p className="text-sm font-medium text-pure-dark">Kalibrasi sedang berjalan...</p>
              <p className="text-xs text-pure-muted mt-1">Mohon tunggu, proses ini membutuhkan waktu beberapa detik.</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
