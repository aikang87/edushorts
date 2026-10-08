#!/usr/bin/env bash
# 1회차: Docker 설치와 첫 실행 - 영상에 쓰이는 명령어를 실제로 실행하고 출력을 output/ 에 저장
#
# 이 스크립트가 검증하는 범위: 설치 확인 명령 (docker --version, docker compose version) 과 첫 컨테이너(docker run hello-world)
# 검증하지 못한 범위: Windows 에서의 `wsl --install`, Docker Desktop 설치/WSL 연동 설정 화면 (제작 환경은 Linux, 슬라이드의 해당 화면은 일러스트)
set -u
cd "$(dirname "$0")"
mkdir -p output
docker info >/dev/null 2>&1 || { echo "Docker 데몬이 실행 중이 아닙니다. 먼저 데몬을 시작하세요." >&2; exit 1; }

# run <파일명> <명령어...> : 프롬프트 + 명령어 + 출력 저장 (Docker Hub 429 제한 시 재시도)
run() {
  local f="output/$1.txt"; shift
  local out
  for wait in 0 30 90 180; do
    sleep "$wait"
    out="$("$@" 2>&1)"
    echo "$out" | grep -q "429 Too Many Requests" || break
  done
  { echo "user@PC:~\$ $*"; echo "$out"; } > "$f"
  cat "$f"; echo
}

# 첫 실행 상태를 재현: hello-world 이미지가 없는 상태에서 시작
docker ps -aq --filter ancestor=hello-world | xargs -r docker rm >/dev/null 2>&1
docker rmi hello-world >/dev/null 2>&1

run 01_version  docker --version
run 02_compose  docker compose version
run 03_hello    docker run hello-world

docker ps -aq --filter ancestor=hello-world | xargs -r docker rm >/dev/null 2>&1
docker rmi hello-world >/dev/null 2>&1
