# 18회차. Docker로 ML 개발환경 ② (목표 1분)

- 슬라이드 = 영상 한 컷(12컷). 슬라이드 자막은 영문 그대로, 슬라이드 노트에도 같은 대본
- `script.txt` = 나레이션용 대본 (영문은 한글 발음, 줄바꿈으로만 구분). `node build.js` 가 자동 생성
- 예상 길이: 낭독 약 62초 (기준: 36자 = 6.7초), 문장 사이 쉼 포함 약 66~68초
- 17회차(Dockerfile + pip + JupyterLab)를 이어서, 같은 환경을 **requirements.txt(버전 고정) + Compose + .env** 로 더 편하게 관리하고 학습한 모델을 내 폴더에 저장 (`~/mlenv2`)
- 화면의 명령어/출력은 `commands.sh` 를 실제 실행한 결과(`output/*.txt`), 화면의 `requirements.txt`/`Dockerfile`/`compose.yaml`/`.env`/`train.py` 는 실제 실행에 쓴 파일(`output/`), 브라우저 화면은 실제 Chromium 캡처(저장한 모델을 불러와 `array([0])` 예측하는 JupyterLab)
- 이 회차는 17·4·5·7·9·11·12회차 내용(포트, 볼륨, 캐시를 고려한 COPY 순서, Compose, `.env`, `restart`, `mem_limit`)을 ML 환경에 적용

## 제작 환경 우회 (학습자와 다른 점, 영상/슬라이드에는 나오지 않음)

제작 환경의 빌드 컨테이너는 외부 네트워크가 막혀 있어 `RUN pip install` 이 그대로는 실패함. `docker compose build` 단계에서만:
1. `tools/verify-base.sh python:3.12-slim` — 프록시 CA 인증서를 넣은 로컬 기반 이미지 (17회차와 동일)
2. 임시 override 파일(`services.lab.build.network: host`)을 `-f compose.yaml -f override.yaml` 로 얹어 빌드 (`--no-cache`: 학습자의 첫 빌드와 같은 로그)

화면의 `compose.yaml`, `Dockerfile` 과 명령(`docker compose build`, `docker compose up -d`)은 학습자용 그대로이며, 인터넷이 되는 PC 에서는 이 우회가 필요 없음.

## 알아둘 점
- `requirements.txt` 의 버전(numpy 2.5.3, pandas 3.0.6, scikit-learn 1.9.1, joblib 1.6.0, jupyterlab 4.6.4)은 17회차 실행 시점에 설치된 실제 버전. 시간이 지나 이 버전이 없거나 다른 환경에서는 다를 수 있음 → 학습자 환경에서는 `pip freeze` 로 확인한 버전 사용 권장
- `JUPYTER_TOKEN` 환경변수로 token 을 고정(`.env` 의 `LAB_TOKEN=mlpass` 는 실습용 예시 값). 실제 사용 시에는 추측하기 어려운 값으로 바꿔야 함
- `.:/work` 볼륨: 프로젝트 폴더 전체를 컨테이너의 `/work` 에 연결 → `models/iris.joblib` 가 내 폴더에 생김. 컨테이너가 root 로 쓰므로 일부 환경(WSL 등)에서 파일 소유자가 root 일 수 있음
- `docker compose run --rm lab python train.py`: `lab` 서비스의 이미지로 `CMD`(JupyterLab) 대신 학습 코드만 실행하는 일회성 컨테이너. 스크립트 캡처용 `-T`(비 TTY) 옵션과 `Container ... Creating/Created` 로그는 화면에서 생략
- `docker compose down` 후에도 `models/iris.joblib` 가 남는 것을 실제로 확인(슬라이드 10)
- 화면 표시용 편집: 긴 명령은 `\` 로 줄바꿈해 표시(실제 실행은 한 줄, build.js 가 일치 여부 검증), `docker compose build` 는 핵심 줄/일부 패키지만, `compose.yaml` 은 일부만(생략 줄 `...`), `down` 은 `Removed` 줄만
- 설치에는 제작 환경에서 약 2~3분 소요
- 마지막 슬라이드는 19회차(Ollama 명령어) 예고
- `build.js` 는 `accuracy: 0.xxx` 형식, `ls models` 결과(`iris.joblib`), `down` 후에도 파일이 남는지, 설치된 패키지 버전이 로그에 있는지 검증

| # | 화면영역 | 자막 |
|---|---|---|
| 1 | 시리즈 타이틀 + 회차 주제 | 이번 시간에는 머신러닝 개발환경을 Compose로 더 편하게 만듭니다. |
| 2 | 카드 3개: `requirements.txt` / `compose.yaml` / `.env` | 세 개의 파일로 환경을 정리합니다. |
| 3 | `cat requirements.txt` (버전 고정) | requirements.txt에 라이브러리와 버전을 적어 두면, 어디서든 같은 환경을 만들 수 있습니다. |
| 4 | `cat Dockerfile` (`COPY requirements.txt`, `RUN pip install -r` 강조) | requirements.txt를 먼저 복사하면, 코드만 바뀔 때 설치를 다시 하지 않습니다. |
| 5 | `cat compose.yaml` 일부 (`.:/work`, `restart`, `mem_limit` 강조) | 내 폴더를 볼륨으로 연결하고, 재시작과 메모리 제한도 한 번에 적습니다. |
| 6 | `cat .env` (`LAB_TOKEN` 강조) | 포트와 접속 token은 .env 파일로 분리합니다. |
| 7 | `docker compose build` 핵심 로그 + `docker compose up -d` (`Started`) | docker compose build로 이미지를 만들고, up -d로 JupyterLab을 실행합니다. |
| 8 | `docker compose run --rm lab python train.py` → `accuracy: 0.974` + `ls models` → `iris.joblib` | 학습한 모델은 내 폴더의 models에 저장됩니다. 코드를 실행하는 동안만 컨테이너를 씁니다. |
| 9 | 브라우저 JupyterLab: 저장한 모델 불러와 예측 `array([0])` (실제 캡처) | JupyterLab에서 저장한 모델을 불러와 바로 예측해 봅니다. |
| 10 | `docker compose down` + `ls models` → `iris.joblib` 남음 | 컨테이너를 지워도 모델 파일은 내 폴더에 그대로 남아 있습니다. |
| 11 | 요약 3개 | 버전은 requirements.txt, 실행은 Compose, 바뀌는 값은 .env로 관리합니다. |
| 12 | 다음 회차 예고 (19회차 Ollama 명령어) | 다음 시간부터는 Ollama로 언어모델을 다뤄 봅니다. |

## 재현
```bash
./commands.sh          # 실제 실행 + output/ 갱신 (Docker 데몬, python:3.12-slim 필요, 8888 포트 사용, 빌드에 몇 분 소요. 끝나면 정리)
node build.js          # ep18.pptx, script.txt 생성 (tools/ 에서 npm install 선행)
../tools/export-png.sh ep18.pptx   # slides/*.png (1080x1920)
```
