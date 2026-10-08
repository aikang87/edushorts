#!/usr/bin/env bash
# 5회차: 데이터 지키기 (볼륨, 바인드 마운트) - 영상에 쓰이는 명령어를 실제로 실행하고 출력/브라우저 화면을 output/ 에 저장
set -u
cd "$(dirname "$0")"
mkdir -p output
docker info >/dev/null 2>&1 || { echo "Docker 데몬이 실행 중이 아닙니다. 먼저 데몬을 시작하세요." >&2; exit 1; }

# run <파일명> <명령어...> : 프롬프트 + 명령어 + 출력 저장 (Docker Hub 429 제한 시 재시도)
# SHOW="..." 를 앞에 붙이면 화면에 그 문자열을 명령어로 표시 (따옴표/리다이렉션 유지용), $HOME 은 ~ 로 표시
run() {
  local f="output/$1.txt"; shift
  local out show="${SHOW:-$*}"
  for wait in 0 10 30 60; do
    sleep "$wait"
    out="$("$@" 2>&1)"
    echo "$out" | grep -q "429 Too Many Requests" || break
  done
  { echo "user@PC:~\$ ${show//$HOME/\~}"; [ -n "$out" ] && echo "${out//$HOME/\~}"; } | tee "$f"
  echo
}

SITE="$HOME/site"
cleanup() {
  docker rm -f web >/dev/null 2>&1
  docker volume rm mydata >/dev/null 2>&1
  rm -f "$SITE/index.html"; rmdir "$SITE" 2>/dev/null
}
cleanup
docker image inspect nginx:alpine >/dev/null 2>&1 || docker pull -q nginx:alpine >/dev/null

# --- 볼륨 ---
run 01_vol_create docker volume create mydata
run 02_vol_ls     docker volume ls
SHOW="docker run --rm -v mydata:/data nginx:alpine sh -c 'echo hello > /data/hello.txt'" \
run 03_write      docker run --rm -v mydata:/data nginx:alpine sh -c 'echo hello > /data/hello.txt'
run 04_read       docker run --rm -v mydata:/data nginx:alpine cat /data/hello.txt
run 05_read_novol docker run --rm nginx:alpine cat /data/hello.txt

# --- 바인드 마운트 ---
run 06_mkdir      mkdir "$SITE"
SHOW='echo "<h1>Hi Docker</h1>" > ~/site/index.html' \
run 07_echo       bash -c 'echo "<h1>Hi Docker</h1>" > "$HOME/site/index.html"'
run 08_run_bind   docker run -d --name web -p 8080:80 -v "$SITE":/usr/share/nginx/html nginx:alpine
sleep 2
NO_PROXY=localhost,127.0.0.1 no_proxy=localhost,127.0.0.1 node ../tools/screenshot.js http://localhost:8080 output/browser1.png 450 180 2
SHOW='echo "<h1>Hello Volume</h1>" > ~/site/index.html' \
run 09_edit       bash -c 'echo "<h1>Hello Volume</h1>" > "$HOME/site/index.html"'
NO_PROXY=localhost,127.0.0.1 no_proxy=localhost,127.0.0.1 node ../tools/screenshot.js http://localhost:8080 output/browser2.png 450 180 2

cleanup
