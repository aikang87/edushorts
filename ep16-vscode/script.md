# 16회차. VSCode 설치 및 필수 확장 세팅 (Dev Containers 포함) (목표 1분)

- 슬라이드 = 영상 한 컷(11컷). 슬라이드 자막은 영문 그대로, 슬라이드 노트에도 같은 대본
- `script.txt` = 나레이션용 대본 (영문은 한글 발음, 줄바꿈으로만 구분). `node build.js` 가 자동 생성
- 예상 길이: 낭독 약 66초 (기준: 36자 = 6.7초), 문장 사이 쉼 포함 약 69~71초
- WSL(Ubuntu) 기준, 프롬프트는 `user@PC:~$`

## 검증 범위 (중요)

VSCode 는 Windows GUI 프로그램이고, 제작 환경(Linux 컨테이너)에서는 VSCode 다운로드/마켓플레이스(`code.visualstudio.com`, `marketplace.visualstudio.com`, `open-vsx.org`) 접속이 막혀 있어 **VSCode 를 설치하거나 실제 화면을 캡처하지 못함**.

| 슬라이드 | 내용 | 상태 |
|---|---|---|
| 2 | 설치 마법사 옵션 화면 | **일러스트** (슬라이드 노트에 표시). 실제 설치 화면과 모양/문구가 다를 수 있음 → 실제 화면으로 교체 권장 |
| 3 | 확장 탭 `WSL` 검색/`Install` | **일러스트** |
| 4 | `mkdir ~/dockerlab`, `cd ~/dockerlab`, `code .` | 표준 사용법 표시 (`code` 명령은 실행하지 못함) |
| 5 | 필수 확장 3개와 확장 ID | 확장 ID(`ms-azuretools.vscode-docker`, `ms-vscode-remote.remote-containers`, `redhat.vscode-yaml`)는 마켓플레이스에서 **조회하지 못해 미검증** (널리 알려진 ID). 설치 명령은 `code --install-extension <ID>` 형식 |
| 6 | Docker 확장 사이드바 | **일러스트** |
| 7 | `.devcontainer/devcontainer.json` 내용 | 파일은 **실제 JSON 유효성 검사 통과**(`python3 -m json.tool`). `cat` 표시는 표준 사용법 |
| 8 | 명령 팔레트 `Dev Containers: Reopen in Container` | **일러스트** (명령 이름은 Dev Containers 확장의 표준 명령) |
| 9 | `docker run --rm -v "$PWD":/workspaces/dockerlab -w /workspaces/dockerlab python:3.12-slim python hello.py` → `Hello from Dev Container!` | **실제 실행 확인**. Dev Containers 가 내부에서 하는 일(폴더 연결 + 컨테이너 실행)을 재현한 명령. 실제 Dev Containers 는 추가로 VSCode Server 를 컨테이너에 설치함 |

- 일러스트가 있는 슬라이드(2, 3, 6, 8)는 학습자 PC 에서 직접 캡처한 화면으로 교체하면 더 좋음 (같은 위치/크기: 화면영역 4.9" x 약 3.6")
- `build.js` 는 JSON 검사 결과와 `docker run` 명령/결과(`Hello from Dev Container!`)가 실제 출력과 일치하는지 검증
- 화면 표시용 편집: 긴 `docker run` 은 `\` 로 줄바꿈해 표시(실제 실행은 한 줄, build.js 가 일치 여부 검증)

| # | 화면영역 | 자막 |
|---|---|---|
| 1 | 시리즈 타이틀 + 회차 주제 | 이번 시간에는 VSCode를 설치하고 Docker용 필수 확장을 설정합니다. |
| 2 | (일러스트) 설치 마법사: `Add to PATH (requires shell restart)` 강조 | Windows에 VSCode를 설치합니다. 설치 옵션에서 Add to PATH가 선택됐는지 확인합니다. |
| 3 | (일러스트) 확장 탭: `WSL` 검색, `Install` 버튼 | 확장 탭에서 WSL 확장을 설치하면, WSL 안의 파일을 직접 열 수 있습니다. |
| 4 | `mkdir ~/dockerlab` / `cd ~/dockerlab` / `code .` | WSL 터미널에서 code . 명령을 실행하면, 현재 폴더가 VSCode로 열립니다. |
| 5 | 필수 확장 3개 + 확장 ID | 필수 확장은 Docker, Dev Containers, YAML입니다. 확장 탭이나 code --install-extension 명령으로 설치합니다. |
| 6 | (일러스트) Docker 사이드바(CONTAINERS, IMAGES, ...) | Docker 확장을 설치하면 컨테이너와 이미지를 볼 수 있는 화면이 생깁니다. |
| 7 | `cat .devcontainer/devcontainer.json` (`"image"` 강조) | Dev Containers는 컨테이너 안에서 VSCode를 엽니다. 설정 파일에 사용할 이미지를 적습니다. |
| 8 | (일러스트) 명령 팔레트: `Dev Containers: Reopen in Container` | 명령 팔레트에서 Reopen in Container를 선택하면, 컨테이너 안에서 열립니다. |
| 9 | `docker run --rm -v "$PWD":/workspaces/dockerlab ...` → `Hello from Dev Container!` | 내부에서는 우리가 배운 볼륨 연결로 내 폴더를 컨테이너에 연결합니다. |
| 10 | 요약 3개 | 확장 설치, code . 로 열기, 컨테이너에서 다시 열기만 기억하세요. |
| 11 | 다음 회차 예고 (17회차 Docker로 ML 개발환경 ①) | 다음 시간에는 Docker로 머신러닝 개발환경을 만들어 봅니다. |

## 재현
```bash
./commands.sh          # JSON 검사 + docker run 재현 (python:3.12-slim 필요). 끝나면 ~/dockerlab 정리
node build.js          # ep16.pptx, script.txt 생성 (tools/ 에서 npm install 선행)
../tools/export-png.sh ep16.pptx   # slides/*.png (1080x1920)
```
