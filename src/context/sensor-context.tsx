'use client';

import React, { createContext, useContext, type ReactNode } from 'react';
import { useRealtimeData, type ConnectionStatus } from '@/hooks/use-realtime-data';
import type { SensorReading } from '@/data/mock-data';

interface SensorContextType {
  current: SensorReading;
  history: SensorReading[];
  connectionStatus: ConnectionStatus;
  lastUpdate: Date;
}

const SensorContext = createContext<SensorContextType | null>(null);

export function SensorProvider({ children }: { children: ReactNode }) {
  const data = useRealtimeData(3000);

  return (
    <SensorContext.Provider value={data}>
      {children}
    </SensorContext.Provider>
  );
}

export function useSensorData(): SensorContextType {
  const context = useContext(SensorContext);
  if (!context) {
    throw new Error('useSensorData must be used within a SensorProvider');
  }
  return context;
}
