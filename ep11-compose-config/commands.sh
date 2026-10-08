#!/usr/bin/env bash
# 11회차: Compose 설정 다듬기 (.env, healthcheck, depends_on) - 영상에 쓰이는 명령어를 실제로 실행하고 출력을 output/ 에 저장
# 10회차 프로젝트(~/visits: 파이썬 웹 + redis)에 설정을 추가한 상태
set -u
cd "$(dirname "$0")"
mkdir -p output
docker info >/dev/null 2>&1 || { echo "Docker 데몬이 실행 중이 아닙니다. 먼저 데몬을 시작하세요." >&2; exit 1; }

# run <파일명> <표시할 명령> <실제 실행할 명령(쉘 문자열)> : ~/visits 안에서 실행, 프롬프트 + 명령 + 출력 저장
# (Docker Hub 429 제한 시 재시도, 비대화형 출력의 연속 중복 줄은 제거)
DIR="$HOME/visits"
run() {
  local f="output/$1.txt" show="$2" real="$3" out
  for wait in 0 10 30 60 90; do
    sleep "$wait"
    out="$(bash -c "cd \"$DIR\" && $real" 2>&1 | uniq)"
    echo "$out" | grep -q "429 Too Many Requests" || break
  done
  { echo "user@PC:~\$ $show"; [ -n "$out" ] && echo "$out"; } > "$f"
  grep -v '^#' "$f" | head -n 14; echo
}

cleanup() {
  [ -f "$DIR/compose.yaml" ] && (cd "$DIR" && docker compose down >/dev/null 2>&1)
  docker rmi visits-web >/dev/null 2>&1
  rm -f "$DIR/app.py" "$DIR/Dockerfile" "$DIR/compose.yaml" "$DIR/.env"; rmdir "$DIR" 2>/dev/null
}
cleanup
for img in python:3.12-alpine redis:alpine; do docker image inspect "$img" >/dev/null 2>&1 || docker pull -q "$img" >/dev/null; done

# 프로젝트 파일 준비: app.py / Dockerfile 은 10회차와 동일, compose.yaml 과 .env 는 이번 회차에서 추가한 설정
mkdir -p "$DIR"
cat > "$DIR/app.py" <<'PY'
import socket
from http.server import BaseHTTPRequestHandler, HTTPServer

def count_visit():
    s = socket.create_connection(("db", 6379))
    s.sendall(b"INCR visits\r\n")
    reply = s.recv(64).decode().strip()
    s.close()
    return reply.lstrip(":")

class Handler(BaseHTTPRequestHandler):
    def do_GET(self):
        body = f"Visits: {count_visit()}\n".encode()
        self.send_response(200)
        self.send_header("Content-Type", "text/plain; charset=utf-8")
        self.end_headers()
        self.wfile.write(body)

HTTPServer(("0.0.0.0", 8000), Handler).serve_forever()
PY
cat > "$DIR/Dockerfile" <<'DF'
FROM python:3.12-alpine
WORKDIR /app
COPY app.py .
CMD ["python", "app.py"]
DF
cat > "$DIR/.env" <<'ENV'
WEB_PORT=8080
ENV
cat > "$DIR/compose.yaml" <<'YAML'
services:
  web:
    build: .
    ports:
      - "${WEB_PORT}:8000"
    depends_on:
      db:
        condition: service_healthy
  db:
    image: redis:alpine
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 2s
      timeout: 3s
      retries: 5
YAML
cp "$DIR/compose.yaml" "$DIR/.env" output/ 2>/dev/null; cp "$DIR/.env" output/dotenv.txt; rm -f output/.env

run 01_cat_env  'cat .env'                      'cat .env'
run 02_grep     'grep WEB_PORT compose.yaml'    'grep WEB_PORT compose.yaml'
run 03_up       'docker compose up -d'          'docker compose up -d'
sleep 3  # 웹 서버가 완전히 뜨고, 화면에 'Up 3 seconds' 로 표시되도록
run 04_ps       'docker compose ps'             'docker compose ps'
run 05_curl     'curl localhost:8080'           'curl -s localhost:8080'   # 터미널에서는 진행 표시 없이 본문만 출력되므로 -s 로 같은 결과를 캡처

cleanup
