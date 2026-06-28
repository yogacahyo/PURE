'use client';

import { SensorProvider } from '@/context/sensor-context';
import { DashboardLayout } from '@/components/layout/dashboard-layout';

export default function DashboardRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SensorProvider>
      <DashboardLayout>{children}</DashboardLayout>
    </SensorProvider>
  );
}
