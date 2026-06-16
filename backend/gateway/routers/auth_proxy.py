from fastapi import APIRouter, Request, Response
from pydantic import BaseModel
import httpx
import os

router = APIRouter()
def get_service_url(env_var, default_port):
    raw = os.getenv(env_var, f"127.0.0.1:{default_port}")
    host = raw.split(":")[0]
    if host in ["127.0.0.1", "localhost"]:
        return f"http://{host}:{default_port}"
    if not host.endswith(".onrender.com"):
        host += ".onrender.com"
    return f"https://{host}"

AUTH_SERVICE_URL = get_service_url("AUTH_SERVICE_HOSTPORT", 8081)

class LoginRequest(BaseModel):
    email: str
    password: str

class RegisterRequest(BaseModel):
    email: str
    password: str

class AuthResponse(BaseModel):
    token: str
    role: str
    expiresIn: int

@router.post("/api/v1/auth/register", response_model=AuthResponse, tags=["Authentication"])
async def register(request: Request, body: RegisterRequest):
    target_url = f"{AUTH_SERVICE_URL}/auth/register"
    req_body = await request.body()
    headers = {
        k: v for k, v in request.headers.items() 
        if not k.lower().startswith(("cf-", "x-forwarded-", "x-render-", "host", "origin", "accept-encoding"))
    }
    
    try:
        async with httpx.AsyncClient(timeout=60.0) as client:
            response = await client.request("POST", target_url, content=req_body, headers=headers)
            
            # Strip hop-by-hop and encoding headers to avoid issues with the client
            resp_headers = dict(response.headers)
            for h in ["content-encoding", "content-length", "transfer-encoding", "connection"]:
                resp_headers.pop(h, None)
                
            return Response(content=response.content, status_code=response.status_code, headers=resp_headers)
    except Exception as e:
        import traceback
        err = traceback.format_exc()
        return Response(content=err, status_code=500)

@router.post("/api/v1/auth/login", response_model=AuthResponse, tags=["Authentication"])
async def login(request: Request, body: LoginRequest):
    target_url = f"{AUTH_SERVICE_URL}/auth/login"
    req_body = await request.body()
    headers = {
        k: v for k, v in request.headers.items() 
        if not k.lower().startswith(("cf-", "x-forwarded-", "x-render-", "host", "origin", "accept-encoding"))
    }
    
    try:
        async with httpx.AsyncClient(timeout=60.0) as client:
            response = await client.request("POST", target_url, content=req_body, headers=headers)
            
            # Strip hop-by-hop and encoding headers to avoid issues with the client
            resp_headers = dict(response.headers)
            for h in ["content-encoding", "content-length", "transfer-encoding", "connection"]:
                resp_headers.pop(h, None)
                
            return Response(content=response.content, status_code=response.status_code, headers=resp_headers)
    except Exception as e:
        import traceback
        err = traceback.format_exc()
        return Response(content=err, status_code=500)

@router.api_route("/api/v1/auth/{full_path:path}", methods=["GET", "POST", "PUT", "DELETE"], include_in_schema=False)
async def auth_proxy(full_path: str, request: Request):
    target_url = f"{AUTH_SERVICE_URL}/auth/{full_path}"
    req_body = await request.body()
    
    # Strip Cloudflare and Render headers to prevent 403s on internal routing
    # Also strip accept-encoding so httpx auto-decompresses the response
    headers = {
        k: v for k, v in request.headers.items() 
        if not k.lower().startswith(("cf-", "x-forwarded-", "x-render-", "host", "origin", "accept-encoding"))
    }
    
    try:
        async with httpx.AsyncClient(timeout=60.0) as client:
            response = await client.request(
                request.method,
                target_url,
                content=req_body,
                headers=headers,
                params=dict(request.query_params)
            )      
        resp_headers = dict(response.headers)
        for h in ["content-encoding", "content-length", "transfer-encoding", "connection"]:
            resp_headers.pop(h, None)
            
        return Response(content=response.content, status_code=response.status_code, headers=resp_headers)
    except Exception as e:
        import traceback
        err = traceback.format_exc()
        return Response(content=err, status_code=500)
