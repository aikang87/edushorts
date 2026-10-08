#!/usr/bin/env bash
# 17회차: Docker로 ML 개발환경 ① (파이썬 ML 라이브러리 + JupyterLab) - 영상에 쓰이는 명령어를 실제로 실행하고 출력/브라우저 화면을 output/ 에 저장
#
# 제작 환경 주의: 빌드 컨테이너는 외부 네트워크가 막혀 있어, 빌드할 때만 `--network host` 와 프록시 CA 가 든 검증용 기반 이미지
# (tools/verify-base.sh)를 사용한다. 화면/문서의 명령과 Dockerfile 은 학습자용 그대로이며, 이 우회는 인터넷이 되는 PC 에서는 필요 없다.
set -u
cd "$(dirname "$0")"
mkdir -p output
docker info >/dev/null 2>&1 || { echo "Docker 데몬이 실행 중이 아닙니다. 먼저 데몬을 시작하세요." >&2; exit 1; }
EXTRA=""; [ -f /root/.ccr/ca-bundle.crt ] && { EXTRA="--network host --no-cache"; ../tools/verify-base.sh python:3.12-slim; }

# run <파일명> <표시할 명령> <실제 실행할 명령(쉘 문자열)> : ~/mlenv 안에서 실행, 프롬프트 + 명령 + 출력 저장 (Docker Hub 429 제한 시 재시도)
DIR="$HOME/mlenv"
run() {
  local f="output/$1.txt" show="$2" real="$3" out
  for wait in 0 30 90 180; do
    sleep "$wait"
    out="$(bash -c "cd \"$DIR\" && $real" 2>&1)"
    echo "$out" | grep -q "429 Too Many Requests" || break
  done
  { echo "user@PC:~\$ $show"; [ -n "$out" ] && echo "$out"; } > "$f"
  tail -n 8 "$f" | cut -c1-160; echo
}

cleanup() {
  docker rm -f lab >/dev/null 2>&1
  docker rmi ml-env >/dev/null 2>&1
  rm -f "$DIR/Dockerfile" "$DIR/train.py" "$DIR/analysis.ipynb"; rmdir "$DIR" 2>/dev/null
}
cleanup

# 프로젝트 파일 준비 (영상에서는 에디터로 만든 것으로 설명)
mkdir -p "$DIR"
cat > "$DIR/Dockerfile" <<'DF'
FROM python:3.12-slim
WORKDIR /work
RUN pip install --no-cache-dir \
    numpy pandas scikit-learn jupyterlab
EXPOSE 8888
CMD ["jupyter", "lab", "--ip=0.0.0.0", \
     "--no-browser", "--allow-root"]
DF
cat > "$DIR/train.py" <<'PY'
from sklearn.datasets import load_iris
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split

X, y = load_iris(return_X_y=True)
Xtr, Xte, ytr, yte = train_test_split(X, y, random_state=0)
clf = RandomForestClassifier(random_state=0).fit(Xtr, ytr)
print("accuracy:", round(clf.score(Xte, yte), 3))
PY
cp "$DIR/Dockerfile" "$DIR/train.py" output/

run 01_build 'docker build -t ml-env .'                                        "docker build $EXTRA -t ml-env ."
run 02_train 'docker run --rm -v "$PWD":/work ml-env python train.py'          'docker run --rm -v "$PWD":/work ml-env python train.py'
run 03_lab   'docker run -d --name lab -p 8888:8888 -v "$PWD":/work ml-env'    'docker run -d --name lab -p 8888:8888 -v "$PWD":/work ml-env'

# JupyterLab 이 뜰 때까지 대기 후 접속 주소(토큰) 추출
URL=""
for i in $(seq 1 30); do
  sleep 1
  URL="$(docker logs lab 2>&1 | grep -o 'http://127.0.0.1:8888/lab?token=[0-9a-f]*' | head -1)"
  [ -n "$URL" ] && break
done
{ echo "user@PC:~\$ docker logs lab"; docker logs lab 2>&1 | grep -E 'Jupyter Server .* is running|http://127.0.0.1:8888/lab\?token' | head -3; } > output/04_logs.txt

# 노트북 만들고 실행해 결과를 채움 (브라우저 캡처용)
cat > "$DIR/analysis.ipynb" <<'NB'
{"cells":[{"cell_type":"code","execution_count":null,"metadata":{},"outputs":[],"source":["from sklearn.datasets import load_iris\n","import pandas as pd\n","df = pd.DataFrame(load_iris().data, columns=load_iris().feature_names)\n","df.describe().round(2)"]}],"metadata":{"kernelspec":{"display_name":"Python 3","language":"python","name":"python3"}},"nbformat":4,"nbformat_minor":5}
NB
docker exec lab jupyter nbconvert --to notebook --execute --inplace /work/analysis.ipynb >/dev/null 2>&1
TOKEN="${URL##*token=}"
NO_PROXY=localhost,127.0.0.1 no_proxy=localhost,127.0.0.1 SCREENSHOT_WAIT_MS=9000 SCREENSHOT_DISMISS=No node ../tools/screenshot.js "http://localhost:8888/lab/tree/analysis.ipynb?token=$TOKEN" output/browser.png 1000 640

cleanup
