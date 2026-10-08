#!/usr/bin/env bash
# 2회차: 이미지와 컨테이너 - 영상에 쓰이는 명령어를 실제로 실행하고 출력을 output/ 에 저장
set -u
cd "$(dirname "$0")"
mkdir -p output

# 깨끗한 상태에서 시작
docker rm -f web web2 >/dev/null 2>&1
docker rmi nginx:alpine alpine:latest >/dev/null 2>&1

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

run 01_pull    docker pull nginx:alpine
run 02_images  docker images
run 03_run     docker run -d --name web nginx:alpine
sleep 3  # 화면에 'Up 3 seconds' 로 짧게 표시되도록
run 04_ps      docker ps
run 05_run2    docker run -d --name web2 nginx:alpine
sleep 2
run 06_ps2     docker ps

# 정리
docker rm -f web web2 >/dev/null 2>&1
