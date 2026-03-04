import urllib.request
import json
import re

with open('js/config.js', 'r', encoding='utf-8') as f:
    content = f.read()
    
url_match = re.search(r"url:\s*'([^']+)'", content)
key_match = re.search(r"anonKey:\s*'([^']+)'", content)

url = url_match.group(1) if url_match else ''
key = key_match.group(1) if key_match else ''

headers = {
    'apikey': key,
    'Authorization': f'Bearer {key}',
    'Content-Type': 'application/json'
}

print("Fetching profiles...")
req = urllib.request.Request(f"{url}/rest/v1/profiles?select=id,username,level,attributes,hp_current,sp_current", headers=headers)
try:
    with urllib.request.urlopen(req) as response:
        profiles = json.loads(response.read().decode('utf-8'))
        print(f"Found {len(profiles)} profiles.")
        
        for p in profiles:
            level = p.get('level', 1)
            attrs = p.get('attributes') or {}
            
            con = attrs.get('CON', 1)
            esp = attrs.get('ESP', 1)
            
            max_hp = 15 + con + ((level - 1) * 3)
            max_sp = 10 + esp + ((level - 1) * 3)
            
            cur_hp = p.get('hp_current', 0)
            cur_sp = p.get('sp_current', 0)
            
            print(f"Profile: {p.get('username', p.get('id'))}")
            print(f"  Level: {level} | CON: {con} | ESP: {esp}")
            print(f"  Current HP: {cur_hp} (Max should be {max_hp})")
            print(f"  Current SP: {cur_sp} (Max should be {max_sp})")
            
            update_data = json.dumps({
                'hp_current': max_hp,
                'sp_current': max_sp
            }).encode('utf-8')
            
            patch_url = f"{url}/rest/v1/profiles?id=eq.{p['id']}"
            patch_req = urllib.request.Request(patch_url, data=update_data, headers=headers, method='PATCH')
            
            try:
                with urllib.request.urlopen(patch_req) as patch_resp:
                    if patch_resp.status in [200, 204]:
                        print(f"  -> Successfully updated to HP: {max_hp}, SP: {max_sp}")
                    else:
                        print(f"  -> Failed to update: {patch_resp.status}")
            except Exception as e:
                print(f"  -> Error updating: {e}")
            print("-" * 20)
except Exception as e:
    print(f"Failed to fetch profiles: {e}")
