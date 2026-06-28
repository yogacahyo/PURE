'use client';

import { ClayCard } from '@/components/ui/clay-card';
import { motion } from 'framer-motion';
import { Settings, Bell, Wifi, User, Palette, Globe, Shield, Database } from 'lucide-react';

const settingsGroups = [
  {
    title: 'General',
    items: [
      { icon: User, label: 'Profile', desc: 'Manage your account information' },
      { icon: Globe, label: 'Language', desc: 'Set your preferred language' },
      { icon: Palette, label: 'Appearance', desc: 'Theme and display preferences' },
    ],
  },
  {
    title: 'Notifications',
    items: [
      { icon: Bell, label: 'Alert Settings', desc: 'Configure alert thresholds and notifications' },
      { icon: Wifi, label: 'MQTT Configuration', desc: 'Broker URL, port, and credentials' },
    ],
  },
  {
    title: 'System',
    items: [
      { icon: Database, label: 'Data Export', desc: 'Export settings and scheduled reports' },
      { icon: Shield, label: 'Security', desc: 'Password and access control' },
    ],
  },
];

export default function SettingsPage() {
  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-pure-dark">Settings</h1>
        <p className="text-sm text-pure-muted mt-1">Konfigurasi sistem dan preferensi pengguna</p>
      </div>

      {settingsGroups.map((group, gi) => (
        <motion.div
          key={group.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: gi * 0.1 }}
        >
          <h2 className="text-sm font-semibold text-pure-muted uppercase tracking-wide mb-3">{group.title}</h2>
          <ClayCard variant="raised" noPadding noHover>
            {group.items.map((item, i) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.label}
                  className="w-full flex items-center gap-4 p-4 hover:bg-pure-sky/30 transition-colors text-left border-b border-blue-50 last:border-0"
                >
                  <div className="sensor-bubble bg-pure-sky w-10 h-10 flex-shrink-0">
                    <Icon className="w-4 h-4 text-pure-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-pure-dark">{item.label}</p>
                    <p className="text-xs text-pure-muted">{item.desc}</p>
                  </div>
                  <span className="text-pure-muted text-sm">→</span>
                </button>
              );
            })}
          </ClayCard>
        </motion.div>
      ))}
    </div>
  );
}
