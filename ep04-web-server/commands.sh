#!/usr/bin/env bash
# 4회차: 웹서버 띄우기 (포트와 환경변수) - 영상에 쓰이는 명령어를 실제로 실행하고 출력/브라우저 화면을 output/ 에 저장
set -u
cd "$(dirname "$0")"
mkdir -p output
docker info >/dev/null 2>&1 || { echo "Docker 데몬이 실행 중이 아닙니다. 먼저 데몬을 시작하세요." >&2; exit 1; }

run() {  # run <파일명> <명령어...> : 프롬프트 + 명령어 + 출력 저장 (Docker Hub 429 제한 시 재시도)
  local f="output/$1.txt"; shift
  local out
  for wait in 0 10 30 60; do
    sleep "$wait"
    out="$("$@" 2>&1)"
    echo "$out" | grep -q "429 Too Many Requests" || break
  done
  { echo "user@PC:~\$ $*"; echo "$out"; } | tee "$f"
  echo
}

# 시작 상태: web, web2 없음 / nginx:alpine 이미지 있음 (2회차에서 받은 이미지)
docker rm -f web web2 >/dev/null 2>&1
docker image inspect nginx:alpine >/dev/null 2>&1 || docker pull -q nginx:alpine >/dev/null

run 01_run   docker run -d --name web -p 8080:80 nginx:alpine
sleep 2
run 02_ps    docker ps
# 실제 브라우저 화면 캡처 (localhost 는 프록시를 거치지 않도록)
NO_PROXY=localhost,127.0.0.1 no_proxy=localhost,127.0.0.1 node ../tools/screenshot.js http://localhost:8080 output/browser.png 900 560

run 03_run2  docker run -d --name web2 -p 8081:80 nginx:alpine
sleep 2
run 04_ps2   docker ps
run 05_env   docker run --rm -e MY_NAME=Docker nginx:alpine printenv MY_NAME

docker rm -f web web2 >/dev/null 2>&1
