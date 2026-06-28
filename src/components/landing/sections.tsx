'use client';

import { motion } from 'framer-motion';
import {
  Wifi, Activity, Wind, Fish, Bell, Wrench, Clock, Cpu,
  Thermometer, FlaskConical, AlertTriangle, Waves, Zap,
  ArrowRight, CheckCircle2, Shield, TrendingUp, BarChart3,
  Droplets,
} from 'lucide-react';

// ============================================
// Features Section
// ============================================

const features = [
  { icon: Wifi, title: 'Real-Time Monitoring', desc: 'Data sensor langsung dari tambak melalui protokol MQTT dengan latensi rendah.' },
  { icon: Activity, title: 'Sensor Kualitas Air', desc: 'Pantau suhu, pH, DO, amonia, kekeruhan, dan TDS secara bersamaan.' },
  { icon: Wind, title: 'Dissolved Oxygen Monitoring', desc: 'Monitoring oksigen terlarut untuk menjaga kelangsungan hidup ikan.' },
  { icon: Fish, title: 'DSS Rekomendasi Ikan', desc: 'Sistem pendukung keputusan untuk merekomendasikan jenis ikan terbaik.' },
  { icon: Bell, title: 'Alarm Kondisi Kritis', desc: 'Notifikasi real-time ketika parameter kualitas air melewati ambang batas.' },
  { icon: Wrench, title: 'Tindakan Korektif', desc: 'Rekomendasi langkah perbaikan berdasarkan kondisi air terkini.' },
  { icon: Clock, title: 'Riwayat Data Sensor', desc: 'Analisis tren data historis untuk perencanaan budidaya yang lebih baik.' },
  { icon: Cpu, title: 'Device Management', desc: 'Kelola node sensor ESP32-S3 termasuk kalibrasi dan monitoring status.' },
];

export function FeaturesSection() {
  return (
    <section className="py-20 lg:py-28 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="clay-badge bg-pure-primary/10 text-pure-primary border border-pure-primary/20 mb-4 inline-block">Features</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-pure-dark mb-4">
            Everything You Need for <span className="gradient-text">Smart Aquaculture</span>
          </h2>
          <p className="text-pure-muted text-lg max-w-2xl mx-auto">
            Platform lengkap untuk monitoring, analisis, dan pengelolaan kualitas air tambak ikan berbasis IoT.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="clay-card p-6 group cursor-default"
              >
                <div className="sensor-bubble bg-pure-sky w-12 h-12 mb-4 group-hover:bg-pure-primary/10 transition-colors">
                  <Icon className="w-5 h-5 text-pure-primary" />
                </div>
                <h3 className="font-semibold text-pure-dark mb-2">{feature.title}</h3>
                <p className="text-sm text-pure-muted leading-relaxed">{feature.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ============================================
// Parameters Section
// ============================================

const parameters = [
  { icon: Thermometer, name: 'Suhu Air', unit: '°C', desc: 'Monitoring suhu air real-time', color: 'text-orange-500', bg: 'bg-orange-50' },
  { icon: FlaskConical, name: 'pH', unit: 'pH', desc: 'Tingkat keasaman air', color: 'text-purple-500', bg: 'bg-purple-50' },
  { icon: Wind, name: 'Dissolved Oxygen', unit: 'mg/L', desc: 'Kadar oksigen terlarut', color: 'text-cyan-500', bg: 'bg-cyan-50' },
  { icon: AlertTriangle, name: 'Amonia', unit: 'mg/L', desc: 'Kadar amonia dalam air', color: 'text-red-500', bg: 'bg-red-50' },
  { icon: Waves, name: 'Kekeruhan', unit: 'NTU', desc: 'Tingkat kekeruhan air', color: 'text-blue-500', bg: 'bg-blue-50' },
  { icon: Zap, name: 'TDS / EC', unit: 'ppm', desc: 'Total Dissolved Solids', color: 'text-amber-500', bg: 'bg-amber-50' },
];

export function ParametersSection() {
  return (
    <section className="py-20 lg:py-28 bg-white/50 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="clay-badge bg-pure-cyan/10 text-pure-deep border border-pure-cyan/20 mb-4 inline-block">Parameters</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-pure-dark mb-4">
            6 Parameter Kualitas Air <span className="gradient-text">Terpantau</span>
          </h2>
          <p className="text-pure-muted text-lg max-w-2xl mx-auto">
            Setiap parameter dipantau secara real-time untuk memastikan kondisi optimal bagi ikan.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {parameters.map((param, i) => {
            const Icon = param.icon;
            return (
              <motion.div
                key={param.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="clay-card p-6 flex items-start gap-4"
              >
                <div className={`sensor-bubble ${param.bg} flex-shrink-0`}>
                  <Icon className={`w-5 h-5 ${param.color}`} />
                </div>
                <div>
                  <h3 className="font-semibold text-pure-dark mb-1">{param.name}</h3>
                  <p className="text-sm text-pure-muted mb-2">{param.desc}</p>
                  <span className="clay-badge bg-pure-sky text-pure-primary text-[10px]">{param.unit}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ============================================
// System Flow Section
// ============================================

const flowSteps = [
  { icon: Cpu, title: 'ESP32-S3', subtitle: 'Sensor Node', desc: 'Membaca data sensor air' },
  { icon: Wifi, title: 'MQTT Broker', subtitle: 'Telemetri', desc: 'Pengiriman data real-time' },
  { icon: BarChart3, title: 'Cloud Database', subtitle: 'Penyimpanan', desc: 'Menyimpan data historis' },
  { icon: Activity, title: 'Next.js Dashboard', subtitle: 'Visualisasi', desc: 'Monitoring real-time' },
  { icon: Fish, title: 'DSS Recommendation', subtitle: 'Keputusan', desc: 'Rekomendasi berbasis data' },
];

export function SystemFlowSection() {
  return (
    <section className="py-20 lg:py-28 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="clay-badge bg-emerald-50 text-emerald-700 border border-emerald-200 mb-4 inline-block">System Architecture</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-pure-dark mb-4">
            Alur Sistem <span className="gradient-text">End-to-End</span>
          </h2>
          <p className="text-pure-muted text-lg max-w-2xl mx-auto">
            Dari sensor di tambak hingga rekomendasi di dashboard — semua terhubung secara seamless.
          </p>
        </motion.div>

        {/* Desktop: Horizontal Flow */}
        <div className="hidden lg:flex items-center justify-center gap-4">
          {flowSteps.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="flex items-center gap-4"
              >
                <div className="clay-raised p-5 text-center min-w-[160px]">
                  <div className="sensor-bubble bg-pure-sky mx-auto w-12 h-12 mb-3">
                    <Icon className="w-5 h-5 text-pure-primary" />
                  </div>
                  <h3 className="font-semibold text-pure-dark text-sm">{step.title}</h3>
                  <p className="text-[10px] text-pure-muted mt-0.5">{step.subtitle}</p>
                  <p className="text-xs text-pure-muted mt-2">{step.desc}</p>
                </div>
                {i < flowSteps.length - 1 && (
                  <ArrowRight className="w-5 h-5 text-pure-primary/40 flex-shrink-0" />
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Mobile: Vertical Flow */}
        <div className="lg:hidden space-y-4">
          {flowSteps.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="clay-card p-4 flex items-center gap-4">
                  <div className="sensor-bubble bg-pure-sky flex-shrink-0">
                    <Icon className="w-5 h-5 text-pure-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-pure-dark text-sm">{step.title}</h3>
                    <p className="text-xs text-pure-muted">{step.desc}</p>
                  </div>
                  <span className="ml-auto clay-badge bg-pure-sky text-pure-primary text-[10px]">
                    Step {i + 1}
                  </span>
                </div>
                {i < flowSteps.length - 1 && (
                  <div className="flex justify-center py-1">
                    <div className="w-px h-4 bg-pure-primary/20" />
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ============================================
// Benefits Section
// ============================================

const benefits = [
  { icon: TrendingUp, title: 'Keputusan Lebih Cepat', desc: 'Membantu petambak mengambil keputusan berdasarkan data real-time, bukan intuisi.' },
  { icon: Shield, title: 'Kurangi Risiko Kematian', desc: 'Deteksi dini kondisi kritis untuk mencegah kematian massal ikan.' },
  { icon: BarChart3, title: 'Produktivitas Meningkat', desc: 'Optimalisasi kondisi air untuk meningkatkan hasil panen.' },
  { icon: CheckCircle2, title: 'Pengelolaan Berbasis Data', desc: 'Transisi dari pengelolaan tradisional ke smart aquaculture.' },
  { icon: Bell, title: 'Preventif, Bukan Reaktif', desc: 'Antisipasi masalah sebelum terjadi dengan monitoring 24/7.' },
];

export function BenefitsSection() {
  return (
    <section className="py-20 lg:py-28 bg-white/50 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="clay-badge bg-amber-50 text-amber-700 border border-amber-200 mb-4 inline-block">Benefits</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-pure-dark mb-4">
            Manfaat Menggunakan <span className="gradient-text">PURE</span>
          </h2>
          <p className="text-pure-muted text-lg max-w-2xl mx-auto">
            Platform yang membantu Anda mengelola tambak dengan lebih cerdas dan efisien.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {benefits.map((benefit, i) => {
            const Icon = benefit.icon;
            return (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="clay-card p-6"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="sensor-bubble bg-gradient-to-br from-pure-sky to-white">
                    <Icon className="w-5 h-5 text-pure-primary" />
                  </div>
                  <h3 className="font-semibold text-pure-dark">{benefit.title}</h3>
                </div>
                <p className="text-sm text-pure-muted leading-relaxed">{benefit.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ============================================
// Footer
// ============================================

export function Footer() {
  return (
    <footer className="py-10 border-t border-blue-100/50 bg-white/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-br from-pure-primary to-pure-cyan">
              <Droplets className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="font-bold text-pure-dark text-sm">PURE</span>
              <span className="text-xs text-pure-muted ml-2">Precise Units for Resources Evaluation</span>
            </div>
          </div>
          <p className="text-sm text-pure-muted">
            © 2026 PURE. Smart Aquaculture Monitoring System.
          </p>
        </div>
      </div>
    </footer>
  );
}
