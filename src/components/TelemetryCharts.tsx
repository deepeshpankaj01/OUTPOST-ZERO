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
    <div className="clean-card p-3.5 sm:p-4 shadow-card">
      {/* Header & Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3 pb-2.5 border-b border-slate-800">
        <div>
          <h3 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5 tracking-wide">
            <span>📈</span>
            <span>
              {isCadet
                ? 'Mission Telemetry Trends'
                : 'Real-Time Subsystem Telemetry Logs'}
            </span>
          </h3>
          <p className="text-[11px] text-slate-400 mt-0.5">
            {isCadet
              ? 'Track how your decisions affected the base across each Sol.'
              : 'Multi-channel historical telemetry across EPS, ECLSS, TCS, and Human Factors.'}
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex flex-wrap gap-1 p-1 bg-space-950 rounded-lg border border-slate-800 text-xs font-mono">
          <button
            onClick={() => setActiveTab('power')}
            className={`px-2.5 py-1 rounded transition-all ${
              activeTab === 'power'
                ? 'bg-sky-500/15 text-sky-300 border border-sky-500/30 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            ⚡ {isCadet ? 'Power' : 'EPS'}
          </button>
          <button
            onClick={() => setActiveTab('eclss')}
            className={`px-2.5 py-1 rounded transition-all ${
              activeTab === 'eclss'
                ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            🌬️ {isCadet ? 'Air & Water' : 'ECLSS'}
          </button>
          <button
            onClick={() => setActiveTab('thermal')}
            className={`px-2.5 py-1 rounded transition-all ${
              activeTab === 'thermal'
                ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            🌡️ {isCadet ? 'Temp & Rad' : 'TCS'}
          </button>
          <button
            onClick={() => setActiveTab('morale')}
            className={`px-2.5 py-1 rounded transition-all ${
              activeTab === 'morale'
                ? 'bg-purple-500/15 text-purple-300 border border-purple-500/30 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            😊 {isCadet ? 'Morale' : 'Morale'}
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
