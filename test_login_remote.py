import urllib.request
import urllib.error
import json

req = urllib.request.Request('https://nexus-gateway-f6hf.onrender.com/api/v1/auth/login', data=json.dumps({"email":"admin@demo.com","password":"123"}).encode('utf-8'), headers={'Content-Type': 'application/json', 'User-Agent': 'Mozilla/5.0'})
try:
    res = urllib.request.urlopen(req)
    print("Status:", res.status)
    print("Headers:", res.headers)
    print("Body:", res.read().decode())
except urllib.error.HTTPError as e:
    print("HTTP ERROR:", e.code)
    print("Headers:", e.headers)
    print("Body:", e.read().decode())
