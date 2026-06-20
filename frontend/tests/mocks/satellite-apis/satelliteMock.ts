/**
 * Satellite API Mocks for Offline Frontend Testing
 * Generates sample telemetry data representing NDVI matrixes and gas spectrometry maps.
 */

export const mockNDVIData = {
  region: "Punjab_Baseline_Field",
  coordinates: { latitude: 30.9, longitude: 75.8 },
  ndviScore: 0.72,
  history: [
    { date: "2026-06-01", score: 0.65 },
    { date: "2026-06-10", score: 0.72 }
  ],
  stubbleBurnAlert: false
};

export const mockAirQualitySpectrometry = {
  bounds: {
    northEast: { lat: 31.2, lng: 76.1 },
    southWest: { lat: 30.6, lng: 75.5 }
  },
  gases: {
    no2: 24.5, // ppb
    ch4: 1890,  // ppb
    so2: 1.8   // ppb
  },
  historicalBaseline: {
    no2: 22.1,
    ch4: 1850
  }
};
