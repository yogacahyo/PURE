'use client';

import { useState } from 'react';
import { Sidebar, MobileBottomNav, MobileDrawer } from './sidebar';
import { TopNav } from './top-nav';
import { cn } from '@/lib/utils';

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-pure-sky/30">
      {/* Desktop Sidebar */}
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Mobile Drawer */}
      <MobileDrawer
        isOpen={mobileDrawerOpen}
        onClose={() => setMobileDrawerOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen">
        <TopNav onMenuClick={() => setMobileDrawerOpen(true)} />
        
        <main className={cn(
          'flex-1 p-4 lg:p-6 pb-24 lg:pb-6',
          'transition-all duration-300',
        )}>
          {children}
        </main>
      </div>

      {/* Mobile Bottom Nav */}
      <MobileBottomNav />
    </div>
  );
}
