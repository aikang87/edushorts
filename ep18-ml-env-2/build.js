// 18회차 PPT 생성: node build.js  (output/ 의 실제 실행 결과와 브라우저 캡처 사용, script.txt 도 함께 생성)
const path = require("path");
const fs = require("fs");
const L = require("../tools/shorts-lib.js");
const { C, F, R } = L;
const out = (n) => path.join(__dirname, "output", n);
const P = "user@PC:~$ ";
const PH = "user@PC:~/mlenv2$ "; // ~/mlenv2 폴더 안에서의 프롬프트
const TOPIC = "18회차\nDocker로 ML 개발환경 ②";
const TOPIC_TITLE = "18회차 · Docker로 ML 개발환경 ②";

// caption = 슬라이드 자막(영문 그대로), narr = 나레이션 대본(영문은 한글 발음)
const T = {
  intro: { caption: "이번 시간에는 머신러닝 개발환경을 Compose로 더 편하게 만듭니다.", narr: "이번 시간에는 머신러닝 개발환경을 컴포즈로 더 편하게 만듭니다." },
  three: { caption: "세 개의 파일로 환경을 정리합니다.", narr: "세 개의 파일로 환경을 정리합니다." },
  req: { caption: "requirements.txt에 라이브러리와 버전을 적어 두면, 어디서든 같은 환경을 만들 수 있습니다.", narr: "리콰이어먼츠 티엑스티에 라이브러리와 버전을 적어 두면, 어디서든 같은 환경을 만들 수 있습니다." },
  df: { caption: "requirements.txt를 먼저 복사하면, 코드만 바뀔 때 설치를 다시 하지 않습니다.", narr: "리콰이어먼츠 티엑스티를 먼저 복사하면, 코드만 바뀔 때 설치를 다시 하지 않습니다." },
  yaml: { caption: "내 폴더를 볼륨으로 연결하고, 재시작과 메모리 제한도 한 번에 적습니다.", narr: "내 폴더를 볼륨으로 연결하고, 재시작과 메모리 제한도 한 번에 적습니다." },
  env: { caption: "포트와 접속 token은 .env 파일로 분리합니다.", narr: "포트와 접속 토큰은 점엔브 파일로 분리합니다." },
  build: { caption: "docker compose build로 이미지를 만들고, up -d로 JupyterLab을 실행합니다.", narr: "도커 컴포즈 빌드로 이미지를 만들고, 업 대시 디로 주피터랩을 실행합니다." },
  train: { caption: "학습한 모델은 내 폴더의 models에 저장됩니다. 코드를 실행하는 동안만 컨테이너를 씁니다.", narr: "학습한 모델은 내 폴더의 모델스에 저장됩니다. 코드를 실행하는 동안만 컨테이너를 씁니다." },
  browser: { caption: "JupyterLab에서 저장한 모델을 불러와 바로 예측해 봅니다.", narr: "주피터랩에서 저장한 모델을 불러와 바로 예측해 봅니다." },
  down: { caption: "컨테이너를 지워도 모델 파일은 내 폴더에 그대로 남아 있습니다.", narr: "컨테이너를 지워도 모델 파일은 내 폴더에 그대로 남아 있습니다." },
  sum: { caption: "버전은 requirements.txt, 실행은 Compose, 바뀌는 값은 .env로 관리합니다.", narr: "버전은 리콰이어먼츠 티엑스티, 실행은 컴포즈, 바뀌는 값은 점엔브로 관리합니다." },
  next: { caption: "다음 시간부터는 Ollama로 언어모델을 다뤄 봅니다.", narr: "다음 시간부터는 올라마로 언어모델을 다뤄 봅니다." },
};

const pres = L.newDeck("Docker 18회차 ML 개발환경 ②");
const narration = [];
function slide(key, notesExtra = "") {
  narration.push(T[key].narr);
  return L.baseSlide(pres, { title: key === "intro" ? L.SERIES_TITLE : TOPIC_TITLE, caption: T[key].caption, notes: T[key].caption + notesExtra });
}

// ---- 실제 실행 결과 ----
const rd = (n) => L.readOut(out(n + ".txt"));
const req = L.readOut(out("requirements.txt")), dockerfile = L.readOut(out("Dockerfile")), yaml = L.readOut(out("compose.yaml")), dotenv = L.readOut(out("dotenv.txt"));
const build = rd("01_build"), up = rd("02_up"), train = rd("03_train"), tail = rd("04_tail"), ls = rd("05_ls"), ps = rd("06_ps"), down = rd("07_down"), ls2 = rd("08_ls2");
const y = (re) => { const l = yaml.find((x) => re.test(x)); if (!l) throw new Error("compose.yaml 에서 못 찾음: " + re); return l; };
const f = (lines, re, what) => { const l = lines.find((x) => re.test(x)); if (!l) throw new Error("로그에서 못 찾음: " + what); return l; };
const pipLine = f(build, /RUN pip install/, "pip install");
const okLine = f(build, /Successfully installed/, "Successfully installed");
const pkgs = ["numpy", "pandas", "scikit-learn", "jupyterlab"].map((n) => { const m = okLine.match(new RegExp(`${n}-[0-9][0-9.]*`)); if (!m) throw new Error("설치 결과에 없음: " + n); return m[0]; });
const copyLine = f(build, /COPY requirements\.txt/, "COPY requirements.txt");
const upKey = [/Network .*Created/, /Container .*Started/].map((re) => f(up, re, String(re)));
const accuracy = train.at(-1);
if (!/^accuracy: 0\.\d+$/.test(accuracy) || ls[1] !== "iris.joblib" || ls2[1] !== "iris.joblib" || !down.some((l) => /Removed/.test(l))) throw new Error("실행 결과가 예상과 다름");
for (const [name, line] of [["numpy", "numpy==2.5.3"]]) if (!req.includes(line)) throw new Error("requirements.txt 가 예상과 다름: " + name);
const psRows = L.pickColumns(ps.slice(1), ["NAME", "STATUS", "PORTS"]);

// 1) 타이틀
{
  const s = slide("intro");
  s.addShape("roundRect", { ...R.screen, rectRadius: 0.2, fill: { color: C.purple }, line: { color: C.pink, width: 1.5 }, objectName: "화면영역" });
  s.addText(TOPIC, { ...R.screen, fontFace: F.title, fontSize: 28, color: C.text, align: "center", valign: "middle", isTextBox: true, objectName: "회차주제" });
}
// 2) 세 개의 파일
{
  const s = slide("three");
  const items = [["requirements.txt", "라이브러리 목록 (버전 고정)"], ["compose.yaml", "실행 설정"], [".env", "바뀌는 값 (포트, token)"]];
  items.forEach(([head, sub], i) => {
    const yy = 2.6 + i * 1.25;
    s.addShape("roundRect", { x: 0.45, y: yy, w: 4.7, h: 1.05, rectRadius: 0.12, fill: { color: i === 0 ? C.purple : i === 1 ? C.greenDark : C.term }, line: { color: i === 0 ? C.pink : i === 1 ? C.green : C.edge, width: 1.5 }, objectName: "파일카드" + (i + 1) });
    s.addText([{ text: head, options: { fontFace: F.mono, fontSize: 17, bold: true, color: i === 2 ? C.pink : C.text, breakLine: true } }, { text: sub, options: { fontFace: F.body, fontSize: 13, color: C.text } }],
      { x: 0.45, y: yy, w: 4.7, h: 1.05, align: "center", valign: "middle", margin: 0.05, isTextBox: true });
  });
}
// 3) requirements.txt
{
  const s = slide("req", " (버전은 17회차에서 설치된 실제 버전)");
  L.terminal(s, { lines: [{ t: PH + "cat requirements.txt" }, ...req.map((t) => ({ t, hl: /^numpy/.test(t) || /^scikit/.test(t) }))], label: "버전을 고정한 라이브러리 목록", tone: "pink", fontSize: 11 });
}
// 4) Dockerfile
{
  const s = slide("df");
  L.terminal(s, { lines: [{ t: PH + "cat Dockerfile" }, ...dockerfile.map((t) => ({ t, hl: /^COPY/.test(t) || /^RUN/.test(t) }))], label: "목록 먼저 복사 → 설치 캐시", tone: "pink", fontSize: 10 });
}
// 5) compose.yaml (일부)
{
  const s = slide("yaml", " (compose.yaml 일부만 표시, 생략한 줄은 ... 로 표시)");
  L.terminal(s, { lines: [{ t: PH + "cat compose.yaml" }, { t: yaml[0] }, { t: yaml[1] }, { t: "    ...", dim: true }, { t: y(/volumes:/) }, { t: y(/- \.:\/work/), hl: true }, { t: y(/restart:/), hl: true }, { t: y(/mem_limit:/), hl: true }], label: "볼륨, 재시작, 메모리 제한", tone: "pink", fontSize: 10 });
}
// 6) .env
{
  const s = slide("env", " (token 값은 실습용 예시)");
  L.terminal(s, { lines: [{ t: PH + "cat .env" }, ...dotenv.map((t) => ({ t, hl: /TOKEN/.test(t) }))], label: ".env: 포트와 token", tone: "pink", fontSize: 12 });
}
// 7) build + up
{
  const s = slide("build", " (긴 빌드 로그 중 핵심 줄만 표시, 설치된 패키지는 일부만 표시. 설치에는 약 2~3분 소요)");
  L.terminal(s, {
    lines: [{ t: PH + "docker compose build" }, { t: "...", dim: true }, { t: "Successfully installed ...", hl: true }, { t: "  " + pkgs.slice(0, 2).join(" "), hl: true }, { t: "  " + pkgs.slice(2).join(" "), hl: true },
      { t: PH + "docker compose up -d" }, { t: upKey[1], hl: true }],
    label: "빌드 후 실행", tone: "green", fontSize: 10,
  });
}
// 8) 학습 + 모델 저장
{
  const s = slide("train", " (긴 명령은 \\ 로 줄바꿈해 표시, docker compose run 의 컨테이너 생성 로그와 스크립트용 -T 옵션은 화면에서 생략)");
  const trainCmd = [PH + "docker compose run --rm lab \\", "  python train.py"];
  if (trainCmd.map((l) => l.replace(/ \\$/, "").trim()).join(" ").replace(PH.trim(), "").trim() !== train[0].replace("user@PC:~$", "").trim()) throw new Error("03_train 명령 불일치");
  L.terminal(s, { lines: [...trainCmd.map((t) => ({ t })), { t: accuracy, hl: true }, { t: PH + "ls models" }, { t: ls[1], hl: true }], label: "모델이 내 폴더에 저장됨", tone: "green", fontSize: 10 });
}
// 9) 브라우저 (실제 캡처)
{
  const s = slide("browser");
  L.browserFrame(s, { path: out("browser.png"), url: "localhost:8888/lab", aspect: 1000 / 640, altText: "JupyterLab: 저장한 모델을 불러와 예측" });
}
// 10) down 후에도 모델이 남음
{
  const s = slide("down", " (down 의 중간 단계는 생략하고 Removed 줄만 표시)");
  L.terminal(s, { lines: [{ t: PH + "docker compose down" }, ...down.filter((l) => /Removed/.test(l)).map((t) => ({ t })), { t: PH + "ls models" }, { t: ls2[1], hl: true }], label: "컨테이너는 지워도 모델은 남음", tone: "green", fontSize: 10 });
}
// 11) 요약
{
  const s = slide("sum");
  const rows = [["requirements.txt", "버전 고정"], ["compose.yaml", "실행 설정"], [".env", "바뀌는 값"]];
  rows.forEach(([cmd, desc], i) => {
    const yy = 2.7 + i * 1.05;
    s.addShape("roundRect", { x: 0.45, y: yy, w: 4.7, h: 0.85, rectRadius: 0.1, fill: { color: C.term }, line: { color: C.edge, width: 0.75 }, objectName: "요약행" + (i + 1) });
    s.addText(cmd, { x: 0.6, y: yy, w: 2.6, h: 0.85, fontFace: F.mono, fontSize: 13, bold: true, color: C.pink, valign: "middle", margin: 0, isTextBox: true });
    s.addText(desc, { x: 3.3, y: yy, w: 1.8, h: 0.85, fontFace: F.body, fontSize: 14, color: C.text, valign: "middle", margin: 0, isTextBox: true });
  });
}
// 12) 다음 회차 예고
{
  const s = slide("next");
  s.addShape("roundRect", { ...R.screen, rectRadius: 0.2, fill: { color: C.purple }, line: { color: C.pink, width: 1.5 }, objectName: "화면영역" });
  s.addText([{ text: "NEXT", options: { fontFace: F.mono, fontSize: 16, bold: true, color: C.pink, breakLine: true } },
    { text: "19회차", options: { fontSize: 20, breakLine: true } },
    { text: "Ollama 명령어", options: { fontSize: 28 } }],
    { ...R.screen, fontFace: F.title, color: C.text, align: "center", valign: "middle", isTextBox: true, objectName: "다음회차" });
}

fs.writeFileSync(path.join(__dirname, "script.txt"), narration.join("\n") + "\n", "utf8");
pres.writeFile({ fileName: path.join(__dirname, "ep18.pptx") }).then((f2) => console.log("saved", f2));
