import httpx
import asyncio

async def main():
    target_url = "https://nexus-springboot-service-f6hf.onrender.com/api/v1/products"
    headers = {"host": "nexus-gateway-f6hf.onrender.com", "accept": "*/*"}
    headers.pop("host", None)
    
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.request(
                method="GET",
                url=target_url,
                content=b"",
                headers=headers,
                params={}
            )
            print(response.status_code)
            print(response.text)
    except Exception as e:
        import traceback
        traceback.print_exc()

asyncio.run(main())
