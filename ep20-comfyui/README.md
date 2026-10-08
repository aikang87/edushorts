# 20회차. Docker + ComfyUI (이미지 생성) — 제작 계획서 (미제작)

**상태: 슬라이드/대본 미제작.** 제작 환경에서 아래 항목을 검증할 수 없어, 실행해 보지 않은 명령과 출력을 만들지 않기 위해 계획서만 둡니다.

## 막힌 항목 (제작 환경)
- `huggingface.co`, `ollama.com`, `registry.ollama.ai` 접속 차단 → 이미지 생성 모델(체크포인트, 약 2~4GB) 내려받기 불가
- 빌드 컨테이너의 DNS 차단 → Dockerfile 의 `RUN pip install`, `RUN git clone` 이 빌드 중 실패 (`apk add` 로 확인함)
- ComfyUI 용으로 검증된 CPU 전용 공식 이미지 없음 (Docker Hub 의 `comfyui/*`, `obeliks/comfyui`, `zhangp365/comfyui` 등은 대부분 GPU용이거나 첫 실행 때 네트워크로 추가 설치하는 커뮤니티 이미지)

## 제작에 필요한 것 (둘 중 하나)
1. 제작 환경의 네트워크 허용 목록에 `github.com`, `pypi.org`, `files.pythonhosted.org`, `download.pytorch.org`, `huggingface.co` (+ 모델 CDN) 를 추가하고, 빌드 컨테이너가 프록시를 통해 외부로 나갈 수 있도록 설정
2. 또는 Docker Desktop(WSL)이 있는 PC에서 아래 명령을 직접 실행하고 출력/스크린샷을 이 폴더에 넣기 (그러면 슬라이드는 같은 방식으로 제작 가능)

## 예상 구성 (CPU 기본, 7·9회차 내용 활용 — 모두 **미검증**)

`Dockerfile`
```dockerfile
FROM python:3.12-slim
RUN apt-get update && apt-get install -y --no-install-recommends git && rm -rf /var/lib/apt/lists/*
WORKDIR /app
RUN git clone https://github.com/comfyanonymous/ComfyUI.git .
RUN pip install --no-cache-dir torch torchvision torchaudio --extra-index-url https://download.pytorch.org/whl/cpu \
 && pip install --no-cache-dir -r requirements.txt
EXPOSE 8188
CMD ["python", "main.py", "--listen", "0.0.0.0", "--cpu"]
```

`compose.yaml`
```yaml
services:
  comfyui:
    build: .
    ports:
      - "8188:8188"
    volumes:
      - ./models:/app/models     # 모델은 이미지에 넣지 않고 볼륨으로 (5회차)
      - ./output:/app/output     # 생성된 이미지 저장
    restart: unless-stopped      # 12회차
```

예상 진행 컷: ComfyUI 소개 → `Dockerfile` → `docker compose up -d --build` → 브라우저 `localhost:8188` (실제 캡처) → 모델 파일을 `models/checkpoints/` 에 넣기 → 기본 워크플로 → 생성 결과(CPU는 수 분 걸리므로 타임랩스) → `output/` 의 결과 파일 → 요약, GPU 부록(`--gpus all`, `--cpu` 제거)

## 검증해야 할 것
- 빌드 성공 여부와 이미지 크기 (torch CPU 포함 약 수 GB)
- `docker compose up -d --build` 로그, `localhost:8188` UI 화면
- CPU 에서 기본 워크플로 1장 생성에 걸리는 시간 (SD1.5, 512x512, 20 steps 기준으로 측정)
- 모델 파일 이름/경로(`models/checkpoints/`)와 워크플로가 모델을 인식하는지
