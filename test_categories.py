import urllib.request
import urllib.error

req = urllib.request.Request('https://nexus-gateway-f6hf.onrender.com/api/v1/categories')
try:
    res = urllib.request.urlopen(req)
    print("Status:", res.status)
    print("Body:", res.read().decode())
except urllib.error.HTTPError as e:
    print("HTTP ERROR:", e.code)
    print("Body:", e.read().decode())
