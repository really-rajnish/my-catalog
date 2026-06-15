import os
import httpx
from fastapi import APIRouter, Request, HTTPException, Depends
from fastapi.responses import JSONResponse
from middleware.auth_middleware import verify_jwt_token

router = APIRouter()

NODE_SERVICE_URL = os.getenv("NODE_SERVICE_URL", "http://127.0.0.1:3000")

async def forward_request(method: str, path: str, request: Request, headers: dict):
    url = f"{NODE_SERVICE_URL}/{path}"
    
    # Try parsing JSON body if it exists
    body = None
    if method in ["POST", "PUT", "PATCH"]:
        try:
            body = await request.json()
        except Exception:
            body = None

    async with httpx.AsyncClient() as client:
        try:
            response = await client.request(
                method=method,
                url=url,
                headers=headers,
                json=body,
                params=request.query_params,
                timeout=10.0
            )
            return JSONResponse(status_code=response.status_code, content=response.json() if response.content else None)
        except httpx.RequestError as exc:
            raise HTTPException(status_code=502, detail=f"Error communicating with Node.js service: {str(exc)}")

@router.api_route("/{path:path}", methods=["GET", "POST", "PUT", "DELETE", "PATCH"])
async def node_proxy(path: str, request: Request, payload: dict = Depends(verify_jwt_token)):
    # Create clean headers and inject user identity from JWT
    headers = {
        "Content-Type": "application/json",
        "X-User-Id": str(payload.get("userId", "")),
        "X-User-Role": payload.get("role", "")
    }
    
    # Prefix the path with api/v1/node since we stripped it in the main router
    full_path = f"api/v1/node/{path}"
    
    return await forward_request(request.method, full_path, request, headers)
