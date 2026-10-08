#!/usr/bin/env bash
# 20회차: 내 앱에 LLM 연결 (Compose + Ollama API + 파이썬 클라이언트) - 영상에 쓰이는 명령어를 실제로 실행하고 출력을 output/ 에 저장
#
# 모델: 제작 환경에서 ollama.com / Hugging Face 접속이 막혀 `ollama pull` 은 실행하지 못함.
#       이미 가진 모델 파일(GGUF)을 `ollama create` 로 등록해 사용 (tools/fetch-model.sh 가 Docker Hub 의 ai/smollm2 GGUF 를 ~/models 에 준비)
set -u
cd "$(dirname "$0")"
mkdir -p output
docker info >/dev/null 2>&1 || { echo "Docker 데몬이 실행 중이 아닙니다. 먼저 데몬을 시작하세요." >&2; exit 1; }
../tools/fetch-model.sh >/dev/null

# 터미널 제어문자(스피너 등) 제거 후 같은 줄 반복 정리
clean() { sed -r 's/\x1b\[[0-9;?]*[a-zA-Z]//g' | tr '\r' '\n' | sed -r 's/[[:space:]]+$//' | grep -v '^$' | uniq; }

# run <파일명> <표시할 명령> <실제 실행할 명령(쉘 문자열)> : ~/llmapp 안에서 실행, 프롬프트 + 명령 + 출력 저장
DIR="$HOME/llmapp"
run() {
  local f="output/$1.txt" show="$2" real="$3" out
  out="$(bash -c "cd \"$DIR\" && $real" 2>&1 | clean)"
  { echo "user@PC:~\$ $show"; [ -n "$out" ] && echo "$out"; } > "$f"
  cat "$f"; echo
}

cleanup() {
  [ -f "$DIR/compose.yaml" ] && (cd "$DIR" && docker compose --profile tools down -v >/dev/null 2>&1)
  rm -f "$DIR/compose.yaml" "$DIR/app/chat.py"; rmdir "$DIR/app" "$DIR" 2>/dev/null
}
cleanup
for img in ollama/ollama python:3.12-slim; do docker image inspect "$img" >/dev/null 2>&1 || docker pull -q "$img" >/dev/null; done

# 프로젝트 파일 준비 (영상에서는 에디터로 만든 것으로 설명)
mkdir -p "$DIR/app"
cat > "$DIR/compose.yaml" <<'YAML'
services:
  ollama:
    image: ollama/ollama
    volumes:
      - ollama:/root/.ollama
      - ~/models:/models
    ports:
      - "11434:11434"
  chat:
    image: python:3.12-slim
    working_dir: /app
    volumes:
      - ./app:/app
    environment:
      - OLLAMA_HOST=http://ollama:11434
    profiles: ["tools"]

volumes:
  ollama:
YAML
cat > "$DIR/app/chat.py" <<'PY'
import json, os, sys, urllib.request

url = os.environ["OLLAMA_HOST"] + "/api/generate"
prompt = " ".join(sys.argv[1:])
data = {"model": "smol", "prompt": prompt, "stream": False}
r = urllib.request.Request(url, json.dumps(data).encode())
res = json.load(urllib.request.urlopen(r))
print(res["response"].strip())
PY
cp "$DIR/compose.yaml" "$DIR/app/chat.py" output/

run 01_up     'docker compose up -d'  'docker compose up -d'
sleep 4
run 02_create 'docker compose exec ollama ollama create smol -f /models/Modelfile' 'docker compose exec -T ollama ollama create smol -f /models/Modelfile'   # -T: 스크립트(비 TTY) 실행용, 화면에는 생략
run 03_curl   "curl localhost:11434/api/generate -d '{\"model\": \"smol\", \"prompt\": \"What is Docker?\", \"stream\": false}'" "curl -s localhost:11434/api/generate -d '{\"model\": \"smol\", \"prompt\": \"What is Docker?\", \"stream\": false}'"
run 04_chat   'docker compose run --rm chat python chat.py "What is Docker? Answer in one short sentence."' 'docker compose run --rm -T chat python chat.py "What is Docker? Answer in one short sentence."'

cleanup
