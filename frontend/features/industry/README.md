# Industry Feature Module

This module manages industrial zones monitoring, gas plume spectrometry analysis, and facility mapping.

## 📂 Folders

- **`components/`**: Industrial asset listings, translucent gas plume overlay masks, and emission telemetry visualization overlays.
- **`hooks/`**: Custom hooks for industrial zone lookups and Sentinel-5P gas spectrometry telemetry data loading.
- **`services/`**: API wrapper clients for Google Geocoding (facility coordinate lookups) and Sentinel-5P queries.
- **`types/`**: Types defining industrial zones, gas plume boundaries, and emission levels.
- **`utils/`**: Utilities for calculating bounding boxes from coordinates for gas spectrometry query bounds.
