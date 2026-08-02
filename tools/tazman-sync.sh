#!/bin/bash
# tazman-sync.sh — מסנכרן את הנוכחות מהמערכת שלנו אל טאזמן.
# שימוש: bash tools/tazman-sync.sh [תאריך כמו 2.8]  (ברירת מחדל: היום, שעון ישראל)
# האסימון נקרא מ-~/.config/flipper/tazman-token (מחוץ לריפו).
set -euo pipefail

TOKEN_FILE="$HOME/.config/flipper/tazman-token"
if [ ! -f "$TOKEN_FILE" ]; then
  echo "חסר קובץ אסימון: $TOKEN_FILE" >&2
  exit 1
fi
TOKEN=$(cat "$TOKEN_FILE")
SB_KEY="sb_publishable_ZNRIWrTQwMD0E0MCauim7g_dh6Brf6I"
SB_URL="https://joyerclvkexbutbalfxb.supabase.co"
TZ_URL="https://tazman.co.il/manager-api/external/v2"

DAY="${1:-$(TZ=Asia/Jerusalem date +%-d.%-m)}"
ISO="2026-$(TZ=Asia/Jerusalem date +%m-%d)"
if [ $# -ge 1 ]; then
  ISO=$(python3 -c "d,m='$1'.split('.'); print(f'2026-{int(m):02d}-{int(d):02d}')")
fi

WORK=$(mktemp -d)
trap 'rm -rf "$WORK"' EXIT

# 1) דוחות טאזמן: מיפוי שם -> client_id + meeting_id (שני קורסי מחזור 1)
curl -s "$TZ_URL/reports/subscriptions-with-presence" -X POST \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d "{\"page\":1,\"items_on_page\":100,\"filter\":{\"course_id\":120522,\"date_from\":\"$ISO\",\"date_to\":\"$ISO\"}}" > "$WORK/long.json"
curl -s "$TZ_URL/reports/subscriptions-with-presence" -X POST \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d "{\"page\":1,\"items_on_page\":100,\"filter\":{\"course_id\":121615,\"date_from\":\"$ISO\",\"date_to\":\"$ISO\"}}" > "$WORK/short.json"

# 2) הנוכחות שלנו
curl -s "$SB_URL/rest/v1/rpc/flipper_staff_op" -X POST \
  -H "apikey: $SB_KEY" -H "Content-Type: application/json" \
  -d "{\"staff_code\":\"flipper-moran-2026\",\"op\":\"get_all\",\"payload\":{\"day\":\"$DAY\"}}" > "$WORK/ours.json"

# 3) בניית תוכנית דחיפה
python3 - "$WORK" << 'PYEOF'
import json, sys
W = sys.argv[1]
MEETING = {120522: 18487711, 121615: 18552509}

def norm(s):
    return s.replace('׳','').replace('״','').replace("'",'').replace('"','').strip()

taz = {}
for f in ('long', 'short'):
    for r in json.load(open(f"{W}/{f}.json")).get('data', []):
        taz[norm(r['client']['name'])] = (r['client']['id'], MEETING[r['course']['id']], r.get('presence'))

ours = json.load(open(f"{W}/ours.json"))['attendance']
plan, missing, skipped = [], [], 0
for a in ours:
    if a.get('present') is None:
        continue
    key = norm(a['child'])
    hit = taz.get(key)
    if not hit:
        for tname, val in taz.items():
            if tname.split()[0] == key.split()[0] and (key.split()[-1] in tname or tname.split()[-1] in key):
                hit = val; break
    if not hit:
        missing.append(a['child']); continue
    cid, mid, current = hit
    target = "present" if a['present'] else "not present"
    if current == target:
        skipped += 1; continue  # כבר מסונכרן
    plan.append({"client_id": cid, "meeting_id": mid, "presence": target, "name": a['child']})

json.dump(plan, open(f"{W}/plan.json", 'w'), ensure_ascii=False)
print(f"מסומנים אצלנו: {sum(1 for a in ours if a.get('present') is not None)} | כבר מסונכרנים: {skipped} | לדחיפה: {len(plan)}")
if missing:
    print("בלי התאמת שם בטאזמן:", ", ".join(missing))
PYEOF

# 4) דחיפה
ok=0; fail=0
while IFS= read -r row; do
  body=$(printf '%s' "$row" | python3 -c "import json,sys; d=json.loads(sys.stdin.read()); print(json.dumps({k:d[k] for k in ('client_id','meeting_id','presence')}))")
  res=$(curl -s "$TZ_URL/journal/presence" -X POST \
    -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" -d "$body")
  if printf '%s' "$res" | grep -q '"OK"'; then
    ok=$((ok+1))
  else
    fail=$((fail+1))
    name=$(printf '%s' "$row" | python3 -c "import json,sys; print(json.loads(sys.stdin.read())['name'])")
    echo "נכשל: $name -> $res"
  fi
done < <(python3 -c "import json; [print(json.dumps(x, ensure_ascii=False)) for x in json.load(open('$WORK/plan.json'))]")

echo "סונכרנו לטאזמן: $ok | נכשלו: $fail | יום: $DAY"
