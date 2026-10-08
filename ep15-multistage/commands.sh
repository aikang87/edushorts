#!/usr/bin/env bash
# 15회차: 이미지 다이어트 (멀티스테이지 빌드) - 영상에 쓰이는 명령어를 실제로 실행하고 출력을 output/ 에 저장
# 외부 패키지가 필요 없는 Go 프로그램을 사용 (빌드 중 네트워크 접근 불필요)
set -u
cd "$(dirname "$0")"
mkdir -p output
docker info >/dev/null 2>&1 || { echo "Docker 데몬이 실행 중이 아닙니다. 먼저 데몬을 시작하세요." >&2; exit 1; }

# run <파일명> <표시할 명령> <실제 실행할 명령(쉘 문자열)> : ~/gohello 안에서 실행, 프롬프트 + 명령 + 출력 저장
# (Docker Hub 429 제한 시 재시도)
DIR="$HOME/gohello"
run() {
  local f="output/$1.txt" show="$2" real="$3" out
  for wait in 0 10 30 60 90; do
    sleep "$wait"
    out="$(bash -c "cd \"$DIR\" && $real" 2>&1)"
    echo "$out" | grep -q "429 Too Many Requests" || break
  done
  { echo "user@PC:~\$ $show"; [ -n "$out" ] && echo "$out"; } > "$f"
  grep -v '^#' "$f" | head -n 12; echo
}

cleanup() {
  docker rmi hello-single hello-multi >/dev/null 2>&1
  rm -f "$DIR/main.go" "$DIR/Dockerfile" "$DIR/Dockerfile.single"; rmdir "$DIR" 2>/dev/null
}
cleanup
for img in golang:1.22-alpine alpine; do docker image inspect "$img" >/dev/null 2>&1 || docker pull -q "$img" >/dev/null; done

# 프로젝트 파일 준비 (영상에서는 에디터로 만든 것으로 설명)
mkdir -p "$DIR"
cat > "$DIR/main.go" <<'GO'
package main

import "fmt"

func main() {
	fmt.Println("Hello from Go!")
}
GO
cat > "$DIR/Dockerfile.single" <<'DF'
FROM golang:1.22-alpine
WORKDIR /src
COPY main.go .
RUN go build -o hello main.go
CMD ["./hello"]
DF
cat > "$DIR/Dockerfile" <<'DF'
FROM golang:1.22-alpine AS build
WORKDIR /src
COPY main.go .
RUN go build -o hello main.go

FROM alpine
COPY --from=build /src/hello /hello
CMD ["/hello"]
DF
cp "$DIR/main.go" "$DIR/Dockerfile.single" "$DIR/Dockerfile" output/

run 01_build_single 'docker build -f Dockerfile.single -t hello-single .' 'docker build -f Dockerfile.single -t hello-single .'
run 02_build_multi  'docker build -t hello-multi .'                        'docker build -t hello-multi .'
run 03_run          'docker run --rm hello-multi'                          'docker run --rm hello-multi'
run 04_images       'docker images'                                        'docker images'   # 전체 출력 저장, 화면에서는 hello-* 행만 표시

cleanup
