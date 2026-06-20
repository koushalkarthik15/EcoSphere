import asyncio
from typing import Dict, Any, Optional
import httpx

class EcoSphereClientError(Exception):
    """Custom error representing external service connection failures."""
    def __init__(self, message: str, status_code: Optional[int] = None, details: Optional[Any] = None):
        super().__init__(message)
        self.status_code = status_code
        self.details = details


class BaseHTTPClient:
    """
    Dependency-injectable, resilient base HTTP client.
    Supports timeouts, retries with exponential backoff, and strict validation.
    """
    
    def __init__(self, base_url: str = "", timeout_seconds: float = 10.0, max_retries: int = 3):
        self.base_url = base_url
        self.timeout = timeout_seconds
        self.max_retries = max_retries

    async def request(
        self,
        method: str,
        endpoint: str,
        headers: Optional[Dict[str, str]] = None,
        params: Optional[Dict[str, Any]] = None,
        json_data: Optional[Any] = None,
        auth: Optional[Any] = None,
        data: Optional[Any] = None
    ) -> Dict[str, Any]:
        """
        Executes HTTP requests asynchronously.
        Handles retry timeouts and parses responses safely.
        """
        url = f"{self.base_url.rstrip('/')}/{endpoint.lstrip('/')}"
        
        async with httpx.AsyncClient(timeout=self.timeout) as client:
            retries = 0
            backoff_delay = 1.0
            
            while True:
                try:
                    response = await client.request(
                        method=method,
                        url=url,
                        headers=headers,
                        params=params,
                        json=json_data,
                        data=data,
                        auth=auth
                    )
                    
                    # Raise for HTTP errors (4xx, 5xx)
                    response.raise_for_status()
                    
                    # Validate JSON structure
                    try:
                        return response.json()
                    except ValueError:
                        return {"text": response.text}
                        
                except (httpx.ConnectError, httpx.TimeoutException) as e:
                    retries += 1
                    if retries > self.max_retries:
                        raise EcoSphereClientError(
                            message=f"Failed to connect to external endpoint after {self.max_retries} attempts: {e}"
                        )
                    await asyncio.sleep(backoff_delay)
                    backoff_delay *= 2.0 # Exponential backoff
                    
                except httpx.HTTPStatusError as e:
                    raise EcoSphereClientError(
                        message=f"External API returned failure response: {e.response.text}",
                        status_code=e.response.status_code,
                        details=e.response.text
                    )
