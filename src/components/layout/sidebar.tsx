'use client';

import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import {
  LayoutDashboard,
  Activity,
  Fish,
  Wrench,
  Bell,
  Clock,
  Cpu,
  Settings,
  Menu,
  X,
  Droplets,
  ChevronLeft,
} from 'lucide-react';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/sensors', label: 'Sensor', icon: Activity },
  { href: '/dashboard/recommendation', label: 'Fish Recommendation', icon: Fish },
  { href: '/dashboard/actions', label: 'Corrective Action', icon: Wrench },
  { href: '/dashboard/alerts', label: 'Alerts', icon: Bell },
  { href: '/dashboard/history', label: 'History', icon: Clock },
  { href: '/dashboard/devices', label: 'Devices', icon: Cpu },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
];

// ============================================
// Desktop Sidebar
// ============================================

export function Sidebar({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        'hidden lg:flex flex-col h-screen sticky top-0 z-40 transition-all duration-300 ease-in-out',
        'bg-white/80 backdrop-blur-sm border-r border-blue-100/50',
        collapsed ? 'w-20' : 'w-64',
      )}
      style={{
        boxShadow: '4px 0 16px rgba(14, 143, 234, 0.04)',
      }}
    >
      {/* Logo */}
      <div className={cn(
        'flex items-center gap-3 p-4 border-b border-blue-50',
        collapsed ? 'justify-center' : 'px-5',
      )}>
        <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-br from-pure-primary to-pure-cyan shadow-lg shadow-pure-primary/20">
          <Droplets className="w-5 h-5 text-white" />
        </div>
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
          >
            <h1 className="text-lg font-bold text-pure-dark">PURE</h1>
            <p className="text-[10px] text-pure-muted leading-tight">Water Quality Intelligence</p>
          </motion.div>
        )}
      </div>

      {/* Nav Items */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto custom-scrollbar">
        {navItems.map((item) => {
          const isActive = pathname === item.href || 
            (item.href !== '/dashboard' && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative',
                isActive
                  ? 'bg-gradient-to-r from-pure-primary/10 to-pure-cyan/10 text-pure-primary font-medium'
                  : 'text-pure-muted hover:bg-pure-sky/50 hover:text-pure-dark',
                collapsed && 'justify-center px-2',
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-pure-primary"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
              <Icon className={cn('w-5 h-5 flex-shrink-0', isActive && 'text-pure-primary')} />
              {!collapsed && (
                <span className="text-sm truncate">{item.label}</span>
              )}
              {collapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 rounded-lg bg-pure-dark text-white text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                  {item.label}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Collapse Button */}
      <div className="p-3 border-t border-blue-50">
        <button
          onClick={onToggle}
          className="flex items-center justify-center w-full py-2 rounded-xl text-pure-muted hover:bg-pure-sky/50 hover:text-pure-dark transition-colors"
        >
          <ChevronLeft className={cn('w-5 h-5 transition-transform', collapsed && 'rotate-180')} />
          {!collapsed && <span className="ml-2 text-sm">Collapse</span>}
        </button>
      </div>
    </aside>
  );
}

// ============================================
// Mobile Bottom Navigation
// ============================================

export function MobileBottomNav() {
  const pathname = usePathname();
  const mobileItems = navItems.slice(0, 5); // Show first 5 items

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-t border-blue-100/50 pb-[env(safe-area-inset-bottom)]"
      style={{
        boxShadow: '0 -4px 16px rgba(14, 143, 234, 0.06)',
      }}
    >
      <div className="flex items-center justify-around px-2 py-2">
        {mobileItems.map((item) => {
          const isActive = pathname === item.href || 
            (item.href !== '/dashboard' && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all min-w-[56px]',
                isActive
                  ? 'text-pure-primary'
                  : 'text-pure-muted',
              )}
            >
              <div className={cn(
                'p-1.5 rounded-xl transition-all',
                isActive && 'bg-pure-primary/10',
              )}>
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-medium leading-tight">{item.label.split(' ')[0]}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

// ============================================
// Mobile Drawer
// ============================================

export function MobileDrawer({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const pathname = usePathname();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 lg:hidden"
            onClick={onClose}
          />
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed left-0 top-0 bottom-0 w-72 bg-white/95 backdrop-blur-md z-50 lg:hidden shadow-2xl"
          >
            <div className="flex items-center justify-between p-4 border-b border-blue-50">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-br from-pure-primary to-pure-cyan">
                  <Droplets className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-pure-dark">PURE</h1>
                  <p className="text-[10px] text-pure-muted">Water Quality Intelligence</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 rounded-xl hover:bg-pure-sky/50">
                <X className="w-5 h-5 text-pure-muted" />
              </button>
            </div>
            <nav className="py-4 px-3 space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href || 
                  (item.href !== '/dashboard' && pathname.startsWith(item.href));
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all',
                      isActive
                        ? 'bg-gradient-to-r from-pure-primary/10 to-pure-cyan/10 text-pure-primary font-medium'
                        : 'text-pure-muted hover:bg-pure-sky/50 hover:text-pure-dark',
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-sm">{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
