# 7회차. Dockerfile 실전 (목표 1분)

- 슬라이드 = 영상 한 컷(12컷). 슬라이드 자막은 영문 그대로, 슬라이드 노트에도 같은 대본
- `script.txt` = 나레이션용 대본 (영문은 한글 발음, 줄바꿈으로만 구분). `node build.js` 가 자동 생성
- 예상 길이: 낭독 약 63초 (기준: 36자 = 6.7초), 문장 사이 쉼 포함 약 67~69초
- 화면의 명령어/출력은 `commands.sh` 를 실제 실행한 결과(`output/*.txt`), 화면의 Dockerfile/app.py 는 실제 빌드에 쓴 `output/Dockerfile`, `output/app.py`
- 빌드 로그는 핵심 줄만 표시(`...` 로 생략). `build.js` 는 캐시 로그(`CACHED`)와 `.dockerignore` 결과가 예상과 다르면 빌드를 중단하도록 검증함
- 예제: 외부 패키지 없이 표준 라이브러리만 쓰는 파이썬 앱(`print`) — 제작 환경에서 빌드 컨테이너 네트워크가 막혀 있어 `pip install` 은 검증 불가
- 학습자의 첫 빌드에서는 `python:3.12-alpine` 내려받기 로그가 먼저 나옴 (제작 환경은 이미 받아둔 상태)
- 캐시 시연: 같은 내용 재빌드 → 모든 단계 `CACHED`, `app.py` 수정 후 재빌드 → `COPY` 단계부터 다시 실행

| # | 화면영역 | 자막 |
|---|---|---|
| 1 | 시리즈 타이틀 + 회차 주제 | 이번 시간에는 내 프로그램 파일을 이미지에 넣는 Dockerfile 작성법을 알아봅니다. |
| 2 | 도식: 내 컴퓨터 `~/myapp` → `COPY . .` → 이미지 `/app` | 내 파일을 이미지 안으로 복사하면, 내가 만든 프로그램을 컨테이너로 실행할 수 있습니다. |
| 3 | `ls`(secret.txt 강조) + `cat app.py` | 폴더에는 파이썬 파일, Dockerfile, 비밀번호 파일이 있습니다. |
| 4 | `cat Dockerfile` (`WORKDIR /app` 강조) | WORKDIR은 컨테이너 안에서 작업할 폴더를 정합니다. |
| 5 | `cat Dockerfile` (`COPY . .` 강조) | COPY는 내 파일을 이미지 안으로 복사합니다. 앞의 점은 내 폴더, 뒤의 점은 작업 폴더입니다. |
| 6 | `docker build -t myapp .` 핵심 로그 + `docker run --rm myapp` → `Hello from Docker!` | build한 뒤 실행하면 내 프로그램의 결과가 출력됩니다. |
| 7 | 같은 내용으로 재빌드: `WORKDIR`, `COPY` 모두 `CACHED` | 같은 내용으로 다시 build하면 이미 만든 단계는 캐시되어 건너뜁니다. |
| 8 | `app.py` 수정 후 재빌드: `WORKDIR` 은 `CACHED`, `COPY` 는 다시 실행 | 파일을 수정하면 바뀐 단계부터 다시 실행됩니다. 앞 단계는 캐시를 그대로 씁니다. |
| 9 | `docker run --rm myapp ls` → `secret.txt` 가 이미지 안에 있음 | 그런데 비밀번호 파일까지 이미지에 들어가 버렸습니다. |
| 10 | `.dockerignore`(secret.txt) → 재빌드 → `ls` 에 `secret.txt` 없음 | .dockerignore에 파일 이름을 적으면 이미지에 복사하지 않습니다. |
| 11 | 요약 4개 | WORKDIR, COPY, .dockerignore로 프로그램을 이미지에 담습니다. |
| 12 | 다음 회차 예고 (8회차 컨테이너 네트워크) | 다음 시간에는 컨테이너끼리 대화하는 네트워크를 알아봅니다. |

## 재현
```bash
./commands.sh          # 실제 실행 + output/ 갱신 (Docker 데몬 필요, 끝나면 myapp 이미지와 ~/myapp 정리)
node build.js          # ep07.pptx, script.txt 생성 (tools/ 에서 npm install 선행)
../tools/export-png.sh ep07.pptx   # slides/*.png (1080x1920)
```
