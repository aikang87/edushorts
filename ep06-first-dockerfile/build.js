// 6회차 PPT 생성: node build.js  (output/ 의 실제 실행 결과 사용, script.txt 도 함께 생성)
const path = require("path");
const fs = require("fs");
const L = require("../tools/shorts-lib.js");
const { C, F, R } = L;
const out = (n) => path.join(__dirname, "output", n);
const P = "user@PC:~$ ";
const PH = "user@PC:~/hello$ "; // ~/hello 폴더 안에서의 프롬프트
const TOPIC = "6회차\n내 첫 Dockerfile";
const TOPIC_TITLE = "6회차 · 내 첫 Dockerfile";

// caption = 슬라이드 자막(영문 그대로), narr = 나레이션 대본(영문은 한글 발음)
const T = {
  intro: { caption: "이번 시간에는 나만의 이미지를 만드는 Dockerfile을 알아봅니다.", narr: "이번 시간에는 나만의 이미지를 만드는 도커파일을 알아봅니다." },
  what: { caption: "Dockerfile은 이미지를 만드는 순서를 적은 설명서입니다. 이 파일로 build하면 이미지가 만들어집니다.", narr: "도커파일은 이미지를 만드는 순서를 적은 설명서입니다. 이 파일로 빌드하면 이미지가 만들어집니다." },
  create: { caption: "먼저 폴더를 만들고, 그 안에 Dockerfile이라는 이름의 파일을 만듭니다.", narr: "먼저 폴더를 만들고, 그 안에 도커파일이라는 이름의 파일을 만듭니다." },
  from: { caption: "첫 줄 FROM은 어떤 이미지에서 시작할지 정합니다. 여기서는 alpine을 사용합니다.", narr: "첫 줄 프롬은 어떤 이미지에서 시작할지 정합니다. 여기서는 알파인을 사용합니다." },
  run: { caption: "RUN은 이미지를 만드는 동안 실행할 명령입니다. 여기서는 파일 하나를 만듭니다.", narr: "런은 이미지를 만드는 동안 실행할 명령입니다. 여기서는 파일 하나를 만듭니다." },
  cmd: { caption: "CMD는 컨테이너가 시작될 때 실행할 명령입니다. 만들어 둔 파일을 출력합니다.", narr: "씨엠디는 컨테이너가 시작될 때 실행할 명령입니다. 만들어 둔 파일을 출력합니다." },
  build: { caption: "docker build로 이미지를 만듭니다. -t 옵션은 이미지 이름이고, 마지막 점은 현재 폴더입니다.", narr: "도커 빌드로 이미지를 만듭니다. 티 옵션은 이미지 이름이고, 마지막 점은 현재 폴더입니다." },
  images: { caption: "docker images로 보면 방금 만든 hello 이미지가 보입니다.", narr: "도커 이미지스로 보면 방금 만든 헬로 이미지가 보입니다." },
  runIt: { caption: "docker run으로 실행하면 CMD에 적어 둔 명령이 실행됩니다.", narr: "도커 런으로 실행하면 씨엠디에 적어 둔 명령이 실행됩니다." },
  sum: { caption: "FROM, RUN, CMD로 이미지를 설계하고,\ndocker build로 만듭니다.", narr: "프롬, 런, 씨엠디로 이미지를 설계하고, 도커 빌드로 만듭니다." },
  next: { caption: "다음 시간에는 내 파일을 이미지에 넣는 방법을 알아봅니다.", narr: "다음 시간에는 내 파일을 이미지에 넣는 방법을 알아봅니다." },
};

const pres = L.newDeck("Docker 6회차 내 첫 Dockerfile");
const narration = [];
function slide(key, notesExtra = "") {
  narration.push(T[key].narr);
  return L.baseSlide(pres, { title: key === "intro" ? L.SERIES_TITLE : TOPIC_TITLE, caption: T[key].caption, notes: T[key].caption.replace(/\n/g, " ") + notesExtra });
}

// ---- 실제 실행 결과 ----
const rd = (n) => L.readOut(out(n + ".txt"));
const dockerfile = L.readOut(out("Dockerfile")); // 실제 빌드에 쓴 Dockerfile
const build = rd("03_build").slice(1);
const pick = (re) => build.find((l) => re.test(l));
const buildView = [
  L.trunc(pick(/^#\d+ \[1\/2\] FROM/).replace(/@sha256:\w+/, ""), 46),
  pick(/^#\d+ \[2\/2\] RUN/),
  pick(/^#\d+ naming to/),
];
const images = L.pickColumns(rd("04_images").slice(1), ["IMAGE", "ID", "DISK USAGE"]);
const result = rd("05_run")[1];

// 1) 타이틀
{
  const s = slide("intro");
  s.addShape("roundRect", { ...R.screen, rectRadius: 0.2, fill: { color: C.purple }, line: { color: C.pink, width: 1.5 }, objectName: "화면영역" });
  s.addText(TOPIC, { ...R.screen, fontFace: F.title, fontSize: 32, color: C.text, align: "center", valign: "middle", isTextBox: true, objectName: "회차주제" });
}

// 2) Dockerfile -> build -> 이미지 -> run -> 컨테이너
{
  const s = slide("what");
  const box = (y, fill, line, head, sub, name) => {
    s.addShape("roundRect", { x: 0.9, y, w: 3.8, h: 0.8, rectRadius: 0.12, fill: { color: fill }, line: { color: line, width: 1.5 }, objectName: name });
    s.addText([{ text: head, options: { fontSize: 18, bold: true, breakLine: !!sub } }, ...(sub ? [{ text: sub, options: { fontSize: 11 } }] : [])],
      { x: 0.9, y, w: 3.8, h: 0.8, fontFace: F.body, color: C.text, align: "center", valign: "middle", margin: 0.03, isTextBox: true });
  };
  const arrow = (y, text) => s.addText(text, { x: 0.9, y, w: 3.8, h: 0.45, fontFace: F.mono, fontSize: 13, bold: true, color: C.pink, align: "center", valign: "middle", margin: 0, isTextBox: true });
  box(2.55, C.purple, C.pink, "Dockerfile", "이미지를 만드는 설명서", "도커파일");
  arrow(3.4, "▼ docker build");
  box(3.9, C.purple, C.pink, "이미지", "", "이미지");
  arrow(4.75, "▼ docker run");
  box(5.25, C.greenDark, C.green, "컨테이너", "", "컨테이너");
}

// 3) 폴더 + Dockerfile 만들기
{
  const s = slide("create", " (heredoc 은 입력한 내용을 파일로 저장하는 쉘 문법)");
  L.terminal(s, {
    lines: [{ t: P + "mkdir ~/hello" }, { t: P + "cd ~/hello" }, { t: PH + "cat > Dockerfile <<'EOF'", hl: true }, ...dockerfile.map((t) => ({ t })), { t: "EOF" }],
    label: "Dockerfile 만들기", tone: "pink", fontSize: 11,
  });
}

// 4~6) FROM / RUN / CMD 설명 (cat Dockerfile + 해당 줄 강조)
const dfLines = (hlIdx) => [{ t: PH + "cat Dockerfile" }, ...dockerfile.map((t, i) => ({ t, hl: i === hlIdx }))];
{
  const s = slide("from");
  L.terminal(s, { lines: dfLines(0), label: "FROM: 시작할 베이스 이미지", tone: "pink", fontSize: 11 });
}
{
  const s = slide("run");
  L.terminal(s, { lines: dfLines(1), label: "RUN: 이미지를 만들 때 실행", tone: "pink", fontSize: 11 });
}
{
  const s = slide("cmd");
  L.terminal(s, { lines: dfLines(2), label: "CMD: 컨테이너가 시작될 때 실행", tone: "pink", fontSize: 11 });
}

// 7) docker build (긴 진행 로그 중 핵심만)
{
  const s = slide("build", " (긴 빌드 로그 중 핵심 줄만 표시)");
  L.terminal(s, {
    lines: [{ t: PH + "docker build -t hello .", hl: true }, { t: "..." , dim: true }, { t: buildView[0] }, { t: buildView[1], hl: true }, { t: "...", dim: true }, { t: buildView[2] }],
    label: "이미지 만들기: docker build", tone: "pink", fontSize: 10,
  });
}

// 8) docker images hello
{
  const s = slide("images", " (일부 열 생략)");
  L.terminal(s, { lines: [{ t: PH + "docker images hello" }, ...images.map((t, i) => ({ t, dim: i === 0, hl: i === 1 }))], label: "만들어진 이미지: hello", tone: "green", fontSize: 11 });
}

// 9) docker run
{
  const s = slide("runIt");
  L.terminal(s, { lines: [{ t: PH + "docker run --rm hello" }, { t: result, hl: true }], label: "컨테이너 실행: docker run", tone: "green", fontSize: 12 });
}

// 10) 요약
{
  const s = slide("sum");
  const rows = [["FROM", "시작할 이미지"], ["RUN", "빌드할 때 실행"], ["CMD", "컨테이너 시작 때 실행"], ["docker build -t", "이미지 만들기"]];
  rows.forEach(([cmd, desc], i) => {
    const y = 2.6 + i * 0.95;
    s.addShape("roundRect", { x: 0.45, y, w: 4.7, h: 0.8, rectRadius: 0.1, fill: { color: C.term }, line: { color: C.edge, width: 0.75 }, objectName: "요약행" + (i + 1) });
    s.addText(cmd, { x: 0.6, y, w: 2.3, h: 0.8, fontFace: F.mono, fontSize: 13, bold: true, color: C.pink, valign: "middle", margin: 0, isTextBox: true });
    s.addText(desc, { x: 2.95, y, w: 2.2, h: 0.8, fontFace: F.body, fontSize: 14, color: C.text, valign: "middle", margin: 0, isTextBox: true });
  });
}

// 11) 다음 회차 예고
{
  const s = slide("next");
  s.addShape("roundRect", { ...R.screen, rectRadius: 0.2, fill: { color: C.purple }, line: { color: C.pink, width: 1.5 }, objectName: "화면영역" });
  s.addText([{ text: "NEXT", options: { fontFace: F.mono, fontSize: 16, bold: true, color: C.pink, breakLine: true } },
    { text: "7회차", options: { fontSize: 20, breakLine: true } },
    { text: "Dockerfile 실전", options: { fontSize: 30 } }],
    { ...R.screen, fontFace: F.title, color: C.text, align: "center", valign: "middle", isTextBox: true, objectName: "다음회차" });
}

fs.writeFileSync(path.join(__dirname, "script.txt"), narration.join("\n") + "\n", "utf8");
pres.writeFile({ fileName: path.join(__dirname, "ep06.pptx") }).then((f) => console.log("saved", f));
