# Farmer Feature Module

This module encompasses agricultural dashboards and telemetry overlays for farmers.

## 📂 Folders

- **`components/`**: Agricultural maps plotting stubble burn alerts (`[🔥 Alert Icons]`), soil carbon sink status charts, and ledger export utilities.
- **`hooks/`**: Custom hooks for fetching Sentinel-2 NDVI matrix data and NASA FIRMS alert updates.
- **`services/`**: Google Sheets API integration adapters for ledger exporting and telemetry integrations.
- **`types/`**: Types defining field coordinates, NDVI indices, and burn alert criteria.
- **`utils/`**: Utilities for estimating topsoil carbon sequestration back baseline values (e.g. 1.5 MT CO2 baseline per 5 acres).
