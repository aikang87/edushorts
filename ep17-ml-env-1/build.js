// 17회차 PPT 생성: node build.js  (output/ 의 실제 실행 결과와 브라우저 캡처 사용, script.txt 도 함께 생성)
const path = require("path");
const fs = require("fs");
const L = require("../tools/shorts-lib.js");
const { C, F, R } = L;
const out = (n) => path.join(__dirname, "output", n);
const P = "user@PC:~$ ";
const PH = "user@PC:~/mlenv$ "; // ~/mlenv 폴더 안에서의 프롬프트
const TOPIC = "17회차\nDocker로 ML 개발환경 ①";
const TOPIC_TITLE = "17회차 · Docker로 ML 개발환경 ①";

// caption = 슬라이드 자막(영문 그대로), narr = 나레이션 대본(영문은 한글 발음)
const T = {
  intro: { caption: "이번 시간에는 Docker로 머신러닝 개발환경을 만듭니다.", narr: "이번 시간에는 도커로 머신러닝 개발환경을 만듭니다." },
  why: { caption: "라이브러리를 내 컴퓨터에 직접 설치하면 버전이 꼬이기 쉽습니다. 컨테이너에 담으면 깨끗하게 지울 수 있습니다.", narr: "라이브러리를 내 컴퓨터에 직접 설치하면 버전이 꼬이기 쉽습니다. 컨테이너에 담으면 깨끗하게 지울 수 있습니다." },
  df: { caption: "Dockerfile에 파이썬 이미지를 고르고, pip으로 필요한 라이브러리를 설치합니다.", narr: "도커파일에 파이썬 이미지를 고르고, 핍으로 필요한 라이브러리를 설치합니다." },
  build: { caption: "docker build로 이미지를 만듭니다. 라이브러리를 내려받는 동안 시간이 걸리지만, 한 번 만들어 두면 계속 쓸 수 있습니다.", narr: "도커 빌드로 이미지를 만듭니다. 라이브러리를 내려받는 동안 시간이 걸리지만, 한 번 만들어 두면 계속 쓸 수 있습니다." },
  code: { caption: "붓꽃 데이터로 꽃의 종류를 맞히는 간단한 머신러닝 코드입니다.", narr: "붓꽃 데이터로 꽃의 종류를 맞히는 간단한 머신러닝 코드입니다." },
  train: { caption: "코드는 내 폴더에 두고, 컨테이너를 실행하며 연결합니다. 정확도가 출력됩니다.", narr: "코드는 내 폴더에 두고, 컨테이너를 실행하며 연결합니다. 정확도가 출력됩니다." },
  lab: { caption: "JupyterLab을 실행하면, 로그에 접속 주소가 나옵니다. 주소 끝의 token이 비밀번호 역할을 합니다.", narr: "주피터랩을 실행하면, 로그에 접속 주소가 나옵니다. 주소 끝의 토큰이 비밀번호 역할을 합니다." },
  browser: { caption: "브라우저로 접속하면 JupyterLab에서 코드를 실행하고 결과를 바로 볼 수 있습니다.", narr: "브라우저로 접속하면 주피터랩에서 코드를 실행하고 결과를 바로 볼 수 있습니다." },
  sum: { caption: "이미지에 라이브러리를, 볼륨에 코드를 담아 개발환경을 만듭니다.", narr: "이미지에 라이브러리를, 볼륨에 코드를 담아 개발환경을 만듭니다." },
  next: { caption: "다음 시간에는 이 환경을 더 편하게 만들어 봅니다.", narr: "다음 시간에는 이 환경을 더 편하게 만들어 봅니다." },
};

const pres = L.newDeck("Docker 17회차 ML 개발환경 ①");
const narration = [];
function slide(key, notesExtra = "") {
  narration.push(T[key].narr);
  return L.baseSlide(pres, { title: key === "intro" ? L.SERIES_TITLE : TOPIC_TITLE, caption: T[key].caption, notes: T[key].caption + notesExtra });
}
const join = (ls_) => ls_.map((l) => l.replace(/ \\$/, "").trim()).join(" ").replace(PH.trim(), "").trim();
const same = (lines, file, name) => { if (join(lines) !== file[0].replace(P.trim(), "").trim()) throw new Error("명령 불일치: " + name); };

// ---- 실제 실행 결과 ----
const rd = (n) => L.readOut(out(n + ".txt"));
const dockerfile = L.readOut(out("Dockerfile")), trainPy = L.readOut(out("train.py")).filter((l) => l.trim() !== "");
const build = rd("01_build"), train = rd("02_train"), lab = rd("03_lab"), logs = rd("04_logs");
const pipLine = build.find((l) => /RUN pip install/.test(l));
const okLine = build.find((l) => /Successfully installed/.test(l));
if (!pipLine || !okLine) throw new Error("빌드 로그에서 pip install 결과를 못 찾음");
const pkgs = ["numpy", "pandas", "scikit-learn", "jupyterlab"].map((n) => { const m = okLine.match(new RegExp(`${n}-[0-9][0-9.]*`)); if (!m) throw new Error("설치 결과에 없음: " + n); return m[0]; });
const trainCmd = [PH + "docker run --rm \\", '  -v "$PWD":/work \\', "  ml-env python train.py"];
const labCmd = [PH + "docker run -d --name lab \\", "  -p 8888:8888 \\", '  -v "$PWD":/work ml-env'];
same(trainCmd, train, "02_train"); same(labCmd, lab, "03_lab");
if (!/^accuracy: 0\.\d+$/.test(train.at(-1))) throw new Error("학습 결과가 예상과 다름: " + train.at(-1));
const urlLine = logs.find((l) => /^\s*http:\/\/127\.0\.0\.1:8888\/lab\?token=/.test(l)); // 접속 주소만 있는 줄
if (!urlLine) throw new Error("JupyterLab 접속 주소를 로그에서 못 찾음");

// 1) 타이틀
{
  const s = slide("intro");
  s.addShape("roundRect", { ...R.screen, rectRadius: 0.2, fill: { color: C.purple }, line: { color: C.pink, width: 1.5 }, objectName: "화면영역" });
  s.addText(TOPIC, { ...R.screen, fontFace: F.title, fontSize: 28, color: C.text, align: "center", valign: "middle", isTextBox: true, objectName: "회차주제" });
}
// 2) 직접 설치 vs 컨테이너
{
  const s = slide("why");
  const col = (x, head, sub, fill, line, name) => {
    s.addShape("roundRect", { x, y: 2.8, w: 2.3, h: 2.2, rectRadius: 0.12, fill: { color: fill }, line: { color: line, width: 1.5 }, objectName: name });
    s.addText([{ text: head, options: { fontSize: 16, bold: true, breakLine: true } }, { text: sub, options: { fontSize: 11 } }],
      { x, y: 2.8, w: 2.3, h: 2.2, fontFace: F.body, color: C.text, align: "center", valign: "middle", margin: 0.08, isTextBox: true });
  };
  col(0.3, "내 컴퓨터에 직접", "프로젝트마다 라이브러리 버전이 달라 충돌", C.term, "FF5555", "직접설치");
  col(3.0, "컨테이너에 담기", "numpy, pandas, scikit-learn 을 이미지 안에", C.greenDark, C.green, "컨테이너");
  s.addText("지우면 흔적 없이 깨끗하게", { x: 0.3, y: 5.2, w: 5.0, h: 0.45, fontFace: F.body, fontSize: 13, color: C.dim, align: "center", valign: "middle", margin: 0, isTextBox: true });
}
// 3) Dockerfile
{
  const s = slide("df");
  L.terminal(s, { lines: [{ t: PH + "cat Dockerfile" }, ...dockerfile.map((t) => ({ t, hl: /RUN pip install/.test(t) }))], label: "pip 으로 라이브러리 설치", tone: "pink", fontSize: 9.5 });
}
// 4) build (핵심 로그)
{
  const s = slide("build", " (긴 빌드 로그 중 핵심 줄만 표시, 설치된 패키지는 일부만 표시. 설치에는 약 2~3분 소요)");
  L.terminal(s, {
    lines: [{ t: PH + "docker build -t ml-env ." }, { t: "...", dim: true }, { t: L.trunc(pipLine.replace(/^#\d+ /, "#6 ").replace(/^#6 /, ""), 50) }, { t: "Successfully installed ...", hl: true }, { t: "  " + pkgs.slice(0, 2).join(" "), hl: true }, { t: "  " + pkgs.slice(2).join(" "), hl: true }],
    label: "라이브러리가 이미지에 설치됨", tone: "green", fontSize: 10,
  });
}
// 5) train.py
{
  const s = slide("code", " (빈 줄은 생략하고 표시)");
  L.terminal(s, { lines: [{ t: PH + "cat train.py" }, ...trainPy.map((t) => ({ t, hl: /^print/.test(t) }))], label: "붓꽃 분류 (RandomForest)", tone: "pink", fontSize: 9.5 });
}
// 6) train 실행
{
  const s = slide("train", " (긴 명령은 \\ 로 줄바꿈해 표시)");
  L.terminal(s, { lines: [...trainCmd.map((t, i) => ({ t, hlCols: i === 1 ? [2, 18] : undefined })), { t: train.at(-1), hl: true }], label: "코드는 내 폴더, 환경은 컨테이너", tone: "green", fontSize: 11 });
}
// 7) JupyterLab 실행 + 로그
{
  const s = slide("lab", " (긴 명령은 \\ 로 줄바꿈해 표시, 컨테이너 ID와 token 은 앞부분만 표시)");
  L.terminal(s, {
    lines: [...labCmd.map((t) => ({ t })), { t: L.trunc(lab[1], 30) }, { t: PH + "docker logs lab" }, { t: "    " + L.trunc(urlLine.trim(), 44), hl: true }],
    label: "접속 주소와 token", tone: "pink", fontSize: 10,
  });
}
// 8) 브라우저 (실제 캡처)
{
  const s = slide("browser");
  L.browserFrame(s, { path: out("browser.png"), url: "localhost:8888/lab", aspect: 1000 / 640, altText: "JupyterLab: 붓꽃 데이터 describe() 실행 결과" });
}
// 9) 요약
{
  const s = slide("sum");
  const rows = [["Dockerfile", "라이브러리 설치"], ["-v", "코드는 내 폴더에"], ["-p 8888:8888", "JupyterLab 접속"]];
  rows.forEach(([cmd, desc], i) => {
    const y = 2.7 + i * 1.05;
    s.addShape("roundRect", { x: 0.45, y, w: 4.7, h: 0.85, rectRadius: 0.1, fill: { color: C.term }, line: { color: C.edge, width: 0.75 }, objectName: "요약행" + (i + 1) });
    s.addText(cmd, { x: 0.6, y, w: 2.4, h: 0.85, fontFace: F.mono, fontSize: 13, bold: true, color: C.pink, valign: "middle", margin: 0, isTextBox: true });
    s.addText(desc, { x: 3.1, y, w: 2.0, h: 0.85, fontFace: F.body, fontSize: 13, color: C.text, valign: "middle", margin: 0, isTextBox: true });
  });
}
// 10) 다음 회차 예고 (18회차는 기존 콘텐츠)
{
  const s = slide("next");
  s.addShape("roundRect", { ...R.screen, rectRadius: 0.2, fill: { color: C.purple }, line: { color: C.pink, width: 1.5 }, objectName: "화면영역" });
  s.addText([{ text: "NEXT", options: { fontFace: F.mono, fontSize: 16, bold: true, color: C.pink, breakLine: true } },
    { text: "18회차", options: { fontSize: 20, breakLine: true } },
    { text: "Docker로 ML 개발환경 ②", options: { fontSize: 26 } }],
    { ...R.screen, fontFace: F.title, color: C.text, align: "center", valign: "middle", isTextBox: true, objectName: "다음회차" });
}

fs.writeFileSync(path.join(__dirname, "script.txt"), narration.join("\n") + "\n", "utf8");
pres.writeFile({ fileName: path.join(__dirname, "ep17.pptx") }).then((f) => console.log("saved", f));
