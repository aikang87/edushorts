#!/usr/bin/env bash
# 9회차: Docker Compose 입문 - 영상에 쓰이는 명령어를 실제로 실행하고 출력/브라우저 화면을 output/ 에 저장
set -u
cd "$(dirname "$0")"
mkdir -p output
docker info >/dev/null 2>&1 || { echo "Docker 데몬이 실행 중이 아닙니다. 먼저 데몬을 시작하세요." >&2; exit 1; }

# run <파일명> <표시할 명령> <실제 실행할 명령(쉘 문자열)> : ~/myweb 안에서 실행, 프롬프트 + 명령 + 출력 저장
# (Docker Hub 429 제한 시 재시도, 비대화형 출력의 연속 중복 줄은 제거)
DIR="$HOME/myweb"
run() {
  local f="output/$1.txt" show="$2" real="$3" out
  for wait in 0 10 30 60 90; do
    sleep "$wait"
    out="$(bash -c "cd \"$DIR\" && $real" 2>&1 | uniq)"
    echo "$out" | grep -q "429 Too Many Requests" || break
  done
  { echo "user@PC:~\$ $show"; [ -n "$out" ] && echo "$out"; } | tee "$f"
  echo
}

cleanup() {
  [ -f "$DIR/compose.yaml" ] && (cd "$DIR" && docker compose down >/dev/null 2>&1)
  rm -f "$DIR/compose.yaml"; rmdir "$DIR" 2>/dev/null
}
cleanup
docker image inspect nginx:alpine >/dev/null 2>&1 || docker pull -q nginx:alpine >/dev/null

# compose.yaml 만들기 (영상에서는 cat > compose.yaml <<'EOF' ... EOF 로 보여줌)
mkdir -p "$DIR"
cat > "$DIR/compose.yaml" <<'YAML'
services:
  web:
    image: nginx:alpine
    ports:
      - "8080:80"
YAML
cp "$DIR/compose.yaml" output/compose.yaml

run 01_up   'docker compose up -d' 'docker compose up -d'
sleep 3
run 02_ps   'docker compose ps'    'docker compose ps'
NO_PROXY=localhost,127.0.0.1 no_proxy=localhost,127.0.0.1 node ../tools/screenshot.js http://localhost:8080 output/browser.png 900 560
run 03_down 'docker compose down'  'docker compose down'

cleanup
