# 11회차. Compose 설정 다듬기 (목표 1분)

- 슬라이드 = 영상 한 컷(10컷). 슬라이드 자막은 영문 그대로, 슬라이드 노트에도 같은 대본
- `script.txt` = 나레이션용 대본 (영문은 한글 발음, 줄바꿈으로만 구분). `node build.js` 가 자동 생성
- 예상 길이: 낭독 약 61초 (기준: 36자 = 6.7초), 문장 사이 쉼 포함 약 64~66초
- 10회차 프로젝트(`~/visits`: 파이썬 웹 + redis)에 `.env`, `healthcheck`, `depends_on` 을 추가한 구성
- 화면의 명령어/출력은 `commands.sh` 를 실제 실행한 결과(`output/*.txt`), 화면의 compose.yaml/.env 는 실제 실행에 쓴 파일(`output/compose.yaml`, `output/dotenv.txt`)
- 화면 표시용 편집: compose.yaml 은 설명할 부분만 표시(생략 줄은 `...`), `docker compose up -d` 는 핵심 4줄만, `docker compose ps` 는 일부 열 생략
- `curl localhost:8080` 은 터미널에서 본문만 출력되도록 캡처 시 `-s` 를 사용
- `up` 직후 웹이 뜨기까지 시간이 걸려 캡처 전 3초 대기를 둠 (영상에서는 편집으로 처리)
- `.env` 는 `docker compose` 가 같은 폴더에서 자동으로 읽는 파일 (`.env` 의 `WEB_PORT` 가 compose.yaml 의 `${WEB_PORT}` 로 치환됨)
- `build.js` 는 `db Healthy` 가 `web Started` 보다 먼저 나왔는지, `(healthy)` 표시, `Visits: 1` 이 실제 출력에 있는지 검증
- 학습자의 첫 `up` 에서는 이미지 내려받기 로그가 먼저 나옴

| # | 화면영역 | 자막 |
|---|---|---|
| 1 | 시리즈 타이틀 + 회차 주제 | 이번 시간에는 Compose 설정을 다듬는 방법을 알아봅니다. .env 파일, healthcheck, depends_on입니다. |
| 2 | 카드 3개: `.env` / `healthcheck` / `depends_on` | 지난 시간에 만든 웹과 db 프로젝트에 세 가지 설정을 더해 봅니다. |
| 3 | `cat .env` (`WEB_PORT=8080`) + `grep WEB_PORT compose.yaml` (`${WEB_PORT}` 강조) | 포트 번호처럼 바뀔 수 있는 값은 .env 파일에 적고, compose.yaml에서는 변수 이름으로 가져옵니다. |
| 4 | `compose.yaml` db 부분 (`healthcheck`, `test` 강조) | healthcheck는 서비스가 정상인지 주기적으로 검사하는 명령입니다. redis는 ping에 응답하면 정상입니다. |
| 5 | `compose.yaml` web 부분 (`depends_on` ... `service_healthy` 강조) | depends_on에 service_healthy를 적으면, db가 정상이 된 뒤에 web을 시작합니다. |
| 6 | `docker compose up -d` (`db Healthy` → `web Started` 강조) | docker compose up -d를 실행하면 db가 Healthy 상태가 된 뒤에 web이 시작됩니다. 정상이 될 때까지 기다리므로 연결 오류를 줄일 수 있습니다. |
| 7 | `docker compose ps` (`(healthy)` 강조) | docker compose ps에서 db 상태에 healthy가 표시됩니다. |
| 8 | `curl localhost:8080` → `Visits: 1` | .env에 적은 8080 포트로 접속합니다. |
| 9 | 요약 3개 | .env는 값 분리, healthcheck는 상태 검사, depends_on은 시작 순서입니다. |
| 10 | 다음 회차 예고 (12회차 Compose 실전 팁) | 다음 시간에는 restart와 리소스 제한, profiles를 알아봅니다. |

## 재현
```bash
./commands.sh          # 실제 실행 + output/ 갱신 (Docker 데몬, python:3.12-alpine, redis:alpine, 8080 포트 필요. 끝나면 정리)
node build.js          # ep11.pptx, script.txt 생성 (tools/ 에서 npm install 선행)
../tools/export-png.sh ep11.pptx   # slides/*.png (1080x1920)
```
