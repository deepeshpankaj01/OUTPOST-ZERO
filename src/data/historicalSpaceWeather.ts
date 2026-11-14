import { SpaceWeatherEvent } from '../types/mission';

/**
 * Curated NASA DONKI & SOHO Historical Space Weather Dataset
 * Used as an offline-safe fallback when NASA DONKI API is rate-limited or unreachable.
 */
export const HISTORICAL_DONKI_FLARES: SpaceWeatherEvent[] = [
  {
    flareId: 'FLR-2024-X2.4',
    classType: 'X2.4',
    beginTime: '2024-10-09T01:30Z',
    peakTime: '2024-10-09T01:56Z',
    sourceLocation: 'AR3848 (Earth-Sun / Moon line)',
    radiationFactor: 8.5,
    description:
      'Major X2.4-class solar flare observed by NASA SDO and GOES satellites. High proton flux detected in interplanetary space.',
  },
  {
    flareId: 'FLR-2024-X1.8',
    classType: 'X1.8',
    beginTime: '2024-10-24T06:57Z',
    peakTime: '2024-10-24T07:23Z',
    sourceLocation: 'AR3869',
    radiationFactor: 6.2,
    description:
      'Strong impulsive X1.8 flare from active region 3869 producing coronal mass ejection and solar proton enhancement.',
  },
  {
    flareId: 'FLR-2024-M9.0',
    classType: 'M9.0',
    beginTime: '2024-10-03T02:08Z',
    peakTime: '2024-10-03T02:22Z',
    sourceLocation: 'AR3842',
    radiationFactor: 4.0,
    description:
      'Near X-class eruption resulting in immediate radio blackout and moderate space radiation flux.',
  },
  {
    flareId: 'FLR-2023-X1.2',
    classType: 'X1.2',
    beginTime: '2023-01-06T00:43Z',
    peakTime: '2023-01-06T00:57Z',
    sourceLocation: 'AR3182',
    radiationFactor: 5.5,
    description:
      'NASA SDO captured this X1.2 solar flare. Accelerated relativistic ions impacting lunar and martian orbits.',
  },
];

export interface DonkiApiResult {
  isLive: boolean;
  event: SpaceWeatherEvent;
  source: string;
  timestamp: string;
  rawApiCount?: number;
}

/**
 * Fetch recent Solar Flares from NASA DONKI API with a 4-second timeout.
 * Automatically falls back to curated historical dataset.
 */
export async function fetchNasaDonkiSpaceWeather(): Promise<DonkiApiResult> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 4000);

  try {
    // NASA DONKI Solar Flare (FLR) endpoint with DEMO_KEY
    // We look back 30 days
    const today = new Date();
    const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
    const startDate = thirtyDaysAgo.toISOString().split('T')[0];
    const endDate = today.toISOString().split('T')[0];

    const url = `https://api.nasa.gov/DONKI/FLR?startDate=${startDate}&endDate=${endDate}&api_key=DEMO_KEY`;

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`NASA DONKI HTTP status ${response.status}`);
    }

    const data = await response.json();

    if (Array.isArray(data) && data.length > 0) {
      // Pick the strongest or latest flare
      const latest = data[data.length - 1];
      const classType = latest.classType || 'M1.5';
      const isXClass = classType.startsWith('X');
      const isMClass = classType.startsWith('M');

      const radiationFactor = isXClass ? 8.0 : isMClass ? 3.5 : 1.5;

      return {
        isLive: true,
        source: 'NASA DONKI LIVE SATELLITE TELEMETRY (api.nasa.gov)',
        timestamp: new Date().toLocaleTimeString(),
        rawApiCount: data.length,
        event: {
          flareId: latest.flrID || `DONKI-LIVE-${latest.beginTime?.slice(0, 10)}`,
          classType: classType,
          beginTime: latest.beginTime || new Date().toISOString(),
          peakTime: latest.peakTime || new Date().toISOString(),
          sourceLocation: latest.sourceLocation || 'Solar Disk (Orbital Sensor)',
          radiationFactor: radiationFactor,
          description: `Live flare ${classType} telemetry acquired from NASA Space Weather Database Of Notifications, Knowledge, Information (DONKI).`,
        },
      };
    }

    // If empty array, fallback to curated
    return getFallbackHistorical('No recent solar flare events in 30-day DONKI window.');
  } catch (error: any) {
    clearTimeout(timeoutId);
    return getFallbackHistorical(`DONKI API Offline/Rate-Limited (${error?.message || 'Timeout'}).`);
  }
}

function getFallbackHistorical(reason: string): DonkiApiResult {
  const randomIndex = Math.floor(Math.random() * HISTORICAL_DONKI_FLARES.length);
  const event = HISTORICAL_DONKI_FLARES[randomIndex];

  return {
    isLive: false,
    source: `CURATED NASA HISTORICAL DATASET [OFFLINE SAFE: ${reason}]`,
    timestamp: new Date().toLocaleTimeString(),
    event: event,
  };
}
