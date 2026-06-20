import logging
from typing import Dict, Any, Optional, List
from app.services.base_client import BaseHTTPClient
from app.core.config import settings

logger = logging.getLogger("climate_trace_client")

class ClimateTraceClient:
    """
    Dependency-injectable client querying Climate TRACE greenhouse gas telemetry feeds (v7).
    Provides detailed industrial sector emission histories, facility queries, and pagination support.
    """

    def __init__(self, http_client: Optional[BaseHTTPClient] = None):
        # Base url defaults to v7 endpoint from settings
        self.client = http_client or BaseHTTPClient(base_url=settings.CLIMATE_TRACE_ENDPOINT)
        self.fallback_active = False

    async def get_sources(
        self, 
        year: int = 2025, 
        gas: str = "co2e_100yr", 
        limit: int = 100, 
        offset: int = 0
    ) -> Dict[str, Any]:
        """
        Retrieves a paginated list of emitting sources / facilities.
        """
        if "placeholder" in settings.CLIMATE_TRACE_ENDPOINT or self.fallback_active:
            return self._get_mock_sources(year, gas, limit, offset)

        try:
            params = {
                "year": year,
                "gas": gas,
                "limit": limit,
                "offset": offset
            }
            res = await self.client.request(
                method="GET",
                endpoint="/sources",
                params=params
            )
            if isinstance(res, list):
                return {
                    "sources": res,
                    "total_count": len(res),
                    "year": year,
                    "gas": gas,
                    "limit": limit,
                    "offset": offset,
                    "fallback_active": False
                }
            elif isinstance(res, dict):
                res["fallback_active"] = False
                return res
            else:
                return {
                    "sources": [],
                    "fallback_active": True
                }
        except Exception as e:
            logger.error(f"Climate TRACE get_sources failed: {e}. Falling back to mock data.")
            return self._get_mock_sources(year, gas, limit, offset)

    async def get_source_by_id(self, source_id: str) -> Dict[str, Any]:
        """
        Retrieves details for a specific emitting source/facility by its ID.
        Climate TRACE v7 API requires a valid non-zero numeric string ID.
        Internal mock IDs (facility_1, facility_2, etc.) are served from mock data
        without hitting the real API.
        """
        # Normalise to string for safe comparisons
        source_id_str = str(source_id) if source_id is not None else ""
        
        # Guard: empty, None, or zero IDs are invalid
        if not source_id_str or source_id_str in ("0", "None", ""):
            logger.warning(f"Climate TRACE get_source_by_id: invalid/zero ID '{source_id}' — serving mock data.")
            return self._get_mock_source_by_id("facility_1")

        # Guard: internal mock IDs (facility_1, facility_2 etc.) are not valid Climate TRACE API IDs
        if source_id_str.startswith("facility_") or not source_id_str.replace("-", "").replace("_", "").isalnum():
            logger.info(f"Climate TRACE get_source_by_id: internal ID '{source_id_str}' — serving mock data.")
            return self._get_mock_source_by_id(source_id_str)

        if "placeholder" in settings.CLIMATE_TRACE_ENDPOINT or self.fallback_active:
            return self._get_mock_source_by_id(source_id_str)

        try:
            res = await self.client.request(
                method="GET",
                endpoint=f"/sources/{source_id_str}"
            )
            res["fallback_active"] = False
            return res
        except Exception as e:
            logger.error(f"Climate TRACE get_source_by_id failed: {e}. Falling back.")
            return self._get_mock_source_by_id(source_id_str)

    async def get_aggregate_emissions(self, params: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """
        Retrieves aggregate emissions totals.
        """
        if "placeholder" in settings.CLIMATE_TRACE_ENDPOINT or self.fallback_active:
            return {
                "total_co2e_tons": 458900.0,
                "facilities_counted": 14,
                "gases_breakdown": {
                    "co2": 400000.0,
                    "ch4": 1800.0,
                    "n2o": 90.0
                },
                "fallback_active": True
            }

        try:
            res = await self.client.request(
                method="GET",
                endpoint="/emissions",
                params=params
            )
            res["fallback_active"] = False
            return res
        except Exception as e:
            logger.error(f"Climate TRACE get_aggregate_emissions failed: {e}. Falling back.")
            return {
                "total_co2e_tons": 458900.0,
                "facilities_counted": 14,
                "gases_breakdown": {
                    "co2": 400000.0,
                    "ch4": 1800.0,
                    "n2o": 90.0
                },
                "fallback_active": True
            }

    async def get_facility_emissions(self, facility_id: str) -> Dict[str, Any]:
        """
        Retrieves greenhouse gas emissions calculations for a specific target factory.
        Kept for backwards compatibility with ESG and intelligence engine methods.
        """
        return await self.get_source_by_id(facility_id)

    def _get_mock_sources(self, year: int, gas: str, limit: int, offset: int) -> Dict[str, Any]:
        """Returns mock paginated sources list."""
        all_mock = [
            {
                "facility_id": "facility_1",
                "name": "Ludhiana Heavy Industries Corp",
                "sector": "manufacturing",
                "subsector": "metal_casting",
                "annual_emissions_co2_equivalent_tons": 18450.0,
                "coordinates": {"lat": 30.902, "lng": 75.845},
                "gases": {"co2": 15000.0, "ch4": 120.0, "so2": 4.5}
            },
            {
                "facility_id": "facility_2",
                "name": "Punjab Bio-Thermal plant",
                "sector": "power",
                "subsector": "biomass_generation",
                "annual_emissions_co2_equivalent_tons": 12200.0,
                "coordinates": {"lat": 30.915, "lng": 75.862},
                "gases": {"co2": 10500.0, "ch4": 60.0, "so2": 1.2}
            },
            {
                "facility_id": "facility_3",
                "name": "Sutlej Chemical Refining Ltd",
                "sector": "chemical",
                "subsector": "fertilizers",
                "annual_emissions_co2_equivalent_tons": 25100.0,
                "coordinates": {"lat": 30.895, "lng": 75.830},
                "gases": {"co2": 21000.0, "ch4": 140.0, "so2": 8.4}
            }
        ]
        
        # Paginate
        paginated = all_mock[offset : offset + limit]
        return {
            "sources": paginated,
            "total_count": len(all_mock),
            "year": year,
            "gas": gas,
            "limit": limit,
            "offset": offset,
            "fallback_active": True
        }

    def _get_mock_source_by_id(self, source_id: str) -> Dict[str, Any]:
        """Returns details for a mock facility by ID."""
        sources = {
            "facility_1": {
                "facility_id": "facility_1",
                "name": "Ludhiana Heavy Industries Corp",
                "sector": "manufacturing",
                "subsector": "metal_casting",
                "annual_emissions_co2_equivalent_tons": 18450.0,
                "coordinates": {"lat": 30.902, "lng": 75.845},
                "gases": {"co2": 15000.0, "ch4": 120.0, "so2": 4.5}
            },
            "facility_2": {
                "facility_id": "facility_2",
                "name": "Punjab Bio-Thermal plant",
                "sector": "power",
                "subsector": "biomass_generation",
                "annual_emissions_co2_equivalent_tons": 12200.0,
                "coordinates": {"lat": 30.915, "lng": 75.862},
                "gases": {"co2": 10500.0, "ch4": 60.0, "so2": 1.2}
            },
            "facility_3": {
                "facility_id": "facility_3",
                "name": "Sutlej Chemical Refining Ltd",
                "sector": "chemical",
                "subsector": "fertilizers",
                "annual_emissions_co2_equivalent_tons": 25100.0,
                "coordinates": {"lat": 30.895, "lng": 75.830},
                "gases": {"co2": 21000.0, "ch4": 140.0, "so2": 8.4}
            }
        }
        fallback_record = sources.get(source_id, sources["facility_1"])
        fallback_record["fallback_active"] = True
        return fallback_record
