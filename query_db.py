import requests
import json
import re

with open('js/config.js', 'r', encoding='utf-8') as f:
    content = f.read()
    
url_match = re.search(r"supabaseUrl\s*=\s*'([^']+)'", content)
key_match = re.search(r"supabaseAnonKey\s*=\s*'([^']+)'", content)

url = url_match.group(1) if url_match else ''
key = key_match.group(1) if key_match else ''

headers = {
    'apikey': key,
    'Authorization': f'Bearer {key}',
    'Content-Type': 'application/json'
}

response = requests.get(f"{url}/rest/v1/profiles?select=*&limit=1", headers=headers)
if response.status_code == 200:
    data = response.json()
    if data:
        print(json.dumps(list(data[0].keys()), indent=2))
    else:
        print("Empty table")
else:
    print(response.text)
