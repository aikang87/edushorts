# 5회차. 데이터 지키기: 볼륨 (목표 1분)

- 슬라이드 = 영상 한 컷(13컷). 슬라이드 자막은 영문 그대로, 슬라이드 노트에도 같은 대본
- `script.txt` = 나레이션용 대본 (영문은 한글 발음, 줄바꿈으로만 구분). `node build.js` 가 자동 생성
- 예상 길이: 낭독 약 67초 (기준: 36자 = 6.7초), 문장 사이 쉼 포함 약 71~73초
- 화면의 명령어/출력은 `commands.sh` 를 실제 실행한 결과(`output/*.txt`), 브라우저 화면은 실제 Chromium 캡처(`output/browser1.png`, `browser2.png`)
- 화면 표시용 편집: 긴 명령은 `\` 로 줄바꿈해 표시(실제 실행은 한 줄, build.js 가 실행한 명령과 일치하는지 검증), 긴 오류 메시지는 터미널처럼 줄바꿈, 컨테이너 ID는 앞부분만
- 홈 디렉터리는 `~` 로 표시 (WSL 사용자 홈 기준). `docker run -v ~/site:...` 는 WSL(리눅스 파일시스템) 경로 기준
- 줄이는 과정: 처음 대본은 낭독 81초라 문장을 압축해 67초로 맞춤 (내용 변경 없음)

| # | 화면영역 | 자막 |
|---|---|---|
| 1 | 시리즈 타이틀 + 회차 주제 | 이번 시간에는 컨테이너가 지워져도 데이터를 지키는 볼륨을 알아봅니다. |
| 2 | 도식: 볼륨 없이(삭제 시 데이터 사라짐) vs 볼륨 연결(데이터 유지) | 컨테이너를 삭제하면 데이터도 사라집니다. 그래서 데이터는 밖에 저장합니다. |
| 3 | `docker volume create mydata` + `docker volume ls` | docker volume create로 볼륨을 만들고, docker volume ls로 목록을 확인합니다. |
| 4 | `docker run --rm -v mydata:/data nginx:alpine sh -c 'echo hello > /data/hello.txt'` (`-v` 강조) | -v 옵션으로 볼륨을 컨테이너의 data 폴더에 연결하고 파일을 만듭니다. 콜론 앞은 볼륨, 뒤는 컨테이너 경로입니다. |
| 5 | 새 컨테이너 `cat /data/hello.txt` → `hello` | 새 컨테이너에 같은 볼륨을 연결하면 파일이 그대로 남아 있습니다. |
| 6 | 볼륨 없이 `cat` → `No such file or directory` | 볼륨을 연결하지 않으면 파일은 컨테이너와 함께 사라집니다. |
| 7 | `mkdir ~/site` + `echo "<h1>Hi Docker</h1>" > ~/site/index.html` | 내 컴퓨터의 폴더를 직접 연결할 수도 있습니다. 이것을 바인드 마운트라고 합니다. |
| 8 | `docker run -d --name web -p 8080:80 -v ~/site:/usr/share/nginx/html nginx:alpine` | -v 뒤에 내 폴더 경로를 적으면 컨테이너 안에 연결됩니다. |
| 9 | 브라우저 `localhost:8080` → Hi Docker (실제 캡처) | 브라우저에서 접속하면 방금 만든 웹페이지가 보입니다. |
| 10 | `echo "<h1>Hello Volume</h1>" > ~/site/index.html` | 파일을 수정합니다. |
| 11 | 브라우저 → Hello Volume (컨테이너 재생성 없이 반영, 실제 캡처) | 컨테이너를 다시 만들지 않아도 화면에 바로 반영됩니다. |
| 12 | 요약 3개 | 오래 보관할 데이터는 볼륨, 내 폴더를 연결할 때는 바인드 마운트입니다. |
| 13 | 다음 회차 예고 (6회차 내 첫 Dockerfile) | 다음 시간에는 나만의 이미지를 만드는 Dockerfile을 알아봅니다. |

## 재현
```bash
./commands.sh          # 실제 실행 + output/ 갱신 (Docker 데몬, nginx:alpine, 8080 포트 필요. 끝나면 컨테이너/볼륨/~/site 정리)
node build.js          # ep05.pptx, script.txt 생성 (tools/ 에서 npm install 선행)
../tools/export-png.sh ep05.pptx   # slides/*.png (1080x1920)
```
