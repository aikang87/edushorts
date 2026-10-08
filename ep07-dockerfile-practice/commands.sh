#!/usr/bin/env bash
# 7회차: Dockerfile 실전 (WORKDIR, COPY, 빌드 캐시, .dockerignore) - 영상에 쓰이는 명령어를 실제로 실행하고 출력을 output/ 에 저장
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
# 폴더 ~/myapp 안에서 실행 (화면에는 cd 이후 상태로 표시)
inapp() { local f="$1"; shift; local cmd="$1"; shift; SHOW="$cmd" run "$f" bash -c "cd \"\$HOME/myapp\" && $cmd"; }

DIR="$HOME/myapp"
cleanup() {
  docker rmi myapp >/dev/null 2>&1
  rm -f "$DIR/app.py" "$DIR/secret.txt" "$DIR/Dockerfile" "$DIR/.dockerignore"; rmdir "$DIR" 2>/dev/null
}
cleanup
docker image inspect python:3.12-alpine >/dev/null 2>&1 || docker pull -q python:3.12-alpine >/dev/null

# 프로젝트 파일 준비 (영상에서는 에디터/heredoc 로 만든 것으로 설명)
mkdir -p "$DIR"
cat > "$DIR/app.py" <<'PY'
print("Hello from Docker!")
PY
echo "password=1234" > "$DIR/secret.txt"
cat > "$DIR/Dockerfile" <<'DF'
FROM python:3.12-alpine
WORKDIR /app
COPY . .
CMD ["python", "app.py"]
DF
cp "$DIR/Dockerfile" output/Dockerfile; cp "$DIR/app.py" output/app.py

inapp 01_ls       'ls'
inapp 02_build1   'docker build -t myapp .'
inapp 03_run      'docker run --rm myapp'
inapp 04_build2   'docker build -t myapp .'
echo 'print("Hello again!")' > "$DIR/app.py"
inapp 05_build3   'docker build -t myapp .'
inapp 06_run3     'docker run --rm myapp'
inapp 07_ls_image 'docker run --rm myapp ls'
echo "secret.txt" > "$DIR/.dockerignore"
inapp 08_cat_ignore 'cat .dockerignore'
inapp 09_build4   'docker build -t myapp .'
inapp 10_ls_image2 'docker run --rm myapp ls'

cleanup
