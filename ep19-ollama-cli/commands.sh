#!/usr/bin/env bash
# 19회차: Ollama 명령어 익히기 (서버 컨테이너 + create / list / run / show / ps / rm) - 영상에 쓰이는 명령어를 실제로 실행하고 출력을 output/ 에 저장
#
# 모델: 제작 환경에서 ollama.com / Hugging Face 접속이 막혀 `ollama pull` 은 실행하지 못함.
#       대신 이미 가진 모델 파일(GGUF)을 `ollama create` 로 등록해 사용 (tools/fetch-model.sh 가 Docker Hub 의 ai/smollm2 GGUF 를 ~/models 에 준비)
set -u
cd "$(dirname "$0")"
mkdir -p output
docker info >/dev/null 2>&1 || { echo "Docker 데몬이 실행 중이 아닙니다. 먼저 데몬을 시작하세요." >&2; exit 1; }
../tools/fetch-model.sh >/dev/null

# 터미널 제어문자(스피너 등) 제거 후 같은 줄 반복 정리
clean() { sed -r 's/\x1b\[[0-9;?]*[a-zA-Z]//g' | tr '\r' '\n' | sed -r 's/[[:space:]]+$//' | grep -v '^$' | uniq; }

# run <파일명> <표시할 명령> <실제 실행할 명령(쉘 문자열)> : 프롬프트 + 명령 + 출력 저장
run() {
  local f="output/$1.txt" show="$2" real="$3" out
  out="$(bash -c "$real" 2>&1 | clean)"
  { echo "user@PC:~\$ $show"; [ -n "$out" ] && echo "$out"; } > "$f"
  cat "$f"; echo
}

cleanup() { docker rm -f ollama >/dev/null 2>&1; docker volume rm ollama >/dev/null 2>&1; }
cleanup
docker image inspect ollama/ollama >/dev/null 2>&1 || docker pull -q ollama/ollama >/dev/null
cp "$HOME/models/Modelfile" output/Modelfile

run 01_run      'docker run -d -v ollama:/root/.ollama -v ~/models:/models -p 11434:11434 --name ollama ollama/ollama' 'docker run -d -v ollama:/root/.ollama -v "$HOME/models":/models -p 11434:11434 --name ollama ollama/ollama'
sleep 4
run 02_modelfile 'cat ~/models/Modelfile'                          'cat "$HOME/models/Modelfile"'
run 03_create   'docker exec ollama ollama create smol -f /models/Modelfile' 'docker exec ollama ollama create smol -f /models/Modelfile'
run 04_list     'docker exec ollama ollama list'                   'docker exec ollama ollama list'
# 캡처할 때만 --nowordwrap (터미널 줄바꿈 제어문자가 파일에 섞이는 것을 막기 위함, 화면에는 옵션 없이 표시)
run 05_run      'docker exec ollama ollama run smol "What is Docker? Answer in one short sentence."' 'docker exec ollama ollama run --nowordwrap smol "What is Docker? Answer in one short sentence." 2>/dev/null'
run 06_show     'docker exec ollama ollama show smol'              'docker exec ollama ollama show smol'
run 07_ps       'docker exec ollama ollama ps'                     'docker exec ollama ollama ps'
run 08_rm       'docker exec ollama ollama rm smol'                'docker exec ollama ollama rm smol'

cleanup
