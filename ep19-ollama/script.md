# 19회차. Docker + Ollama (목표 1분) — **일부 미검증 초안**

- 슬라이드 = 영상 한 컷(10컷). 슬라이드 자막은 영문 그대로, 슬라이드 노트에도 같은 대본
- `script.txt` = 나레이션용 대본 (영문은 한글 발음, 줄바꿈으로만 구분). `node build.js` 가 자동 생성
- 예상 길이: 낭독 약 65초 (기준: 36자 = 6.7초), 문장 사이 쉼 포함 약 68~70초
- CPU 기본, GPU 는 8번 슬라이드의 부록으로만 설명

## 검증 범위 (중요)

| 슬라이드 | 내용 | 검증 |
|---|---|---|
| 3 | `docker run -d -v ollama:/root/.ollama -p 11434:11434 --name ollama ollama/ollama` | **실제 실행 확인** |
| 4 | `curl localhost:11434` → `Ollama is running` | **실제 실행 확인** |
| 5 | `docker exec ollama ollama list` → 빈 목록(`NAME ID SIZE MODIFIED`) | **실제 실행 확인** |
| 6 | `docker exec ollama ollama pull qwen2.5:0.5b` | **미검증 (명령만 표시)** |
| 7 | `docker exec -it ollama ollama run qwen2.5:0.5b` | **미검증 (명령만 표시)** |
| 8 | GPU 부록 `--gpus all` | **미검증 (GPU 없음, 안내 화면)** |

- 6~8번은 **출력 없이 명령만** 보여주며, 출력을 지어내지 않았음. 슬라이드 노트에 `[미검증 ...]` 표시
- 이유: 제작 환경에서 모델 내려받기가 실패함. 실제로 시도한 결과:
  `Error: pull model manifest: Get "https://registry.ollama.ai/v2/library/qwen2.5/manifests/0.5b": dial tcp: lookup registry.ollama.ai on 8.8.8.8:53: no such host`
  (제작 환경의 네트워크 허용 목록 + 컨테이너 DNS 차단. 호스트 `curl` 로도 `ollama.com`, `registry.ollama.ai`, `huggingface.co` 접속 불가)
- 모델 `qwen2.5:0.5b` 는 CPU 에서 돌릴 수 있는 작은 모델로 선택했으나 실제 용량/응답 속도/답변 품질은 확인하지 못함. 한국어 답변 품질은 낮을 수 있어 영어 질문 사용을 권장
- 검증 방법: 네트워크가 열린 환경에서 `EXTRA=1 ./commands.sh` 실행 → `output/04_pull.txt`, `05_list2.txt`, `06_run.txt` 생성. 이후 `build.js` 에 출력 슬라이드를 추가하고 6~8번을 교체. `docker exec -it` 는 대화형(TTY)이라 스크립트 캡처 시 `-it` 대신 `docker exec ollama ollama run MODEL "질문"` 형태 사용
- 이미지 `ollama/ollama` 는 **디스크 9.36GB** (제작 환경 `docker images` 기준, GPU 라이브러리 포함). 첫 실행 시 내려받기에 오래 걸림 → 3번 슬라이드 자막에 안내 문장 포함

## 화면 표시용 편집
- 긴 `docker run` 은 `\` 로 줄바꿈해 표시(실제 실행은 한 줄, `build.js` 가 일치 여부 검증), 컨테이너 ID는 앞부분만
- `ollama list` 의 열 사이 공백은 표시용으로 줄임

| # | 화면영역 | 자막 | 검증 |
|---|---|---|---|
| 1 | 시리즈 타이틀 + 회차 주제 | 이번 시간에는 Docker로 내 컴퓨터에서 대규모 언어모델을 실행하는 Ollama를 알아봅니다. | - |
| 2 | 도식: 터미널/브라우저 → `localhost:11434` → Ollama 컨테이너 → `-v` 볼륨(모델 저장) | Ollama는 인공지능 언어모델을 내 컴퓨터에서 실행해 주는 프로그램입니다. 컨테이너로 실행하면 설치가 간단합니다. | - |
| 3 | `docker run -d -v ollama:/root/.ollama -p 11434:11434 --name ollama ollama/ollama` | -v 옵션으로 모델 저장 폴더를 연결하면, 컨테이너를 지워도 모델이 남습니다. 이미지가 커서 처음에는 시간이 걸립니다. | 확인 |
| 4 | `curl localhost:11434` → `Ollama is running` | 접속해 보면 Ollama가 실행 중이라고 응답합니다. | 확인 |
| 5 | `docker exec ollama ollama list` (빈 목록) | docker exec로 컨테이너 안의 ollama 명령을 실행합니다. 아직 내려받은 모델이 없어서 목록이 비어 있습니다. | 확인 |
| 6 | `docker exec ollama ollama pull qwen2.5:0.5b` (명령만) | ollama pull로 모델을 내려받습니다. 작은 모델이라 GPU가 없어도 실행할 수 있습니다. | **미검증** |
| 7 | `docker exec -it ollama ollama run qwen2.5:0.5b` (명령만) | ollama run으로 모델과 대화를 시작합니다. -it 옵션은 키보드 입력을 연결합니다. | **미검증** |
| 8 | GPU 부록: `docker run -d --gpus all ...` | GPU가 있다면 --gpus all 옵션을 더해 더 빠르게 실행할 수 있습니다. | **미검증** |
| 9 | 요약 3개 | 컨테이너로 실행하고, exec로 명령하고, 볼륨에 모델을 보관합니다. | - |
| 10 | 다음 회차 예고 (20회차 Docker + ComfyUI) | 다음 시간에는 Docker로 이미지를 만드는 ComfyUI를 알아봅니다. | - |

## 재현
```bash
./commands.sh          # 검증된 범위(01~03) 실행 + output/ 갱신. 이미지 9GB 내려받기 필요, 11434 포트 사용. 끝나면 컨테이너/볼륨 정리
EXTRA=1 ./commands.sh  # (네트워크 허용 환경) 모델 다운로드/대화까지
node build.js          # ep19.pptx, script.txt 생성 (tools/ 에서 npm install 선행)
../tools/export-png.sh ep19.pptx   # slides/*.png (1080x1920)
```
