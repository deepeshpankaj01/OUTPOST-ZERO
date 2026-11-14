import { MissionId, ResourceState, PowerAllocation, SolLogEntry, CrewMember } from '../types/mission';

export interface SavedMissionState {
  missionId: MissionId;
  currentSol: number;
  resources: ResourceState;
  allocations: PowerAllocation;
  history: SolLogEntry[];
  crew: CrewMember[];
  isCompleted: boolean;
  score: number;
  lastUpdated: string;
}

export interface PlayerProfile {
  callsign: string;
  rank: string;
  badgesEarned: string[];
  missionsCompletedCount: number;
  highScores: Record<string, number>;
  favoriteMission: MissionId;
}

const STORAGE_KEYS = {
  CURRENT_MISSION: 'outpost_zero_saved_state',
  REWIND_STACK: 'outpost_zero_rewind_stack',
  PLAYER_PROFILE: 'outpost_zero_player_profile',
  AUDIO_MUTED: 'outpost_zero_muted',
  AUDIENCE_MODE: 'outpost_zero_audience_mode',
};

export const storage = {
  saveMissionState(state: SavedMissionState): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEYS.CURRENT_MISSION, JSON.stringify(state));
    } catch (e) {
      console.warn('Failed to save mission state to localStorage', e);
    }
  },

  getMissionState(): SavedMissionState | null {
    if (typeof window === 'undefined') return null;
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CURRENT_MISSION);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  },

  clearMissionState(): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_MISSION);
      localStorage.removeItem(STORAGE_KEYS.REWIND_STACK);
    } catch (e) {}
  },

  pushRewindSnapshot(state: SavedMissionState): void {
    if (typeof window === 'undefined') return;
    try {
      const stack = this.getRewindStack();
      // Keep last 10 snapshots
      stack.push(state);
      if (stack.length > 10) stack.shift();
      localStorage.setItem(STORAGE_KEYS.REWIND_STACK, JSON.stringify(stack));
    } catch (e) {}
  },

  popRewindSnapshot(): SavedMissionState | null {
    if (typeof window === 'undefined') return null;
    try {
      const stack = this.getRewindStack();
      if (stack.length === 0) return null;
      const snapshot = stack.pop();
      localStorage.setItem(STORAGE_KEYS.REWIND_STACK, JSON.stringify(stack));
      return snapshot || null;
    } catch (e) {
      return null;
    }
  },

  getRewindStack(): SavedMissionState[] {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(STORAGE_KEYS.REWIND_STACK);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  },

  getPlayerProfile(): PlayerProfile {
    if (typeof window === 'undefined') {
      return {
        callsign: 'Cadet Explorer',
        rank: 'Junior Astronaut',
        badgesEarned: [],
        missionsCompletedCount: 0,
        highScores: {},
        favoriteMission: 'moon_shackleton',
      };
    }
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PLAYER_PROFILE);
      if (data) return JSON.parse(data);
    } catch (e) {}

    const defaultProfile: PlayerProfile = {
      callsign: 'Cadet Explorer',
      rank: 'Junior Astronaut',
      badgesEarned: ['CADET_INSIGNIA'],
      missionsCompletedCount: 0,
      highScores: { moon_shackleton: 0, mars_jezero: 0 },
      favoriteMission: 'moon_shackleton',
    };
    return defaultProfile;
  },

  savePlayerProfile(profile: PlayerProfile): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEYS.PLAYER_PROFILE, JSON.stringify(profile));
    } catch (e) {}
  },

  unlockBadge(badgeId: string): void {
    const profile = this.getPlayerProfile();
    if (!profile.badgesEarned.includes(badgeId)) {
      profile.badgesEarned.push(badgeId);
      this.savePlayerProfile(profile);
    }
  },
};
