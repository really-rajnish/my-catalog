from fastapi import FastAPI, Request, Response
import httpx
import os
from fastapi.middleware.cors import CORSMiddleware
from middleware.auth_middleware import JWTAuthMiddleware
from routers.auth_proxy import router as auth_router
from routers.node_proxy import router as node_router

app = FastAPI(
    title="Nexus API Gateway",
    description="API Gateway routing to the authentication service",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow frontend origin
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register JWT middleware
app.add_middleware(JWTAuthMiddleware)

# Register auth router BEFORE general proxy
app.include_router(auth_router)
app.include_router(node_router, prefix="/api/v1/node")

import asyncio

def get_service_url(env_var, default_port):
    raw = os.getenv(env_var, f"127.0.0.1:{default_port}")
    host = raw.split(":")[0]
    if host in ["127.0.0.1", "localhost"]:
        return f"http://{host}:{default_port}"
    if not host.endswith(".onrender.com"):
        host += ".onrender.com"
    return f"https://{host}"

AUTH_SERVICE_URL = get_service_url("AUTH_SERVICE_HOSTPORT", 8081)
NODE_SERVICE_URL = get_service_url("NODE_SERVICE_HOSTPORT", 3000)

@app.get("/api/v1/products/{product_id}")
async def get_product_composed(product_id: str, request: Request):
    target_sql_url = f"{AUTH_SERVICE_URL}/api/v1/products/{product_id}"
    target_mongo_url = f"{NODE_SERVICE_URL}/api/v1/node/product-details/{product_id}"

    headers = {
        k: v for k, v in request.headers.items() 
        if not k.lower().startswith(("cf-", "x-forwarded-", "x-render-", "host", "origin", "accept-encoding"))
    }

    try:
        async with httpx.AsyncClient(timeout=60.0) as client:
            sql_req = client.get(target_sql_url, headers=headers, params=request.query_params)
            mongo_req = client.get(target_mongo_url, headers=headers)
            
            sql_resp, mongo_resp = await asyncio.gather(sql_req, mongo_req, return_exceptions=True)
            
            if isinstance(sql_resp, Exception) or sql_resp.status_code != 200:
                return Response(content=getattr(sql_resp, 'content', b'{"error": "Product not found"}'), status_code=getattr(sql_resp, 'status_code', 404))

            sql_data = sql_resp.json()
            mongo_data = {}
            if not isinstance(mongo_resp, Exception) and mongo_resp.status_code == 200:
                mongo_data = mongo_resp.json()
                
            composed_data = {
                "sqlData": sql_data,
                "mongoData": mongo_data
            }
            return composed_data
    except Exception as e:
        import traceback
        err = traceback.format_exc()
        return Response(content=err, status_code=500)

@app.api_route("/api/v1/{full_path:path}", methods=["GET", "POST", "PUT", "PATCH", "DELETE"], include_in_schema=False)
async def api_v1_proxy(full_path: str, request: Request):
    target_url = f"{AUTH_SERVICE_URL}/api/v1/{full_path}"
    
    body = await request.body()
    headers = {
        k: v for k, v in request.headers.items() 
        if not k.lower().startswith(("cf-", "x-forwarded-", "x-render-", "host", "origin", "accept-encoding"))
    }
    
    try:
        async with httpx.AsyncClient(timeout=60.0) as client:
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
    except Exception as e:
        import traceback
        err = traceback.format_exc()
        return Response(content=err, status_code=500)

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
