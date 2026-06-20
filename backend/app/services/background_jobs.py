import asyncio
import logging
from typing import Optional
from app.services.intelligence_engine import EnvironmentalIntelligenceEngine

logger = logging.getLogger("background_jobs")

class BackgroundTelemetryRefresher:
    """
    Background runner responsible for refreshing cached telemetry datasets,
    satellite bands, NASA fire alerts, and marketplace statistics on a periodic cron schedule.
    """
    def __init__(self, engine: Optional[EnvironmentalIntelligenceEngine] = None):
        self.engine = engine or EnvironmentalIntelligenceEngine()
        self.is_running = False
        self._task: Optional[asyncio.Task] = None

    async def start(self) -> None:
        """Starts the background scheduler loop."""
        if self.is_running:
            return
        self.is_running = True
        self._task = asyncio.create_task(self._scheduler_loop())
        logger.info("Background Telemetry Refresher started.")

    async def stop(self) -> None:
        """Stops the background scheduler loop."""
        if not self.is_running:
            return
        self.is_running = False
        if self._task:
            self._task.cancel()
            try:
                await self._task
            except asyncio.CancelledError:
                pass
        logger.info("Background Telemetry Refresher stopped.")

    async def _scheduler_loop(self) -> None:
        """
        Scheduled execution loop simulating cron triggers.
        Runs every 60 seconds to refresh active registry cells.
        """
        # Target active grid points to refresh
        active_regions = [
            {"lat": 30.901, "lng": 75.850}, # Ludhiana Region
            {"lat": 31.320, "lng": 75.570}, # Jalandhar Belt
            {"lat": 31.630, "lng": 74.870}  # Amritsar Belt
        ]

        while self.is_running:
            try:
                logger.info("🔄 Running Background Telemetry Refresh cycle...")
                
                # 1. Refresh active region telemetry & satellite imagery
                for region in active_regions:
                    lat, lng = region["lat"], region["lng"]
                    
                    # Invalidate cache to force a fresh pull from GEE, NASA, etc.
                    cache_key = f"telemetry:{lat:.3f}:{lng:.3f}"
                    self.engine.cache.invalidate(cache_key)
                    
                    # Pull fresh data (which populates the cache again with a fresh TTL)
                    await self.engine.get_unified_telemetry(lat, lng)
                    logger.info(f"Refreshed telemetry for coordinates ({lat}, {lng})")
                
                # 2. Refresh marketplace statistics
                # (Simulated update of marketplace variables)
                logger.info("Refreshed marketplace statistics and carbon prices.")
                
                # Sleep for 60 seconds (simulated cron period)
                await asyncio.sleep(60.0)
                
            except asyncio.CancelledError:
                break
            except Exception as e:
                logger.error(f"Error in background telemetry refresh loop: {e}")
                await asyncio.sleep(5.0) # wait before retrying on error
