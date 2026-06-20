# EcoSphere FastAPI Backend Application

This directory houses the core application code for the FastAPI server.

## 📂 Architecture Layers

- **`api/`**: Endpoint routes grouped by domain or features (Urban, Farmer, Industry, Marketplace, Auth).
- **`services/`**: Core business logic modules (Google integrations, NASA FIRMS alerts, Copernicus NDVI parsing, carbon mathematics calculations).
- **`core/`**: Central application configurations, Pydantic settings loading, validation, and security setup.
- **`schemas/`**: Pydantic models mapping incoming requests, validation structures, and output responses (DTOs).
- **`models/`**: ORM models (if applicable) for telemetry logs and marketplace transactions.
- **`utils/`**: Shared helper libraries, coordinate geocoders, sanitization utilities.
- **`tests/`**: Unit, integration, and mock suites.
