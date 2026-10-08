# 15회차. 이미지 다이어트: 멀티스테이지 빌드 (목표 1분)

- 슬라이드 = 영상 한 컷(10컷). 슬라이드 자막은 영문 그대로, 슬라이드 노트에도 같은 대본
- `script.txt` = 나레이션용 대본 (영문은 한글 발음, 줄바꿈으로만 구분). `node build.js` 가 자동 생성
- 예상 길이: 낭독 약 61초 (기준: 36자 = 6.7초), 문장 사이 쉼 포함 약 64~66초
- 화면의 명령어/출력은 `commands.sh` 를 실제 실행한 결과(`output/*.txt`), 화면의 `main.go`/`Dockerfile.single`/`Dockerfile` 은 실제 빌드에 쓴 파일(`output/`)
- **예제 구성:** 외부 패키지가 필요 없는 Go 프로그램(`golang:1.22-alpine`로 컴파일 → `alpine` 에 실행 파일만 복사). 제작 환경은 빌드 중 네트워크가 막혀 있어 `pip install` 류는 검증 불가 — Go 표준 라이브러리 예제는 네트워크 없이 빌드됨
- **크기 숫자:** 한 단계 빌드 `hello-single` **387MB**, 멀티스테이지 `hello-multi` **16MB** (`docker images` 의 DISK USAGE 열, 제작 환경 Docker 29.x 기준). 학습자 환경에서는 Docker/이미지 버전·표시 방식(`SIZE` 열 등)에 따라 값이 다를 수 있음. `build.js` 가 자막의 숫자(387MB → 16MB)가 실제 출력과 일치하는지 검증하며, 값이 바뀌면 빌드가 중단되므로 자막을 수정해야 함
- 화면 표시용 편집: 긴 `docker build` 는 `\` 로 줄바꿈해 표시(실제 실행은 한 줄, build.js 가 일치 여부 검증), 빌드 로그는 핵심 줄만, `docker images` 는 hello 이미지 행과 일부 열만, Go 소스의 탭은 공백 4칸으로, 멀티스테이지 Dockerfile 의 빈 줄은 생략
- 첫 빌드에서는 `golang:1.22-alpine`(약 349MB) 내려받기로 시간이 오래 걸리고 로그가 길어짐 (제작 환경은 이미 받아둔 상태)
- 마지막 슬라이드는 16회차(기존 VSCode 콘텐츠) 예고

| # | 화면영역 | 자막 |
|---|---|---|
| 1 | 시리즈 타이틀 + 회차 주제 | 이번 시간에는 이미지 크기를 크게 줄이는 멀티스테이지 빌드를 알아봅니다. |
| 2 | 도식: 빌드 단계(golang, 큼) → 결과물 hello 만 복사 → 실행 단계(alpine, 작음) | 프로그램을 만들 때는 컴파일러가 필요하지만, 실행할 때는 결과물 하나면 충분합니다. |
| 3 | `cat main.go` | 간단한 Go 프로그램입니다. 컴파일하면 실행 파일 하나가 만들어집니다. |
| 4 | `cat Dockerfile.single` (`FROM golang:1.22-alpine` 강조) | 먼저 한 단계로 만든 Dockerfile입니다. 컴파일러가 들어 있는 이미지에서 그대로 실행합니다. |
| 5 | `docker build -f Dockerfile.single -t hello-single .` 핵심 로그 (`RUN go build` 강조) | build하면 컴파일러까지 이미지에 그대로 남습니다. 실행에는 필요 없는 것들입니다. |
| 6 | `cat Dockerfile` (`FROM` 2개, `COPY --from=build` 강조) | 멀티스테이지는 FROM을 두 번 씁니다. 첫 단계에서 컴파일하고, COPY --from으로 결과물만 가져옵니다. |
| 7 | `docker build -t hello-multi .` 핵심 로그 + `docker run --rm hello-multi` → `Hello from Go!` | build하고 실행하면 결과는 똑같습니다. |
| 8 | `docker images` (hello-multi 16MB / hello-single 387MB 강조) | 크기를 비교하면 387MB가 16MB로 줄었습니다. 작은 이미지는 올리고 내려받는 시간도 줄어듭니다. |
| 9 | 요약 3개 | 빌드 단계와 실행 단계를 나누면, 실행 이미지는 작고 안전해집니다. |
| 10 | 다음 회차 예고 (16회차 VSCode 설치와 확장) | 다음 시간에는 Docker를 편하게 쓰는 VSCode를 알아봅니다. |

## 재현
```bash
./commands.sh          # 실제 실행 + output/ 갱신 (Docker 데몬, golang:1.22-alpine, alpine 필요. 끝나면 hello-* 이미지와 ~/gohello 정리)
node build.js          # ep15.pptx, script.txt 생성 (tools/ 에서 npm install 선행)
../tools/export-png.sh ep15.pptx   # slides/*.png (1080x1920)
```
