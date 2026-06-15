from fastapi import FastAPI, Request, Response
import httpx
import os
from fastapi.middleware.cors import CORSMiddleware
from middleware.auth_middleware import JWTAuthMiddleware
from routers.auth_proxy import router as auth_router

app = FastAPI(
    title="Nexus API Gateway",
    description="API Gateway routing to the authentication service",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow frontend origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register JWT middleware
app.add_middleware(JWTAuthMiddleware)

# Register auth router BEFORE general proxy
app.include_router(auth_router)

AUTH_SERVICE_URL = os.getenv("AUTH_SERVICE_URL", "http://127.0.0.1:8081")

@app.api_route("/api/v1/{full_path:path}", methods=["GET", "POST", "PUT", "PATCH", "DELETE"], include_in_schema=False)
async def api_v1_proxy(full_path: str, request: Request):
    target_url = f"{AUTH_SERVICE_URL}/api/v1/{full_path}"
    
    body = await request.body()
    headers = dict(request.headers)
    # Remove host header to avoid conflicts
    headers.pop("host", None)
    headers.pop("origin", None)
    
    async with httpx.AsyncClient(timeout=30.0) as client:
        response = await client.request(
            method=request.method,
            url=target_url,
            content=body,
            headers=headers,
            params=request.query_params
        )
        resp_headers = dict(response.headers)
        for h in ["content-encoding", "content-length", "transfer-encoding", "connection"]:
            resp_headers.pop(h, None)
            
        return Response(content=response.content, status_code=response.status_code, headers=resp_headers)

from fastapi.responses import PlainTextResponse

@app.get("/", include_in_schema=False)
async def root():
    return PlainTextResponse("Started...!!")

@app.get("/health", tags=["System"])
async def health_check():
    """Health check endpoint for the Gateway."""
    return {"status": "ok", "service": "FastAPI Gateway"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000)
