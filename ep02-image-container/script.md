# 2회차. 이미지와 컨테이너 (약 1분)

- 슬라이드 = 영상 한 컷. 자막은 슬라이드 하단 자막영역과 동일, 슬라이드 노트에도 같은 대본이 있음
- 화면의 명령어/출력은 `commands.sh` 를 실제 실행한 결과(`output/*.txt`)에서 가져옴
- 화면 표시용 편집: `docker pull` 은 긴 진행 로그 중 일부만, `docker run` 의 컨테이너 ID는 앞부분만, `docker ps`/`docker images` 는 일부 열 생략

| # | 시간 | 화면영역 | 자막(나레이션) |
|---|---|---|---|
| 1 | 0:00-0:06 | 시리즈 타이틀 + 회차 주제 | 이번 시간에는 Docker의 핵심, 이미지와 컨테이너를 알아봅니다. |
| 2 | 0:06-0:14 | 이미지 → `docker run` → 컨테이너 도식 | 이미지는 실행에 필요한 모든 것을 담은 설계도, 컨테이너는 그 이미지를 실행한 것입니다. |
| 3 | 0:14-0:20 | `docker pull nginx:alpine` | docker pull 명령으로 Docker Hub에서 nginx 이미지를 내려받습니다. |
| 4 | 0:20-0:26 | pull 결과 (Status 줄 강조) | 마지막에 Downloaded 메시지가 나오면 내려받기가 끝난 것입니다. |
| 5 | 0:26-0:32 | `docker images` | docker images로 내려받은 이미지를 확인합니다. |
| 6 | 0:32-0:40 | `docker run -d --name web nginx:alpine` | docker run으로 이미지를 컨테이너로 실행합니다. -d는 백그라운드, --name은 이름입니다. |
| 7 | 0:40-0:46 | `docker ps` | docker ps로 실행 중인 컨테이너를 확인합니다. Up이면 실행 중입니다. |
| 8 | 0:46-0:52 | `docker run ... web2` + `docker ps` | 같은 이미지로 컨테이너를 여러 개 실행할 수도 있습니다. |
| 9 | 0:52-0:57 | 명령어 4개 요약 | pull로 받고, images로 확인하고, run으로 실행하고, ps로 확인합니다. |
| 10 | 0:57-1:00 | 다음 회차 예고 | 다음 시간에는 컨테이너를 켜고 끄는 방법을 알아봅니다. |

## 재현
```bash
./commands.sh          # 실제 실행 + output/ 갱신
node build.js          # ep02.pptx 생성 (tools/ 에서 npm install 선행)
../tools/export-png.sh ep02.pptx   # slides/*.png (1080x1920)
```
