'use client';

import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';
import { SolLogEntry, AudienceMode } from '../types/mission';

interface TelemetryChartsProps {
  history: SolLogEntry[];
  mode: AudienceMode;
}

export const TelemetryCharts: React.FC<TelemetryChartsProps> = ({ history, mode }) => {
  const [activeTab, setActiveTab] = useState<'power' | 'eclss' | 'thermal' | 'morale'>('power');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const isCadet = mode === 'cadet';

  if (!isMounted) {
    return (
      <div className="h-64 rounded-2xl bg-space-900 border border-slate-800 p-6 flex items-center justify-center text-slate-400 font-mono text-xs">
        Initializing Telemetry Feed...
      </div>
    );
  }

  // Format data for Recharts
  const chartData = history.map((entry) => ({
    sol: `Sol ${entry.sol}`,
    solNum: entry.sol,
    battery: entry.batteryPct,
    powerGen: entry.powerGeneratedKw,
    powerUsed: entry.powerConsumedKw,
    oxygen: parseFloat(entry.oxygenKg.toFixed(1)),
    water: parseFloat(entry.waterLiters.toFixed(1)),
    temp: entry.cabinTempC,
    radiation: parseFloat(entry.radiationDoseMSv.toFixed(2)),
    morale: entry.moralePct,
  }));

  return (
    <div className="rounded-2xl bg-space-900/90 border border-slate-800 p-4 sm:p-6 shadow-xl backdrop-blur-md">
      {/* Header & Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800">
        <div>
          <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
            <span>📈</span>
            <span>
              {isCadet
                ? 'Outpost Mission Telemetry (Sols Progress)'
                : 'Real-Time Subsystem Telemetry & Trend Logs'}
            </span>
          </h3>
          <p className="text-xs text-slate-400">
            {isCadet
              ? 'Watch how your decisions affected the base over every Sol!'
              : 'Multi-channel historical telemetry across EPS, ECLSS, TCS, and Human Factors.'}
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex flex-wrap gap-1 p-1 bg-space-950 rounded-lg border border-slate-800 text-xs font-mono">
          <button
            onClick={() => setActiveTab('power')}
            className={`px-3 py-1.5 rounded-md transition-all ${
              activeTab === 'power'
                ? 'bg-cyan-500/20 text-cyan-neon border border-cyan-500/50'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            ⚡ {isCadet ? 'Battery & Power' : 'EPS & Storage'}
          </button>
          <button
            onClick={() => setActiveTab('eclss')}
            className={`px-3 py-1.5 rounded-md transition-all ${
              activeTab === 'eclss'
                ? 'bg-emerald-500/20 text-emerald-neon border border-emerald-500/50'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            🌬️ {isCadet ? 'Oxygen & Water' : 'ECLSS Reserves'}
          </button>
          <button
            onClick={() => setActiveTab('thermal')}
            className={`px-3 py-1.5 rounded-md transition-all ${
              activeTab === 'thermal'
                ? 'bg-amber-500/20 text-amber-neon border border-amber-500/50'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            🌡️ {isCadet ? 'Temp & Radiation' : 'TCS & Dosimetry'}
          </button>
          <button
            onClick={() => setActiveTab('morale')}
            className={`px-3 py-1.5 rounded-md transition-all ${
              activeTab === 'morale'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/50'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            😊 {isCadet ? 'Crew Morale' : 'Human Factors'}
          </button>
        </div>
      </div>

      {/* Charts Area */}
      <div className="w-full h-64 sm:h-72">
        <ResponsiveContainer width="100%" height="100%">
          {activeTab === 'power' ? (
            <AreaChart data={chartData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="batteryGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00F0FF" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#00F0FF" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
              <XAxis dataKey="sol" stroke="#64748B" fontSize={11} fontVariant="mono" />
              <YAxis stroke="#64748B" fontSize={11} fontVariant="mono" domain={[0, 100]} />
              <Tooltip
                contentStyle={{ backgroundColor: '#070B19', borderColor: '#334155', borderRadius: '8px' }}
                itemStyle={{ fontSize: '12px' }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />
              <Area
                type="monotone"
                dataKey="battery"
                name="Battery Charge (%)"
                stroke="#00F0FF"
                fillOpacity={1}
                fill="url(#batteryGrad)"
                strokeWidth={2.5}
              />
              <Line
                type="monotone"
                dataKey="powerGen"
                name="Generated (kW)"
                stroke="#10B981"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
              <Line
                type="monotone"
                dataKey="powerUsed"
                name="Consumed (kW)"
                stroke="#EF4444"
                strokeWidth={2}
                strokeDasharray="4 4"
              />
            </AreaChart>
          ) : activeTab === 'eclss' ? (
            <LineChart data={chartData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
              <XAxis dataKey="sol" stroke="#64748B" fontSize={11} />
              <YAxis stroke="#64748B" fontSize={11} />
              <Tooltip
                contentStyle={{ backgroundColor: '#070B19', borderColor: '#334155', borderRadius: '8px' }}
                itemStyle={{ fontSize: '12px' }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />
              <Line
                type="monotone"
                dataKey="oxygen"
                name="Oxygen Reserve (kg)"
                stroke="#10B981"
                strokeWidth={2.5}
                dot={{ r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="water"
                name="Water Storage (Liters)"
                stroke="#06B6D4"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
            </LineChart>
          ) : activeTab === 'thermal' ? (
            <LineChart data={chartData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
              <XAxis dataKey="sol" stroke="#64748B" fontSize={11} />
              <YAxis stroke="#64748B" fontSize={11} />
              <Tooltip
                contentStyle={{ backgroundColor: '#070B19', borderColor: '#334155', borderRadius: '8px' }}
                itemStyle={{ fontSize: '12px' }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />
              <Line
                type="monotone"
                dataKey="temp"
                name="Cabin Temperature (°C)"
                stroke="#F59E0B"
                strokeWidth={2.5}
                dot={{ r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="radiation"
                name="Daily Radiation Dose (mSv)"
                stroke="#EF4444"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            </LineChart>
          ) : (
            <AreaChart data={chartData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="moraleGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#A855F7" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#A855F7" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
              <XAxis dataKey="sol" stroke="#64748B" fontSize={11} />
              <YAxis stroke="#64748B" fontSize={11} domain={[0, 100]} />
              <Tooltip
                contentStyle={{ backgroundColor: '#070B19', borderColor: '#334155', borderRadius: '8px' }}
                itemStyle={{ fontSize: '12px' }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />
              <Area
                type="monotone"
                dataKey="morale"
                name="Crew Morale Index (%)"
                stroke="#A855F7"
                fillOpacity={1}
                fill="url(#moraleGrad)"
                strokeWidth={2.5}
              />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};
