// 11회차 PPT 생성: node build.js  (output/ 의 실제 실행 결과 사용, script.txt 도 함께 생성)
const path = require("path");
const fs = require("fs");
const L = require("../tools/shorts-lib.js");
const { C, F, R } = L;
const out = (n) => path.join(__dirname, "output", n);
const PH = "user@PC:~/visits$ "; // 10회차와 같은 ~/visits 프로젝트 폴더
const TOPIC = "11회차\nCompose 설정 다듬기";
const TOPIC_TITLE = "11회차 · Compose 설정 다듬기";

// caption = 슬라이드 자막(영문 그대로), narr = 나레이션 대본(영문은 한글 발음)
const T = {
  intro: { caption: "이번 시간에는 Compose 설정을 다듬는 방법을 알아봅니다. .env 파일, healthcheck, depends_on입니다.", narr: "이번 시간에는 컴포즈 설정을 다듬는 방법을 알아봅니다. 점엔브 파일, 헬스체크, 디펜즈 온입니다." },
  three: { caption: "지난 시간에 만든 웹과 db 프로젝트에 세 가지 설정을 더해 봅니다.", narr: "지난 시간에 만든 웹과 디비 프로젝트에 세 가지 설정을 더해 봅니다." },
  env: { caption: "포트 번호처럼 바뀔 수 있는 값은 .env 파일에 적고, compose.yaml에서는 변수 이름으로 가져옵니다.", narr: "포트 번호처럼 바뀔 수 있는 값은 점엔브 파일에 적고, 컴포즈 파일에서는 변수 이름으로 가져옵니다." },
  health: { caption: "healthcheck는 서비스가 정상인지 주기적으로 검사하는 명령입니다. redis는 ping에 응답하면 정상입니다.", narr: "헬스체크는 서비스가 정상인지 주기적으로 검사하는 명령입니다. 레디스는 핑에 응답하면 정상입니다." },
  depends: { caption: "depends_on에 service_healthy를 적으면, db가 정상이 된 뒤에 web을 시작합니다.", narr: "디펜즈 온에 서비스 헬시를 적으면, 디비가 정상이 된 뒤에 웹을 시작합니다." },
  up: { caption: "docker compose up -d를 실행하면 db가 Healthy 상태가 된 뒤에 web이 시작됩니다. 정상이 될 때까지 기다리므로 연결 오류를 줄일 수 있습니다.", narr: "도커 컴포즈 업 대시 디를 실행하면 디비가 헬시 상태가 된 뒤에 웹이 시작됩니다. 정상이 될 때까지 기다리므로 연결 오류를 줄일 수 있습니다." },
  ps: { caption: "docker compose ps에서 db 상태에 healthy가 표시됩니다.", narr: "도커 컴포즈 피에스에서 디비 상태에 헬시가 표시됩니다." },
  curl: { caption: ".env에 적은 8080 포트로 접속합니다.", narr: "점엔브에 적은 팔천팔십 포트로 접속합니다." },
  sum: { caption: ".env는 값 분리, healthcheck는 상태 검사, depends_on은 시작 순서입니다.", narr: "점엔브는 값 분리, 헬스체크는 상태 검사, 디펜즈 온은 시작 순서입니다." },
  next: { caption: "다음 시간에는 restart와 리소스 제한, profiles를 알아봅니다.", narr: "다음 시간에는 리스타트와 리소스 제한, 프로파일즈를 알아봅니다." },
};

const pres = L.newDeck("Docker 11회차 Compose 설정 다듬기");
const narration = [];
function slide(key, notesExtra = "") {
  narration.push(T[key].narr);
  return L.baseSlide(pres, { title: key === "intro" ? L.SERIES_TITLE : TOPIC_TITLE, caption: T[key].caption, notes: T[key].caption + notesExtra });
}

// ---- 실제 실행 결과 ----
const rd = (n) => L.readOut(out(n + ".txt"));
const yaml = L.readOut(out("compose.yaml"));
const envLine = L.readOut(out("dotenv.txt"))[0];
const portLine = rd("02_grep")[1];
const up = rd("03_up").filter((l) => /^ Container /.test(l));
const ps = L.pickColumns(rd("04_ps").slice(1), ["NAME", "STATUS"]);
const curl = rd("05_curl");
const y = (re) => { const l = yaml.find((x) => re.test(x)); if (!l) throw new Error("compose.yaml 에서 못 찾음: " + re); return l; };
const upKey = ["visits-db-1 Started", "visits-db-1 Waiting", "visits-db-1 Healthy", "visits-web-1 Started"].map((k) => {
  const l = up.find((x) => x.includes(k)); if (!l) throw new Error("up 로그에서 못 찾음: " + k); return l;
});
const iH = up.findIndex((l) => l.includes("db-1 Healthy")), iW = up.findIndex((l) => l.includes("web-1 Started"));
if (iH < 0 || iW < iH) throw new Error("db Healthy 가 web Started 보다 먼저여야 함");
if (!ps[1].includes("(healthy)") || curl[1] !== "Visits: 1" || envLine !== "WEB_PORT=8080") throw new Error("실행 결과가 예상과 다름");

// 1) 타이틀
{
  const s = slide("intro");
  s.addShape("roundRect", { ...R.screen, rectRadius: 0.2, fill: { color: C.purple }, line: { color: C.pink, width: 1.5 }, objectName: "화면영역" });
  s.addText(TOPIC, { ...R.screen, fontFace: F.title, fontSize: 30, color: C.text, align: "center", valign: "middle", isTextBox: true, objectName: "회차주제" });
}

// 2) 세 가지 설정
{
  const s = slide("three");
  const items = [[".env", "값을 파일로 분리"], ["healthcheck", "서비스가 정상인지 검사"], ["depends_on", "시작 순서 정하기"]];
  items.forEach(([head, sub], i) => {
    const yy = 2.6 + i * 1.25;
    s.addShape("roundRect", { x: 0.45, y: yy, w: 4.7, h: 1.05, rectRadius: 0.12, fill: { color: i === 0 ? C.purple : i === 1 ? C.greenDark : C.term }, line: { color: i === 0 ? C.pink : i === 1 ? C.green : C.edge, width: 1.5 }, objectName: "설정카드" + (i + 1) });
    s.addText([{ text: head, options: { fontFace: F.mono, fontSize: 17, bold: true, color: i === 2 ? C.pink : C.text, breakLine: true } }, { text: sub, options: { fontFace: F.body, fontSize: 13, color: C.text } }],
      { x: 0.45, y: yy, w: 4.7, h: 1.05, align: "center", valign: "middle", margin: 0.05, isTextBox: true });
  });
}

// 3) .env 와 변수
{
  const s = slide("env");
  const c = portLine.indexOf("${WEB_PORT}");
  L.terminal(s, {
    lines: [{ t: PH + "cat .env" }, { t: envLine, hl: true }, { t: PH + "grep WEB_PORT compose.yaml" }, { t: portLine, hlCols: [c, c + "${WEB_PORT}".length] }],
    label: ".env 의 값을 compose.yaml 에서 사용", tone: "pink", fontSize: 11,
  });
}

// 4) healthcheck (compose.yaml 일부)
{
  const s = slide("health", " (compose.yaml 의 db 부분만 표시, 생략한 줄은 ... 로 표시)");
  const hc = y(/healthcheck:/), test = y(/test:/);
  L.terminal(s, {
    lines: [{ t: PH + "cat compose.yaml" }, { t: "...", dim: true }, { t: y(/^  db:/) }, { t: y(/image:/) }, { t: hc, hl: true }, { t: test, hl: true }, { t: y(/interval:/) }, { t: "...", dim: true }],
    label: "healthcheck: 정상인지 검사", tone: "pink", fontSize: 10,
  });
}

// 5) depends_on (compose.yaml 일부)
{
  const s = slide("depends", " (compose.yaml 의 web 부분만 표시, 생략한 줄은 ... 로 표시)");
  L.terminal(s, {
    lines: [{ t: PH + "cat compose.yaml" }, { t: y(/^  web:/) }, { t: "    ...", dim: true }, { t: y(/depends_on:/), hl: true }, { t: y(/^      db:/), hl: true }, { t: y(/condition:/), hl: true }],
    label: "depends_on: db 가 정상이 된 뒤 시작", tone: "pink", fontSize: 11,
  });
}

// 6) up: Healthy 이후 web 시작
{
  const s = slide("up", " (중간 단계는 생략하고 핵심 줄만 표시)");
  L.terminal(s, { lines: [{ t: PH + "docker compose up -d" }, ...upKey.map((t) => ({ t, hl: /Healthy|web-1 Started/.test(t) }))], label: "db Healthy → web 시작", tone: "green", fontSize: 11 });
}

// 7) ps: (healthy)
{
  const s = slide("ps", " (일부 열 생략)");
  const col = ps[1].indexOf("(healthy)");
  L.terminal(s, { lines: [{ t: PH + "docker compose ps" }, { t: ps[0], dim: true }, { t: ps[1], hlCols: [col, col + 9] }, { t: ps[2] }], label: "STATUS: healthy", tone: "green", fontSize: 11 });
}

// 8) curl 8080
{
  const s = slide("curl", " (터미널에서 curl 은 본문만 출력)");
  L.terminal(s, { lines: [{ t: PH + "curl localhost:8080" }, { t: curl[1], hl: true }], label: ".env 에 적은 포트: 8080", tone: "green", fontSize: 12 });
}

// 9) 요약
{
  const s = slide("sum");
  const rows = [[".env", "값 분리"], ["healthcheck", "상태 검사"], ["depends_on", "시작 순서"]];
  rows.forEach(([cmd, desc], i) => {
    const yy = 2.7 + i * 1.05;
    s.addShape("roundRect", { x: 0.45, y: yy, w: 4.7, h: 0.85, rectRadius: 0.1, fill: { color: C.term }, line: { color: C.edge, width: 0.75 }, objectName: "요약행" + (i + 1) });
    s.addText(cmd, { x: 0.6, y: yy, w: 2.4, h: 0.85, fontFace: F.mono, fontSize: 13, bold: true, color: C.pink, valign: "middle", margin: 0, isTextBox: true });
    s.addText(desc, { x: 3.1, y: yy, w: 2.0, h: 0.85, fontFace: F.body, fontSize: 14, color: C.text, valign: "middle", margin: 0, isTextBox: true });
  });
}

// 10) 다음 회차 예고
{
  const s = slide("next");
  s.addShape("roundRect", { ...R.screen, rectRadius: 0.2, fill: { color: C.purple }, line: { color: C.pink, width: 1.5 }, objectName: "화면영역" });
  s.addText([{ text: "NEXT", options: { fontFace: F.mono, fontSize: 16, bold: true, color: C.pink, breakLine: true } },
    { text: "12회차", options: { fontSize: 20, breakLine: true } },
    { text: "Compose 실전 팁", options: { fontSize: 28 } }],
    { ...R.screen, fontFace: F.title, color: C.text, align: "center", valign: "middle", isTextBox: true, objectName: "다음회차" });
}

fs.writeFileSync(path.join(__dirname, "script.txt"), narration.join("\n") + "\n", "utf8");
pres.writeFile({ fileName: path.join(__dirname, "ep11.pptx") }).then((f) => console.log("saved", f));
