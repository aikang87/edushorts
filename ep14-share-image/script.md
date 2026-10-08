# 14회차. 내 이미지 공유하기 (목표 1분)

- 슬라이드 = 영상 한 컷(10컷). 슬라이드 자막은 영문 그대로, 슬라이드 노트에도 같은 대본
- `script.txt` = 나레이션용 대본 (영문은 한글 발음, 줄바꿈으로만 구분). `node build.js` 가 자동 생성
- 예상 길이: 낭독 약 60초 (기준: 36자 = 6.7초), 문장 사이 쉼 포함 약 63~65초
- **검증 범위 (중요):** Docker Hub 계정/로그인이 필요한 `docker login` 과 Docker Hub 로의 `docker push` 는 제작 환경에서 **실행하지 않았음**. 같은 `tag → push → rmi → pull(run)` 과정을 이 컴퓨터에서 실행한 로컬 레지스트리(`registry:2`, `localhost:5000`)로 **실제 시연**. 8번 슬라이드(Docker Hub 안내)는 출력 없이 명령 형식만 보여주는 안내 화면
- Docker Hub 에서의 차이: ① `docker login` 선행 ② 이미지 이름 앞에 `localhost:5000` 대신 Docker Hub 아이디(`내아이디/hello:1.0`). 학습자 환경에서 `docker login` 이 요구하는 입력(아이디/비밀번호 또는 토큰)과 푸시 후 Docker Hub 웹 화면은 별도로 확인 필요
- 공유할 이미지는 6회차의 `hello`(alpine + echo/cat). `build.js` 는 `tag` 후 두 이름의 이미지 ID가 같은지, push 로그(`Pushed`, `digest`), 삭제 후 `Pulling from hello` + `Hello Dockerfile` 이 실제 출력에 있는지 검증
- 화면 표시용 편집: 긴 명령은 `\` 로 줄바꿈해 표시(`build.js` 가 일치 여부 검증), `docker images` 는 hello 관련 행/일부 열만, push/pull 진행 로그는 일부 줄만, ID/digest 는 앞부분만
- 이미지/컨테이너 ID, digest 값은 실행할 때마다(또는 PC마다) 다름

| # | 화면영역 | 자막 |
|---|---|---|
| 1 | 시리즈 타이틀 + 회차 주제 | 이번 시간에는 내가 만든 이미지를 레지스트리에 올려서 공유하는 방법을 알아봅니다. |
| 2 | 도식: 내 PC → push → 레지스트리(Docker Hub) → pull → 다른 PC | 레지스트리는 이미지를 보관하는 저장소입니다. Docker Hub가 가장 유명합니다. 올리면 다른 컴퓨터에서 내려받아 쓸 수 있습니다. |
| 3 | `docker run -d -p 5000:5000 --name registry registry:2` | 연습을 위해 내 컴퓨터에서 작은 레지스트리를 실행합니다. Docker Hub와 같은 역할입니다. |
| 4 | `docker tag hello localhost:5000/hello:1.0` + `docker images` (hello 행 2개, 같은 ID) | docker tag로 이미지에 레지스트리 주소와 버전 이름을 붙입니다. 이미지 ID는 같습니다. |
| 5 | `docker push localhost:5000/hello:1.0` (`Pushed`, `digest`) | docker push로 올립니다. 레이어가 하나씩 올라가고, 마지막에 digest가 표시됩니다. |
| 6 | `docker rmi hello localhost:5000/hello:1.0` | 내 컴퓨터의 이미지를 지워 보겠습니다. |
| 7 | `docker run --rm localhost:5000/hello:1.0` → `Pulling from hello` → `Hello Dockerfile` | 다시 실행하면, 이미지를 레지스트리에서 내려받아 실행합니다. |
| 8 | 안내: `docker login` / `docker tag hello 내아이디/hello:1.0` / `docker push 내아이디/hello:1.0` (실행하지 않음) | Docker Hub에 올릴 때는 docker login을 하고, 이미지 이름 앞에 내 ID를 붙이면 됩니다. |
| 9 | 요약 3개 | tag로 이름을 붙이고, push로 올리고, pull로 내려받습니다. |
| 10 | 다음 회차 예고 (15회차 이미지 다이어트) | 다음 시간에는 이미지 크기를 줄이는 멀티스테이지 빌드를 알아봅니다. |

## 재현
```bash
./commands.sh          # 실제 실행 + output/ 갱신 (Docker 데몬, registry:2, alpine 필요, 5000 포트 사용. 끝나면 정리)
node build.js          # ep14.pptx, script.txt 생성 (tools/ 에서 npm install 선행)
../tools/export-png.sh ep14.pptx   # slides/*.png (1080x1920)
```
