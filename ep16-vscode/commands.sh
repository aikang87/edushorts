#!/usr/bin/env bash
# 16회차: VSCode 설치 및 필수 확장 세팅 (Dev Containers 포함)
#
# VSCode 설치/확장 설치 화면은 GUI 이고 제작 환경에서 VSCode 다운로드/마켓플레이스 접속이 막혀 있어 실행하지 못함(슬라이드의 해당 화면은 일러스트).
# 이 스크립트가 실제로 검증하는 것:
#   01: devcontainer.json 이 올바른 JSON 인지
#   02: Dev Containers 가 내부에서 하는 일(내 폴더를 컨테이너에 연결해 실행)을 docker run 으로 재현
set -u
cd "$(dirname "$0")"
mkdir -p output
DIR="$HOME/dockerlab"
cleanup() { rm -f "$DIR/hello.py" "$DIR/.devcontainer/devcontainer.json"; rmdir "$DIR/.devcontainer" "$DIR" 2>/dev/null; }
cleanup

mkdir -p "$DIR/.devcontainer"
cat > "$DIR/hello.py" <<'PY'
print("Hello from Dev Container!")
PY
cat > "$DIR/.devcontainer/devcontainer.json" <<'JSON'
{
  "name": "dockerlab",
  "image": "python:3.12-slim"
}
JSON
cp "$DIR/.devcontainer/devcontainer.json" output/devcontainer.json; cp "$DIR/hello.py" output/hello.py

# 01) JSON 문법 검사 (python 이 있는 환경에서)
python3 -m json.tool "$DIR/.devcontainer/devcontainer.json" > /dev/null && echo "devcontainer.json: valid JSON" | tee output/01_json_check.txt

# 02) Dev Containers 내부 동작 재현 (Docker 필요, python:3.12-slim 이미지)
if docker info >/dev/null 2>&1; then
  out=""
  for wait in 0 30 90 180; do
    sleep "$wait"
    out="$(cd "$DIR" && docker run --rm -v "$PWD":/workspaces/dockerlab -w /workspaces/dockerlab python:3.12-slim python hello.py 2>&1)"
    echo "$out" | grep -q "429 Too Many Requests" || break
  done
  { echo 'user@PC:~/dockerlab$ docker run --rm -v "$PWD":/workspaces/dockerlab -w /workspaces/dockerlab python:3.12-slim python hello.py'; echo "$out"; } > output/02_run.txt
  cat output/02_run.txt
fi
cleanup
