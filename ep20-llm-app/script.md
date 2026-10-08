# 20회차. 내 앱에 LLM 연결 (목표 1분, 마지막 회차)

- 슬라이드 = 영상 한 컷(11컷). 슬라이드 자막은 영문 그대로, 슬라이드 노트에도 같은 대본
- `script.txt` = 나레이션용 대본 (영문은 한글 발음, 줄바꿈으로만 구분). `node build.js` 가 자동 생성
- 예상 길이: 낭독 약 65초 (기준: 36자 = 6.7초), 문장 사이 쉼 포함 약 69~71초 (마지막 회차라 마무리 문장 포함)
- CPU 기본(GPU 없음). 화면의 명령어/출력은 모두 `commands.sh` 를 실제 실행한 결과(`output/*.txt`), 화면의 `compose.yaml`/`chat.py` 는 실제 실행에 쓴 파일(`output/`)
- 8~12회차(Compose, 서비스 이름 접속, 환경변수, 볼륨), 19회차(Ollama 명령어)를 종합한 회차

## 모델 준비 방식 (19회차와 동일, 학습자와 다른 점)

- 제작 환경에서 `ollama.com`, `registry.ollama.ai`, `huggingface.co` 접속이 막혀 **`ollama pull` 은 실행하지 못함**. 이미 가진 GGUF 모델 파일(Docker Hub 의 `ai/smollm2`, 270MB)을 `ollama create` 로 등록해 사용 (`tools/fetch-model.sh` 가 `~/models` 에 준비, SHA-256 검증)
- 학습자에게는 "인터넷에서 받은 .gguf 파일을 `~/models` 에 두고 등록"하는 방법으로 설명

## 알아둘 점

- 모델은 `ollama` 서비스의 **named volume**(`ollama`)에 저장됨. `docker compose down -v` 로 볼륨까지 지우면 모델도 사라짐(제작 스크립트는 정리를 위해 `-v` 사용). 컨테이너만 다시 만들 때(`docker compose up -d --force-recreate`)는 모델이 남음
- `chat` 서비스는 `profiles: ["tools"]` 라 `docker compose up -d` 때는 시작되지 않고 `docker compose run --rm chat ...` 으로만 실행 (12회차의 profiles 활용)
- 스크립트 실행용(비 TTY) 옵션 `-T` 는 `docker compose exec`/`run` 캡처 시에만 사용하고 화면에는 표시하지 않음. `docker compose run` 의 `Container ... Creating/Created` 로그 줄은 화면에서 생략
- `ollama create` 의 스피너/진행률은 제거하고 완료된 줄만 표시, `up` 은 핵심 3줄만, API 응답 JSON 은 키 단위로 줄을 나눠 앞부분만 표시
- 응답은 Modelfile 의 `PARAMETER temperature 0` 덕분에 같은 질문에 같은 답. 학습자 환경(다른 모델)에서는 답이 다름
- 모델이 작아 답변 품질이 낮을 수 있음 → 짧은 영어 질문 사용
- 이미지 `ollama/ollama` 는 디스크 약 9GB. `python:3.12-slim` 은 표준 라이브러리만 사용(`pip install` 없음)
- `~/models:/models` 는 Compose 가 `~` 를 홈 경로로 확장하는 것을 사용 (WSL 기준)
- `build.js` 는 `Started` 로그, 응답 JSON(`"response":"Docker is `, `"done":true`), 앱 응답이 실제 출력에 있는지, 화면의 명령이 실제 실행한 명령과 같은지 검증

| # | 화면영역 | 자막 |
|---|---|---|
| 1 | 시리즈 타이틀 + 회차 주제 | 이번 시간에는 Compose로 Ollama와 내 파이썬 앱을 연결합니다. |
| 2 | 도식: chat 컨테이너 → `http://ollama:11434` → ollama 컨테이너(볼륨) | 앱 컨테이너가 서비스 이름 ollama로 Ollama 컨테이너에 요청을 보내는 구조입니다. |
| 3 | `compose.yaml` ollama 부분 (`~/models:/models` 강조) | ollama 서비스는 모델을 볼륨에 보관하고, 모델 파일 폴더를 연결합니다. |
| 4 | `compose.yaml` chat 부분 (`OLLAMA_HOST` 강조) | chat 서비스는 환경변수로 Ollama 주소를 받습니다. 주소의 호스트 이름이 서비스 이름입니다. |
| 5 | `cat app/chat.py` (`OLLAMA_HOST` 줄 강조) | 파이썬 표준 라이브러리만으로 요청을 보내는 짧은 코드입니다. 외부 패키지는 필요 없습니다. |
| 6 | `docker compose up -d` (`Started` 강조) | docker compose up -d로 Ollama 서버를 실행합니다. |
| 7 | `docker compose exec ollama ollama create smol -f /models/Modelfile` → `success` | 컨테이너 안에서 모델을 등록합니다. 모델은 볼륨에 저장되어, 컨테이너를 다시 만들어도 남습니다. |
| 8 | `curl localhost:11434/api/generate -d '{...}'` → 응답 JSON (`response` 강조) | Ollama는 API도 제공합니다. JSON으로 질문을 보내면 응답이 JSON으로 돌아옵니다. |
| 9 | `docker compose run --rm chat python chat.py "What is Docker? ..."` → 답변 | 이제 내 파이썬 앱에서 같은 질문을 보내 답을 받습니다. |
| 10 | 요약 3개 | 서비스 이름으로 연결하고, 볼륨에 모델을 보관하면 나만의 LLM 앱을 만들 수 있습니다. |
| 11 | 마무리: 수고하셨습니다 (Docker 기초 → Compose → LLM) | 지금까지 Docker의 기초부터 LLM 실행까지 배웠습니다. 수고하셨습니다. |

## 재현
```bash
./commands.sh          # 실제 실행 + output/ 갱신 (Docker 데몬, ollama/ollama(약 9GB), python:3.12-slim, 11434 포트, ~/models 의 GGUF 필요 → tools/fetch-model.sh 가 준비. 끝나면 컨테이너/볼륨 정리)
node build.js          # ep20.pptx, script.txt 생성 (tools/ 에서 npm install 선행)
../tools/export-png.sh ep20.pptx   # slides/*.png (1080x1920)
```
