# 6회차. 내 첫 Dockerfile (목표 1분)

- 슬라이드 = 영상 한 컷(11컷). 슬라이드 자막은 영문 그대로, 슬라이드 노트에도 같은 대본
- `script.txt` = 나레이션용 대본 (영문은 한글 발음, 줄바꿈으로만 구분). `node build.js` 가 자동 생성
- 예상 길이: 낭독 약 60초 (기준: 36자 = 6.7초), 문장 사이 쉼 포함 약 64~66초
- 화면의 명령어/출력은 `commands.sh` 를 실제 실행한 결과(`output/*.txt`), 화면의 Dockerfile 내용은 실제 빌드에 쓴 `output/Dockerfile`
- 화면 표시용 편집: 긴 `docker build` 로그는 핵심 3줄만 표시(`...` 로 생략), `docker images hello` 는 일부 열 생략
- `cd ~/hello` 는 화면 표시용 단계이며, 스크립트는 같은 효과로 `~/hello` 안에서 명령을 실행
- **예제 선택 이유:** 빌드 중 `apk add`/`pip install` 같은 네트워크 설치는 제작 환경(빌드 컨테이너 DNS 차단)에서 실행 검증이 불가능해, 네트워크가 필요 없는 `RUN echo ... > /hello.txt` + `CMD ["cat", "/hello.txt"]` 로 RUN(빌드 때)/CMD(실행 때) 차이를 보여줌. 패키지 설치 예제는 7회차 이후 학습자 환경 기준으로 따로 검증 필요
- 첫 빌드 시 alpine 을 내려받는 로그가 더 나올 수 있음 (제작 환경은 이미 받아둔 상태라 `CACHED`)

| # | 화면영역 | 자막 |
|---|---|---|
| 1 | 시리즈 타이틀 + 회차 주제 | 이번 시간에는 나만의 이미지를 만드는 Dockerfile을 알아봅니다. |
| 2 | 도식: Dockerfile → build → 이미지 → run → 컨테이너 | Dockerfile은 이미지를 만드는 순서를 적은 설명서입니다. 이 파일로 build하면 이미지가 만들어집니다. |
| 3 | `mkdir ~/hello`, `cd ~/hello`, `cat > Dockerfile <<'EOF' ... EOF` | 먼저 폴더를 만들고, 그 안에 Dockerfile이라는 이름의 파일을 만듭니다. |
| 4 | `cat Dockerfile` (`FROM alpine` 강조) | 첫 줄 FROM은 어떤 이미지에서 시작할지 정합니다. 여기서는 alpine을 사용합니다. |
| 5 | `cat Dockerfile` (`RUN echo ...` 강조) | RUN은 이미지를 만드는 동안 실행할 명령입니다. 여기서는 파일 하나를 만듭니다. |
| 6 | `cat Dockerfile` (`CMD [...]` 강조) | CMD는 컨테이너가 시작될 때 실행할 명령입니다. 만들어 둔 파일을 출력합니다. |
| 7 | `docker build -t hello .` (핵심 로그 3줄, RUN 단계 강조) | docker build로 이미지를 만듭니다. -t 옵션은 이미지 이름이고, 마지막 점은 현재 폴더입니다. |
| 8 | `docker images hello` | docker images로 보면 방금 만든 hello 이미지가 보입니다. |
| 9 | `docker run --rm hello` → `Hello Dockerfile` | docker run으로 실행하면 CMD에 적어 둔 명령이 실행됩니다. |
| 10 | 요약 4개 (FROM / RUN / CMD / docker build -t) | FROM, RUN, CMD로 이미지를 설계하고, docker build로 만듭니다. |
| 11 | 다음 회차 예고 (7회차 Dockerfile 실전) | 다음 시간에는 내 파일을 이미지에 넣는 방법을 알아봅니다. |

## 재현
```bash
./commands.sh          # 실제 실행 + output/ 갱신 (Docker 데몬 필요, 끝나면 hello 이미지와 ~/hello 정리)
node build.js          # ep06.pptx, script.txt 생성 (tools/ 에서 npm install 선행)
../tools/export-png.sh ep06.pptx   # slides/*.png (1080x1920)
```
