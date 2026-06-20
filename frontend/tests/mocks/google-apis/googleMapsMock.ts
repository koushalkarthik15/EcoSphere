/**
 * Google Maps JavaScript API Mock Setup for Jest
 * Injects mock objects into the global window context.
 */

export const mockGoogleMaps = () => {
  const mockMap = jest.fn().mockImplementation(() => ({
    setCenter: jest.fn(),
    setZoom: jest.fn(),
    addListener: jest.fn(),
    getBounds: jest.fn(() => ({
      getNorthEast: () => ({ lat: () => 45, lng: () => -75 }),
      getSouthWest: () => ({ lat: () => 40, lng: () => -80 }),
    })),
  }));

  const mockMarker = jest.fn().mockImplementation(() => ({
    setMap: jest.fn(),
    setPosition: jest.fn(),
  }));

  const mockOverlayView = jest.fn().mockImplementation(() => ({
    setMap: jest.fn(),
    onAdd: jest.fn(),
    draw: jest.fn(),
    onRemove: jest.fn(),
  }));

  global.window.google = {
    // @ts-ignore
    maps: {
      Map: mockMap,
      Marker: mockMarker,
      OverlayView: mockOverlayView,
      Animation: { DROP: 1, BOUNCE: 2 },
      MapTypeId: { ROADMAP: "roadmap", SATELLITE: "satellite" },
      event: {
        addListener: jest.fn(),
        clearListeners: jest.fn(),
      },
    },
  };
};

if (typeof window !== "undefined") {
  mockGoogleMaps();
}
