import urllib.request
import urllib.error

req = urllib.request.Request('https://nexus-gateway-f6hf.onrender.com/api/v1/products')
try:
    urllib.request.urlopen(req)
except urllib.error.HTTPError as e:
    print("HTTP ERROR:", e.code)
    print(e.read().decode())
