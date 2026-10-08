// 10회차 PPT 생성: node build.js  (output/ 의 실제 실행 결과와 브라우저 캡처 사용, script.txt 도 함께 생성)
const path = require("path");
const fs = require("fs");
const L = require("../tools/shorts-lib.js");
const { C, F, R } = L;
const out = (n) => path.join(__dirname, "output", n);
const PH = "user@PC:~/visits$ "; // ~/visits 폴더 안에서의 프롬프트
const TOPIC = "10회차\nCompose로 웹 + DB";
const TOPIC_TITLE = "10회차 · Compose로 웹 + DB";

// caption = 슬라이드 자막(영문 그대로), narr = 나레이션 대본(영문은 한글 발음)
const T = {
  intro: { caption: "이번 시간에는 Compose로 웹서버와 데이터베이스를 함께 실행합니다.", narr: "이번 시간에는 컴포즈로 웹서버와 데이터베이스를 함께 실행합니다." },
  why: { caption: "웹 앱이 방문 횟수를 데이터베이스에 저장하는 구조입니다. 서비스 두 개를 파일 하나로 실행합니다.", narr: "웹 앱이 방문 횟수를 데이터베이스에 저장하는 구조입니다. 서비스 두 개를 파일 하나로 실행합니다." },
  build: { caption: "web 서비스의 build: . 는 현재 폴더의 Dockerfile로 이미지를 만든다는 뜻입니다.", narr: "웹 서비스의 빌드 점은, 현재 폴더의 도커파일로 이미지를 만든다는 뜻입니다." },
  image: { caption: "데이터베이스는 이미 만들어진 redis 이미지를 그대로 사용합니다.", narr: "데이터베이스는 이미 만들어진 레디스 이미지를 그대로 사용합니다." },
  up: { caption: "docker compose up -d 하나로 이미지를 만들고 두 서비스를 함께 실행합니다.", narr: "도커 컴포즈 업 대시 디 하나로 이미지를 만들고 두 서비스를 함께 실행합니다." },
  ps: { caption: "docker compose ps로 보면 web과 db가 함께 실행 중입니다.", narr: "도커 컴포즈 피에스로 보면 웹과 디비가 함께 실행 중입니다." },
  curl: { caption: "접속할 때마다 방문 횟수가 데이터베이스에 저장되어 늘어납니다.", narr: "접속할 때마다 방문 횟수가 데이터베이스에 저장되어 늘어납니다." },
  browser: { caption: "브라우저로 접속해도 횟수가 늘어납니다.", narr: "브라우저로 접속해도 횟수가 늘어납니다." },
  name: { caption: "웹 코드는 데이터베이스를 서비스 이름 db로 찾아갑니다. 앞에서 배운 이름 접속 방식입니다.", narr: "웹 코드는 데이터베이스를 서비스 이름 디비로 찾아갑니다. 앞에서 배운 이름 접속 방식입니다." },
  down: { caption: "docker compose down으로 두 서비스를 한 번에 정리합니다.", narr: "도커 컴포즈 다운으로 두 서비스를 한 번에 정리합니다." },
  sum: { caption: "build와 image로 서비스를 정하고, 이름으로 서로 찾아 연결합니다.", narr: "빌드와 이미지로 서비스를 정하고, 이름으로 서로 찾아 연결합니다." },
  next: { caption: "다음 시간에는 설정을 다듬는 환경변수와 healthcheck를 알아봅니다.", narr: "다음 시간에는 설정을 다듬는 환경변수와 헬스체크를 알아봅니다." },
};

const pres = L.newDeck("Docker 10회차 Compose로 웹 + DB");
const narration = [];
function slide(key, notesExtra = "") {
  narration.push(T[key].narr);
  return L.baseSlide(pres, { title: key === "intro" ? L.SERIES_TITLE : TOPIC_TITLE, caption: T[key].caption, notes: T[key].caption + notesExtra });
}

// ---- 실제 실행 결과 ----
const rd = (n) => L.readOut(out(n + ".txt"));
const yaml = L.readOut(out("compose.yaml"));
const up = rd("01_up").filter((l) => /^ (Image|Network|Container) /.test(l));
const down = rd("06_down").filter((l) => /Removed/.test(l));
const ps = L.pickColumns(rd("02_ps").slice(1), ["NAME", "STATUS", "PORTS"]);
const curl1 = rd("03_curl1"), curl2 = rd("04_curl2"), grep = rd("05_grep");
const idx = (re) => { const i = yaml.findIndex((l) => re.test(l)); if (i < 0) throw new Error("compose.yaml 에서 못 찾음: " + re); return i; };
const iBuild = idx(/build:/), iImage = idx(/image: redis/);
const upKey = up.filter((l) => /Image .* Built|Network .* Created|Container .* Started/.test(l));
if (upKey.length < 4 || down.length < 3 || curl1[1] !== "Visits: 1" || curl2[1] !== "Visits: 2" || !grep[1].includes('("db", 6379)')) throw new Error("실행 결과가 예상과 다름");
const catView = (hl) => [{ t: PH + "cat compose.yaml" }, ...yaml.map((t, i) => ({ t, hl: i === hl }))];

// 1) 타이틀
{
  const s = slide("intro");
  s.addShape("roundRect", { ...R.screen, rectRadius: 0.2, fill: { color: C.purple }, line: { color: C.pink, width: 1.5 }, objectName: "화면영역" });
  s.addText(TOPIC, { ...R.screen, fontFace: F.title, fontSize: 30, color: C.text, align: "center", valign: "middle", isTextBox: true, objectName: "회차주제" });
}

// 2) 구조: 브라우저 -> web -> db
{
  const s = slide("why");
  s.addText("브라우저", { x: 0.35, y: 2.45, w: 4.9, h: 0.4, fontFace: F.body, fontSize: 13, color: C.dim, align: "center", valign: "middle", margin: 0, isTextBox: true });
  s.addText("▼", { x: 0.35, y: 2.8, w: 4.9, h: 0.35, fontFace: F.mono, fontSize: 14, bold: true, color: C.pink, align: "center", valign: "middle", margin: 0, isTextBox: true });
  s.addShape("roundRect", { x: 0.35, y: 3.2, w: 4.9, h: 2.9, rectRadius: 0.15, fill: { color: C.term }, line: { color: C.pink, width: 1.5, dashType: "dash" }, objectName: "컴포즈영역" });
  s.addText("Compose", { x: 0.35, y: 3.22, w: 4.9, h: 0.4, fontFace: F.mono, fontSize: 12, bold: true, color: C.pink, align: "center", valign: "middle", margin: 0, isTextBox: true });
  const card = (x, head, sub, fill, line, name) => {
    s.addShape("roundRect", { x, y: 3.75, w: 1.8, h: 1.7, rectRadius: 0.12, fill: { color: fill }, line: { color: line, width: 1.5 }, objectName: name });
    s.addText([{ text: head, options: { fontSize: 18, bold: true, breakLine: true } }, { text: sub, options: { fontSize: 12 } }],
      { x, y: 3.75, w: 1.8, h: 1.7, fontFace: F.body, color: C.text, align: "center", valign: "middle", margin: 0.03, isTextBox: true });
  };
  card(0.6, "web", "파이썬 웹 앱", C.purple, C.pink, "web");
  card(3.45, "db", "redis 데이터베이스", C.greenDark, C.green, "db");
  s.addShape("rightArrow", { x: 2.5, y: 4.3, w: 0.85, h: 0.45, fill: { color: C.pink }, line: { color: C.pink, width: 0.5 }, objectName: "저장화살표" });
  s.addText("방문 횟수 저장", { x: 0.35, y: 5.55, w: 4.9, h: 0.4, fontFace: F.body, fontSize: 12, color: C.dim, align: "center", valign: "middle", margin: 0, isTextBox: true });
}

// 3) build / 4) image
{
  const s = slide("build");
  L.terminal(s, { lines: catView(iBuild), label: "web: 내 Dockerfile 로 이미지 만들기", tone: "pink", fontSize: 10 });
}
{
  const s = slide("image");
  L.terminal(s, { lines: catView(iImage), label: "db: 만들어진 이미지 사용", tone: "pink", fontSize: 10 });
}

// 5) up (핵심 로그 줄)
{
  const s = slide("up", " (빌드 진행 로그와 중간 단계는 생략하고 핵심 줄만 표시)");
  L.terminal(s, { lines: [{ t: PH + "docker compose up -d" }, ...upKey.map((t) => ({ t, hl: /Started/.test(t) }))], label: "이미지 빌드 + 두 서비스 실행", tone: "green", fontSize: 11 });
}

// 6) ps
{
  const s = slide("ps", " (일부 열 생략)");
  L.terminal(s, { lines: [{ t: PH + "docker compose ps" }, ...ps.map((t, i) => ({ t, dim: i === 0, hl: i > 0 }))], label: "web 과 db 가 함께 실행 중", tone: "green", fontSize: 10 });
}

// 7) curl 두 번
{
  const s = slide("curl", " (터미널에서 curl 은 본문만 출력)");
  L.terminal(s, {
    lines: [{ t: PH + "curl localhost:8000" }, { t: curl1[1], hl: true }, { t: PH + "curl localhost:8000" }, { t: curl2[1], hl: true }],
    label: "접속할 때마다 횟수가 늘어남", tone: "green", fontSize: 12,
  });
}

// 8) 브라우저 (실제 캡처)
{
  const s = slide("browser");
  L.browserFrame(s, { path: out("browser.png"), url: "localhost:8000", aspect: 900 / 240, altText: "localhost:8000 - Visits: 3" });
}

// 9) 서비스 이름 db 로 접속
{
  const s = slide("name");
  const col = grep[1].indexOf('"db"');
  L.terminal(s, { lines: [{ t: PH + "grep -n create_connection app.py" }, { t: grep[1], hlCols: [col, col + 4] }], label: "서비스 이름 db = 접속 주소", tone: "pink", fontSize: 11 });
}

// 10) down (Removed 줄)
{
  const s = slide("down", " (중간 단계는 생략하고 Removed 줄만 표시)");
  L.terminal(s, { lines: [{ t: PH + "docker compose down" }, ...down.map((t) => ({ t, hl: true }))], label: "한 번에 정리", tone: "pink", fontSize: 11 });
}

// 11) 요약
{
  const s = slide("sum");
  const rows = [["build: .", "내 Dockerfile 로 만들기"], ["image: ...", "만들어진 이미지 쓰기"], ["db", "서비스 이름 = 주소"]];
  rows.forEach(([cmd, desc], i) => {
    const y = 2.7 + i * 1.05;
    s.addShape("roundRect", { x: 0.45, y, w: 4.7, h: 0.85, rectRadius: 0.1, fill: { color: C.term }, line: { color: C.edge, width: 0.75 }, objectName: "요약행" + (i + 1) });
    s.addText(cmd, { x: 0.6, y, w: 1.8, h: 0.85, fontFace: F.mono, fontSize: 13, bold: true, color: C.pink, valign: "middle", margin: 0, isTextBox: true });
    s.addText(desc, { x: 2.4, y, w: 2.7, h: 0.85, fontFace: F.body, fontSize: 14, color: C.text, valign: "middle", margin: 0, isTextBox: true });
  });
}

// 12) 다음 회차 예고
{
  const s = slide("next");
  s.addShape("roundRect", { ...R.screen, rectRadius: 0.2, fill: { color: C.purple }, line: { color: C.pink, width: 1.5 }, objectName: "화면영역" });
  s.addText([{ text: "NEXT", options: { fontFace: F.mono, fontSize: 16, bold: true, color: C.pink, breakLine: true } },
    { text: "11회차", options: { fontSize: 20, breakLine: true } },
    { text: "Compose 설정 다듬기", options: { fontSize: 28 } }],
    { ...R.screen, fontFace: F.title, color: C.text, align: "center", valign: "middle", isTextBox: true, objectName: "다음회차" });
}

fs.writeFileSync(path.join(__dirname, "script.txt"), narration.join("\n") + "\n", "utf8");
pres.writeFile({ fileName: path.join(__dirname, "ep10.pptx") }).then((f) => console.log("saved", f));
