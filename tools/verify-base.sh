#!/usr/bin/env bash
# 제작 환경 전용: 빌드 중 `pip install` 을 검증할 수 있도록 기반 이미지에 프록시 CA 인증서를 넣은 로컬 이미지를 만든다.
#   사용: tools/verify-base.sh python:3.12-slim
# - 같은 이름(태그)의 로컬 이미지로 덮어쓰므로 학습자용 Dockerfile 의 `FROM python:3.12-slim` 을 그대로 검증할 수 있다.
# - 원본은 <이미지>-orig 태그로 보존. 이 환경에서 이미지 빌드는 `docker build --network host` 로 해야 외부(PyPI)에 닿는다.
# - 학습자 PC(인터넷 연결 환경)에서는 필요 없음. 영상/슬라이드에는 이 과정이 나오지 않는다.
set -eu
img="$1"
[ -f /root/.ccr/ca-bundle.crt ] || { echo "프록시 CA(/root/.ccr/ca-bundle.crt)가 없는 환경에서는 필요하지 않습니다."; exit 0; }
docker image inspect "$img" >/dev/null 2>&1 || docker pull -q "$img" >/dev/null
if [ "$(docker image inspect -f '{{index .Config.Labels "verify-base"}}' "$img" 2>/dev/null)" = "1" ]; then echo "이미 검증용 기반 이미지입니다: $img"; exit 0; fi
docker tag "$img" "${img}-orig"
tmp="$(mktemp -d)"; cp /root/.ccr/ca-bundle.crt "$tmp/ca.crt"
printf 'FROM %s\nCOPY ca.crt /etc/ssl/ccr-ca.crt\nENV PIP_CERT=/etc/ssl/ccr-ca.crt\nLABEL verify-base=1\n' "${img}-orig" > "$tmp/Dockerfile"
docker build -q --network host -t "$img" "$tmp" >/dev/null
rm -f "$tmp/Dockerfile" "$tmp/ca.crt"; rmdir "$tmp"
echo "검증용 기반 이미지 준비됨: $img (원본: ${img}-orig)"
