from typing import Dict, Any, List, Tuple
from app.services.firms_client import FirmsClient

class FireVerificationService:
    """
    Monitors registered land parcel boundaries for crop stubble burning.
    Cross-references field polygon boundaries against NASA FIRMS coordinate markers.
    """

    def __init__(self, firms_client: FirmsClient = None):
        self.firms_client = firms_client or FirmsClient()

    @staticmethod
    def is_point_in_polygon(point: Tuple[float, float], polygon: List[Tuple[float, float]]) -> bool:
        """
        Ray-casting Point-in-Polygon (PIP) implementation.
        point: (latitude, longitude)
        polygon: List of coordinate tuples [(lat, lng), (lat, lng), ...]
        """
        if len(polygon) < 3:
            return False
            
        x, y = point
        n = len(polygon)
        inside = False
        
        p1x, p1y = polygon[0]
        for i in range(n + 1):
            p2x, p2y = polygon[i % n]
            if y > min(p1y, p2y):
                if y <= max(p1y, p2y):
                    if x <= max(p1x, p2x):
                        if p1y != p2y:
                            xinters = (y - p1y) * (p2x - p1x) / (p2y - p1y) + p1x
                        if p1x == p2x or x <= xinters:
                            inside = not inside
            p1x, p1y = p2x, p2y
            
        return inside

    async def verify_field_fires(
        self, 
        field_id: str, 
        polygon_coords: List[Dict[str, float]], 
        acreage: float
    ) -> Dict[str, Any]:
        """
        Scans field boundaries for active FIRMS thermal warnings.
        Calculates estimated carbon emissions loss if a fire is intersecting.
        """
        # Convert List of dicts [{"lat": x, "lng": y}] to List of tuples [(lat, lng)]
        polygon = [(coord["lat"], coord["lng"]) for coord in polygon_coords]
        
        # Determine bounding box to minimize NASA query load
        lats = [p[0] for p in polygon]
        lngs = [p[1] for p in polygon]
        min_lat, max_lat = min(lats), max(lats)
        min_lng, max_lng = min(lngs), max(lngs)

        # Pull raw active fires from NASA FIRMS wrapper
        active_fires = await self.firms_client.get_active_fires_in_region(
            min_lat=min_lat - 0.002,
            max_lat=max_lat + 0.002,
            min_lng=min_lng - 0.002,
            max_lng=max_lng + 0.002
        )

        intersecting_fires = []
        for fire in active_fires:
            point = (fire["lat"], fire["lng"])
            if self.is_point_in_polygon(point, polygon):
                intersecting_fires.append(fire)

        if intersecting_fires:
            # Calculate severity based on thermal energy (brightness)
            mean_brightness = sum(f["brightness"] for f in intersecting_fires) / len(intersecting_fires)
            severity = "HIGH" if mean_brightness > 325.0 else "MEDIUM"
            
            # Simple estimations of damage
            affected_percentage = min(95.0, len(intersecting_fires) * 12.5) # 12.5% per fire spot
            affected_acres = acreage * (affected_percentage / 100.0)
            
            # Biomass carbon release coefficient: ~4.5 Tons of CO2 lost per acre burned
            co2_loss_tons = affected_acres * 4.5
            
            return {
                "status": "DANGER",
                "field_id": field_id,
                "active_burns_detected": len(intersecting_fires),
                "severity": severity,
                "affected_area_percentage": round(affected_percentage, 1),
                "estimated_carbon_loss_tons": round(co2_loss_tons, 2),
                "alert_timestamp": "2026-06-19T14:30:00Z"
            }

        return {
            "status": "SAFE",
            "field_id": field_id,
            "active_burns_detected": 0,
            "severity": "NONE",
            "affected_area_percentage": 0.0,
            "estimated_carbon_loss_tons": 0.0,
            "alert_timestamp": None
        }
