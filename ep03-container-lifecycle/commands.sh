#!/usr/bin/env bash
# 3회차: 컨테이너 켜고 끄기 - 영상에 쓰이는 명령어를 실제로 실행하고 출력을 output/ 에 저장
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

# 시작 상태: web 컨테이너 없음, nginx:alpine 이미지는 있음 (2회차에서 받은 이미지)
docker rm -f web >/dev/null 2>&1
docker image inspect nginx:alpine >/dev/null 2>&1 || run 00_pull docker pull nginx:alpine >/dev/null

run 01_run     docker run -d --name web nginx:alpine
sleep 3
run 02_ps      docker ps
run 03_stop    docker stop web
run 04_ps_none docker ps
sleep 2
run 05_ps_a    docker ps -a
run 06_start   docker start web
sleep 2
run 07_ps_up   docker ps
run 08_logs    docker logs web
ID4="$(docker ps -q --filter name=web | cut -c1-4)"   # 컨테이너 ID 앞 4글자 (이름 대신 사용)
run 09_stop    docker stop "$ID4"
run 10_rm      docker rm "$ID4"
run 11_ps_a    docker ps -a

docker rm -f web >/dev/null 2>&1
