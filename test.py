import urllib.request
import urllib.error
import json

req = urllib.request.Request('https://nexus-gateway-f6hf.onrender.com/api/v1/auth/login', data=json.dumps({"email":"admin@demo.com","password":"123"}).encode('utf-8'), headers={'Content-Type': 'application/json', 'User-Agent': 'Mozilla/5.0'})
try:
    print(urllib.request.urlopen(req).read().decode())
except urllib.error.HTTPError as e:
    print("HTTP ERROR:", e.code)
    print(e.read().decode())
