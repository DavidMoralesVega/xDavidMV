#!/bin/bash
# ============================================================================
# live-check.sh — Smoke test de producción para moralesvegadavid.com + bemorex.com
# ============================================================================
# Verifica, sobre el sitio EN VIVO:
#   • HTTP 200 en cada ruta
#   • HTML válido y legible tras descompresión  → anti "números raros"/basura
#     (bytes NUL, doble-decodificado, mojibake de acentos)
#   • charset UTF-8
#   • SEO esencial: <title>, meta description, canonical, OpenGraph, Twitter,
#     JSON-LD, html lang, viewport
#   • robots.txt / sitemap.xml / sw.js alcanzables
#
# Uso:  bash scripts/live-check.sh
# Requiere: curl (con --compressed) y python3. Sale con código !=0 si hay fallos.
# Correr DESPUÉS de cada `firebase deploy` para confirmar que nada se rompió.
# ============================================================================
set -u
PASS=0; FAIL=0; WARN=0
ok()   { printf "  \033[32m✓\033[0m %s\n" "$1"; PASS=$((PASS+1)); }
bad()  { printf "  \033[31m✗ %s\033[0m\n" "$1"; FAIL=$((FAIL+1)); }
warn() { printf "  \033[33m! %s\033[0m\n" "$1"; WARN=$((WARN+1)); }

UA="Mozilla/5.0 (compatible; LiveCheck/1.0)"
TMP=$(mktemp -d)
trap 'rm -rf "$TMP"' EXIT

check_page() {
  local url="$1"
  echo ""
  echo "── $url"
  local hdr="$TMP/h.txt" body="$TMP/b.html" code
  # --compressed → envía Accept-Encoding Y descomprime el body, como un navegador.
  code=$(curl -sS -A "$UA" --compressed -L -o "$body" -D "$hdr" \
    -w '%{http_code}' --max-time 25 "$url" 2>/dev/null)

  [ "$code" = "200" ] && ok "HTTP $code" || bad "HTTP $code (esperado 200)"

  local ct; ct=$(grep -i '^content-type:' "$hdr" | tail -1 | tr -d '\r')
  echo "$ct" | grep -qi 'text/html' && ok "Content-Type html" || warn "Content-Type: $ct"
  echo "$ct" | grep -qi 'charset=utf-8' && ok "charset=utf-8" || warn "charset ausente"

  # --- ANTI-BASURA ---
  if head -c 400 "$body" | grep -qiE '<!doctype html|<html'; then
    ok "HTML válido (<!DOCTYPE/<html>)"
  else
    bad "NO empieza como HTML — posible basura/doble-decodificado"
  fi
  if python3 -c "import sys; sys.exit(0 if b'\x00' in open('$body','rb').read() else 1)"; then
    bad "Contiene bytes NUL (binario/basura)"
  else
    ok "Sin bytes NUL"
  fi
  if LC_ALL=C grep -qE 'Ã©|Ã³|Ã±|Ã¡|Â¿|â€™|ï»¿' "$body"; then
    warn "Posible mojibake (Ã©/Ã±/â€™) — revisar acentos"
  else
    ok "Sin mojibake típico"
  fi
  local words; words=$(wc -w < "$body" | tr -d ' ')
  [ "$words" -gt 150 ] && ok "Contenido presente ($words palabras)" || warn "Poco texto ($words)"

  # --- SEO ---
  grep -qiE '<title>[^<]+</title>' "$body" && ok "<title>" || bad "<title> ausente"
  grep -qiE '<meta[^>]+name="description"[^>]+content="[^"]{40,}"' "$body" && ok "meta description" || warn "meta description corta/ausente"
  grep -qiE '<link[^>]+rel="canonical"' "$body" && ok "canonical" || warn "canonical ausente"
  grep -qiE 'property="og:title"' "$body" && ok "og:title" || warn "og:title ausente"
  grep -qiE 'property="og:image"' "$body" && ok "og:image" || warn "og:image ausente"
  grep -qiE 'name="twitter:card"' "$body" && ok "twitter:card" || warn "twitter:card ausente"
  grep -qiE 'application/ld\+json' "$body" && ok "JSON-LD" || warn "JSON-LD ausente"
  grep -qiE '<html[^>]+lang=' "$body" && ok "html lang" || warn "html lang ausente"
  grep -qiE '<meta[^>]+name="viewport"' "$body" && ok "viewport" || warn "viewport ausente"
}

check_asset() {
  local url="$1" label="$2" code ct
  code=$(curl -sS -A "$UA" -L --compressed -o "$TMP/a" -w '%{http_code}' -D "$TMP/ah.txt" --max-time 20 "$url" 2>/dev/null)
  ct=$(grep -i '^content-type:' "$TMP/ah.txt" | tail -1 | tr -d '\r' | sed 's/^[Cc]ontent-[Tt]ype: //')
  [ "$code" = "200" ] && ok "$label → 200 ($ct)" || bad "$label → $code"
}

echo "═══════════════════════════════════════════"
echo " PORTFOLIO — moralesvegadavid.com"
echo "═══════════════════════════════════════════"
for p in "" "/proyectos" "/proyectos/citi" "/proyectos/cisep" "/conferencias" "/contacto" "/blog"; do
  check_page "https://moralesvegadavid.com${p}"
done
echo ""; echo "── assets/SEO (portfolio)"
check_asset "https://moralesvegadavid.com/robots.txt" "robots.txt"
check_asset "https://moralesvegadavid.com/sitemap.xml" "sitemap.xml"
check_asset "https://moralesvegadavid.com/sw.js" "sw.js"
check_asset "https://moralesvegadavid.com/favicon/manifest.webmanifest" "manifest"

echo ""
echo "═══════════════════════════════════════════"
echo " BEMOREX — bemorex.com"
echo "═══════════════════════════════════════════"
for p in "/" "/servicios/" "/proyectos/" "/proyectos/citi/" "/proyectos/cisep/" "/contacto/" "/blog/"; do
  check_page "https://bemorex.com${p}"
done
echo ""; echo "── assets/SEO (bemorex)"
check_asset "https://bemorex.com/robots.txt" "robots.txt"
check_asset "https://bemorex.com/sitemap.xml" "sitemap.xml"
check_asset "https://bemorex.com/sw.js" "sw.js"

echo ""
echo "═══════════════════════════════════════════"
printf " RESULTADO: \033[32m%d OK\033[0m · \033[33m%d avisos\033[0m · \033[31m%d fallos\033[0m\n" "$PASS" "$WARN" "$FAIL"
echo "═══════════════════════════════════════════"
[ "$FAIL" -eq 0 ]
