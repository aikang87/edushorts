# 1회차. Docker 설치와 첫 실행 (목표 1분)

- 슬라이드 = 영상 한 컷(11컷). 슬라이드 자막은 영문 그대로, 슬라이드 노트에도 같은 대본
- `script.txt` = 나레이션용 대본 (영문은 한글 발음, 줄바꿈으로만 구분). `node build.js` 가 자동 생성
- 예상 길이: 낭독 약 62초 (기준: 36자 = 6.7초), 문장 사이 쉼 포함 약 65~67초
- Windows + WSL(Ubuntu) 기준, 프롬프트는 `user@PC:~$`

## 검증 범위 (중요)

설치는 Windows GUI 작업이고 제작 환경은 Linux 컨테이너라 **Windows 설치 과정은 실행하지 못함**.

| 슬라이드 | 내용 | 상태 |
|---|---|---|
| 2 | 가상머신 vs 컨테이너 개념 도식 | 개념 도식 (일반적인 설명) |
| 3 | PowerShell: `wsl --install` | **미검증, 표준 사용법 표시** (관리자 PowerShell 에서 실행, 설치 후 재부팅 필요) |
| 4 | Docker Desktop 설치 마법사 옵션 화면 (`Use WSL 2 instead of Hyper-V (recommended)`) | **일러스트** (슬라이드 노트에 표시). 실제 설치 화면과 문구/모양이 다를 수 있음 → 실제 화면으로 교체 권장 |
| 5 | Docker Desktop 설정: WSL integration 토글 | **일러스트**. 메뉴 이름/위치는 Docker Desktop 버전에 따라 다를 수 있음 → 실제 화면으로 교체 권장 |
| 6 | `docker --version` → `Docker version 29.8.2` | **실제 실행 확인** (build 해시는 화면에서 생략, 버전은 PC마다 다름) |
| 7 | `docker compose version` → `Docker Compose version v5.6.0` | **실제 실행 확인** (버전은 PC마다 다름) |
| 8 | `docker run hello-world` (첫 실행: 이미지 내려받기 + 환영 메시지) | **실제 실행 확인** (긴 출력 중 핵심 줄만 표시) |
| 9 | hello-world 가 설명하는 4단계 | 실제 출력의 설명 내용(`To generate this message, Docker took the following steps`)을 정리 |

- 6~8번은 제작 환경(Linux 의 Docker Engine, WSL 이 아님)에서 실행한 결과. WSL 의 Docker Desktop 연동 환경에서도 같은 명령/출력 형식이지만 버전 문자열(`Docker version ...`)은 다름
- 일러스트가 있는 슬라이드(4, 5)는 학습자 PC 에서 직접 캡처한 화면으로 교체하면 더 좋음 (같은 위치/크기: 화면영역 4.9" x 약 3.6")
- `build.js` 는 버전 출력 형식과 hello-world 의 핵심 줄(`Unable to find image`, `Pulling from library/hello-world`, `Hello from Docker!` 등)이 실제 출력에 있는지 검증

## 제작 환경 메모

- Docker Hub 익명 요청 제한(429)이 소진돼 `hello-world` 를 받지 못해서, 제작 환경의 Docker 데몬에 **Docker Hub 공개 미러**(`/etc/docker/daemon.json` 의 `registry-mirrors: ["https://mirror.gcr.io"]`)를 설정하고 같은 명령(`docker run hello-world`)으로 실행. 출력 형식은 Hub 에서 직접 받을 때와 동일(미러는 Hub 이미지를 그대로 제공). 학습자 환경에는 필요 없음
- 스크립트는 첫 실행 상태(이미지 없음)를 재현하기 위해 시작 전에 `hello-world` 컨테이너/이미지를 삭제하고, 끝나면 다시 정리

| # | 화면영역 | 자막 |
|---|---|---|
| 1 | 시리즈 타이틀 + 회차 주제 | 이번 시간에는 Docker를 설치하고, 첫 컨테이너를 실행해 봅니다. |
| 2 | 도식: 가상머신(앱+게스트 OS) vs 컨테이너(앱 + Docker) | Docker는 프로그램을 컨테이너라는 상자에 담아, 어디서든 똑같이 실행하게 해 줍니다. |
| 3 | PowerShell: `wsl --install` | Windows에서는 먼저 WSL을 설치합니다. PowerShell에서 한 줄이면 됩니다. |
| 4 | (일러스트) Docker Desktop 설치 옵션: `Use WSL 2 instead of Hyper-V` 강조 | 그다음 Docker Desktop을 설치합니다. 설치 옵션에서 WSL 2 사용을 선택합니다. |
| 5 | (일러스트) 설정 > WSL integration: Ubuntu 토글 강조 | 설정에서 WSL 연동을 켜면, Ubuntu 터미널에서도 docker를 쓸 수 있습니다. |
| 6 | `docker --version` | Ubuntu 터미널에서 docker --version으로 버전을 확인합니다. |
| 7 | `docker compose version` | Docker Compose도 함께 설치되어 있습니다. |
| 8 | `docker run hello-world` (`Hello from Docker!` 강조) | 이제 docker run hello-world로 첫 컨테이너를 실행합니다. 처음에는 이미지를 먼저 내려받아서 시간이 조금 걸립니다. 환영 메시지가 나오면 성공입니다. |
| 9 | 4단계 도식 (요청 → 내려받기 → 컨테이너 실행 → 출력) | Docker는 이미지를 내려받아 컨테이너를 만들고, 그 결과를 화면에 보여 줍니다. |
| 10 | 요약 3개 | 버전 확인과 hello-world 실행, 이 두 가지로 설치를 확인합니다. |
| 11 | 다음 회차 예고 (2회차 이미지와 컨테이너) | 다음 시간에는 이미지와 컨테이너를 알아봅니다. |

## 재현
```bash
./commands.sh          # 설치 확인 명령 + hello-world 실행 + output/ 갱신 (Docker 데몬 필요, 첫 실행 상태 재현을 위해 hello-world 컨테이너/이미지를 지우고 시작)
node build.js          # ep01.pptx, script.txt 생성 (tools/ 에서 npm install 선행)
../tools/export-png.sh ep01.pptx   # slides/*.png (1080x1920)
```
