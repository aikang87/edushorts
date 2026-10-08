# 8회차. 컨테이너끼리 대화하기: 네트워크 (목표 1분)

- 슬라이드 = 영상 한 컷(9컷). 슬라이드 자막은 영문 그대로, 슬라이드 노트에도 같은 대본
- `script.txt` = 나레이션용 대본 (영문은 한글 발음, 줄바꿈으로만 구분). `node build.js` 가 자동 생성
- 예상 길이: 낭독 약 62초 (기준: 36자 = 6.7초), 문장 사이 쉼 포함 약 65~67초
- 화면의 명령어/출력은 `commands.sh` 를 실제 실행한 결과(`output/*.txt`)
- 화면 표시용 편집: 긴 명령은 `\` 로 줄바꿈해 표시(실제 실행은 한 줄, build.js 가 실제 명령과 일치하는지 검증), 컨테이너/네트워크 ID는 앞부분만, 웹서버 응답(HTML)은 앞 4줄만
- `build.js` 는 `<title>` 응답과 `bad address` 오류가 실제 출력에 있는지 검증
- 네트워크 ID와 `docker network ls` 의 ID 값은 실행할 때마다 달라짐
- 이 예제는 컨테이너끼리의 통신만 사용하므로 외부 네트워크가 막힌 제작 환경에서도 동일하게 동작

| # | 화면영역 | 자막 |
|---|---|---|
| 1 | 시리즈 타이틀 + 회차 주제 | 이번 시간에는 컨테이너끼리 이름으로 대화하는 네트워크를 알아봅니다. |
| 2 | 도식: 네트워크 `mynet` 안의 alpine → `http://web` → nginx 웹서버 | 같은 네트워크에 있는 컨테이너는 서로의 이름으로 접속할 수 있습니다. 웹서버와 데이터베이스를 연결할 때 꼭 필요한 방법입니다. |
| 3 | `docker network create mynet` + `docker network ls` (`mynet` 행 강조) | docker network create로 네트워크를 만들고, ls로 목록을 확인합니다. |
| 4 | `docker run -d --name web --network mynet nginx:alpine` (`--network mynet` 강조) | --network 옵션으로 웹서버 컨테이너를 방금 만든 네트워크에 연결합니다. 컨테이너의 이름 web이, 이 네트워크에서 쓰는 이름이 됩니다. |
| 5 | `docker run --rm --network mynet alpine wget -qO- http://web` (`http://web` 강조) | 다른 컨테이너에서 웹서버의 이름으로 접속해 봅니다. wget은 주소의 내용을 가져오는 명령입니다. |
| 6 | 같은 명령 + 응답 앞 4줄 (`<title>Welcome to nginx!</title>` 강조) | 이름만으로 웹서버의 응답이 돌아옵니다. IP 주소를 몰라도 됩니다. |
| 7 | `web2`(기본 네트워크) → `wget http://web2` → `bad address 'web2'` | 네트워크를 지정하지 않은 기본 네트워크에서는 이름을 찾지 못해 접속할 수 없습니다. |
| 8 | 요약 3개 | 네트워크를 만들고 컨테이너를 연결하면, 이름으로 서로 찾을 수 있습니다. |
| 9 | 다음 회차 예고 (9회차 Docker Compose 입문) | 다음 시간에는 여러 컨테이너를 한 번에 실행하는 Docker Compose를 알아봅니다. |

## 재현
```bash
./commands.sh          # 실제 실행 + output/ 갱신 (Docker 데몬, nginx:alpine, alpine 이미지 필요. 끝나면 컨테이너/네트워크 정리)
node build.js          # ep08.pptx, script.txt 생성 (tools/ 에서 npm install 선행)
../tools/export-png.sh ep08.pptx   # slides/*.png (1080x1920)
```
