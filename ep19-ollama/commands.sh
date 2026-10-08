#!/usr/bin/env bash
# 19회차: Docker + Ollama (CPU 기본) - 영상에 쓰이는 명령어를 실제로 실행하고 출력을 output/ 에 저장
#
# 이 스크립트가 실행/검증하는 범위 (제작 환경에서 확인됨):
#   01~03: Ollama 서버 컨테이너 실행, 응답 확인, 설치된 모델 목록(비어 있음)
# 제작 환경에서 검증하지 못한 범위 (registry.ollama.ai 접속 차단 → 모델 다운로드 불가):
#   04~05: 모델 내려받기(ollama pull), 대화(ollama run)  -> 네트워크 허용 후 아래 EXTRA=1 로 실행
#
# 사용: ./commands.sh            # 검증된 범위만
#       EXTRA=1 ./commands.sh    # 모델 다운로드/대화까지 (registry.ollama.ai 접속 가능한 환경 필요)
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

cleanup() { docker rm -f ollama >/dev/null 2>&1; docker volume rm ollama >/dev/null 2>&1; }
cleanup
docker image inspect ollama/ollama >/dev/null 2>&1 || docker pull -q ollama/ollama >/dev/null

run 01_run  'docker run -d -v ollama:/root/.ollama -p 11434:11434 --name ollama ollama/ollama' 'docker run -d -v ollama:/root/.ollama -p 11434:11434 --name ollama ollama/ollama'
sleep 4
run 02_curl 'curl localhost:11434'           'curl -s localhost:11434; echo'     # 터미널에서는 본문만 출력되므로 -s
run 03_list 'docker exec ollama ollama list' 'docker exec ollama ollama list'

if [ "${EXTRA:-0}" = "1" ]; then
  run 04_pull 'docker exec ollama ollama pull qwen2.5:0.5b' 'docker exec ollama ollama pull qwen2.5:0.5b'
  run 05_list2 'docker exec ollama ollama list' 'docker exec ollama ollama list'
  run 06_run  'docker exec ollama ollama run qwen2.5:0.5b "Why is the sky blue? Answer in one sentence."' 'docker exec ollama ollama run qwen2.5:0.5b "Why is the sky blue? Answer in one sentence."'
fi

cleanup
