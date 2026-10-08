# 13회차. 문제 해결과 청소 (목표 1분)

- 슬라이드 = 영상 한 컷(11컷). 슬라이드 자막은 영문 그대로, 슬라이드 노트에도 같은 대본
- `script.txt` = 나레이션용 대본 (영문은 한글 발음, 줄바꿈으로만 구분). `node build.js` 가 자동 생성
- 예상 길이: 낭독 약 63초 (기준: 36자 = 6.7초), 문장 사이 쉼 포함 약 66~68초
- 화면의 명령어/출력은 `commands.sh` 를 실제 실행한 결과(`output/*.txt`)
- 화면 표시용 편집: 긴 명령은 `\` 로 줄바꿈해 표시(실제 실행은 한 줄, build.js 가 일치 여부 검증), `docker ps`/`ps -a`/`system df` 는 일부 열 생략, 컨테이너/이미지 ID는 앞부분만
- `docker system df` 의 용량 값과 `Images` 개수는 PC마다 다름. 정리 전후의 **변화**(컨테이너 1→0, 이미지 -1)를 `build.js` 가 검증
- **정리 시연 선택:** `docker image prune`(이름 없는 이미지)은 제작 환경(containerd 이미지 저장소)에서 대상 이미지가 만들어지지 않아 시연 불가, `docker builder prune` 은 회수량이 매우 작고 출력이 수십 줄이라 제외. 대신 `container prune` + `docker rmi` 로 시연
- **`docker system prune`/`image prune -a` 는 실행하지 않음** (사용하지 않는 모든 것을 삭제하므로 학습자에게 주의만 안내)
- 오류 컨테이너: `python -c "import notamodule"` → `ModuleNotFoundError`, `Exited (1)`

| # | 화면영역 | 자막 |
|---|---|---|
| 1 | 시리즈 타이틀 + 회차 주제 | 이번 시간에는 컨테이너에 문제가 생겼을 때 원인을 찾고, 쓰지 않는 것을 정리하는 방법을 알아봅니다. |
| 2 | 오류 컨테이너 `docker run -d --name broken ...` + `docker ps`(비어 있음) | 일부러 오류가 나는 컨테이너를 실행합니다. docker ps에는 아무것도 보이지 않습니다. |
| 3 | `docker ps -a` (`Exited (1)` 강조) | -a 옵션을 붙이면 종료된 컨테이너가 보이고, 상태는 Exited (1)입니다. |
| 4 | `docker logs broken` (`ModuleNotFoundError` 강조) | docker logs로 보면 원인이 나옵니다. 없는 모듈을 불러오려다 종료됐습니다. |
| 5 | `docker inspect -f '{{.State.ExitCode}}' broken` → `1` | docker inspect로 종료 코드를 확인할 수 있습니다. 1은 오류로 끝났다는 뜻입니다. |
| 6 | `docker system df` (정리 전, Containers 1) | 정리 전에 docker system df로 도커가 차지한 공간을 확인합니다. |
| 7 | `docker container prune -f` (`Total reclaimed space`) | docker container prune은 종료된 컨테이너를 한 번에 지웁니다. -f는 확인 없이 실행합니다. |
| 8 | `docker rmi cache-demo` (`Untagged`) | 쓰지 않는 이미지는 docker rmi로 지웁니다. |
| 9 | `docker system df` (정리 후, Containers 0 / Images -1) | 다시 확인하면 줄어든 것을 볼 수 있습니다. |
| 10 | 요약 4개 + `※ prune 은 지우기 전에 꼭 확인` | ps -a, logs, inspect로 원인을 찾고, prune으로 정리합니다. prune은 꼭 확인 후 실행하세요. |
| 11 | 다음 회차 예고 (14회차 내 이미지 공유하기) | 다음 시간에는 내가 만든 이미지를 공유하는 방법을 알아봅니다. |

## 재현
```bash
./commands.sh          # 실제 실행 + output/ 갱신 (Docker 데몬, python:3.12-alpine 필요. 시작 시 종료된 컨테이너를 모두 정리함에 주의)
node build.js          # ep13.pptx, script.txt 생성 (tools/ 에서 npm install 선행)
../tools/export-png.sh ep13.pptx   # slides/*.png (1080x1920)
```
