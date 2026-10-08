# 3회차. 컨테이너 켜고 끄기 (목표 1분)

- 슬라이드 = 영상 한 컷(11컷). 슬라이드 자막은 영문 그대로, 슬라이드 노트에도 같은 대본
- `script.txt` = 나레이션용 대본 (영문은 한글 발음, 줄바꿈으로만 구분). `node build.js` 가 자동 생성
- 예상 길이: 낭독 약 61초 (기준: 36자 = 6.7초), 문장 사이 쉼 포함 약 64~66초
- 화면의 명령어/출력은 `commands.sh` 를 실제 실행한 결과(`output/*.txt`)에서 가져옴
- 화면 표시용 편집: `docker ps`/`docker ps -a` 는 일부 열 생략, `docker run` 의 컨테이너 ID는 앞부분만, `docker logs` 는 긴 로그 일부만
- 컨테이너 ID 앞 4글자는 실행할 때마다 달라짐 (스크립트가 그때그때 추출)

| # | 화면영역 | 자막 |
|---|---|---|
| 1 | 시리즈 타이틀 + 회차 주제 | 이번 시간에는 컨테이너를 켜고 끄는 방법을 알아봅니다. |
| 2 | 수명주기 도식 (실행 중 ⇄ 정지 → 삭제) | 컨테이너는 실행 중, 정지, 삭제 상태를 오가며 살아갑니다. 이것을 수명주기라고 합니다. |
| 3 | `docker run -d --name web nginx:alpine` | 먼저 docker run으로 컨테이너를 백그라운드에서 실행합니다. |
| 4 | `docker ps` (Up 행 강조) | docker ps로 보면 Up, 즉 실행 중인 상태입니다. |
| 5 | `docker stop web` | docker stop 뒤에 이름을 적어 컨테이너를 정지합니다. |
| 6 | `docker ps` (빈 목록) → `docker ps -a` (Exited) | 정지된 컨테이너는 docker ps에 보이지 않습니다. -a 옵션을 붙이면 Exited 상태로 보입니다. |
| 7 | `docker start web` + `docker ps` | docker start로 정지된 컨테이너를 다시 시작합니다. |
| 8 | `docker logs web` | docker logs로 컨테이너가 남긴 로그를 확인합니다. 문제가 생겼을 때 가장 먼저 확인하는 곳입니다. |
| 9 | `docker stop <ID4>` → `docker rm <ID4>` → `docker ps -a` | 필요 없어지면 stop으로 멈춘 뒤 docker rm으로 삭제합니다. 이름 대신 컨테이너 ID 앞부분만 적어도 됩니다. |
| 10 | 명령어 5개 요약 | stop으로 멈추고, start로 다시 켜고, logs로 기록을 보고, rm으로 삭제합니다. |
| 11 | 다음 회차 예고 (4회차 웹서버 띄우기) | 다음 시간에는 컨테이너에 포트를 연결해 웹서버를 열어봅니다. |

## 재현
```bash
./commands.sh          # 실제 실행 + output/ 갱신 (Docker 데몬 필요, 2회차에서 받은 nginx:alpine 사용)
node build.js          # ep03.pptx, script.txt 생성 (tools/ 에서 npm install 선행)
../tools/export-png.sh ep03.pptx   # slides/*.png (1080x1920)
```
