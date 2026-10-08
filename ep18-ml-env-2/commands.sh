#!/usr/bin/env bash
# 18회차: Docker로 ML 개발환경 ② (requirements.txt + Compose + .env + 모델 저장) - 영상에 쓰이는 명령어를 실제로 실행하고 출력/브라우저 화면을 output/ 에 저장
# 17회차(Dockerfile + pip + JupyterLab)를 이어서, Compose 한 파일로 환경을 관리한다.
#
# 제작 환경 주의: 빌드 컨테이너는 외부 네트워크가 막혀 있어, `docker compose build` 단계에서만 임시 override 파일(build.network=host)과
# 프록시 CA 가 든 검증용 기반 이미지(tools/verify-base.sh)를 사용한다. 화면/문서의 compose.yaml, Dockerfile, 명령은 학습자용 그대로이며
# 인터넷이 되는 PC 에서는 이 우회가 필요 없다.
set -u
cd "$(dirname "$0")"
mkdir -p output
docker info >/dev/null 2>&1 || { echo "Docker 데몬이 실행 중이 아닙니다. 먼저 데몬을 시작하세요." >&2; exit 1; }
OVERRIDE=""; [ -f /root/.ccr/ca-bundle.crt ] && { ../tools/verify-base.sh python:3.12-slim; OVERRIDE="$(mktemp)"; printf 'services:\n  lab:\n    build:\n      network: host\n' > "$OVERRIDE"; }

# 터미널 제어문자 제거 후 같은 줄 반복 정리 (Compose 의 비대화형 출력용)
clean() { sed -r 's/\x1b\[[0-9;?]*[a-zA-Z]//g' | tr '\r' '\n' | sed -r 's/[[:space:]]+$//' | grep -v '^$' | uniq; }

# run <파일명> <표시할 명령> <실제 실행할 명령(쉘 문자열)> : ~/mlenv2 안에서 실행, 프롬프트 + 명령 + 출력 저장
DIR="$HOME/mlenv2"
run() {
  local f="output/$1.txt" show="$2" real="$3" out
  out="$(bash -c "cd \"$DIR\" && $real" 2>&1 | clean)"
  { echo "user@PC:~\$ $show"; [ -n "$out" ] && echo "$out"; } > "$f"
  tail -n 6 "$f" | cut -c1-160; echo
}

cleanup() {
  [ -f "$DIR/compose.yaml" ] && (cd "$DIR" && docker compose down >/dev/null 2>&1)
  docker rmi mlenv2-lab >/dev/null 2>&1
  rm -f "$DIR/compose.yaml" "$DIR/Dockerfile" "$DIR/requirements.txt" "$DIR/.env" "$DIR/train.py" "$DIR/predict.ipynb" "$DIR/models/iris.joblib"
  rmdir "$DIR/models" "$DIR" 2>/dev/null
}
cleanup

# 프로젝트 파일 준비 (영상에서는 에디터로 만든 것으로 설명). 버전은 17회차에서 설치된 실제 버전
mkdir -p "$DIR"
cat > "$DIR/requirements.txt" <<'REQ'
numpy==2.5.3
pandas==3.0.6
scikit-learn==1.9.1
joblib==1.6.0
jupyterlab==4.6.4
REQ
cat > "$DIR/Dockerfile" <<'DF'
FROM python:3.12-slim
WORKDIR /work
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
EXPOSE 8888
CMD ["jupyter", "lab", "--ip=0.0.0.0", \
     "--no-browser", "--allow-root"]
DF
cat > "$DIR/.env" <<'ENV'
LAB_PORT=8888
LAB_TOKEN=mlpass
ENV
cat > "$DIR/compose.yaml" <<'YAML'
services:
  lab:
    build: .
    ports:
      - "${LAB_PORT}:8888"
    volumes:
      - .:/work
    environment:
      - JUPYTER_TOKEN=${LAB_TOKEN}
    restart: unless-stopped
    mem_limit: 2g
YAML
cat > "$DIR/train.py" <<'PY'
import os
import joblib
from sklearn.datasets import load_iris
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split

X, y = load_iris(return_X_y=True)
Xtr, Xte, ytr, yte = train_test_split(X, y, random_state=0)
clf = RandomForestClassifier(random_state=0).fit(Xtr, ytr)
os.makedirs("models", exist_ok=True)
joblib.dump(clf, "models/iris.joblib")
print("accuracy:", round(clf.score(Xte, yte), 3))
PY
cp "$DIR/requirements.txt" "$DIR/Dockerfile" "$DIR/compose.yaml" "$DIR/train.py" output/; cp "$DIR/.env" output/dotenv.txt

if [ -n "$OVERRIDE" ]; then BUILD="docker compose -f compose.yaml -f $OVERRIDE build --no-cache"; else BUILD="docker compose build --no-cache"; fi
run 01_build 'docker compose build' "$BUILD"
run 02_up    'docker compose up -d'  'docker compose up -d'
sleep 6
run 03_train 'docker compose run --rm lab python train.py' 'docker compose run --rm -T lab python train.py'   # -T: 스크립트(비 TTY) 실행용, 화면에는 생략
run 04_tail  'tail -n 3 train.py'    'tail -n 3 train.py'
run 05_ls    'ls models'             'ls models'
run 06_ps    'docker compose ps'     'docker compose ps'

# 저장한 모델을 불러와 예측하는 노트북을 만들어 실행 (브라우저 캡처용)
cat > "$DIR/predict.ipynb" <<'NB'
{"cells":[{"cell_type":"code","execution_count":null,"metadata":{},"outputs":[],"source":["import joblib\n","clf = joblib.load(\"models/iris.joblib\")\n","clf.predict([[5.1, 3.5, 1.4, 0.2]])"]}],"metadata":{"kernelspec":{"display_name":"Python 3","language":"python","name":"python3"}},"nbformat":4,"nbformat_minor":5}
NB
(cd "$DIR" && docker compose exec -T lab jupyter nbconvert --to notebook --execute --inplace predict.ipynb >/dev/null 2>&1)
NO_PROXY=localhost,127.0.0.1 no_proxy=localhost,127.0.0.1 SCREENSHOT_WAIT_MS=9000 SCREENSHOT_DISMISS=No node ../tools/screenshot.js "http://localhost:8888/lab/tree/predict.ipynb?token=mlpass" output/browser.png 1000 640

# 컨테이너를 지워도 모델 파일은 내 폴더에 남는지 확인
run 07_down  'docker compose down'   'docker compose down'
run 08_ls2   'ls models'             'ls models'

cleanup
[ -n "$OVERRIDE" ] && rm -f "$OVERRIDE"
