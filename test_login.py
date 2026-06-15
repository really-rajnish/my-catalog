import httpx
import asyncio
import json

async def main():
    target_url = "https://nexus-springboot-service-f6hf.onrender.com/auth/login"
    headers = {"Content-Type": "application/json"}
    body = json.dumps({"email": "admin@demo.com", "password": "123"}).encode("utf-8")
    
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.request(
                method="POST",
                url=target_url,
                content=body,
                headers=headers
            )
            print(response.status_code)
            print(response.text)
    except Exception as e:
        import traceback
        traceback.print_exc()

asyncio.run(main())
