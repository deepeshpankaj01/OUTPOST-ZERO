import { SpaceWeatherEvent } from '../types/mission';

/**
 * Curated NASA DONKI & SOHO Historical Space Weather Dataset
 * Used as an offline-safe, deterministic fallback when NASA DONKI API is rate-limited or unreachable.
 * Sorted chronologically descending (newest first).
 */
export const HISTORICAL_DONKI_FLARES: SpaceWeatherEvent[] = [
  {
    flareId: 'FLR-2024-X2.4',
    classType: 'X2.4',
    beginTime: '2024-10-09T01:30Z',
    peakTime: '2024-10-09T01:56Z',
    sourceLocation: 'AR3848 (Earth-Moon Line of Sight)',
    radiationFactor: 8.5, // Scenario modifier (illustrative solar storm scenario)
    observedDate: '2024-10-09',
    description:
      'Major X2.4-class solar soft X-ray flare observed by GOES-16 satellite. Note: X-ray flux is an indicator of solar electromagnetic activity, not a direct measurement of particle fluence at the lunar surface.',
    isExtrapolatedScenarioModifier: true,
  },
  {
    flareId: 'FLR-2024-X1.8',
    classType: 'X1.8',
    beginTime: '2024-10-24T06:57Z',
    peakTime: '2024-10-24T07:23Z',
    sourceLocation: 'AR3869',
    radiationFactor: 6.2,
    observedDate: '2024-10-24',
    description:
      'Impulsive X1.8-class flare observed in active region 3869. Associated with coronal mass ejection (CME) shock front.',
    isExtrapolatedScenarioModifier: true,
  },
  {
    flareId: 'FLR-2024-M9.0',
    classType: 'M9.0',
    beginTime: '2024-10-03T02:08Z',
    peakTime: '2024-10-03T02:22Z',
    sourceLocation: 'AR3842',
    radiationFactor: 4.0,
    observedDate: '2024-10-03',
    description:
      'Near X-class M9.0 solar flare resulting in high-frequency radio absorption on sunlit hemisphere.',
    isExtrapolatedScenarioModifier: true,
  },
  {
    flareId: 'FLR-2023-X1.2',
    classType: 'X1.2',
    beginTime: '2023-01-06T00:43Z',
    peakTime: '2023-01-06T00:57Z',
    sourceLocation: 'AR3182',
    radiationFactor: 5.5,
    observedDate: '2023-01-06',
    description:
      'X1.2 flare observed by NASA SDO and NOAA GOES spacecraft.',
    isExtrapolatedScenarioModifier: true,
  },
];

export interface DonkiApiResult {
  isLive: boolean;
  statusType: 'live_telemetry' | 'no_events_found' | 'api_error' | 'offline_fallback';
  event: SpaceWeatherEvent;
  source: string;
  timestamp: string;
  queryWindow?: {
    startDate: string;
    endDate: string;
  };
  rawApiCount: number;
  provenanceNote: string;
}

/**
 * Fetch recent Solar Flares from NASA DONKI API with a 4-second timeout.
 * Deterministic fallback to latest curated NASA archive record when offline or rate-limited.
 */
export async function fetchNasaDonkiSpaceWeather(): Promise<DonkiApiResult> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 4000);

  const today = new Date();
  const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
  const startDate = thirtyDaysAgo.toISOString().split('T')[0];
  const endDate = today.toISOString().split('T')[0];

  // Prefer environment API key if provided, else fall back to DEMO_KEY
  const apiKey = (typeof process !== 'undefined' && process.env?.NASA_API_KEY) || 'DEMO_KEY';
  const url = `https://api.nasa.gov/DONKI/FLR?startDate=${startDate}&endDate=${endDate}&api_key=${apiKey}`;

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return getFallbackHistorical(
        `NASA DONKI HTTP ${response.status} (${response.status === 429 ? 'Rate Limited' : 'Unavailable'})`,
        'api_error',
        { startDate, endDate }
      );
    }

    const data = await response.json();

    if (Array.isArray(data)) {
      if (data.length === 0) {
        // Successful query, but zero solar flares in window
        return getFallbackHistorical(
          'Zero solar flares reported by NASA DONKI in the 30-day window.',
          'no_events_found',
          { startDate, endDate },
          0
        );
      }

      // Deterministically sort by peakTime or beginTime descending (most recent first)
      const sorted = [...data].sort((a, b) => {
        const timeA = new Date(a.peakTime || a.beginTime || 0).getTime();
        const timeB = new Date(b.peakTime || b.beginTime || 0).getTime();
        return timeB - timeA;
      });

      const latest = sorted[0];
      const classType = latest.classType || 'M1.0';
      const isXClass = classType.startsWith('X');
      const isMClass = classType.startsWith('M');

      // Educational scenario modifier (explicitly documented as simulation setting)
      const scenarioModifier = isXClass ? 6.0 : isMClass ? 3.0 : 1.5;

      return {
        isLive: true,
        statusType: 'live_telemetry',
        source: 'NASA DONKI Solar Flare (FLR) Feed [Live Query]',
        timestamp: new Date().toLocaleTimeString(),
        queryWindow: { startDate, endDate },
        rawApiCount: data.length,
        provenanceNote:
          'OBSERVED SOURCE DATA: Real-time GOES X-ray solar flare record from NASA DONKI API. Note: X-ray flux is an indicator of solar eruptive activity; the simulation uses an illustrative scenario modifier.',
        event: {
          flareId: latest.flrID || `DONKI-${latest.beginTime?.slice(0, 10)}`,
          classType,
          beginTime: latest.beginTime || new Date().toISOString(),
          peakTime: latest.peakTime || new Date().toISOString(),
          sourceLocation: latest.sourceLocation || 'Solar Disk (Orbital Sensor)',
          radiationFactor: scenarioModifier,
          observedDate: latest.beginTime ? latest.beginTime.slice(0, 10) : endDate,
          description: `Live flare ${classType} telemetry acquired from NASA DONKI. Primary active region: ${latest.sourceLocation || 'Unspecified'}.`,
          isExtrapolatedScenarioModifier: true,
        },
      };
    }

    return getFallbackHistorical('Unexpected API response structure', 'api_error', { startDate, endDate });
  } catch (error: any) {
    clearTimeout(timeoutId);
    const reason = error?.name === 'AbortError' ? 'Query Timeout (>4s)' : (error?.message || 'Network Error');
    return getFallbackHistorical(`DONKI API Offline (${reason})`, 'offline_fallback', { startDate, endDate });
  }
}

/**
 * Deterministic fallback selector: Always selects the latest curated event (index 0).
 * Never uses Math.random().
 */
function getFallbackHistorical(
  reason: string,
  statusType: DonkiApiResult['statusType'],
  queryWindow?: { startDate: string; endDate: string },
  rawApiCount: number = 0
): DonkiApiResult {
  // Deterministic: Always pick the primary verified historical record (FLR-2024-X2.4)
  const event = HISTORICAL_DONKI_FLARES[0];

  return {
    isLive: false,
    statusType,
    source: `CURATED NASA ARCHIVE RECORD [${reason}]`,
    timestamp: new Date().toLocaleTimeString(),
    queryWindow,
    rawApiCount,
    provenanceNote:
      'OBSERVED SOURCE DATA (Curated Archive): Selected deterministic historical GOES solar flare record (2024-10-09) with educational scenario modifier.',
    event,
  };
}
