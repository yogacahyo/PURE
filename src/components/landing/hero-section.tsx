"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight,
  Play,
  Droplets,
  Wifi,
  BarChart3,
  TrendingUp,
} from "lucide-react";

/* ─── Bubble config ────────────────────────────── */
const BUBBLES = [
  // Large – close, slow, very visible
  { w: 56, left: "6%",   dur: "18s", delay: "0s",   drift: "36px",  blur: 0 },
  { w: 48, left: "70%",  dur: "20s", delay: "2s",   drift: "-28px", blur: 0 },
  { w: 64, left: "40%",  dur: "24s", delay: "6s",   drift: "20px",  blur: 0 },
  { w: 44, left: "85%",  dur: "19s", delay: "9s",   drift: "-22px", blur: 0 },
  // Medium
  { w: 34, left: "15%",  dur: "14s", delay: "1s",   drift: "-24px", blur: 0 },
  { w: 30, left: "52%",  dur: "15s", delay: "3.5s", drift: "30px",  blur: 0 },
  { w: 36, left: "78%",  dur: "16s", delay: "1.5s", drift: "-18px", blur: 0 },
  { w: 28, left: "32%",  dur: "13s", delay: "5s",   drift: "26px",  blur: 0 },
  { w: 38, left: "60%",  dur: "17s", delay: "4s",   drift: "-32px", blur: 0 },
  { w: 32, left: "22%",  dur: "15s", delay: "7.5s", drift: "20px",  blur: 0 },
  // Small – far, faster
  { w: 20, left: "10%",  dur: "11s", delay: "0.5s", drift: "16px",  blur: 0.5 },
  { w: 18, left: "25%",  dur: "10s", delay: "3s",   drift: "-12px", blur: 0.5 },
  { w: 22, left: "46%",  dur: "12s", delay: "1.5s", drift: "18px",  blur: 0.5 },
  { w: 16, left: "65%",  dur: "9s",  delay: "5s",   drift: "-14px", blur: 1 },
  { w: 19, left: "88%",  dur: "11s", delay: "2s",   drift: "12px",  blur: 0.5 },
  { w: 14, left: "93%",  dur: "10s", delay: "7s",   drift: "-10px", blur: 1 },
  { w: 24, left: "3%",   dur: "13s", delay: "4s",   drift: "20px",  blur: 0 },
  { w: 15, left: "56%",  dur: "9.5s", delay: "8s",  drift: "-16px", blur: 0.5 },
  // Extra tiny sparkle bubbles
  { w: 10, left: "18%",  dur: "8s",  delay: "2.5s", drift: "8px",   blur: 0 },
  { w: 12, left: "75%",  dur: "8.5s", delay: "6.5s", drift: "-6px", blur: 0 },
];

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-[#EEF8FF] via-[#DDF7FF] to-[#BEEFFF]">

      {/* ── Layer 0: Background blobs (ambient depth) ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="blob w-96 h-96 bg-pure-primary/20 -top-20 -right-20" />
        <div
          className="blob w-80 h-80 bg-pure-cyan/20 top-1/2 -left-20"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="blob w-64 h-64 bg-pure-aqua/20 bottom-20 right-1/3"
          style={{ animationDelay: "4s" }}
        />
      </div>

      {/* ── Layer 1: Water caustics ── */}
      <div className="hero-caustics-layer" />

      {/* ── Layer 2: Rising bubbles ── */}
      <div className="absolute inset-0 z-[1] pointer-events-none overflow-hidden" aria-hidden="true">
        {BUBBLES.map((b, i) => (
          <div
            key={i}
            className="hero-bubble absolute rounded-full"
            style={{
              width: b.w,
              height: b.w,
              left: b.left,
              bottom: "-60px",
              filter: b.blur > 0 ? `blur(${b.blur}px)` : undefined,
              "--bubble-duration": b.dur,
              "--bubble-delay": b.delay,
              "--bubble-drift": b.drift,
            } as React.CSSProperties}
          />
        ))}
      </div>

      {/* ── Layer 10: Foreground content ── */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-20 lg:py-0">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Text */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center lg:text-left"
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-pure-dark leading-tight mb-6">
              <span className="gradient-text">PURE:</span> Real-Time Water
              Quality Intelligence for{" "}
              <span className="gradient-text">Smarter Aquaculture</span>
            </h1>

            <p className="text-lg sm:text-xl text-pure-muted leading-relaxed mb-8 max-w-xl mx-auto lg:mx-0">
              Pantau kualitas air tambak secara real-time, deteksi risiko lebih
              awal, dan dapatkan rekomendasi jenis ikan berbasis data.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                href="/dashboard"
                className="clay-button bg-gradient-to-r from-pure-primary to-pure-deep text-white inline-flex items-center justify-center gap-2 text-base hover:opacity-90 transition-opacity"
              >
                Masuk Dashboard
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/dashboard/recommendation"
                className="clay-button bg-white text-pure-primary border border-blue-100 inline-flex items-center justify-center gap-2 text-base hover:bg-pure-sky/50 transition-colors"
              >
                <Play className="w-4 h-4" />
                Lihat Rekomendasi Ikan
              </Link>
            </div>
          </motion.div>

          {/* Right: Preview Card */}
          <motion.div
            initial={{ opacity: 0, x: 40, rotateY: 5 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
            className="relative"
          >
            <div className="clay-raised p-6 sm:p-8 relative overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-br from-pure-primary to-pure-cyan">
                    <Droplets className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-pure-dark text-sm">
                      PURE Dashboard
                    </h3>
                    <p className="text-xs text-pure-muted">Tambak A</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span className="text-xs font-medium text-emerald-600">
                    Connected
                  </span>
                </div>
              </div>

              {/* Mini sensor cards */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                {[
                  {
                    label: "Suhu",
                    value: "29.1°C",
                    color: "text-orange-500",
                    bg: "bg-orange-50",
                  },
                  {
                    label: "pH",
                    value: "7.4",
                    color: "text-purple-500",
                    bg: "bg-purple-50",
                  },
                  {
                    label: "DO",
                    value: "5.8 mg/L",
                    color: "text-cyan-500",
                    bg: "bg-cyan-50",
                  },
                ].map((sensor, i) => (
                  <motion.div
                    key={sensor.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + i * 0.1 }}
                    className={`rounded-2xl p-3 ${sensor.bg} text-center`}
                  >
                    <p className="text-[10px] text-pure-muted mb-1">
                      {sensor.label}
                    </p>
                    <p className={`text-sm font-bold ${sensor.color}`}>
                      {sensor.value}
                    </p>
                  </motion.div>
                ))}
              </div>

              {/* Water Quality Score */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.9 }}
                className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-pure-sky to-white border border-blue-100"
              >
                <div className="relative w-14 h-14 flex-shrink-0">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 56 56">
                    <circle
                      cx="28"
                      cy="28"
                      r="22"
                      fill="none"
                      stroke="#E8F4FD"
                      strokeWidth="5"
                    />
                    <circle
                      cx="28"
                      cy="28"
                      r="22"
                      fill="none"
                      stroke="#0E8FEA"
                      strokeWidth="5"
                      strokeLinecap="round"
                      strokeDasharray="138"
                      strokeDashoffset="18"
                    />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-pure-primary">
                    87
                  </span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-pure-dark">
                    Water Quality Score
                  </p>
                  <p className="text-xs text-pure-muted">
                    Good — Cocok untuk Nila &amp; Gurame
                  </p>
                </div>
              </motion.div>

              {/* Mini chart preview */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.1 }}
                className="mt-4 flex items-end gap-1 h-12"
              >
                {[
                  35, 42, 38, 55, 48, 62, 58, 70, 65, 72, 68, 75, 71, 78, 74,
                  80,
                ].map((h, i) => (
                  <motion.div
                    key={i}
                    className="flex-1 rounded-t-sm bg-gradient-to-t from-pure-primary/30 to-pure-cyan/30"
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    transition={{ delay: 1.2 + i * 0.03, duration: 0.3 }}
                  />
                ))}
              </motion.div>
            </div>

            {/* Floating fish recommendation badge */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.4 }}
              className="absolute -bottom-4 -right-4 sm:-right-6 clay-card !rounded-2xl p-3 flex items-center gap-2"
            >
              <img
                src="/images/fish/nila.png"
                alt="Ikan Nila"
                className="w-10 h-10 object-contain"
              />
              <div>
                <p className="text-xs font-semibold text-pure-dark">
                  Nila — 92%
                </p>
                <p className="text-[10px] text-emerald-600">
                  Highly Recommended
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* ── Layer 5: Organic wave bottom ── */}
      <div className="absolute bottom-0 left-0 w-full z-[5] pointer-events-none">
        <svg
          viewBox="0 0 1440 180"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto block hero-wave-svg"
          preserveAspectRatio="none"
        >
          {/* Back wave – subtle depth */}
          <path
            d="M0,120 C120,100 240,85 360,95 C480,105 540,125 720,110 C900,95 1020,70 1140,85 C1260,100 1380,120 1440,105 L1440,180 L0,180 Z"
            fill="white"
            fillOpacity="0.45"
            className="hero-wave-back"
          />
          {/* Mid wave */}
          <path
            d="M0,135 C160,115 280,100 420,115 C560,130 640,145 800,125 C960,105 1080,90 1200,108 C1320,126 1400,140 1440,130 L1440,180 L0,180 Z"
            fill="white"
            fillOpacity="0.65"
            className="hero-wave-mid"
          />
          {/* Front wave – main border */}
          <path
            d="M0,150 C100,138 200,128 320,140 C440,152 520,160 680,145 C840,130 960,118 1100,132 C1240,146 1360,155 1440,148 L1440,180 L0,180 Z"
            fill="white"
            className="hero-wave-front"
          />
        </svg>
      </div>
    </section>
  );
}
