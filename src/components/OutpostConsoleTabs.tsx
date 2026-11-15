'use client';

import React, { useState } from 'react';
import { MissionConfig, ResourceState, PowerAllocation, CrewMember, AudienceMode, SolLogEntry } from '../types/mission';
import { OutpostMapSvg } from './OutpostMapSvg';
import { AstroProfileCard } from './AstroProfileCard';
import { TelemetryCharts } from './TelemetryCharts';

interface OutpostConsoleTabsProps {
  mission: MissionConfig;
  resources: ResourceState;
  allocations: PowerAllocation;
  crew: CrewMember[];
  history: SolLogEntry[];
  mode: AudienceMode;
  selectedModule: string | null;
  onSelectModule: (id: string) => void;
}

export const OutpostConsoleTabs: React.FC<OutpostConsoleTabsProps> = ({
  mission,
  resources,
  allocations,
  crew,
  history,
  mode,
  selectedModule,
  onSelectModule,
}) => {
  const [activeTab, setActiveTab] = useState<'habitat' | 'crew' | 'charts'>('habitat');
  const isCadet = mode === 'cadet';

  return (
    <div className="w-full flex flex-col space-y-3">
      {/* Clean Segmented Tab Switcher */}
      <div className="flex items-center justify-between p-1 rounded-xl bg-space-950 border border-slate-800 text-xs font-mono">
        <div className="flex items-center gap-1 w-full sm:w-auto">
          <button
            onClick={() => setActiveTab('habitat')}
            className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'habitat'
                ? 'bg-sky-500/15 text-sky-300 border border-sky-500/30 font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>📐</span>
            <span>{isCadet ? 'Habitat View' : 'Outpost Schematic'}</span>
          </button>

          <button
            onClick={() => setActiveTab('crew')}
            className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'crew'
                ? 'bg-sky-500/15 text-sky-300 border border-sky-500/30 font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>👨‍🚀</span>
            <span>{isCadet ? 'Crew (4)' : 'Astronaut Roster'}</span>
          </button>

          <button
            onClick={() => setActiveTab('charts')}
            className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'charts'
                ? 'bg-sky-500/15 text-sky-300 border border-sky-500/30 font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>📈</span>
            <span>{isCadet ? 'Sol Trends' : 'Telemetry Logs'}</span>
          </button>
        </div>

        <span className="text-[10px] text-slate-400 hidden md:inline px-2">
          {activeTab === 'habitat' ? 'Click modules to inspect' : activeTab === 'crew' ? '4 Crew Members Active' : `${history.length} Sols Logged`}
        </span>
      </div>

      {/* Tab Panels */}
      <div>
        {activeTab === 'habitat' && (
          <OutpostMapSvg
            mission={mission}
            resources={resources}
            allocations={allocations}
            crew={crew}
            mode={mode}
            selectedModule={selectedModule}
            onSelectModule={onSelectModule}
          />
        )}

        {activeTab === 'crew' && (
          <AstroProfileCard crew={crew} mode={mode} />
        )}

        {activeTab === 'charts' && (
          <TelemetryCharts history={history} mode={mode} />
        )}
      </div>
    </div>
  );
};
