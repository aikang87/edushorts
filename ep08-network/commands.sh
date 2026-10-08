#!/usr/bin/env bash
# 8회차: 컨테이너끼리 대화하기 (네트워크) - 영상에 쓰이는 명령어를 실제로 실행하고 출력을 output/ 에 저장
set -u
cd "$(dirname "$0")"
mkdir -p output
docker info >/dev/null 2>&1 || { echo "Docker 데몬이 실행 중이 아닙니다. 먼저 데몬을 시작하세요." >&2; exit 1; }

# run <파일명> <명령어...> : 프롬프트 + 명령어 + 출력 저장 (Docker Hub 429 제한 시 재시도)
run() {
  local f="output/$1.txt"; shift
  local out show="${SHOW:-$*}"
  for wait in 0 10 30 60 90; do
    sleep "$wait"
    out="$("$@" 2>&1)"
    echo "$out" | grep -q "429 Too Many Requests" || break
  done
  { echo "user@PC:~\$ $show"; [ -n "$out" ] && echo "$out"; } | tee "$f"
  echo
}

cleanup() { docker rm -f web web2 >/dev/null 2>&1; docker network rm mynet >/dev/null 2>&1; }
cleanup
for img in nginx:alpine alpine; do docker image inspect "$img" >/dev/null 2>&1 || docker pull -q "$img" >/dev/null; done

run 01_net_create docker network create mynet
run 02_net_ls     docker network ls
run 03_run_web    docker run -d --name web --network mynet nginx:alpine
sleep 2
run 04_wget       docker run --rm --network mynet alpine wget -qO- http://web
run 05_run_web2   docker run -d --name web2 nginx:alpine
sleep 2
run 06_wget_fail  docker run --rm alpine wget -qO- http://web2

cleanup
