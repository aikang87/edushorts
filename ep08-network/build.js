// 8회차 PPT 생성: node build.js  (output/ 의 실제 실행 결과 사용, script.txt 도 함께 생성)
const path = require("path");
const fs = require("fs");
const L = require("../tools/shorts-lib.js");
const { C, F, R } = L;
const out = (n) => path.join(__dirname, "output", n);
const P = "user@PC:~$ ";
const TOPIC = "8회차\n컨테이너 네트워크";
const TOPIC_TITLE = "8회차 · 컨테이너 네트워크";

// caption = 슬라이드 자막(영문 그대로), narr = 나레이션 대본(영문은 한글 발음)
const T = {
  intro: { caption: "이번 시간에는 컨테이너끼리 이름으로 대화하는 네트워크를 알아봅니다.", narr: "이번 시간에는 컨테이너끼리 이름으로 대화하는 네트워크를 알아봅니다." },
  why: { caption: "같은 네트워크에 있는 컨테이너는 서로의 이름으로 접속할 수 있습니다. 웹서버와 데이터베이스를 연결할 때 꼭 필요한 방법입니다.", narr: "같은 네트워크에 있는 컨테이너는 서로의 이름으로 접속할 수 있습니다. 웹서버와 데이터베이스를 연결할 때 꼭 필요한 방법입니다." },
  create: { caption: "docker network create로 네트워크를 만들고, ls로 목록을 확인합니다.", narr: "도커 네트워크 크리에이트로 네트워크를 만들고, 엘에스로 목록을 확인합니다." },
  web: { caption: "--network 옵션으로 웹서버 컨테이너를 방금 만든 네트워크에 연결합니다. 컨테이너의 이름 web이, 이 네트워크에서 쓰는 이름이 됩니다.", narr: "네트워크 옵션으로 웹서버 컨테이너를 방금 만든 네트워크에 연결합니다. 컨테이너의 이름 웹이, 이 네트워크에서 쓰는 이름이 됩니다." },
  cmd: { caption: "다른 컨테이너에서 웹서버의 이름으로 접속해 봅니다. wget은 주소의 내용을 가져오는 명령입니다.", narr: "다른 컨테이너에서 웹서버의 이름으로 접속해 봅니다. 와이겟은 주소의 내용을 가져오는 명령입니다." },
  result: { caption: "이름만으로 웹서버의 응답이 돌아옵니다. IP 주소를 몰라도 됩니다.", narr: "이름만으로 웹서버의 응답이 돌아옵니다. 아이피 주소를 몰라도 됩니다." },
  fail: { caption: "네트워크를 지정하지 않은 기본 네트워크에서는 이름을 찾지 못해 접속할 수 없습니다.", narr: "네트워크를 지정하지 않은 기본 네트워크에서는 이름을 찾지 못해 접속할 수 없습니다." },
  sum: { caption: "네트워크를 만들고 컨테이너를 연결하면, 이름으로 서로 찾을 수 있습니다.", narr: "네트워크를 만들고 컨테이너를 연결하면, 이름으로 서로 찾을 수 있습니다." },
  next: { caption: "다음 시간에는 여러 컨테이너를 한 번에 실행하는 Docker Compose를 알아봅니다.", narr: "다음 시간에는 여러 컨테이너를 한 번에 실행하는 도커 컴포즈를 알아봅니다." },
};

const pres = L.newDeck("Docker 8회차 컨테이너 네트워크");
const narration = [];
function slide(key, notesExtra = "") {
  narration.push(T[key].narr);
  return L.baseSlide(pres, { title: key === "intro" ? L.SERIES_TITLE : TOPIC_TITLE, caption: T[key].caption, notes: T[key].caption + notesExtra });
}

// ---- 실제 실행 결과 ----
const rd = (n) => L.readOut(out(n + ".txt"));
const create = rd("01_net_create"), nls = rd("02_net_ls");
const runWeb = rd("03_run_web"), wget = rd("04_wget"), runWeb2 = rd("05_run_web2"), fail = rd("06_wget_fail");
// 실제 실행한 한 줄 명령 == 화면에 \ 로 나눠 표시한 명령인지 확인
const join = (ls_) => ls_.map((l) => l.replace(/ \\$/, "").trim()).join(" ").replace(P.trim(), "").trim();
const wgetCmd = [P + "docker run --rm \\", "  --network mynet alpine \\", "  wget -qO- http://web"];
const webCmd = [P + "docker run -d --name web \\", "  --network mynet nginx:alpine"];
const failCmd = [P + "docker run --rm alpine \\", "  wget -qO- http://web2"];
for (const [lines, file] of [[wgetCmd, wget], [webCmd, runWeb], [failCmd, fail]]) {
  if (join(lines) !== file[0].replace(P.trim(), "").trim()) throw new Error("명령 불일치: " + file[0]);
}
const titleLine = wget.find((l) => l.includes("<title>"));
if (!titleLine || !fail[1].includes("bad address")) throw new Error("실행 결과가 예상과 다름");
const hostCol = wgetCmd[2].indexOf("http://web");

// 1) 타이틀
{
  const s = slide("intro");
  s.addShape("roundRect", { ...R.screen, rectRadius: 0.2, fill: { color: C.purple }, line: { color: C.pink, width: 1.5 }, objectName: "화면영역" });
  s.addText(TOPIC, { ...R.screen, fontFace: F.title, fontSize: 32, color: C.text, align: "center", valign: "middle", isTextBox: true, objectName: "회차주제" });
}

// 2) 같은 네트워크 안에서 이름으로 접속
{
  const s = slide("why");
  s.addShape("roundRect", { x: 0.35, y: 2.6, w: 4.9, h: 3.3, rectRadius: 0.15, fill: { color: C.term }, line: { color: C.pink, width: 1.5, dashType: "dash" }, objectName: "네트워크영역" });
  s.addText("네트워크: mynet", { x: 0.35, y: 2.65, w: 4.9, h: 0.45, fontFace: F.mono, fontSize: 13, bold: true, color: C.pink, align: "center", valign: "middle", margin: 0, isTextBox: true });
  const card = (x, head, sub, fill, line, name) => {
    s.addShape("roundRect", { x, y: 3.5, w: 1.7, h: 1.6, rectRadius: 0.12, fill: { color: fill }, line: { color: line, width: 1.5 }, objectName: name });
    s.addText([{ text: head, options: { fontSize: 17, bold: true, breakLine: true } }, { text: sub, options: { fontSize: 12 } }],
      { x, y: 3.5, w: 1.7, h: 1.6, fontFace: F.body, color: C.text, align: "center", valign: "middle", margin: 0.03, isTextBox: true });
  };
  card(0.6, "alpine", "접속하는 쪽", C.purple, C.pink, "클라이언트");
  card(3.3, "web", "nginx 웹서버", C.greenDark, C.green, "웹서버");
  s.addShape("rightArrow", { x: 2.4, y: 3.9, w: 0.8, h: 0.45, fill: { color: C.pink }, line: { color: C.pink, width: 0.5 }, objectName: "접속화살표" });
  s.addText("http://web", { x: 1.9, y: 4.4, w: 1.8, h: 0.4, fontFace: F.mono, fontSize: 11, bold: true, color: C.pink, align: "center", valign: "middle", margin: 0, isTextBox: true });
  s.addText("이름으로 접속", { x: 0.35, y: 5.3, w: 4.9, h: 0.4, fontFace: F.body, fontSize: 12, color: C.dim, align: "center", valign: "middle", margin: 0, isTextBox: true });
}

// 3) network create / ls
{
  const s = slide("create");
  L.terminal(s, {
    lines: [{ t: create[0], hl: true }, { t: L.trunc(create[1], 24) }, { t: nls[0] }, { t: nls[1], dim: true }, ...nls.slice(2).map((t) => ({ t, hl: /\bmynet\b/.test(t) }))],
    label: "네트워크 만들기: docker network create", tone: "pink", fontSize: 10,
  });
}

// 4) 웹서버를 mynet 에 연결
{
  const s = slide("web", " (긴 명령은 \\ 로 줄바꿈해 표시, 컨테이너 ID는 앞부분만 표시)");
  L.terminal(s, { lines: [{ t: webCmd[0] }, { t: webCmd[1], hlCols: [2, 17] }, { t: L.trunc(runWeb[1], 40) }], label: "네트워크 연결: --network 이름", tone: "pink", fontSize: 11 });
}

// 5a) 이름으로 접속하는 명령
{
  const s = slide("cmd", " (긴 명령은 \\ 로 줄바꿈해 표시)");
  L.terminal(s, { lines: wgetCmd.map((t, i) => ({ t, hlCols: i === 2 ? [hostCol, hostCol + 10] : undefined })), label: "다른 컨테이너에서 이름으로 접속", tone: "pink", fontSize: 12 });
}

// 5b) 결과
{
  const s = slide("result", " (긴 응답 중 앞부분만 표시)");
  L.terminal(s, {
    lines: [...wgetCmd.map((t, i) => ({ t, hlCols: i === 2 ? [hostCol, hostCol + 10] : undefined })), ...wget.slice(1, 5).map((t) => ({ t, hl: t === titleLine })), { t: "...", dim: true }],
    label: "웹서버의 응답", tone: "green", fontSize: 10,
  });
}

// 6) 기본 네트워크: 이름으로 접속 불가
{
  const s = slide("fail", " (긴 명령은 \\ 로 줄바꿈해 표시, 컨테이너 ID는 앞부분만 표시)");
  L.terminal(s, {
    lines: [{ t: runWeb2[0] }, { t: L.trunc(runWeb2[1], 40) }, { t: failCmd[0] }, { t: failCmd[1] }, { t: fail[1], hl: true }],
    label: "기본 네트워크: 이름 찾기 실패", tone: "pink", fontSize: 11,
  });
}

// 7) 요약
{
  const s = slide("sum");
  const rows = [["network create", "네트워크 만들기"], ["--network 이름", "네트워크에 연결"], ["http://컨테이너이름", "이름으로 접속"]];
  rows.forEach(([cmd, desc], i) => {
    const y = 2.7 + i * 1.05;
    s.addShape("roundRect", { x: 0.45, y, w: 4.7, h: 0.85, rectRadius: 0.1, fill: { color: C.term }, line: { color: C.edge, width: 0.75 }, objectName: "요약행" + (i + 1) });
    s.addText(cmd, { x: 0.6, y, w: 2.5, h: 0.85, fontFace: F.mono, fontSize: 12, bold: true, color: C.pink, valign: "middle", margin: 0, isTextBox: true });
    s.addText(desc, { x: 3.2, y, w: 1.9, h: 0.85, fontFace: F.body, fontSize: 14, color: C.text, valign: "middle", margin: 0, isTextBox: true });
  });
}

// 8) 다음 회차 예고
{
  const s = slide("next");
  s.addShape("roundRect", { ...R.screen, rectRadius: 0.2, fill: { color: C.purple }, line: { color: C.pink, width: 1.5 }, objectName: "화면영역" });
  s.addText([{ text: "NEXT", options: { fontFace: F.mono, fontSize: 16, bold: true, color: C.pink, breakLine: true } },
    { text: "9회차", options: { fontSize: 20, breakLine: true } },
    { text: "Docker Compose 입문", options: { fontSize: 26 } }],
    { ...R.screen, fontFace: F.title, color: C.text, align: "center", valign: "middle", isTextBox: true, objectName: "다음회차" });
}

fs.writeFileSync(path.join(__dirname, "script.txt"), narration.join("\n") + "\n", "utf8");
pres.writeFile({ fileName: path.join(__dirname, "ep08.pptx") }).then((f) => console.log("saved", f));
