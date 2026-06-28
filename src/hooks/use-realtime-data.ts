'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { currentSensorData, type SensorReading, type ParameterKey } from '@/data/mock-data';

export type ConnectionStatus = 'connected' | 'reconnecting' | 'disconnected';

interface UseRealtimeDataReturn {
  current: SensorReading;
  history: SensorReading[];
  connectionStatus: ConnectionStatus;
  lastUpdate: Date;
}

function randomFluctuation(base: number, range: number, min: number, max: number, decimals: number): number {
  const newValue = base + (Math.random() - 0.5) * range;
  return +Math.max(min, Math.min(max, newValue)).toFixed(decimals);
}

export function useRealtimeData(intervalMs: number = 3000): UseRealtimeDataReturn {
  const [current, setCurrent] = useState<SensorReading>(currentSensorData);
  const [history, setHistory] = useState<SensorReading[]>([currentSensorData]);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('connected');
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const prevValues = useRef<SensorReading>(currentSensorData);

  const generateNewReading = useCallback((): SensorReading => {
    const prev = prevValues.current;
    const now = new Date();
    const hour = now.getHours();

    // Subtle daily cycle effect on temperature
    const tempBias = Math.sin((hour - 6) * Math.PI / 12) * 0.2;

    const newReading: SensorReading = {
      deviceId: prev.deviceId,
      pondId: prev.pondId,
      timestamp: now.toISOString(),
      temperature: randomFluctuation(prev.temperature + tempBias * 0.1, 0.4, 24, 34, 1),
      ph: randomFluctuation(prev.ph, 0.15, 5.5, 9.0, 1),
      dissolvedOxygen: randomFluctuation(prev.dissolvedOxygen, 0.4, 2.0, 12.0, 1),
      ammonia: randomFluctuation(prev.ammonia, 0.008, 0.001, 0.1, 3),
      turbidity: randomFluctuation(prev.turbidity, 3, 5, 50, 0),
      tds: randomFluctuation(prev.tds, 20, 100, 900, 0),
    };

    prevValues.current = newReading;
    return newReading;
  }, []);

  useEffect(() => {
    // Simulate occasional reconnection events
    const connectionTimer = setInterval(() => {
      const rand = Math.random();
      if (rand > 0.97) {
        setConnectionStatus('reconnecting');
        setTimeout(() => setConnectionStatus('connected'), 2000 + Math.random() * 3000);
      }
    }, 15000);

    // Main data update interval
    const dataTimer = setInterval(() => {
      if (connectionStatus === 'disconnected') return;

      const newReading = generateNewReading();
      setCurrent(newReading);
      setLastUpdate(new Date());
      setHistory(prev => {
        const updated = [...prev, newReading];
        // Keep last 500 readings (~25 minutes at 3s interval)
        return updated.slice(-500);
      });
    }, intervalMs);

    return () => {
      clearInterval(dataTimer);
      clearInterval(connectionTimer);
    };
  }, [intervalMs, connectionStatus, generateNewReading]);

  return { current, history, connectionStatus, lastUpdate };
}

/**
 * Get readings for a specific parameter from history
 */
export function getParameterHistory(
  history: SensorReading[],
  parameter: ParameterKey
): { time: string; value: number }[] {
  return history.map(reading => ({
    time: new Date(reading.timestamp).toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
    }),
    value: reading[parameter] as number,
  }));
}
