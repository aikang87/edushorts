#!/usr/bin/env bash
# 12회차: Compose 실전 팁 (restart, 리소스 제한, profiles) - 영상에 쓰이는 명령어를 실제로 실행하고 출력을 output/ 에 저장
# 10~11회차 프로젝트(~/visits: 파이썬 웹 + redis)를 이어서 사용
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
  grep -v '^#' "$f" | head -n 12; echo
}

cleanup() {
  [ -f "$DIR/compose.yaml" ] && (cd "$DIR" && docker compose --profile debug down >/dev/null 2>&1)
  docker rmi visits-web >/dev/null 2>&1
  rm -f "$DIR/app.py" "$DIR/Dockerfile" "$DIR/compose.yaml"; rmdir "$DIR" 2>/dev/null
}
cleanup
for img in python:3.12-alpine redis:alpine; do docker image inspect "$img" >/dev/null 2>&1 || docker pull -q "$img" >/dev/null; done

# 프로젝트 파일 준비: 10회차 앱에 일부러 종료하는 /crash 경로를 추가, compose.yaml 에 restart / 리소스 제한 / profiles 추가
mkdir -p "$DIR"
cat > "$DIR/app.py" <<'PY'
import os
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
        if self.path == "/crash":
            os._exit(1)  # crash on purpose
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
cat > "$DIR/compose.yaml" <<'YAML'
services:
  web:
    build: .
    restart: unless-stopped
    mem_limit: 128m
    cpus: 0.5
    ports:
      - "8000:8000"
  db:
    image: redis:alpine
    restart: unless-stopped
  cli:
    image: redis:alpine
    command: ["sleep", "infinity"]
    profiles: ["debug"]
YAML
cp "$DIR/app.py" "$DIR/Dockerfile" "$DIR/compose.yaml" output/

run 01_up        'docker compose up -d'  'docker compose up -d'
sleep 3
run 02_ps_before 'docker compose ps'     'docker compose ps'
run 03_grep      'grep -n _exit app.py'  'grep -n _exit app.py'
run 04_crash     'curl localhost:8000/crash' 'curl -sS localhost:8000/crash'   # 터미널과 같은 오류 메시지만 출력되도록 -sS
sleep 3
run 05_ps_after  'docker compose ps'     'docker compose ps'
run 06_restarts  "docker inspect -f '{{.RestartCount}}' visits-web-1" "docker inspect -f '{{.RestartCount}}' visits-web-1"
run 07_stats     'docker stats --no-stream' 'docker stats --no-stream'
run 08_up_debug  'docker compose --profile debug up -d' 'docker compose --profile debug up -d'
sleep 2
run 09_ps_debug  'docker compose ps'     'docker compose ps'

cleanup
