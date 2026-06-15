from fastapi import APIRouter, Request, Response
from pydantic import BaseModel
import httpx
import os

router = APIRouter()
AUTH_SERVICE_URL = os.getenv("AUTH_SERVICE_URL", "http://127.0.0.1:8081")

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
    headers = dict(request.headers)
    headers.pop("host", None)
    headers.pop("origin", None)
    
    async with httpx.AsyncClient() as client:
        response = await client.request("POST", target_url, content=req_body, headers=headers)
        
        # Strip hop-by-hop and encoding headers to avoid issues with the client
        resp_headers = dict(response.headers)
        for h in ["content-encoding", "content-length", "transfer-encoding", "connection"]:
            resp_headers.pop(h, None)
            
        return Response(content=response.content, status_code=response.status_code, headers=resp_headers)

@router.post("/api/v1/auth/login", response_model=AuthResponse, tags=["Authentication"])
async def login(request: Request, body: LoginRequest):
    target_url = f"{AUTH_SERVICE_URL}/auth/login"
    req_body = await request.body()
    headers = dict(request.headers)
    headers.pop("host", None)
    headers.pop("origin", None)
    
    async with httpx.AsyncClient() as client:
        response = await client.request("POST", target_url, content=req_body, headers=headers)
        
        # Strip hop-by-hop and encoding headers to avoid issues with the client
        resp_headers = dict(response.headers)
        for h in ["content-encoding", "content-length", "transfer-encoding", "connection"]:
            resp_headers.pop(h, None)
            
        return Response(content=response.content, status_code=response.status_code, headers=resp_headers)

@router.api_route("/api/v1/auth/{full_path:path}", methods=["GET", "POST", "PUT", "DELETE"], include_in_schema=False)
async def auth_proxy(full_path: str, request: Request):
    target_url = f"{AUTH_SERVICE_URL}/auth/{full_path}"
    
    body = await request.body()
    headers = dict(request.headers)
    headers.pop("host", None)
    headers.pop("origin", None)
    
    async with httpx.AsyncClient() as client:
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
