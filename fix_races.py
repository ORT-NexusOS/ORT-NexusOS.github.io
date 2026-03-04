import urllib.request
import json
import re

# RACES DEFINITION
ORT_RACES = {
    'Humano': {
        'bonuses': { 'INT': 2, 'ESP': 2 }
    },
    'Ciborgue': {
        'bonuses': { 'FOR': 3, 'DES': 2, 'SAB': -1 }
    },
    'Androide': {
        'bonuses': { 'INT': 3, 'FOR': 2 },
        'fixed': { 'ESP': 0 }
    },
    'Autômato': {
        'bonuses': { 'FOR': 3, 'CON': 2, 'DES': -1 }
    },
    'Vaxiriano': {
        'bonuses': { 'CON': 3, 'ESP': 1 }
    },
    'Humanoc': {
        'bonuses': { 'INT': 2, 'SAB': 2 }
    },
    'Nenans': {
        'bonuses': { 'CON': 3, 'FOR': 2, 'INT': -1 }
    },
    'Sparalis': {
        'bonuses': { 'ESP': 4 }
    },
    'Tanots': {
        'bonuses': { 'ESP': 2, 'SAB': 2 }
    }
}

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

print("Fetching profiles to apply racial bonuses and starting ability points...")
req = urllib.request.Request(f"{url}/rest/v1/profiles?select=id,username,level,race,attributes,ability_points", headers=headers)

try:
    with urllib.request.urlopen(req) as response:
        profiles = json.loads(response.read().decode('utf-8'))
        print(f"Found {len(profiles)} profiles.")
        
        for p in profiles:
            race_name = p.get('race') or 'Humano'
            race_data = ORT_RACES.get(race_name, ORT_RACES['Humano'])
            attrs = p.get('attributes') or {}
            level = p.get('level', 1)
            
            print(f"[{p.get('username')}] Race: {race_name}")
            
            # 1. Apply Racial Bonuses
            bonuses = race_data.get('bonuses', {})
            for attr_key, bonus_val in bonuses.items():
                if attr_key not in attrs:
                    attrs[attr_key] = 1 # Base default
                attrs[attr_key] += bonus_val
                
            # 2. Enforce fixed attributes
            fixed = race_data.get('fixed', {})
            for attr_key, fixed_val in fixed.items():
                attrs[attr_key] = fixed_val
                
            print(f"  -> New Attributes: {attrs}")
            
            # 3. Recalculate Derived Stats (Max HP / SP) based on new CON/ESP
            con = attrs.get('CON', 1)
            esp = attrs.get('ESP', 1)
            max_hp = 15 + con + ((level - 1) * 3)
            max_sp = 10 + esp + ((level - 1) * 3)
            
            # 4. Inject 1 Starting Ability Point
            new_ability_pts = p.get('ability_points', 0) + 1
            
            update_data = json.dumps({
                'attributes': attrs,
                'hp_current': max_hp,   # Fully heal them to their new max
                'sp_current': max_sp,
                'ability_points': new_ability_pts
            }).encode('utf-8')
            
            patch_url = f"{url}/rest/v1/profiles?id=eq.{p['id']}"
            patch_req = urllib.request.Request(patch_url, data=update_data, headers=headers, method='PATCH')
            
            try:
                with urllib.request.urlopen(patch_req) as patch_resp:
                    if patch_resp.status in [200, 204]:
                        print(f"  -> SUCCESS! HP updated to {max_hp}, Ability Points +1.")
                    else:
                        print(f"  -> Failed to update: {patch_resp.status}")
            except Exception as e:
                print(f"  -> Error updating: {e}")
            print("-" * 20)
except Exception as e:
    print(f"Failed to fetch profiles: {e}")
