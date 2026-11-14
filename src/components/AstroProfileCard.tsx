'use client';

import React from 'react';
import { CrewMember, AudienceMode } from '../types/mission';
import { storage } from '../lib/storage';

interface AstroProfileCardProps {
  crew: CrewMember[];
  mode: AudienceMode;
}

export const AstroProfileCard: React.FC<AstroProfileCardProps> = ({ crew, mode }) => {
  const isCadet = mode === 'cadet';
  const profile = storage.getPlayerProfile();

  const badgeIcons: Record<string, { label: string; icon: string }> = {
    CADET_INSIGNIA: { label: 'Junior Cadet', icon: '⭐' },
    MOON_SHACKLETON_SURVIVOR: { label: 'Lunar Base Director', icon: '🌕' },
    MARS_JEZERO_SURVIVOR: { label: 'Mars Frontier Pioneer', icon: '🔴' },
  };

  return (
    <div className="rounded-2xl bg-space-900/90 border border-slate-800 p-4 sm:p-5 shadow-xl backdrop-blur-md">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3 pb-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="text-base">👨‍🚀</span>
          <h4 className="text-sm font-bold text-white font-mono uppercase tracking-wide">
            {isCadet ? 'Astronaut Crew & Morale' : 'Crew Human Factors & Flight Roster'}
          </h4>
        </div>

        <div className="flex items-center gap-1.5">
          {profile.badgesEarned.map((badgeId) => {
            const b = badgeIcons[badgeId] || { label: badgeId, icon: '🏅' };
            return (
              <span
                key={badgeId}
                className="px-2 py-0.5 rounded bg-space-950 border border-amber-500/40 text-[10px] font-mono text-amber-300 flex items-center gap-1"
                title={b.label}
              >
                <span>{b.icon}</span>
                <span className="hidden sm:inline">{b.label}</span>
              </span>
            );
          })}
        </div>
      </div>

      {/* Crew Members Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {crew.map((member) => (
          <div
            key={member.id}
            className="p-3 rounded-xl bg-space-950/80 border border-slate-800 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span
                  className="w-3 h-3 rounded-full border border-white/40"
                  style={{ backgroundColor: member.avatarColor }}
                />
                <span className="font-bold text-xs text-white truncate">
                  {member.name.split(' ')[0]} {member.name.split(' ')[1]}
                </span>
              </div>
              <div className="text-[10px] text-slate-400 font-mono truncate">
                {member.role}
              </div>
            </div>

            <div className="mt-2 pt-2 border-t border-slate-800/80 space-y-1">
              <div className="flex justify-between text-[10px] font-mono">
                <span className="text-slate-400">Morale</span>
                <span
                  className={
                    member.morale > 70
                      ? 'text-emerald-400'
                      : member.morale > 40
                      ? 'text-amber-400'
                      : 'text-coral-neon'
                  }
                >
                  {member.morale}%
                </span>
              </div>

              {/* Morale Progress Bar */}
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${member.morale}%`,
                    backgroundColor: member.avatarColor,
                  }}
                />
              </div>

              <div className="flex justify-between text-[10px] font-mono pt-0.5">
                <span className="text-slate-400">Status</span>
                <span className="text-cyan-300 font-bold">{member.status}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
