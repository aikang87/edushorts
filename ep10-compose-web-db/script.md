# 10회차. Compose로 웹 + DB (목표 1분)

- 슬라이드 = 영상 한 컷(12컷). 슬라이드 자막은 영문 그대로, 슬라이드 노트에도 같은 대본
- `script.txt` = 나레이션용 대본 (영문은 한글 발음, 줄바꿈으로만 구분). `node build.js` 가 자동 생성
- 예상 길이: 낭독 약 63초 (기준: 36자 = 6.7초), 문장 사이 쉼 포함 약 67~69초
- 화면의 명령어/출력은 `commands.sh` 를 실제 실행한 결과(`output/*.txt`), 화면의 `app.py`/`Dockerfile`/`compose.yaml` 은 실제 실행에 쓴 파일(`output/`), 브라우저 화면은 실제 Chromium 캡처(`output/browser.png`)
- **예제 구성:** 웹 = 파이썬 표준 라이브러리 HTTP 서버(`app.py`, 외부 패키지 없음), DB = `redis:alpine`(키-값 DB, 방문 횟수 `INCR`). 제작 환경은 빌드 중 네트워크가 막혀 `pip install` 검증이 불가해 이 구성을 선택. PostgreSQL + FastAPI 구성은 학습자 환경 기준 별도 검증 필요
- 화면 표시용 편집: `docker compose up -d` 는 빌드 진행 로그와 중간 단계를 생략하고 핵심 줄(`Built`/`Created`/`Started`)만, `down` 은 `Removed` 줄만, `ps` 는 일부 열 생략
- `curl localhost:8000` 은 터미널에서 본문만 출력되도록 캡처 시 `-s` 를 사용 (학습자 화면과 동일한 결과)
- 학습자의 첫 `up` 에서는 `python:3.12-alpine`, `redis:alpine` 내려받기 로그가 먼저 나옴
- 브라우저 화면의 `Visits: 3` 은 curl 2회 + 브라우저 1회 접속 결과 (접속마다 1씩 증가)
- `build.js` 는 `Started`/`Removed` 로그, `Visits: 1/2`, `("db", 6379)` 가 실제 출력에 있는지 검증

| # | 화면영역 | 자막 |
|---|---|---|
| 1 | 시리즈 타이틀 + 회차 주제 | 이번 시간에는 Compose로 웹서버와 데이터베이스를 함께 실행합니다. |
| 2 | 도식: 브라우저 → Compose 안의 web → db(redis), 방문 횟수 저장 | 웹 앱이 방문 횟수를 데이터베이스에 저장하는 구조입니다. 서비스 두 개를 파일 하나로 실행합니다. |
| 3 | `cat compose.yaml` (`build: .` 강조) | web 서비스의 build: . 는 현재 폴더의 Dockerfile로 이미지를 만든다는 뜻입니다. |
| 4 | `cat compose.yaml` (`image: redis:alpine` 강조) | 데이터베이스는 이미 만들어진 redis 이미지를 그대로 사용합니다. |
| 5 | `docker compose up -d` 핵심 로그 (`Started` 강조) | docker compose up -d 하나로 이미지를 만들고 두 서비스를 함께 실행합니다. |
| 6 | `docker compose ps` (web, db 두 행) | docker compose ps로 보면 web과 db가 함께 실행 중입니다. |
| 7 | `curl localhost:8000` x2 → `Visits: 1`, `Visits: 2` | 접속할 때마다 방문 횟수가 데이터베이스에 저장되어 늘어납니다. |
| 8 | 브라우저 `localhost:8000` → `Visits: 3` (실제 캡처) | 브라우저로 접속해도 횟수가 늘어납니다. |
| 9 | `grep -n create_connection app.py` (`"db"` 강조) | 웹 코드는 데이터베이스를 서비스 이름 db로 찾아갑니다. 앞에서 배운 이름 접속 방식입니다. |
| 10 | `docker compose down` (`Removed` 줄) | docker compose down으로 두 서비스를 한 번에 정리합니다. |
| 11 | 요약 3개 | build와 image로 서비스를 정하고, 이름으로 서로 찾아 연결합니다. |
| 12 | 다음 회차 예고 (11회차 Compose 설정 다듬기) | 다음 시간에는 설정을 다듬는 환경변수와 healthcheck를 알아봅니다. |

## 재현
```bash
./commands.sh          # 실제 실행 + output/ 갱신 (Docker 데몬, python:3.12-alpine, redis:alpine, 8000 포트 필요. 끝나면 정리)
node build.js          # ep10.pptx, script.txt 생성 (tools/ 에서 npm install 선행)
../tools/export-png.sh ep10.pptx   # slides/*.png (1080x1920)
```
