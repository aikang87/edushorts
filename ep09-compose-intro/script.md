# 9회차. Docker Compose 입문 (목표 1분)

- 슬라이드 = 영상 한 컷(11컷). 슬라이드 자막은 영문 그대로, 슬라이드 노트에도 같은 대본
- `script.txt` = 나레이션용 대본 (영문은 한글 발음, 줄바꿈으로만 구분). `node build.js` 가 자동 생성
- 예상 길이: 낭독 약 63초 (기준: 36자 = 6.7초), 문장 사이 쉼 포함 약 66~69초
- 화면의 명령어/출력은 `commands.sh` 를 실제 실행한 결과(`output/*.txt`), 화면의 compose.yaml 은 실제 실행에 쓴 `output/compose.yaml`, 브라우저 화면은 실제 Chromium 캡처(`output/browser.png`)
- 화면 표시용 편집: `docker compose ps` 는 일부 열 생략. `up`/`down` 출력은 생략 없이 전체 표시 (비대화형 출력의 연속 중복 줄만 제거)
- 폴더 `~/myweb` 는 사전에 만들어 둔 것으로 설명 (프로젝트 이름이 폴더명이라 컨테이너 이름이 `myweb-web-1` 이 됨)
- Compose 출력 형식(진행 표시 등)은 Compose 버전에 따라 다를 수 있음 (제작 환경: Docker Compose v5.6.0)
- `build.js` 는 `Started`/`Removed` 로그가 실제 출력에 있는지 검증

| # | 화면영역 | 자막 |
|---|---|---|
| 1 | 시리즈 타이틀 + 회차 주제 | 이번 시간에는 여러 설정을 파일 하나로 관리하는 Docker Compose를 알아봅니다. |
| 2 | 도식: 길게 입력하는 `docker run` 명령 → `compose.yaml` + `docker compose up -d` | 컨테이너 옵션이 많아지면 명령이 길어지고 실수하기 쉽습니다. Compose는 이 설정을 파일에 적어 둡니다. |
| 3 | `cat > compose.yaml <<'EOF' ... EOF` | compose.yaml 파일을 만듭니다. YAML은 들여쓰기로 구조를 나타내는 설정 파일 형식입니다. |
| 4 | `cat compose.yaml` (`services:`, `web:` 강조) | services 아래에 서비스 이름을 적습니다. 여기서는 web입니다. |
| 5 | `cat compose.yaml` (`image`, `ports` 강조) | image는 사용할 이미지, ports는 연결할 포트입니다. docker run의 옵션과 같습니다. |
| 6 | `docker compose up -d` 전체 출력 (`Network Created`, `Container Started` 강조) | docker compose up -d로 실행하면, 네트워크와 컨테이너가 한 번에 만들어집니다. |
| 7 | `docker compose ps` | docker compose ps로 실행 중인 서비스를 확인합니다. |
| 8 | 브라우저 `localhost:8080` (nginx 환영 페이지, 실제 캡처) | 브라우저로 접속하면 웹서버가 응답합니다. docker run으로 실행한 것과 똑같은 결과입니다. |
| 9 | `docker compose down` 전체 출력 (`Removed` 강조) | docker compose down으로 한 번에 정리합니다. 컨테이너와 네트워크가 함께 삭제됩니다. |
| 10 | 요약 4개 | up으로 켜고, ps로 확인하고, down으로 끕니다. |
| 11 | 다음 회차 예고 (10회차 Compose로 웹 + DB) | 다음 시간에는 Compose로 웹서버와 데이터베이스를 함께 실행합니다. |

## 재현
```bash
./commands.sh          # 실제 실행 + output/ 갱신 (Docker 데몬, nginx:alpine, 8080 포트 필요. 끝나면 정리)
node build.js          # ep09.pptx, script.txt 생성 (tools/ 에서 npm install 선행)
../tools/export-png.sh ep09.pptx   # slides/*.png (1080x1920)
```
