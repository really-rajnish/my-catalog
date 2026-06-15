from starlette.middleware.base import BaseHTTPMiddleware
from fastapi import Request
from fastapi.responses import JSONResponse
from jose import jwt, JWTError
import os

JWT_SECRET = os.getenv("JWT_SECRET", "default-secret-change-in-prod-minimum-32-chars-length")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")

PUBLIC_PATHS = ["/api/v1/auth/login", "/api/v1/auth/register", "/health", "/docs", "/openapi.json", "/api/v1/products", "/api/v1/categories", "/api/v1/search"]

class JWTAuthMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        # Allow OPTIONS requests for CORS preflight
        if request.method == "OPTIONS":
            return await call_next(request)

        # Allow public paths
        is_public_path = request.url.path == "/" or any(request.url.path.startswith(path) for path in PUBLIC_PATHS)
        
        # Enforce auth for modifying products even if they are in PUBLIC_PATHS
        if is_public_path and request.url.path.startswith("/api/v1/products") and request.method in ["POST", "PUT", "DELETE"]:
            if not request.url.path.endswith("/filter"):
                is_public_path = False
            
        if is_public_path:
            return await call_next(request)
        
        # Check authorization header
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            return JSONResponse(status_code=401, content={"error": "Missing token"})
            
        token = auth_header.split(" ")[1]
        
        try:
            payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256", "HS384", "HS512"])
            
            # Create new headers with injected user info
            # We must modify the scope headers directly to pass them down
            headers = dict(request.scope['headers'])
            
            # Add or override the custom headers
            headers[b'x-user-id'] = str(payload.get("userId", "")).encode()
            headers[b'x-user-role'] = str(payload.get("role", "")).encode()
            
            request.scope['headers'] = [(k, v) for k, v in headers.items()]
            
            response = await call_next(request)
            return response
            
        except jwt.ExpiredSignatureError:
            return JSONResponse(status_code=401, content={"error": "Token expired"})
        except JWTError:
            return JSONResponse(status_code=401, content={"error": "Invalid token"})
