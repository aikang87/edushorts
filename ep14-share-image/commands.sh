#!/usr/bin/env bash
# 14회차: 내 이미지 공유하기 (tag, push, pull) - 영상에 쓰이는 명령어를 실제로 실행하고 출력을 output/ 에 저장
# Docker Hub 계정으로 올리는 것은 검증할 수 없어, 이 컴퓨터에서 실행한 로컬 레지스트리(localhost:5000)로 같은 과정을 시연
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

DIR="$HOME/hello"
cleanup() {
  docker rm -fv registry >/dev/null 2>&1
  docker rmi hello localhost:5000/hello:1.0 >/dev/null 2>&1
  rm -f "$DIR/Dockerfile"; rmdir "$DIR" 2>/dev/null
}
cleanup
for img in registry:2 alpine; do docker image inspect "$img" >/dev/null 2>&1 || docker pull -q "$img" >/dev/null; done

# 6회차의 hello 이미지 (공유할 이미지)
mkdir -p "$DIR"
printf 'FROM alpine\nRUN echo "Hello Dockerfile" > /hello.txt\nCMD ["cat", "/hello.txt"]\n' > "$DIR/Dockerfile"
docker build -q -t hello "$DIR" >/dev/null

run 01_registry 'docker run -d -p 5000:5000 --name registry registry:2' 'docker run -d -p 5000:5000 --name registry registry:2'
sleep 2
run 02_tag      'docker tag hello localhost:5000/hello:1.0' 'docker tag hello localhost:5000/hello:1.0'
run 03_images   'docker images'          'docker images'   # 전체 출력 저장, 화면에서는 hello 관련 행만 표시
run 04_push     'docker push localhost:5000/hello:1.0' 'docker push localhost:5000/hello:1.0'
run 05_rmi      'docker rmi hello localhost:5000/hello:1.0' 'docker rmi hello localhost:5000/hello:1.0'
run 06_run      'docker run --rm localhost:5000/hello:1.0' 'docker run --rm localhost:5000/hello:1.0'

cleanup
