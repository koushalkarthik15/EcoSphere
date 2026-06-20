# EcoSphere Environmental Intelligence Platform

EcoSphere is a single-page environmental intelligence platform designed to empower urban citizens, farmers, and industries with real-time telemetry, mapping, and a shared carbon marketplace.

## 🚀 Overview

The EcoSphere platform consists of three core business domains:
1. **Urban Citizen**: Focuses on transit options, historical air quality indices, and route recommendations mapping against Sentinel-5P gas spectrometry telemetry.
2. **Farmer**: Provides crop field analytics, Normalized Difference Vegetation Index (NDVI) monitoring via Copernicus Sentinel-2, and active stubble burn fire alerts via NASA FIRMS.
3. **Industry**: Facilitates gas spectrometry analysis, industrial asset boundaries overlaying, and emission telemetry visualization.

All modules share unified Google Identity OAuth 2.0 authentication, carbon calculations, and a marketplace.

## 🛠️ Technology Stack

- **Frontend**: Next.js 15 (App Router), TypeScript, TailwindCSS, shadcn/ui, TanStack Query, Framer Motion, Google Maps JS API.
- **Backend**: FastAPI (Python), PyTest, Pydantic Settings, Uvicorn.
- **Infrastructure**: Docker & Docker Compose.

## 📁 Monorepo Structure

```
carbonfootprint/
├── frontend/               # Next.js App Router Frontend application
├── backend/                # FastAPI Backend service
├── shared/                 # Monorepo-wide shared modules & business logic
└── .agents/                # Persona templates & skills (Untouched)
```

For domain-specific guidelines, refer to:
- [Frontend README](file:///c:/Users/Vaishnavi/OneDrive/Desktop/karthik-proj/carbonfootprint/frontend/README.md)
- [Backend README](file:///c:/Users/Vaishnavi/OneDrive/Desktop/karthik-proj/carbonfootprint/backend/README.md)
- [Shared Services README](file:///c:/Users/Vaishnavi/OneDrive/Desktop/karthik-proj/carbonfootprint/shared/README.md)

## 🌐 API Integrations

EcoSphere integrates with the following external data providers:
- **Google Earth Engine (GEE)**: Fetches `Sentinel-2` and `Landsat 8/9` surface reflectance and thermal imagery for NDVI and surface temperature visualizations.
- **NASA FIRMS**: Fetches active fire and thermal anomaly data using the `MODIS` sensor to identify potential stubble burning.
- **Google Maps JS API**: Renders geospatial data on an interactive mapping interface.

## 🧰 Demo Mode & Environment Variables

To operate the application, you must provide certain environment variables. If you do not have active API credentials, the application will gracefully fall back to **Demo Mode**.

**Required Environment Variables (`frontend/.env.local` & `backend/.env`):**
```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="your_maps_api_key" # Or "dummy_key" to enable offline fallback map
NEXT_PUBLIC_API_URL="http://localhost:8000/api/v1"
GOOGLE_APPLICATION_CREDENTIALS="path/to/service_account.json" # For Earth Engine
EE_PROJECT_ID="your_ee_project"
```

**Demo Mode Behavior**:
- **Maps**: If `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` is not provided or set to `dummy_key`, the frontend will render simulated vector map overlays instead of the live Google Map.
- **Satellites & NASA FIRMS**: If external API calls fail or return no data, the backend seamlessly falls back to cached simulation data, ensuring the UI remains functional for presentation purposes.

## ⚠️ Known Limitations
- The integration with NASA FIRMS requires a 10-day lookback window due to data availability. If no fires occurred in the past 10 days at the queried coordinates, the system accurately reports "No active fire hotspots detected".
- The Google Earth Engine module attempts a cascading search window (30-day, 90-day, 180-day) and sensor fallback (Sentinel-2 -> Landsat-9 -> Landsat-8) to find cloud-free imagery. In highly cloudy regions or during certain seasons, imagery may still be unavailable.
## 🚀 Getting Started (Local Development)

1. **Install Dependencies**
   - Frontend: `cd frontend && npm install`
   - Backend: `cd backend && pip install -r requirements.txt`

2. **Environment Variables**
   - Copy `frontend/.env.example` to `frontend/.env.local`
   - Copy `backend/.env.example` to `backend/.env`
   - Populate variables with API keys or use `dummy_key` for offline sandbox.

3. **Run Application**
   - Frontend: `npm run dev`
   - Backend: `uvicorn app.main:app --reload`

## 🌍 Production Deployment

EcoSphere is optimized for production deployment via Docker (Standalone Next.js) and standard Uvicorn/Gunicorn servers.

1. **Build Frontend (Standalone)**
   ```bash
   cd frontend
   npm run build
   # Output is optimized in the .next/standalone directory
   ```

2. **Run Backend (Production Mode)**
   ```bash
   cd backend
   uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
   ```

3. **Security Headers & CORS**
   Ensure `FRONTEND_URL` is set in the backend environment to securely restrict CORS. Security headers (OWASP Helmet equivalents) are enabled by default on the backend.
