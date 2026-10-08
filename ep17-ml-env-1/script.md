# 17회차. Docker로 ML 개발환경 ① (목표 1분)

- 슬라이드 = 영상 한 컷(10컷). 슬라이드 자막은 영문 그대로, 슬라이드 노트에도 같은 대본
- `script.txt` = 나레이션용 대본 (영문은 한글 발음, 줄바꿈으로만 구분). `node build.js` 가 자동 생성
- 예상 길이: 낭독 약 60초 (기준: 36자 = 6.7초), 문장 사이 쉼 포함 약 63~65초
- 화면의 명령어/출력은 `commands.sh` 를 실제 실행한 결과(`output/*.txt`), 화면의 `Dockerfile`/`train.py` 는 실제 빌드/실행에 쓴 파일(`output/`), 브라우저 화면은 실제 Chromium 으로 캡처한 JupyterLab(`output/browser.png`)
- 구성: `python:3.12-slim` + `pip install numpy pandas scikit-learn jupyterlab`, 코드는 내 폴더(`~/mlenv`)를 `-v` 로 연결, JupyterLab 은 `-p 8888:8888`. 붓꽃(iris) 데이터는 scikit-learn 내장이라 별도 다운로드 없음
- 마지막 슬라이드는 18회차(ML 개발환경 ②: requirements.txt + Compose + .env) 예고

## 제작 환경 우회 (학습자와 다른 점, 영상/슬라이드에는 나오지 않음)

제작 환경의 빌드 컨테이너는 외부 네트워크가 막혀 있어 그대로는 `RUN pip install` 이 실패함. 그래서 검증할 때만:
1. `tools/verify-base.sh python:3.12-slim` — 프록시 CA 인증서와 `PIP_CERT` 를 넣은 로컬 기반 이미지를 같은 이름(`python:3.12-slim`)으로 만들어 둠 (원본은 `python:3.12-slim-orig`)
2. `docker build --network host --no-cache -t ml-env .` 로 빌드 (화면에는 `docker build -t ml-env .` 로 표시. `--no-cache` 는 학습자의 첫 빌드와 같은 로그를 얻기 위해)

`Dockerfile` 내용과 나머지 명령은 학습자용 그대로이며, 인터넷이 되는 PC 에서는 이 우회가 필요 없음.

## 알아둘 점
- `pip install` 단계는 제작 환경에서 약 2~3분 걸렸고 설치 결과 버전(numpy 2.5.3, pandas 3.0.6, scikit-learn 1.9.1, jupyterlab 4.6.4)은 실행 시점의 최신 버전이라 학습자 화면과 다를 수 있음. `build.js` 는 `Successfully installed` 줄에서 실제 버전을 읽어 표시
- 정확도(`accuracy: 0.974`)는 `random_state=0` 으로 고정했지만 scikit-learn/numpy 버전에 따라 달라질 수 있음 (`build.js` 는 `accuracy: 0.xxx` 형식인지만 검증)
- JupyterLab 의 token 은 실행할 때마다 달라짐. 슬라이드에는 앞부분만 표시하고, 브라우저 주소창에는 token 없이 `localhost:8888/lab` 로 표시
- 브라우저 캡처에는 노트북(`analysis.ipynb`)을 미리 실행해 결과(붓꽃 `describe()`)를 채웠고, JupyterLab 의 뉴스 알림 팝업은 캡처 전에 닫음
- 화면 표시용 편집: 긴 명령은 `\` 로 줄바꿈해 표시(실제 실행은 한 줄, build.js 가 일치 여부 검증), `docker build` 는 핵심 줄/일부 패키지만, `train.py` 의 빈 줄은 생략
- `--allow-root`, `--ip=0.0.0.0`: 컨테이너 안(root)에서 밖으로 접속을 허용하기 위한 JupyterLab 옵션

| # | 화면영역 | 자막 |
|---|---|---|
| 1 | 시리즈 타이틀 + 회차 주제 | 이번 시간에는 Docker로 머신러닝 개발환경을 만듭니다. |
| 2 | 도식: 내 컴퓨터에 직접(충돌) vs 컨테이너에 담기(깨끗) | 라이브러리를 내 컴퓨터에 직접 설치하면 버전이 꼬이기 쉽습니다. 컨테이너에 담으면 깨끗하게 지울 수 있습니다. |
| 3 | `cat Dockerfile` (`RUN pip install` 강조) | Dockerfile에 파이썬 이미지를 고르고, pip으로 필요한 라이브러리를 설치합니다. |
| 4 | `docker build -t ml-env .` 핵심 로그 + 설치된 패키지 | docker build로 이미지를 만듭니다. 라이브러리를 내려받는 동안 시간이 걸리지만, 한 번 만들어 두면 계속 쓸 수 있습니다. |
| 5 | `cat train.py` | 붓꽃 데이터로 꽃의 종류를 맞히는 간단한 머신러닝 코드입니다. |
| 6 | `docker run --rm -v "$PWD":/work ml-env python train.py` → `accuracy: 0.974` | 코드는 내 폴더에 두고, 컨테이너를 실행하며 연결합니다. 정확도가 출력됩니다. |
| 7 | `docker run -d --name lab -p 8888:8888 -v "$PWD":/work ml-env` + `docker logs lab` (접속 주소) | JupyterLab을 실행하면, 로그에 접속 주소가 나옵니다. 주소 끝의 token이 비밀번호 역할을 합니다. |
| 8 | 브라우저 JupyterLab (노트북 실행 결과, 실제 캡처) | 브라우저로 접속하면 JupyterLab에서 코드를 실행하고 결과를 바로 볼 수 있습니다. |
| 9 | 요약 3개 | 이미지에 라이브러리를, 볼륨에 코드를 담아 개발환경을 만듭니다. |
| 10 | 다음 회차 예고 (18회차 Docker로 ML 개발환경 ②) | 다음 시간에는 이 환경을 더 편하게 만들어 봅니다. |

## 재현
```bash
./commands.sh          # 실제 실행 + output/ 갱신 (Docker 데몬, python:3.12-slim 필요, 8888 포트 사용, 빌드에 몇 분 소요. 끝나면 정리)
node build.js          # ep17.pptx, script.txt 생성 (tools/ 에서 npm install 선행)
../tools/export-png.sh ep17.pptx   # slides/*.png (1080x1920)
```
