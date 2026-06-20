# EcoSphere Frontend Features Module

EcoSphere implements a feature-first architecture to divide complex requirements into isolated, self-contained business units.

## 📂 Structure of Features

Each feature contains:
- **`components/`**: React and UI elements specific to this feature.
- **`hooks/`**: Custom React hooks handling client-state, local actions, and react-query integrations.
- **`services/`**: API fetching clients, Google integrations wrappers, and data adapters.
- **`types/`**: TypeScript interfaces, enums, type definitions, and DTO layouts.
- **`utils/`**: Helper methods, coordinate converters, and formatters specific to this feature.

## 📦 List of Feature Modules

1. **`urban`**: Commute optimization, air quality telemetry parsing, and custom 2-layer Google Maps visualization.
2. **`farmer`**: Agricultural map overlays for stubble burn detection (NASA FIRMS) and vegetation health index (NDVI).
3. **`industry`**: Industrial asset plotting, translucent gas plume visualization overlays, and geocoding bounds calculation.
4. **`marketplace`**: Transactions, carbon credit tracking, and Google Pay Sandbox integration interface.
5. **`authentication`**: Google Identity OAuth login modals, token refresh managers, and router authorization guards.
6. **`shared`**: Reusable features, global layouts, mapping components, design styling constants, and accessibility utilities.
