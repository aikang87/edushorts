# 2회차. 이미지와 컨테이너 (목표 1분)

- 슬라이드 = 영상 한 컷(12컷). 슬라이드 자막은 영문 그대로, 슬라이드 노트에도 같은 대본
- `script.txt` = 나레이션용 대본 (영문은 한글 발음, 줄바꿈으로만 구분)
- 예상 길이: 낭독 약 60초 (기준: 36자 = 6.7초), 문장 사이 쉼 포함 약 64~66초
- 화면의 명령어/출력은 `commands.sh` 를 실제 실행한 결과(`output/*.txt`)에서 가져옴
- 화면 표시용 편집: `docker pull` 은 긴 진행 로그 중 일부만, `docker run` 의 컨테이너 ID는 앞부분만, `docker ps`/`docker images` 는 일부 열 생략

| # | 화면영역 | 자막 |
|---|---|---|
| 1 | 시리즈 타이틀 + 회차 주제 | 이번 시간에는 Docker의 핵심, 이미지와 컨테이너를 알아봅니다. |
| 2 | 이미지 → `docker run` → 컨테이너 도식 | 이미지는 실행에 필요한 모든 것을 담은 설계도, 컨테이너는 그 이미지를 실행한 것입니다. |
| 3 | 이미지 하나 → 내 PC / 서버 / 친구 PC 컨테이너 | 이미지는 한 번 만들어 두면 어디서든 똑같이 실행할 수 있습니다. |
| 4 | `docker pull nginx:alpine` | docker pull 명령으로 Docker Hub에서 nginx 이미지를 내려받습니다. |
| 5 | pull 결과 (Status 줄 강조) | 마지막에 Downloaded 메시지가 나오면 내려받기가 끝난 것입니다. |
| 6 | `docker images` | docker images로 내려받은 이미지를 확인합니다. |
| 7 | `docker run -d --name web nginx:alpine` | docker run으로 이미지를 컨테이너로 실행합니다. -d는 백그라운드, --name은 이름입니다. |
| 8 | `docker ps` (행 강조) | docker ps로 실행 중인 컨테이너를 확인합니다. Up이면 실행 중입니다. |
| 9 | `docker ps` (NAMES 열 강조) | NAMES 열에서 컨테이너 이름을 확인할 수 있습니다. |
| 10 | `docker run ... web2` + `docker ps` | 같은 이미지로 컨테이너를 여러 개 실행할 수도 있습니다. |
| 11 | 명령어 4개 요약 | pull로 받고, images로 확인하고, run으로 실행하고, ps로 확인합니다. |
| 12 | 다음 회차 예고 | 다음 시간에는 컨테이너를 켜고 끄는 방법을 알아봅니다. |

## 재현
```bash
./commands.sh          # 실제 실행 + output/ 갱신
node build.js          # ep02.pptx 생성 (tools/ 에서 npm install 선행)
../tools/export-png.sh ep02.pptx   # slides/*.png (1080x1920)
```
