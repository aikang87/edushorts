#!/usr/bin/env bash
# 19~20회차용 작은 LLM 모델 파일(GGUF) 준비: Docker Hub 의 ai/smollm2 (OCI 아티팩트)에서 GGUF 레이어를 받아 ~/models 에 저장한다.
#   사용: tools/fetch-model.sh   ->  ~/models/smollm2.gguf, ~/models/Modelfile
# - 제작 환경은 Hugging Face/ollama.com 접속이 막혀 있어 Docker Hub 에 올라온 모델을 사용 (Docker Hub 요청 한도: 매니페스트 조회 1회 사용)
# - 학습자는 Hugging Face 등에서 받은 .gguf 파일을 같은 위치에 두고 사용하면 된다.
set -eu
DEST="$HOME/models"; mkdir -p "$DEST"
DIGEST="sha256:bf6f20a603055433b4b998119e17928fc4a89b35c42855dd7eada105058cae0a"   # ai/smollm2:latest 의 GGUF 레이어
if [ ! -s "$DEST/smollm2.gguf" ] || [ "$(sha256sum "$DEST/smollm2.gguf" | cut -d' ' -f1)" != "${DIGEST#sha256:}" ]; then
  TOK="$(curl -sS -m 20 "https://auth.docker.io/token?service=registry.docker.io&scope=repository:ai/smollm2:pull" | python3 -c "import sys,json;print(json.load(sys.stdin)['token'])")"
  curl -sS -L -m 280 -H "Authorization: Bearer $TOK" -o "$DEST/smollm2.gguf" "https://registry-1.docker.io/v2/ai/smollm2/blobs/$DIGEST"
  [ "$(sha256sum "$DEST/smollm2.gguf" | cut -d' ' -f1)" = "${DIGEST#sha256:}" ] || { echo "체크섬 불일치" >&2; rm -f "$DEST/smollm2.gguf"; exit 1; }
fi
cat > "$DEST/Modelfile" <<'MF'
FROM /models/smollm2.gguf
SYSTEM You are a helpful assistant. Answer briefly.
MF
echo "모델 준비됨: $DEST/smollm2.gguf ($(du -h "$DEST/smollm2.gguf" | cut -f1)), $DEST/Modelfile"
