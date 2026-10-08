// 15회차 PPT 생성: node build.js  (output/ 의 실제 실행 결과 사용, script.txt 도 함께 생성)
const path = require("path");
const fs = require("fs");
const L = require("../tools/shorts-lib.js");
const { C, F, R } = L;
const out = (n) => path.join(__dirname, "output", n);
const P = "user@PC:~$ ";
const PH = "user@PC:~/gohello$ "; // ~/gohello 폴더 안에서의 프롬프트
const TOPIC = "15회차\n이미지 다이어트";
const TOPIC_TITLE = "15회차 · 이미지 다이어트";

// caption = 슬라이드 자막(영문 그대로), narr = 나레이션 대본(영문은 한글 발음)
// ※ 8번 슬라이드의 크기 숫자(387MB → 16MB)는 실제 출력과 일치하는지 build.js 가 검증함. 값이 바뀌면 문장을 고쳐야 함
const T = {
  intro: { caption: "이번 시간에는 이미지 크기를 크게 줄이는 멀티스테이지 빌드를 알아봅니다.", narr: "이번 시간에는 이미지 크기를 크게 줄이는 멀티스테이지 빌드를 알아봅니다." },
  why: { caption: "프로그램을 만들 때는 컴파일러가 필요하지만, 실행할 때는 결과물 하나면 충분합니다.", narr: "프로그램을 만들 때는 컴파일러가 필요하지만, 실행할 때는 결과물 하나면 충분합니다." },
  code: { caption: "간단한 Go 프로그램입니다. 컴파일하면 실행 파일 하나가 만들어집니다.", narr: "간단한 고 프로그램입니다. 컴파일하면 실행 파일 하나가 만들어집니다." },
  single: { caption: "먼저 한 단계로 만든 Dockerfile입니다. 컴파일러가 들어 있는 이미지에서 그대로 실행합니다.", narr: "먼저 한 단계로 만든 도커파일입니다. 컴파일러가 들어 있는 이미지에서 그대로 실행합니다." },
  buildSingle: { caption: "build하면 컴파일러까지 이미지에 그대로 남습니다. 실행에는 필요 없는 것들입니다.", narr: "빌드하면 컴파일러까지 이미지에 그대로 남습니다. 실행에는 필요 없는 것들입니다." },
  multi: { caption: "멀티스테이지는 FROM을 두 번 씁니다. 첫 단계에서 컴파일하고, COPY --from으로 결과물만 가져옵니다.", narr: "멀티스테이지는 프롬을 두 번 씁니다. 첫 단계에서 컴파일하고, 카피 프롬으로 결과물만 가져옵니다." },
  buildMulti: { caption: "build하고 실행하면 결과는 똑같습니다.", narr: "빌드하고 실행하면 결과는 똑같습니다." },
  size: { caption: "크기를 비교하면 387MB가 16MB로 줄었습니다. 작은 이미지는 올리고 내려받는 시간도 줄어듭니다.", narr: "크기를 비교하면 삼백팔십칠 메가바이트가 십육 메가바이트로 줄었습니다. 작은 이미지는 올리고 내려받는 시간도 줄어듭니다." },
  sum: { caption: "빌드 단계와 실행 단계를 나누면, 실행 이미지는 작고 안전해집니다.", narr: "빌드 단계와 실행 단계를 나누면, 실행 이미지는 작고 안전해집니다." },
  next: { caption: "다음 시간에는 Docker를 편하게 쓰는 VSCode를 알아봅니다.", narr: "다음 시간에는 도커를 편하게 쓰는 브이에스코드를 알아봅니다." },
};

const pres = L.newDeck("Docker 15회차 이미지 다이어트");
const narration = [];
function slide(key, notesExtra = "") {
  narration.push(T[key].narr);
  return L.baseSlide(pres, { title: key === "intro" ? L.SERIES_TITLE : TOPIC_TITLE, caption: T[key].caption, notes: T[key].caption + notesExtra });
}
const join = (ls_) => ls_.map((l) => l.replace(/ \\$/, "").trim()).join(" ").replace(PH.trim(), "").trim();
const same = (lines, file, name) => { if (join(lines) !== file[0].replace(P.trim(), "").trim()) throw new Error("명령 불일치: " + name); };

// ---- 실제 실행 결과 ----
const rd = (n) => L.readOut(out(n + ".txt"));
const tab = (l) => l.replace(/\t/g, "    ");
const mainGo = L.readOut(out("main.go")).map(tab);
const dfSingle = L.readOut(out("Dockerfile.single")), dfMulti = L.readOut(out("Dockerfile")).filter((l) => l.trim() !== "");
const bs = rd("01_build_single"), bm = rd("02_build_multi"), run = rd("03_run"), imgs = rd("04_images");
const pick = (log, re) => { const l = log.find((x) => re.test(x)); if (!l) throw new Error("로그에서 못 찾음: " + re); return l.replace(/@sha256:\w+/, ""); };
const buildSingleCmd = [PH + "docker build \\", "  -f Dockerfile.single \\", "  -t hello-single ."];
same(buildSingleCmd, bs, "01_build_single");
const rows = L.pickColumns(imgs.slice(1), ["IMAGE", "DISK USAGE"]);
const view = [rows[0], ...rows.slice(1).filter((l) => /^hello-/.test(l))];
const size = (name) => view.find((l) => l.startsWith(name)).split(/\s+/).at(-1);
if (size("hello-single") !== "387MB" || size("hello-multi") !== "16MB" || run[1] !== "Hello from Go!" || view.length !== 3) throw new Error("실행 결과/크기가 자막과 다름: " + size("hello-single") + " / " + size("hello-multi"));

// 1) 타이틀
{
  const s = slide("intro");
  s.addShape("roundRect", { ...R.screen, rectRadius: 0.2, fill: { color: C.purple }, line: { color: C.pink, width: 1.5 }, objectName: "화면영역" });
  s.addText(TOPIC, { ...R.screen, fontFace: F.title, fontSize: 30, color: C.text, align: "center", valign: "middle", isTextBox: true, objectName: "회차주제" });
}
// 2) 빌드 단계 -> 결과물 -> 실행 단계
{
  const s = slide("why");
  const box = (y, fill, line, head, sub, name) => {
    s.addShape("roundRect", { x: 0.9, y, w: 3.8, h: 0.95, rectRadius: 0.12, fill: { color: fill }, line: { color: line, width: 1.5 }, objectName: name });
    s.addText([{ text: head, options: { fontSize: 17, bold: true, breakLine: true } }, { text: sub, options: { fontSize: 12 } }],
      { x: 0.9, y, w: 3.8, h: 0.95, fontFace: F.body, color: C.text, align: "center", valign: "middle", margin: 0.03, isTextBox: true });
  };
  const arrow = (y, text) => s.addText(text, { x: 0.9, y, w: 3.8, h: 0.45, fontFace: F.mono, fontSize: 13, bold: true, color: C.pink, align: "center", valign: "middle", margin: 0, isTextBox: true });
  box(2.55, C.purple, C.pink, "빌드 단계", "golang 이미지 (컴파일러 포함, 큼)", "빌드단계");
  arrow(3.55, "▼ 결과물 hello 만 복사");
  box(4.05, C.greenDark, C.green, "실행 단계", "alpine 이미지 (작음)", "실행단계");
}
// 3) main.go
{
  const s = slide("code");
  L.terminal(s, { lines: [{ t: PH + "cat main.go" }, ...mainGo.map((t) => ({ t }))], label: "간단한 Go 프로그램", tone: "pink", fontSize: 10 });
}
// 4) 한 단계 Dockerfile
{
  const s = slide("single");
  L.terminal(s, { lines: [{ t: PH + "cat Dockerfile.single" }, ...dfSingle.map((t, i) => ({ t, hl: i === 0 }))], label: "한 단계: 컴파일러가 그대로 남음", tone: "pink", fontSize: 11 });
}
// 5) 한 단계 build
{
  const s = slide("buildSingle", " (긴 명령은 \\ 로 줄바꿈해 표시, 긴 빌드 로그 중 핵심 줄만 표시)");
  L.terminal(s, {
    lines: [...buildSingleCmd.map((t) => ({ t })), { t: "...", dim: true }, { t: L.trunc(pick(bs, /\[1\/4\] FROM/), 50) }, { t: pick(bs, /\[4\/4\] RUN go build/), hl: true }, { t: L.trunc(pick(bs, /naming to/), 50) }],
    label: "컴파일러까지 이미지에 포함", tone: "pink", fontSize: 10,
  });
}
// 6) 멀티스테이지 Dockerfile
{
  const s = slide("multi", " (빈 줄은 생략하고 표시)");
  L.terminal(s, { lines: [{ t: PH + "cat Dockerfile" }, ...dfMulti.map((t) => ({ t, hl: /^FROM|^COPY --from/.test(t) }))], label: "멀티스테이지: FROM 두 번", tone: "green", fontSize: 10 });
}
// 7) 멀티스테이지 build + run
{
  const s = slide("buildMulti", " (긴 빌드 로그 중 핵심 줄만 표시)");
  L.terminal(s, {
    lines: [{ t: PH + "docker build -t hello-multi ." }, { t: "...", dim: true }, { t: L.trunc(pick(bm, /\[build 4\/4\] RUN/), 50) }, { t: L.trunc(pick(bm, /\[stage-1 2\/2\] COPY --from/), 50), hl: true }, { t: PH + "docker run --rm hello-multi" }, { t: run[1], hl: true }],
    label: "build 후 실행: 결과는 같음", tone: "green", fontSize: 10,
  });
}
// 8) 크기 비교
{
  const s = slide("size", " (hello 이미지 행과 일부 열만 표시, 크기는 환경에 따라 조금 다를 수 있음)");
  L.terminal(s, { lines: [{ t: PH + "docker images" }, { t: view[0], dim: true }, ...view.slice(1).map((t) => ({ t, hl: true }))], label: "크기 비교: 387MB → 16MB", tone: "green", fontSize: 12 });
}
// 9) 요약
{
  const s = slide("sum");
  const rows2 = [["FROM ... AS build", "빌드 단계"], ["FROM alpine", "실행 단계"], ["COPY --from=build", "결과물만 복사"]];
  rows2.forEach(([cmd, desc], i) => {
    const y = 2.7 + i * 1.05;
    s.addShape("roundRect", { x: 0.45, y, w: 4.7, h: 0.85, rectRadius: 0.1, fill: { color: C.term }, line: { color: C.edge, width: 0.75 }, objectName: "요약행" + (i + 1) });
    s.addText(cmd, { x: 0.6, y, w: 2.7, h: 0.85, fontFace: F.mono, fontSize: 11, bold: true, color: C.pink, valign: "middle", margin: 0, isTextBox: true });
    s.addText(desc, { x: 3.3, y, w: 1.8, h: 0.85, fontFace: F.body, fontSize: 14, color: C.text, valign: "middle", margin: 0, isTextBox: true });
  });
}
// 10) 다음 회차 예고 (16회차: 기존 VSCode 콘텐츠)
{
  const s = slide("next");
  s.addShape("roundRect", { ...R.screen, rectRadius: 0.2, fill: { color: C.purple }, line: { color: C.pink, width: 1.5 }, objectName: "화면영역" });
  s.addText([{ text: "NEXT", options: { fontFace: F.mono, fontSize: 16, bold: true, color: C.pink, breakLine: true } },
    { text: "16회차", options: { fontSize: 20, breakLine: true } },
    { text: "VSCode 설치와 확장", options: { fontSize: 28 } }],
    { ...R.screen, fontFace: F.title, color: C.text, align: "center", valign: "middle", isTextBox: true, objectName: "다음회차" });
}

fs.writeFileSync(path.join(__dirname, "script.txt"), narration.join("\n") + "\n", "utf8");
pres.writeFile({ fileName: path.join(__dirname, "ep15.pptx") }).then((f) => console.log("saved", f));
