#!/usr/bin/env bash
# 6회차: 내 첫 Dockerfile - 영상에 쓰이는 명령어를 실제로 실행하고 출력을 output/ 에 저장
set -u
cd "$(dirname "$0")"
mkdir -p output
docker info >/dev/null 2>&1 || { echo "Docker 데몬이 실행 중이 아닙니다. 먼저 데몬을 시작하세요." >&2; exit 1; }

# run <파일명> <명령어...> : 프롬프트 + 명령어 + 출력 저장 (Docker Hub 429 제한 시 재시도)
# SHOW="..." 를 앞에 붙이면 화면에 그 문자열을 명령어로 표시, $HOME 은 ~ 로 표시
run() {
  local f="output/$1.txt"; shift
  local out show="${SHOW:-$*}"
  for wait in 0 10 30 60 90; do
    sleep "$wait"
    out="$("$@" 2>&1)"
    echo "$out" | grep -q "429 Too Many Requests" || break
  done
  { echo "user@PC:~\$ ${show//$HOME/\~}"; [ -n "$out" ] && echo "${out//$HOME/\~}"; } | tee "$f"
  echo
}

DIR="$HOME/hello"
cleanup() {
  docker rmi hello >/dev/null 2>&1
  rm -f "$DIR/Dockerfile"; rmdir "$DIR" 2>/dev/null
}
cleanup

run 01_mkdir mkdir "$DIR"

# Dockerfile 만들기 (영상에서는 cat > Dockerfile <<'EOF' ... EOF 로 보여줌)
cat > "$DIR/Dockerfile" <<'DOCKERFILE'
FROM alpine
RUN echo "Hello Dockerfile" > /hello.txt
CMD ["cat", "/hello.txt"]
DOCKERFILE
cp "$DIR/Dockerfile" output/Dockerfile

SHOW='cat Dockerfile' run 02_cat   bash -c 'cd "$HOME/hello" && cat Dockerfile'
SHOW='docker build -t hello .' run 03_build bash -c 'cd "$HOME/hello" && docker build -t hello .'
run 04_images docker images hello
run 05_run    docker run --rm hello

cleanup
