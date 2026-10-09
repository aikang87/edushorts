# Docker 교육 쇼츠 (VSCode와 Docker로 만드는 생성형AI)

과정 개요(필요성, 특성, 학습 목표): [COURSE_OVERVIEW.md](COURSE_OVERVIEW.md)

1분 쇼츠 20회차. 슬라이드(PPT) 한 장 = 영상 한 컷. 슬라이드를 이미지로 내보내 영상 편집에 사용합니다.
기준 환경: Windows + WSL(Ubuntu), GPU 없음(GPU 환경은 추가 설명만), 대상은 완전 초보자.

## 회차 구성

| # | 주제 | 폴더 | 상태 |
|---|---|---|---|
| 1 | Docker 설치와 첫 실행 | `ep01-docker-install` | 제작 완료 (Windows 설치 화면은 일러스트, 설치 확인/hello-world 는 실제 실행) |
| 2 | 이미지와 컨테이너 | `ep02-image-container` | 제작 완료 |
| 3 | 컨테이너 켜고 끄기 | `ep03-container-lifecycle` | 제작 완료 |
| 4 | 웹서버 띄우기: 포트와 환경변수 | `ep04-web-server` | 제작 완료 |
| 5 | 데이터 지키기: 볼륨 | `ep05-volume` | 제작 완료 |
| 6 | 내 첫 Dockerfile | `ep06-first-dockerfile` | 제작 완료 |
| 7 | Dockerfile 실전 | `ep07-dockerfile-practice` | 제작 완료 |
| 8 | 컨테이너끼리 대화하기: 네트워크 | `ep08-network` | 제작 완료 |
| 9 | Docker Compose 입문 | `ep09-compose-intro` | 제작 완료 |
| 10 | Compose로 웹 + DB | `ep10-compose-web-db` | 제작 완료 |
| 11 | Compose 설정 다듬기 | `ep11-compose-config` | 제작 완료 |
| 12 | Compose 실전 팁 | `ep12-compose-tips` | 제작 완료 |
| 13 | 문제 해결과 청소 | `ep13-troubleshoot-cleanup` | 제작 완료 |
| 14 | 내 이미지 공유하기 | `ep14-share-image` | 제작 완료 (Docker Hub 로그인/푸시는 미검증, 로컬 레지스트리로 시연) |
| 15 | 이미지 다이어트: 멀티스테이지 | `ep15-multistage` | 제작 완료 |
| 16 | VSCode 설치 및 필수 확장 세팅 | `ep16-vscode` | 제작 완료 (VSCode 화면 일러스트 포함, 문서 참고) |
| 17 | Docker로 ML 개발환경 ① | `ep17-ml-env-1` | 제작 완료 |
| 18 | Docker로 ML 개발환경 ② | `ep18-ml-env-2` | 제작 완료 |
| 19 | Ollama 명령어 | `ep19-ollama-cli` | 제작 완료 (모델은 ollama pull 대신 GGUF 를 create 로 등록) |
| 20 | 내 앱에 LLM 연결 (Compose + Ollama API) | `ep20-llm-app` | 제작 완료 (19회차와 같은 모델 준비 방식) |

## 회차 폴더 구성

각 회차 폴더: `commands.sh`(실제 실행 + `output/` 저장), `build.js`(PPT 생성), `ep??.pptx`, `slides/*.png`(1080x1920), `script.txt`(나레이션, 줄바꿈 구분), `script.md`(컷 구성, 검증 범위, 표시용 편집 내역).

```bash
cd tools && npm install            # 최초 1회 (pptxgenjs)
cd ep02-image-container
./commands.sh                      # Docker 데몬에서 실제 실행하고 출력 저장
node build.js                      # PPT + script.txt 생성 (실제 출력이 자막/표시와 어긋나면 에러)
../tools/export-png.sh ep02.pptx   # 슬라이드 PNG 내보내기
```

## 제작 규칙

- 슬라이드: 첫 장은 시리즈 타이틀 고정 + 화면영역에 회차 주제, 이후 장은 타이틀을 회차 주제로 교체. 폰트 HY견고딕(타이틀) / 맑은 고딕(자막) / Courier New(터미널)
- 자막: 슬라이드 속 자막은 영문 그대로, 나레이션 대본(`script.txt`)은 영문을 한글 발음으로, 시간 구분 없이 줄바꿈으로만 구분
- 길이: 낭독 기준 약 60초 이상(36자 ≈ 6.7초 기준으로 추정). 부족하면 문장 추가, 조금 넘는 것은 허용
- 화면의 명령어와 출력은 모두 실제 실행한 결과. 긴 줄/로그를 줄인 경우 `script.md` 에 편집 내역을 기록
- 프롬프트는 WSL 기준 `user@PC:~$` 표기, 홈 경로는 `~`

## 제작 환경 제약 (검증 범위에 영향)

- 빌드 컨테이너 DNS 차단: `RUN apk add` 등은 그대로는 검증 불가. `RUN pip install` 은 `tools/verify-base.sh`(프록시 CA 가 든 로컬 기반 이미지) + `docker build --network host` 로 검증 (17회차, 문서 참고). 표준 라이브러리/네트워크 불필요 예제는 그대로 검증
- Docker Hub 익명 요청 제한(100회/시간, 429)이 간헐적으로 발생(공용 IP 라 다른 사용 때문에도 소진됨) → 각 `commands.sh` 가 재시도. 가능하면 이미지를 미리 받아 두고 불필요한 build/pull 반복을 피할 것. 소진이 길어지면 데몬에 Docker Hub 공개 미러(`/etc/docker/daemon.json` 의 `registry-mirrors: ["https://mirror.gcr.io"]`)를 설정해 같은 명령/출력으로 받을 수 있음 (1회차 검증에 사용)
- `ollama.com`, `registry.ollama.ai`, `huggingface.co`, VSCode 다운로드/마켓플레이스 접속 차단 → `ollama pull` 실행 불가(19~20회차는 Docker Hub 의 `ai/smollm2` GGUF 를 `ollama create` 로 등록해 검증), VSCode 실제 화면 캡처 불가(16회차 일러스트)
- 회차 폴더의 `script.md` 에 각 회차의 검증 범위와 표시용 편집 내역이 있음
- 20회차는 원래 ComfyUI 계획이었으나 폐기하고 LLM(Ollama) 내용으로 변경
