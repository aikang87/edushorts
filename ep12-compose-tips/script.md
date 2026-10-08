# 12회차. Compose 실전 팁 (목표 1분)

- 슬라이드 = 영상 한 컷(11컷). 슬라이드 자막은 영문 그대로, 슬라이드 노트에도 같은 대본
- `script.txt` = 나레이션용 대본 (영문은 한글 발음, 줄바꿈으로만 구분). `node build.js` 가 자동 생성
- 예상 길이: 낭독 약 60초 (기준: 36자 = 6.7초), 문장 사이 쉼 포함 약 64~66초
- 10~11회차 프로젝트(`~/visits`: 파이썬 웹 + redis)를 이어서 사용. 이번 회차에 `app.py` 에 일부러 종료하는 `/crash` 경로와 `compose.yaml` 의 `restart`, `mem_limit`, `cpus`, `profiles`(cli 서비스)를 추가
- 화면의 명령어/출력은 `commands.sh` 를 실제 실행한 결과(`output/*.txt`), 화면의 `app.py`/`compose.yaml` 은 실제 실행에 쓴 파일(`output/`)
- 화면 표시용 편집: compose.yaml 은 설명할 부분만(생략 줄 `...`), `ps`/`stats` 는 일부 열 생략, `up --profile` 은 핵심 줄만, 긴 `docker inspect` 명령은 `\` 로 줄바꿈해 표시(실제 실행은 한 줄, build.js 가 일치 여부 검증)
- **재시작 시연 방식:** `docker kill`/`docker stop` 은 사용자의 수동 정지로 간주되어 `unless-stopped` 가 재시작하지 않음(제작 환경에서 확인). 그래서 앱이 스스로 비정상 종료(`os._exit(1)`)하는 `/crash` 로 시연
- `curl` 은 오류 메시지가 터미널과 같이 보이도록 `-sS` 사용 (`curl: (52) Empty reply from server`)
- `mem_limit`/`cpus` 는 Compose 서비스 최상위 키(제작 환경 Compose v5.6.0에서 확인). `docker stats` 의 MEM LIMIT 은 web 만 128MiB, db 는 한도 없음(호스트 전체 메모리 표시)
- `build.js` 는 `(52)` 오류, RestartCount 1, `/ 128MiB`, `cli` 서비스가 프로파일 없이는 안 뜨고 `--profile debug` 로 뜨는지 검증

| # | 화면영역 | 자막 |
|---|---|---|
| 1 | 시리즈 타이틀 + 회차 주제 | 이번 시간에는 Compose를 실전에서 쓸 때 유용한 설정 세 가지를 알아봅니다. |
| 2 | 카드 3개: `restart` / `mem_limit, cpus` / `profiles` | 자동 재시작과 리소스 제한, 그리고 필요할 때만 실행하는 profiles입니다. |
| 3 | `compose.yaml` web 부분 (`restart: unless-stopped` 강조) | restart: unless-stopped를 적으면, 앱이 비정상 종료돼도 자동으로 다시 시작합니다. |
| 4 | `grep -n _exit app.py` + `curl localhost:8000/crash` → `curl: (52) Empty reply from server` | 일부러 앱을 종료시키는 주소로 접속해 봅니다. 연결이 끊기며 앱이 죽습니다. |
| 5 | `docker compose ps` (web `Up 2 seconds`) + `docker inspect -f '{{.RestartCount}}' visits-web-1` → `1` | 잠시 뒤 보면 web만 새로 시작되었고, 재시작 횟수는 1입니다. |
| 6 | `compose.yaml` web 부분 (`mem_limit: 128m`, `cpus: 0.5` 강조) | mem_limit은 메모리, cpus는 쓸 수 있는 코어 수를 제한합니다. |
| 7 | `docker stats --no-stream` (web `/ 128MiB` 강조) | docker stats로 보면 web의 메모리 한도가 128MiB로 표시됩니다. |
| 8 | `compose.yaml` cli 부분 (`profiles: ["debug"]` 강조) | profiles를 적은 서비스는 평소에는 시작되지 않고, 필요할 때만 실행됩니다. |
| 9 | `docker compose --profile debug up -d` (`cli Started`) + `docker compose ps` (cli 포함 3개) | --profile 옵션을 붙여 실행하면 debug 서비스까지 함께 시작됩니다. |
| 10 | 요약 3개 | 자동 재시작은 restart, 제한은 mem_limit, 선택 실행은 profiles입니다. |
| 11 | 다음 회차 예고 (13회차 문제 해결과 청소) | 다음 시간에는 문제가 생겼을 때 살펴보고 정리하는 방법을 알아봅니다. |

## 재현
```bash
./commands.sh          # 실제 실행 + output/ 갱신 (Docker 데몬, python:3.12-alpine, redis:alpine, 8000 포트 필요. 끝나면 정리)
node build.js          # ep12.pptx, script.txt 생성 (tools/ 에서 npm install 선행)
../tools/export-png.sh ep12.pptx   # slides/*.png (1080x1920)
```
