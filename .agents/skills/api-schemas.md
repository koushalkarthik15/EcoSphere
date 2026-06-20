# Knowledge Base: EcoSphere Global API Contracts
## 🌍 Google Services Integrations
- Google Maps JS API: Initialized with custom JSON styles aligning to `#F1F8E9`.
- Geocoding API: Endpoint: `https://maps.googleapis.com/maps/api/geocode/json?address={STRING}&key={KEY}`
- Google Sheets API: Handles downstream transformation of JSON matrix streams into spreadsheet objects.
- Google Pay API: Operates strictly on `environment: "TEST"`.
## 🛰️ Open Telemetry Handshakes
- Copernicus Sentinel-5P: Queries daily atmospheric TROPOMI bands for NO2 (Urban) and CH4 (Industrial) plumes.
- Sentinel-1 & 2: Retrieves raw multispectral arrays to output calibrated NDVI values.
- NASA FIRMS API: Near-real-time JSON endpoint mapping latitude and longitude points indicating current local heat signatures.
