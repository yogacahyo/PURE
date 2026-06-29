'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useSensorData } from '@/context/sensor-context';
import { ConnectionStatus } from '@/components/ui/status-badge';
import { Menu, User, Droplets } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface TopNavProps {
  onMenuClick: () => void;
}

export function TopNav({ onMenuClick }: TopNavProps) {
  const { current, connectionStatus, lastUpdate } = useSensorData();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header
      className="sticky top-0 z-30 flex items-center justify-between px-4 lg:px-6 py-3 bg-white/70 backdrop-blur-md border-b border-blue-100/50"
      style={{
        boxShadow: '0 4px 16px rgba(14, 143, 234, 0.04)',
      }}
    >
      {/* Left */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-xl hover:bg-pure-sky/50 text-pure-muted"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Mobile logo */}
        <div className="flex lg:hidden items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-br from-pure-primary to-pure-cyan">
            <Droplets className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-pure-dark text-sm">PURE</span>
        </div>

        {/* Pond name */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-pure-sky/50">
          <div className="w-2 h-2 rounded-full bg-pure-primary" />
          <span className="text-sm font-medium text-pure-dark">{current.pondId}</span>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3 lg:gap-4">
        <ConnectionStatus status={connectionStatus} />

        <div className="hidden md:flex items-center gap-1.5 text-xs text-pure-muted">
          <span>Last update:</span>
          <span className="font-medium text-pure-dark">
            {mounted
              ? lastUpdate.toLocaleTimeString('id-ID', {
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                })
              : '--:--:--'}
          </span>
        </div>

        <div className="h-6 w-px bg-blue-100 hidden md:block" />

        <Avatar className="w-8 h-8 aspect-square clay-badge p-0 cursor-pointer">
          <AvatarFallback className="bg-gradient-to-br from-pure-primary to-pure-cyan text-white text-xs font-bold">
            <User className="w-4 h-4" />
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
