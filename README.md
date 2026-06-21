# 🌍 EcoSphere

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

**EcoSphere** is an AI-powered environmental intelligence platform that combines satellite imagery, climate datasets, and geospatial analytics to help individuals, industries, and policymakers understand environmental impact and make sustainable decisions.

Developed for hackathons focused on climate technology and space-based innovation, EcoSphere demonstrates how Earth observation data can be transformed into actionable insights through an intuitive web platform.

---

# Problem Statement

Climate change decisions are often made using fragmented and difficult-to-access environmental datasets. While satellite providers generate vast amounts of valuable information, most organizations and individuals cannot easily integrate this data into day-to-day sustainability planning.

EcoSphere bridges this gap by converting satellite observations and environmental APIs into meaningful recommendations, interactive visualizations, and carbon intelligence.

---

# Key Features

* Interactive environmental dashboard
* Live satellite intelligence
* Carbon footprint analytics
* AI-powered sustainability recommendations
* Carbon credit marketplace prototype
* Climate Trace emissions visualization
* NASA FIRMS wildfire monitoring
* Copernicus Earth observation integration
* Google Earth Engine support
* Multi-role dashboards (Urban Citizen, Farmer, Industry)
* Secure authentication with Demo Mode
* Responsive modern UI

---

# Project Structure

```text
EcoSphere/
├── backend/                # FastAPI backend service
│   ├── app/                # Main application logic
│   │   ├── api/            # API routing handlers
│   │   ├── core/           # Config and security
│   │   ├── models/         # Pydantic schemas
│   │   └── services/       # External API integrations (FIRMS, GEE, etc.)
│   ├── tests/              # Python test suite
│   ├── Dockerfile          # Backend containerization
│   └── requirements.txt    # Python dependencies
├── frontend/               # Next.js frontend application
│   ├── app/                # Next.js 15 App Router
│   ├── components/         # Reusable UI components
│   ├── features/           # Domain-specific components (Urban, Farmer, Industry)
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Shared utilities and context providers
│   ├── styles/             # Global CSS and Tailwind directives
│   ├── types/              # Shared TypeScript interfaces
│   ├── Dockerfile          # Frontend containerization
│   └── package.json        # Node dependencies
└── README.md               # Project documentation
```

---

# Architecture

Frontend (Next.js + React + TypeScript)

↓

FastAPI Backend

↓

Environmental Intelligence Layer

* Climate Trace API
* NASA FIRMS
* Copernicus
* Google Earth Engine
* Google Maps Platform

↓

Visualization & Decision Support

---

# Technology Stack

## Frontend

* Next.js 15
* React
* TypeScript
* Tailwind CSS
* Google Maps JavaScript API

## Backend

* FastAPI
* Python
* Pydantic
* JWT Authentication

## Environmental Data Sources

* Climate Trace
* NASA FIRMS
* Copernicus Data Space Ecosystem
* Google Earth Engine

## Deployment

* Vercel
* GitHub

---

# User Roles

### Urban Citizen

* Carbon footprint estimation
* Sustainability recommendations
* Environmental awareness dashboard

### Farmer

* Satellite-based land monitoring
* Crop and environmental insights
* Fire detection alerts

### Industry

* Emissions monitoring
* Sustainability reporting
* Carbon credit recommendations

---

# AI Recommendation Engine

EcoSphere generates contextual sustainability recommendations using:

* Satellite observations
* Environmental telemetry
* Air quality indicators
* Carbon emission datasets
* Climate Trace emissions
* Wildfire information
* User role and location

---

# API Integrations

| Service             | Purpose                    |
| ------------------- | -------------------------- |
| Climate Trace       | Global emissions data      |
| NASA FIRMS          | Active wildfire monitoring |
| Copernicus          | Earth observation imagery  |
| Google Earth Engine | Remote sensing analysis    |
| Google Maps         | Interactive mapping        |

---

# Security

* JWT Authentication
* Role-based access
* Environment variable configuration
* CORS protection
* Rate limiting
* Secure HTTP headers

---

# Future Roadmap

* Real-time satellite streaming
* Carbon credit verification
* ML-based emission prediction
* Multi-country expansion
* IoT sensor integration
* Mobile application
* Advanced sustainability reporting

---

# Installation

```bash
git clone https://github.com/koushalkarthik15/EcoSphere.git

cd EcoSphere
```

Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Frontend

```bash
cd frontend
npm install
npm run dev
```

---

# Environment Variables

Frontend

```
NEXT_PUBLIC_API_URL
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
NEXT_PUBLIC_CLIMATE_TRACE_API
```

Backend

```
JWT_SECRET
GOOGLE_MAPS_API_KEY
NASA_FIRMS_API
COPERNICUS_CLIENT_ID
COPERNICUS_CLIENT_SECRET
GOOGLE_EARTH_ENGINE_PROJECT
```

---

# Project Highlights

* Space technology for sustainability
* Satellite-powered environmental intelligence
* AI-assisted decision support
* Modern full-stack architecture
* Scalable API-first design
* Production-ready deployment

---

# Vision

EcoSphere aims to make environmental intelligence accessible to everyone by combining AI, satellite imagery, and geospatial analytics into a unified platform that supports informed climate action.
