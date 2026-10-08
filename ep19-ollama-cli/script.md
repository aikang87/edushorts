# 19회차. Ollama 명령어 (목표 1분)

- 슬라이드 = 영상 한 컷(11컷). 슬라이드 자막은 영문 그대로, 슬라이드 노트에도 같은 대본
- `script.txt` = 나레이션용 대본 (영문은 한글 발음, 줄바꿈으로만 구분). `node build.js` 가 자동 생성
- 예상 길이: 낭독 약 61초 (기준: 36자 = 6.7초), 문장 사이 쉼 포함 약 65~67초
- CPU 기본(GPU 없음). 화면의 명령어/출력은 모두 `commands.sh` 를 실제 실행한 결과(`output/*.txt`), Modelfile 은 실제 사용한 파일(`output/Modelfile`)

## 모델 준비 방식 (학습자와 다른 점)

- 제작 환경에서 `ollama.com`, `registry.ollama.ai`, `huggingface.co` 접속이 막혀 **`ollama pull` 은 실행하지 못함** → 슬라이드/대본에서 제외
- 대신 이미 가진 모델 파일(GGUF)을 `ollama create` 로 등록해 사용. 모델은 Docker Hub 의 `ai/smollm2`(약 360M 파라미터, Q4_K_M, 270MB)에서 GGUF 레이어를 받아(`tools/fetch-model.sh`, SHA-256 검증) `~/models/smollm2.gguf` 로 둠
- 학습자에게는 "인터넷에서 받은 .gguf 파일을 `~/models` 에 두고 등록하는 방법"으로 설명. 라이브러리 모델을 바로 받는 `ollama pull 모델이름` 은 별도 안내 필요 (미검증)
- 이 모델은 아주 작아서 답변 품질이 낮을 수 있음. 영상용으로는 짧은 영어 질문(`What is Docker? ...`)을 사용

## 알아둘 점

- `ollama/ollama` 이미지는 **디스크 약 9GB**(GPU 라이브러리 포함) → 첫 실행 시 내려받기에 시간이 오래 걸림
- `ollama run` 캡처 시에만 `--nowordwrap` 사용(터미널 줄바꿈 제어문자 제거 목적), 화면에는 옵션 없이 표시. Modelfile 의 `PARAMETER temperature 0` 덕분에 같은 질문에 같은 답이 나옴
- `ollama create` 의 스피너/진행률(터미널 제어문자)은 제거하고 완료된 줄(`parsing GGUF`, `using autodetected template chatml`, `writing manifest`, `success`)만 표시
- `ollama ps` 의 `PROCESSOR` 열은 제작 환경에서 `78%/22% CPU/GPU` 라는 환경 특유의 값이 나와(GPU 없는 환경인데도) 혼동을 피하려고 화면에서 열을 생략. `CONTEXT`, `RUNNER` 열도 생략
- `ollama list` 의 ID/MODIFIED 값은 실행할 때마다 다름
- 화면 표시용 편집: 긴 명령은 `\` 로 줄바꿈해 표시(실제 실행은 한 줄, `build.js` 가 일치 여부 검증), `ollama show` 는 앞부분만, 컨테이너 ID는 앞부분만
- `build.js` 는 `deleted 'smol'`, 응답 형식(`Docker is ...`), create 의 완료 줄이 실제 출력에 있는지 검증

| # | 화면영역 | 자막 |
|---|---|---|
| 1 | 시리즈 타이틀 + 회차 주제 | 이번 시간에는 Ollama로 언어모델을 다루는 핵심 명령어를 익힙니다. |
| 2 | `docker run -d -v ollama:/root/.ollama -v ~/models:/models -p 11434:11434 --name ollama ollama/ollama` (`-v ~/models` 강조) | 먼저 Ollama 서버를 컨테이너로 실행합니다. 모델 파일이 있는 폴더도 함께 연결합니다. |
| 3 | `cat ~/models/Modelfile` (`FROM`, `PARAMETER` 강조) | Modelfile은 모델을 등록하는 설명서입니다. FROM 뒤에 모델 파일의 경로를 적습니다. temperature 0은 같은 질문에 같은 답을 내도록 합니다. |
| 4 | `docker exec ollama ollama create smol -f /models/Modelfile` → `success` | ollama create로 모델을 등록합니다. 이름은 smol로 정했습니다. |
| 5 | `docker exec ollama ollama list` | ollama list로 등록된 모델을 확인합니다. |
| 6 | `docker exec ollama ollama run smol "What is Docker? Answer in one short sentence."` → 답변 | ollama run 뒤에 질문을 적으면, 모델이 답을 만들어 줍니다. |
| 7 | `docker exec ollama ollama show smol` (앞부분) | ollama show로 모델의 구조와 설정을 자세히 볼 수 있습니다. |
| 8 | `docker exec ollama ollama ps` (`UNTIL`) | ollama ps는 지금 메모리에 올라가 있는 모델을 보여 줍니다. 일정 시간이 지나면 자동으로 내려갑니다. |
| 9 | `docker exec ollama ollama rm smol` → `deleted 'smol'` | 필요 없는 모델은 ollama rm으로 지웁니다. |
| 10 | 요약 4개 | create로 등록하고, run으로 실행하고, list와 rm으로 관리합니다. |
| 11 | 다음 회차 예고 (20회차 내 앱에 LLM 연결) | 다음 시간에는 파이썬 앱에서 Ollama를 불러 쓰는 방법을 알아봅니다. |

## 재현
```bash
./commands.sh          # 실제 실행 + output/ 갱신 (Docker 데몬, ollama/ollama 이미지 약 9GB, 11434 포트, ~/models 의 GGUF 필요 → tools/fetch-model.sh 가 준비. 끝나면 컨테이너/볼륨 정리)
node build.js          # ep19.pptx, script.txt 생성 (tools/ 에서 npm install 선행)
../tools/export-png.sh ep19.pptx   # slides/*.png (1080x1920)
```
