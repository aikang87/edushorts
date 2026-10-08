// 7회차 PPT 생성: node build.js  (output/ 의 실제 실행 결과 사용, script.txt 도 함께 생성)
const path = require("path");
const fs = require("fs");
const L = require("../tools/shorts-lib.js");
const { C, F, R } = L;
const out = (n) => path.join(__dirname, "output", n);
const PH = "user@PC:~/myapp$ "; // ~/myapp 폴더 안에서의 프롬프트
const TOPIC = "7회차\nDockerfile 실전";
const TOPIC_TITLE = "7회차 · Dockerfile 실전";

// caption = 슬라이드 자막(영문 그대로), narr = 나레이션 대본(영문은 한글 발음)
const T = {
  intro: { caption: "이번 시간에는 내 프로그램 파일을 이미지에 넣는 Dockerfile 작성법을 알아봅니다.", narr: "이번 시간에는 내 프로그램 파일을 이미지에 넣는 도커파일 작성법을 알아봅니다." },
  copy: { caption: "내 파일을 이미지 안으로 복사하면, 내가 만든 프로그램을 컨테이너로 실행할 수 있습니다.", narr: "내 파일을 이미지 안으로 복사하면, 내가 만든 프로그램을 컨테이너로 실행할 수 있습니다." },
  files: { caption: "폴더에는 파이썬 파일, Dockerfile, 비밀번호 파일이 있습니다.", narr: "폴더에는 파이썬 파일, 도커파일, 비밀번호 파일이 있습니다." },
  workdir: { caption: "WORKDIR은 컨테이너 안에서 작업할 폴더를 정합니다.", narr: "워크디어는 컨테이너 안에서 작업할 폴더를 정합니다." },
  copyCmd: { caption: "COPY는 내 파일을 이미지 안으로 복사합니다. 앞의 점은 내 폴더, 뒤의 점은 작업 폴더입니다.", narr: "카피는 내 파일을 이미지 안으로 복사합니다. 앞의 점은 내 폴더, 뒤의 점은 작업 폴더입니다." },
  build: { caption: "build한 뒤 실행하면 내 프로그램의 결과가 출력됩니다.", narr: "빌드한 뒤 실행하면 내 프로그램의 결과가 출력됩니다." },
  cache: { caption: "같은 내용으로 다시 build하면 이미 만든 단계는 캐시되어 건너뜁니다.", narr: "같은 내용으로 다시 빌드하면 이미 만든 단계는 캐시되어 건너뜁니다." },
  edit: { caption: "파일을 수정하면 바뀐 단계부터 다시 실행됩니다. 앞 단계는 캐시를 그대로 씁니다.", narr: "파일을 수정하면 바뀐 단계부터 다시 실행됩니다. 앞 단계는 캐시를 그대로 씁니다." },
  leak: { caption: "그런데 비밀번호 파일까지 이미지에 들어가 버렸습니다.", narr: "그런데 비밀번호 파일까지 이미지에 들어가 버렸습니다." },
  ignore: { caption: ".dockerignore에 파일 이름을 적으면 이미지에 복사하지 않습니다.", narr: "점도커이그노어에 파일 이름을 적으면 이미지에 복사하지 않습니다." },
  sum: { caption: "WORKDIR, COPY, .dockerignore로 프로그램을 이미지에 담습니다.", narr: "워크디어, 카피, 점도커이그노어로 프로그램을 이미지에 담습니다." },
  next: { caption: "다음 시간에는 컨테이너끼리 대화하는 네트워크를 알아봅니다.", narr: "다음 시간에는 컨테이너끼리 대화하는 네트워크를 알아봅니다." },
};

const pres = L.newDeck("Docker 7회차 Dockerfile 실전");
const narration = [];
function slide(key, notesExtra = "") {
  narration.push(T[key].narr);
  return L.baseSlide(pres, { title: key === "intro" ? L.SERIES_TITLE : TOPIC_TITLE, caption: T[key].caption, notes: T[key].caption + notesExtra });
}

// ---- 실제 실행 결과 ----
const rd = (n) => L.readOut(out(n + ".txt"));
const dockerfile = L.readOut(out("Dockerfile")); // 실제 빌드에 쓴 Dockerfile
const appPy = L.readOut(out("app.py"));
const ls1 = rd("01_ls").slice(1);
const find = (lines, re) => { const i = lines.findIndex((l) => re.test(l)); if (i < 0) throw new Error("로그에서 못 찾음: " + re); return i; };
const b1 = rd("02_build1").slice(1), b2 = rd("04_build2").slice(1), b3 = rd("05_build3").slice(1);
const stepLines = (b) => { const w = find(b, /\[2\/3\] WORKDIR/), c = find(b, /\[3\/3\] COPY/); return [b[w], b[w + 1], b[c], b[c + 1]]; };
const [w2, w2s, c2, c2s] = stepLines(b2);
const [w3, w3s, c3, c3s] = stepLines(b3);
const copy1 = b1[find(b1, /\[3\/3\] COPY/)], naming1 = b1[find(b1, /naming to/)];
const run1 = rd("03_run")[1];
const lsImg1 = rd("07_ls_image").slice(1), lsImg2 = rd("10_ls_image2").slice(1);
const ignoreFile = rd("08_cat_ignore")[1];
if (!c2s.includes("CACHED") || !w3s.includes("CACHED") || c3s.includes("CACHED")) throw new Error("캐시 로그가 예상과 다름");
if (!lsImg1.includes("secret.txt") || lsImg2.includes("secret.txt")) throw new Error(".dockerignore 결과가 예상과 다름");

// 1) 타이틀
{
  const s = slide("intro");
  s.addShape("roundRect", { ...R.screen, rectRadius: 0.2, fill: { color: C.purple }, line: { color: C.pink, width: 1.5 }, objectName: "화면영역" });
  s.addText(TOPIC, { ...R.screen, fontFace: F.title, fontSize: 32, color: C.text, align: "center", valign: "middle", isTextBox: true, objectName: "회차주제" });
}

// 2) 내 폴더 -> COPY -> 이미지
{
  const s = slide("copy");
  const card = (x, head, sub, fill, line, name) => {
    s.addShape("roundRect", { x, y: 3.1, w: 1.7, h: 1.7, rectRadius: 0.12, fill: { color: fill }, line: { color: line, width: 1.5 }, objectName: name });
    s.addText([{ text: head, options: { fontSize: 17, bold: true, breakLine: true } }, { text: sub, options: { fontSize: 12, fontFace: F.mono } }],
      { x, y: 3.1, w: 1.7, h: 1.7, fontFace: F.body, color: C.text, align: "center", valign: "middle", margin: 0.03, isTextBox: true });
  };
  card(0.4, "내 컴퓨터", "~/myapp", C.purple, C.pink, "내폴더");
  card(3.5, "이미지", "/app", C.greenDark, C.green, "이미지");
  s.addShape("rightArrow", { x: 2.3, y: 3.5, w: 1.0, h: 0.5, fill: { color: C.pink }, line: { color: C.pink, width: 0.5 }, objectName: "복사화살표" });
  s.addText("COPY . .", { x: 2.15, y: 4.05, w: 1.3, h: 0.4, fontFace: F.mono, fontSize: 11, bold: true, color: C.pink, align: "center", valign: "middle", margin: 0, isTextBox: true });
}

// 3) 폴더 안 파일
{
  const s = slide("files");
  L.terminal(s, {
    lines: [{ t: PH + "ls" }, ...ls1.map((t) => ({ t, hl: t === "secret.txt" })), { t: PH + "cat app.py" }, ...appPy.map((t) => ({ t }))],
    label: "프로젝트 폴더: ~/myapp", tone: "pink", fontSize: 11,
  });
}

// 4) WORKDIR / 5) COPY (cat Dockerfile + 해당 줄 강조)
const dfLines = (hlIdx) => [{ t: PH + "cat Dockerfile" }, ...dockerfile.map((t, i) => ({ t, hl: i === hlIdx }))];
{
  const s = slide("workdir");
  L.terminal(s, { lines: dfLines(dockerfile.findIndex((l) => l.startsWith("WORKDIR"))), label: "WORKDIR: 작업 폴더", tone: "pink", fontSize: 11 });
}
{
  const s = slide("copyCmd");
  L.terminal(s, { lines: dfLines(dockerfile.findIndex((l) => l.startsWith("COPY"))), label: "COPY: 파일 복사 (내 폴더 → 이미지)", tone: "pink", fontSize: 11 });
}

// 6) build + run
{
  const s = slide("build", " (긴 빌드 로그 중 핵심 줄만 표시)");
  L.terminal(s, {
    lines: [{ t: PH + "docker build -t myapp ." }, { t: "...", dim: true }, { t: copy1 }, { t: "...", dim: true }, { t: naming1 }, { t: PH + "docker run --rm myapp" }, { t: run1, hl: true }],
    label: "build 후 실행", tone: "green", fontSize: 10,
  });
}

// 7) 같은 내용으로 다시 build -> CACHED
{
  const s = slide("cache", " (긴 빌드 로그 중 핵심 줄만 표시)");
  L.terminal(s, {
    lines: [{ t: PH + "docker build -t myapp ." }, { t: "...", dim: true }, { t: w2 }, { t: w2s, hl: true }, { t: c2 }, { t: c2s, hl: true }],
    label: "빌드 캐시: CACHED = 건너뜀", tone: "green", fontSize: 11,
  });
}

// 8) 파일 수정 후 build -> COPY 부터 다시
{
  const s = slide("edit", " (긴 빌드 로그 중 핵심 줄만 표시)");
  L.terminal(s, {
    lines: [{ t: PH + `echo 'print("Hello again!")' > app.py` }, { t: PH + "docker build -t myapp ." }, { t: "...", dim: true }, { t: w3 }, { t: w3s, hl: true }, { t: c3 }, { t: c3s, hl: true }],
    label: "바뀐 단계부터 다시 실행", tone: "green", fontSize: 10,
  });
}

// 9) 이미지 안에 secret.txt 가 있음
{
  const s = slide("leak");
  L.terminal(s, { lines: [{ t: PH + "docker run --rm myapp ls" }, ...lsImg1.map((t) => ({ t, hl: t === "secret.txt" }))], label: "이미지 안에 비밀번호 파일이 있음", tone: "pink", fontSize: 12 });
}

// 10) .dockerignore 후 다시 build -> secret.txt 없음
{
  const s = slide("ignore", " (빌드 로그는 생략)");
  L.terminal(s, {
    lines: [{ t: PH + "cat .dockerignore" }, { t: ignoreFile, hl: true }, { t: PH + "docker build -t myapp ." }, { t: "...", dim: true }, { t: PH + "docker run --rm myapp ls" }, ...lsImg2.map((t) => ({ t }))],
    label: ".dockerignore: 복사에서 제외", tone: "green", fontSize: 11,
  });
}

// 11) 요약
{
  const s = slide("sum");
  const rows = [["WORKDIR", "작업 폴더 정하기"], ["COPY . .", "내 파일 복사"], ["빌드 캐시", "바뀐 단계부터 실행"], [".dockerignore", "복사에서 제외"]];
  rows.forEach(([cmd, desc], i) => {
    const y = 2.6 + i * 0.95;
    s.addShape("roundRect", { x: 0.45, y, w: 4.7, h: 0.8, rectRadius: 0.1, fill: { color: C.term }, line: { color: C.edge, width: 0.75 }, objectName: "요약행" + (i + 1) });
    s.addText(cmd, { x: 0.6, y, w: 2.3, h: 0.8, fontFace: F.mono, fontSize: 13, bold: true, color: C.pink, valign: "middle", margin: 0, isTextBox: true });
    s.addText(desc, { x: 2.95, y, w: 2.2, h: 0.8, fontFace: F.body, fontSize: 14, color: C.text, valign: "middle", margin: 0, isTextBox: true });
  });
}

// 12) 다음 회차 예고
{
  const s = slide("next");
  s.addShape("roundRect", { ...R.screen, rectRadius: 0.2, fill: { color: C.purple }, line: { color: C.pink, width: 1.5 }, objectName: "화면영역" });
  s.addText([{ text: "NEXT", options: { fontFace: F.mono, fontSize: 16, bold: true, color: C.pink, breakLine: true } },
    { text: "8회차", options: { fontSize: 20, breakLine: true } },
    { text: "컨테이너 네트워크", options: { fontSize: 30 } }],
    { ...R.screen, fontFace: F.title, color: C.text, align: "center", valign: "middle", isTextBox: true, objectName: "다음회차" });
}

fs.writeFileSync(path.join(__dirname, "script.txt"), narration.join("\n") + "\n", "utf8");
pres.writeFile({ fileName: path.join(__dirname, "ep07.pptx") }).then((f) => console.log("saved", f));
