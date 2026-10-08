#!/usr/bin/env bash
# 13회차: 문제 해결과 청소 (ps -a, logs, inspect, system df, prune) - 영상에 쓰이는 명령어를 실제로 실행하고 출력을 output/ 에 저장
set -u
cd "$(dirname "$0")"
mkdir -p output
docker info >/dev/null 2>&1 || { echo "Docker 데몬이 실행 중이 아닙니다. 먼저 데몬을 시작하세요." >&2; exit 1; }

# run <파일명> <표시할 명령> <실제 실행할 명령(쉘 문자열)> : 프롬프트 + 명령 + 출력 저장 (Docker Hub 429 제한 시 재시도)
run() {
  local f="output/$1.txt" show="$2" real="$3" out
  for wait in 0 10 30 60 90; do
    sleep "$wait"
    out="$(bash -c "$real" 2>&1)"
    echo "$out" | grep -q "429 Too Many Requests" || break
  done
  { echo "user@PC:~\$ $show"; [ -n "$out" ] && echo "$out"; } > "$f"
  cat "$f"; echo
}

cleanup() { docker rm -f broken >/dev/null 2>&1; docker rmi cache-demo >/dev/null 2>&1; }
cleanup
docker container prune -f >/dev/null 2>&1   # 시작 상태: 종료된 컨테이너 없음
docker image inspect python:3.12-alpine >/dev/null 2>&1 || docker pull -q python:3.12-alpine >/dev/null

# --- 문제 해결: 일부러 실패하는 컨테이너 ---
run 01_run     'docker run -d --name broken python:3.12-alpine python -c "import notamodule"' 'docker run -d --name broken python:3.12-alpine python -c "import notamodule"'
sleep 2
run 02_ps      'docker ps'                 'docker ps'
run 03_ps_a    'docker ps -a'              'docker ps -a'
run 04_logs    'docker logs broken'        'docker logs broken'
run 05_inspect "docker inspect -f '{{.State.ExitCode}}' broken" "docker inspect -f '{{.State.ExitCode}}' broken"

# --- 청소 ---
# 쓰지 않는 이미지를 하나 만들어 둠 (정리 대상, 화면에서는 'cache-demo' 이미지로 표시)
BC="$(mktemp -d)"; printf 'FROM python:3.12-alpine\nRUN python -c "print(1)" > /one.txt\n' > "$BC/Dockerfile"
docker build -q -t cache-demo "$BC" >/dev/null; rm -f "$BC/Dockerfile"; rmdir "$BC"
run 06_df      'docker system df'          'docker system df'
run 07_cprune  'docker container prune -f' 'docker container prune -f'
run 08_rmi     'docker rmi cache-demo'     'docker rmi cache-demo'
run 09_df2     'docker system df'          'docker system df'

cleanup
