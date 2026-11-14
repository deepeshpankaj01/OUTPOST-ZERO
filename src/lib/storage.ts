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
  resolvedCrises: string[];
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
  CURRENT_MISSION: 'outpost_zero_saved_state_v2',
  REWIND_STACK: 'outpost_zero_rewind_stack_v2',
  PLAYER_PROFILE: 'outpost_zero_player_profile_v2',
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
      if (!data) return null;
      const parsed = JSON.parse(data);

      // Validate core required fields
      if (
        !parsed ||
        typeof parsed !== 'object' ||
        !parsed.missionId ||
        typeof parsed.currentSol !== 'number' ||
        !parsed.resources ||
        !parsed.allocations
      ) {
        return null;
      }

      // Ensure resolvedCrises array exists
      if (!Array.isArray(parsed.resolvedCrises)) {
        parsed.resolvedCrises = [];
      }

      return parsed as SavedMissionState;
    } catch (e) {
      console.warn('Corrupted mission state in localStorage; clearing', e);
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
      // Keep up to 10 snapshots
      stack.push(JSON.parse(JSON.stringify(state)));
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
      if (!data) return [];
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  },

  getPlayerProfile(): PlayerProfile {
    const defaultProfile: PlayerProfile = {
      callsign: 'Cadet Explorer',
      rank: 'Junior Astronaut',
      badgesEarned: ['CADET_INSIGNIA'],
      missionsCompletedCount: 0,
      highScores: { moon_shackleton: 0, mars_jezero: 0 },
      favoriteMission: 'moon_shackleton',
    };

    if (typeof window === 'undefined') return defaultProfile;

    try {
      const data = localStorage.getItem(STORAGE_KEYS.PLAYER_PROFILE);
      if (!data) return defaultProfile;
      const parsed = JSON.parse(data);
      if (!parsed || typeof parsed !== 'object') return defaultProfile;

      return {
        ...defaultProfile,
        ...parsed,
        badgesEarned: Array.isArray(parsed.badgesEarned) ? parsed.badgesEarned : defaultProfile.badgesEarned,
        highScores: typeof parsed.highScores === 'object' && parsed.highScores !== null ? parsed.highScores : defaultProfile.highScores,
      };
    } catch (e) {
      return defaultProfile;
    }
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
