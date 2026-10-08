// 4회차 PPT 생성: node build.js  (output/ 의 실제 실행 결과와 브라우저 캡처 사용, script.txt 도 함께 생성)
const path = require("path");
const fs = require("fs");
const L = require("../tools/shorts-lib.js");
const { C, F, R } = L;
const out = (n) => path.join(__dirname, "output", n);
const P = "user@PC:~$ ";
const TOPIC = "4회차\n웹서버 띄우기";
const TOPIC_TITLE = "4회차 · 웹서버 띄우기";

// caption = 슬라이드 자막(영문 그대로), narr = 나레이션 대본(영문은 한글 발음)
const T = {
  intro: { caption: "이번 시간에는 컨테이너 안의 웹서버를 열고, 설정값을 전달하는 방법을 알아봅니다.", narr: "이번 시간에는 컨테이너 안의 웹서버를 열고, 설정값을 전달하는 방법을 알아봅니다." },
  port: { caption: "컨테이너 안의 웹서버에 접속하려면 내 컴퓨터의 포트와 컨테이너의 포트를 연결해야 합니다.", narr: "컨테이너 안의 웹서버에 접속하려면 내 컴퓨터의 포트와 컨테이너의 포트를 연결해야 합니다." },
  run: { caption: "docker run에 -p 옵션으로 포트를 연결합니다. 앞의 숫자가 내 컴퓨터, 뒤의 숫자가 컨테이너 포트입니다.", narr: "도커 런에 피 옵션으로 포트를 연결합니다. 앞의 숫자가 내 컴퓨터, 뒤의 숫자가 컨테이너 포트입니다." },
  ps: { caption: "docker ps의 PORTS 열에서 연결된 포트를 확인할 수 있습니다.", narr: "도커 피에스의 포츠 열에서 연결된 포트를 확인할 수 있습니다." },
  browser: { caption: "브라우저에서 localhost:8080에 접속하면 nginx 환영 페이지가 보입니다.", narr: "브라우저에서 로컬호스트 콜론 팔천팔십에 접속하면 엔진엑스 환영 페이지가 보입니다." },
  two: { caption: "포트 번호만 바꾸면 같은 웹서버를 여러 개 띄울 수 있습니다.", narr: "포트 번호만 바꾸면 같은 웹서버를 여러 개 띄울 수 있습니다." },
  envIntro: { caption: "웹서버에 설정값을 전달하고 싶을 때는 환경변수를 사용합니다.", narr: "웹서버에 설정값을 전달하고 싶을 때는 환경변수를 사용합니다." },
  env: { caption: "docker run의 -e 옵션으로 환경변수를 전달하면 컨테이너 안에서 읽을 수 있습니다. --rm 옵션은 실행이 끝나면 컨테이너를 자동으로 지웁니다.", narr: "도커 런의 이 옵션으로 환경변수를 전달하면 컨테이너 안에서 읽을 수 있습니다. 알엠 옵션은 실행이 끝나면 컨테이너를 자동으로 지웁니다." },
  sum: { caption: "-p로 포트를 연결하고,\n-e로 환경변수를 전달하고,\n--rm으로 자동 삭제합니다.", narr: "피 옵션으로 포트를 연결하고, 이 옵션으로 환경변수를 전달하고, 알엠 옵션으로 자동 삭제합니다." },
  next: { caption: "다음 시간에는 컨테이너가 지워져도 데이터를 지키는 볼륨을 알아봅니다.", narr: "다음 시간에는 컨테이너가 지워져도 데이터를 지키는 볼륨을 알아봅니다." },
};

const pres = L.newDeck("Docker 4회차 웹서버 띄우기");
const narration = [];
function slide(key, notesExtra = "") {
  narration.push(T[key].narr);
  return L.baseSlide(pres, { title: key === "intro" ? L.SERIES_TITLE : TOPIC_TITLE, caption: T[key].caption, notes: T[key].caption.replace(/\n/g, " ") + notesExtra });
}
const card = (s, x, y, w, h, fill, line, head, sub, name) => {
  s.addShape("roundRect", { x, y, w, h, rectRadius: 0.12, fill: { color: fill }, line: { color: line, width: 1.5 }, objectName: name });
  s.addText([{ text: head, options: { fontSize: 17, bold: true, breakLine: true } }, { text: sub, options: { fontSize: 12 } }],
    { x, y, w, h, fontFace: F.body, color: C.text, align: "center", valign: "middle", margin: 0.03, isTextBox: true });
};

// ---- 실제 출력에서 화면용 줄 ----
const rd = (n) => L.readOut(out(n + ".txt"));
const run1 = rd("01_run"), run2 = rd("03_run2");
// 긴 명령은 \ 로 나눠 표시 (실제 실행한 한 줄 명령과 동일): 줄1 = 이름까지, 줄2 = -p 와 이미지
const splitRun = (cmd) => { const i = cmd.indexOf(" -p "); return [cmd.slice(0, i) + " \\", "  " + cmd.slice(i + 1)]; };
const ps1 = L.pickColumns(rd("02_ps").slice(1), ["NAMES", "PORTS"]);
const ps2 = L.pickColumns(rd("04_ps2").slice(1), ["NAMES", "PORTS"]);
const env = rd("05_env");
const TERM = { tone: "green", fontSize: 11 };

// 1) 타이틀 + 회차 주제
{
  const s = slide("intro");
  s.addShape("roundRect", { ...R.screen, rectRadius: 0.2, fill: { color: C.purple }, line: { color: C.pink, width: 1.5 }, objectName: "화면영역" });
  s.addText(TOPIC, { ...R.screen, fontFace: F.title, fontSize: 34, color: C.text, align: "center", valign: "middle", isTextBox: true, objectName: "회차주제" });
}

// 2) 포트 연결 도식
{
  const s = slide("port");
  card(s, 0.4, 3.1, 1.7, 1.7, C.purple, C.pink, "내 컴퓨터", "포트 8080", "내컴퓨터");
  card(s, 3.5, 3.1, 1.7, 1.7, C.greenDark, C.green, "컨테이너", "포트 80 (nginx)", "컨테이너");
  s.addShape("rightArrow", { x: 2.3, y: 3.5, w: 1.0, h: 0.5, fill: { color: C.pink }, line: { color: C.pink, width: 0.5 }, objectName: "연결화살표" });
  s.addText("-p 8080:80", { x: 2.15, y: 4.05, w: 1.3, h: 0.4, fontFace: F.mono, fontSize: 11, bold: true, color: C.pink, align: "center", valign: "middle", margin: 0, isTextBox: true });
  s.addText("브라우저  localhost:8080", { x: 0.4, y: 2.55, w: 2.4, h: 0.4, fontFace: F.body, fontSize: 11, color: C.dim, align: "left", valign: "middle", margin: 0, isTextBox: true });
}

// 3) run -p
{
  const s = slide("run", " (긴 명령은 \\ 로 줄바꿈해 표시, 컨테이너 ID는 앞부분만 표시)");
  const [l1, l2] = splitRun(run1[0]);
  L.terminal(s, { lines: [{ t: l1 }, { t: l2, hlCols: [2, 12] }, { t: L.trunc(run1[1], 40) }], label: "포트 연결: -p 내컴퓨터:컨테이너", tone: "pink", fontSize: 11 });
}

// 4) ps PORTS
{
  const s = slide("ps", " (일부 열 생략)");
  const c = ps1[0].indexOf("PORTS");
  L.terminal(s, { lines: [{ t: P + "docker ps" }, { t: ps1[0], dim: true, hlCols: [c, c + 5] }, { t: ps1[1], hlCols: [c, ps1[1].length] }], label: "연결된 포트: PORTS", ...TERM });
}

// 5) 브라우저 화면 (실제 캡처)
{
  const s = slide("browser");
  const x = 0.35, w = 4.9, barH = 0.42, imgH = (w * 560) / 900, y = 2.5;
  s.addShape("roundRect", { x, y, w, h: barH + imgH, rectRadius: 0.08, fill: { color: "FFFFFF" }, line: { color: C.edge, width: 1 }, objectName: "브라우저프레임" });
  s.addShape("rect", { x: x + 0.02, y: y + 0.02, w: w - 0.04, h: barH - 0.02, fill: { color: "E8EAED" }, line: { color: "E8EAED", width: 0.25 }, objectName: "주소창영역" });
  s.addShape("roundRect", { x: x + 0.15, y: y + 0.07, w: w - 0.3, h: 0.28, rectRadius: 0.14, fill: { color: "FFFFFF" }, line: { color: "D0D3D8", width: 0.5 }, objectName: "주소창" });
  s.addText("localhost:8080", { x: x + 0.3, y: y + 0.07, w: w - 0.6, h: 0.28, fontFace: "Arial", fontSize: 12, color: "202124", valign: "middle", margin: 0, isTextBox: true });
  s.addImage({ path: out("browser.png"), x: x + 0.02, y: y + barH, w: w - 0.04, h: imgH - 0.02, altText: "localhost:8080 에서 보이는 nginx 환영 페이지" });
}

// 6) 두 번째 컨테이너 (8081)
{
  const s = slide("two", " (긴 명령은 \\ 로 줄바꿈해 표시, 일부 열 생략)");
  const [l1, l2] = splitRun(run2[0]);
  const c = ps2[0].indexOf("PORTS");
  L.terminal(s, {
    lines: [{ t: l1 }, { t: l2, hlCols: [2, 12] }, { t: L.trunc(run2[1], 40) }, { t: P + "docker ps" },
      { t: ps2[0], dim: true }, { t: ps2[1], hl: false, hlCols: [c, ps2[1].length] }, { t: ps2[2], hlCols: [c, ps2[2].length] }],
    label: "같은 이미지, 다른 포트", ...TERM,
  });
}

// 7) 환경변수 도식
{
  const s = slide("envIntro");
  card(s, 0.9, 2.7, 3.8, 1.2, C.purple, C.pink, "MY_NAME=Docker", "설정값 (이름=값)", "환경변수카드");
  s.addText("▼  -e", { x: 0.9, y: 4.0, w: 3.8, h: 0.5, fontFace: F.mono, fontSize: 14, bold: true, color: C.pink, align: "center", valign: "middle", margin: 0, isTextBox: true });
  card(s, 0.9, 4.65, 3.8, 1.2, C.greenDark, C.green, "컨테이너", "안의 프로그램이 읽어서 사용", "컨테이너카드");
}

// 8) -e 와 --rm  (한 줄 명령을 \ 로 나눠 표시: 실제 실행한 명령과 동일)
{
  const s = slide("env", ` (실제 실행한 명령: ${env[0].replace(P, "")})`);
  L.terminal(s, {
    lines: [{ t: P + "docker run --rm \\" }, { t: "  -e MY_NAME=Docker \\", hl: true }, { t: "  nginx:alpine printenv MY_NAME" }, { t: env[1] }],
    label: "환경변수 전달: -e KEY=값", tone: "pink", fontSize: 11,
  });
}

// 9) 요약
{
  const s = slide("sum");
  const rows = [["-p 8080:80", "포트 연결"], ["-e KEY=값", "환경변수 전달"], ["--rm", "종료 후 자동 삭제"], ["localhost:8080", "브라우저 접속 주소"]];
  rows.forEach(([cmd, desc], i) => {
    const y = 2.6 + i * 0.95;
    s.addShape("roundRect", { x: 0.45, y, w: 4.7, h: 0.8, rectRadius: 0.1, fill: { color: C.term }, line: { color: C.edge, width: 0.75 }, objectName: "요약행" + (i + 1) });
    s.addText(cmd, { x: 0.6, y, w: 2.2, h: 0.8, fontFace: F.mono, fontSize: 13, bold: true, color: C.pink, valign: "middle", margin: 0, isTextBox: true });
    s.addText(desc, { x: 2.85, y, w: 2.2, h: 0.8, fontFace: F.body, fontSize: 14, color: C.text, valign: "middle", margin: 0, isTextBox: true });
  });
}

// 10) 다음 회차 예고
{
  const s = slide("next");
  s.addShape("roundRect", { ...R.screen, rectRadius: 0.2, fill: { color: C.purple }, line: { color: C.pink, width: 1.5 }, objectName: "화면영역" });
  s.addText([{ text: "NEXT", options: { fontFace: F.mono, fontSize: 16, bold: true, color: C.pink, breakLine: true } },
    { text: "5회차", options: { fontSize: 20, breakLine: true } },
    { text: "데이터 지키기: 볼륨", options: { fontSize: 28 } }],
    { ...R.screen, fontFace: F.title, color: C.text, align: "center", valign: "middle", isTextBox: true, objectName: "다음회차" });
}

fs.writeFileSync(path.join(__dirname, "script.txt"), narration.join("\n") + "\n", "utf8");
pres.writeFile({ fileName: path.join(__dirname, "ep04.pptx") }).then((f) => console.log("saved", f));
