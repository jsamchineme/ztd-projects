#!/usr/bin/env bash
# Deduped, parallel host/DNS fingerprint for each unique prospect domain.
# Stage 1: resolve every UNIQUE domain once -> per-domain cache (TSV).
# Stage 2: join prospect ids back onto the domain facts.
#
# Usage: host-detect2.sh <data-dir> <out-dir> [parallelism]
set -uo pipefail
DATA_DIR="${1:-prospects/gp/data}"
OUT_DIR="${2:?need out dir}"
PAR="${3:-12}"
mkdir -p "$OUT_DIR"
DOMAIN_TSV="$OUT_DIR/by-domain.tsv"
REPORT="$OUT_DIR/hosting-report.tsv"

# One domain -> one line of facts. Runs under xargs in parallel.
probe() {
  host="$1"
  ip=$(dig +short +time=3 +tries=1 "$host" A | grep -E '^[0-9]' | head -1)
  ns=$(dig +short +time=3 +tries=1 NS "$host" | head -1 | sed 's/\.$//')
  cname=$(dig +short +time=3 +tries=1 CNAME "www.$host" | head -1 | sed 's/\.$//')
  ip_org=""
  [ -n "$ip" ] && ip_org=$(whois "$ip" 2>/dev/null \
      | grep -iE 'org-?name|netname|descr|organization' \
      | head -1 | sed -E 's/^[^:]*:[[:space:]]*//' | tr -d '\t')
  hdr=$(curl -sI --max-time 8 "http://$host/" 2>/dev/null \
      | grep -iE '^(server|via|cf-ray|x-vercel-id|x-served-by|x-amz-cf-id|x-wix-request-id|x-shopify-stage|x-powered-by):' \
      | tr '\n' ' ' | tr -s ' \t' ' ')
  blob=$(printf '%s %s %s %s' "$ns" "$cname" "$ip_org" "$hdr" | tr 'A-Z' 'a-z')
  case "$blob" in
    *cloudflare*|*cf-ray*) g="Cloudflare (proxy - real host hidden)";;
    *practices365*)        g="Practices365 (GP builder, on AWS/CloudFront)";;
    *wpengine*)            g="WP Engine";;
    *wix*)                 g="Wix";;
    *squarespace*)         g="Squarespace";;
    *shopify*)             g="Shopify";;
    *vercel*)              g="Vercel";;
    *netlify*)             g="Netlify";;
    *gpsurgery*)           g="gpsurgery.net (GP builder)";;
    *my*surgery*)          g="My Surgery Website (GP builder)";;
    *cloudfront*|*amazon*|*aws*) g="AWS";;
    *msft*|*microsoft*|*azure*)  g="Microsoft / Azure";;
    *google*|*1e100*)      g="Google";;
    *) g="${ip_org:-unknown}";;
  esac
  printf '%s\t%s\t%s\t%s\t%s\t%s\t%s\n' "$host" "${ip:-}" "${ip_org:-}" "${ns:-}" "${cname:-}" "${hdr:-}" "$g"
}
export -f probe

# Stage 1: unique domains -> parallel probe -> cache
jq -r '.[] | select(.website!=null) | .website' "$DATA_DIR"/*.json \
  | sed -E 's#^https?://##; s#/.*##' | sort -u \
  | xargs -P "$PAR" -I{} bash -c 'probe "$@"' _ {} \
  > "$DOMAIN_TSV"
echo "probed $(wc -l < "$DOMAIN_TSV") unique domains" >&2

# Stage 2: join ids onto domain facts
{
  printf 'id\tname\twebsite\tip\tip_org\tnameserver\tcname\tserver_hdr\tguess\n'
  jq -r '.[] | select(.website!=null) | [.id, .name, .website] | @tsv' "$DATA_DIR"/*.json \
  | while IFS=$'\t' read -r id name url; do
      host=$(printf '%s' "$url" | sed -E 's#^https?://##; s#/.*##')
      facts=$(awk -F'\t' -v h="$host" '$1==h{$1="";sub(/^\t/,"");print;exit}' "$DOMAIN_TSV")
      printf '%s\t%s\t%s\t%s\n' "$id" "$name" "$url" "$facts"
    done
} > "$REPORT"
echo "report: $REPORT" >&2
