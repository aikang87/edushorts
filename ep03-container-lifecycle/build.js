// 3회차 PPT 생성: node build.js  (output/*.txt 의 실제 실행 결과 사용, script.txt/script.md 도 함께 생성)
const path = require("path");
const fs = require("fs");
const L = require("../tools/shorts-lib.js");
const { C, F, R } = L;
const out = (n) => path.join(__dirname, "output", n + ".txt");
const P = "user@PC:~$ ";
const TOPIC = "3회차\n컨테이너 켜고 끄기";
const TOPIC_TITLE = "3회차 · 컨테이너 켜고 끄기";

// caption = 슬라이드 자막(영문 그대로), narr = 나레이션 대본(영문은 한글 발음)
const T = {
  intro: { caption: "이번 시간에는 컨테이너를 켜고 끄는 방법을 알아봅니다.", narr: "이번 시간에는 컨테이너를 켜고 끄는 방법을 알아봅니다." },
  cycle: { caption: "컨테이너는 실행 중, 정지, 삭제 상태를 오가며 살아갑니다. 이것을 수명주기라고 합니다.", narr: "컨테이너는 실행 중, 정지, 삭제 상태를 오가며 살아갑니다. 이것을 수명주기라고 합니다." },
  run: { caption: "먼저 docker run으로 컨테이너를 백그라운드에서 실행합니다.", narr: "먼저 도커 런으로 컨테이너를 백그라운드에서 실행합니다." },
  ps: { caption: "docker ps로 보면 Up, 즉 실행 중인 상태입니다.", narr: "도커 피에스로 보면 업, 즉 실행 중인 상태입니다." },
  stop: { caption: "docker stop 뒤에 이름을 적어 컨테이너를 정지합니다.", narr: "도커 스톱 뒤에 이름을 적어 컨테이너를 정지합니다." },
  psa: { caption: "정지된 컨테이너는 docker ps에 보이지 않습니다. -a 옵션을 붙이면 Exited 상태로 보입니다.", narr: "정지된 컨테이너는 도커 피에스에 보이지 않습니다. 에이 옵션을 붙이면 엑시티드 상태로 보입니다." },
  start: { caption: "docker start로 정지된 컨테이너를 다시 시작합니다.", narr: "도커 스타트로 정지된 컨테이너를 다시 시작합니다." },
  logs: { caption: "docker logs로 컨테이너가 남긴 로그를 확인합니다. 문제가 생겼을 때 가장 먼저 확인하는 곳입니다.", narr: "도커 로그스로 컨테이너가 남긴 로그를 확인합니다. 문제가 생겼을 때 가장 먼저 확인하는 곳입니다." },
  rm: { caption: "필요 없어지면 stop으로 멈춘 뒤 docker rm으로 삭제합니다. 이름 대신 컨테이너 ID 앞부분만 적어도 됩니다.", narr: "필요 없어지면 스톱으로 멈춘 뒤 도커 알엠으로 삭제합니다. 이름 대신 컨테이너 아이디 앞부분만 적어도 됩니다." },
  sum: { caption: "stop으로 멈추고, start로 다시 켜고, logs로 기록을 보고, rm으로 삭제합니다.", narr: "스톱으로 멈추고, 스타트로 다시 켜고, 로그스로 기록을 보고, 알엠으로 삭제합니다." },
  next: { caption: "다음 시간에는 컨테이너에 포트를 연결해 웹서버를 열어봅니다.", narr: "다음 시간에는 컨테이너에 포트를 연결해 웹서버를 열어봅니다." },
};

const pres = L.newDeck("Docker 3회차 컨테이너 켜고 끄기");
const narration = [];
function slide(key, notesExtra = "") {
  narration.push(T[key].narr);
  return L.baseSlide(pres, { title: key === "intro" ? L.SERIES_TITLE : TOPIC_TITLE, caption: T[key].caption, notes: T[key].caption + notesExtra });
}

// ---- 실제 출력에서 화면용 줄 ----
const rd = (n) => L.readOut(out(n));
const cols = ["IMAGE", "STATUS", "NAMES"];
const tbl = (n) => L.pickColumns(rd(n).slice(1), cols);
const psUp = L.pickColumns(rd("02_ps").slice(1), ["CONTAINER ID", "IMAGE", "STATUS", "NAMES"]), psNone = tbl("04_ps_none"), psA = tbl("05_ps_a"), psUp2 = tbl("07_ps_up"), psA2 = tbl("11_ps_a");
const logs = rd("08_logs").slice(1);
const logView = [L.trunc(logs[0], 50), L.trunc(logs[1], 50), "...", L.trunc(logs[logs.length - 2], 50), L.trunc(logs[logs.length - 1], 50)];
const TERM = { tone: "green", fontSize: 11 };

// 1) 타이틀 + 회차 주제
{
  const s = slide("intro");
  s.addShape("roundRect", { ...R.screen, rectRadius: 0.2, fill: { color: C.purple }, line: { color: C.pink, width: 1.5 }, objectName: "화면영역" });
  s.addText(TOPIC, { ...R.screen, fontFace: F.title, fontSize: 34, color: C.text, align: "center", valign: "middle", isTextBox: true, objectName: "회차주제" });
}

// 2) 수명주기 도식
{
  const s = slide("cycle");
  const card = (y, fill, line, head, sub, name) => {
    s.addShape("roundRect", { x: 1.3, y, w: 3.0, h: 0.8, rectRadius: 0.12, fill: { color: fill }, line: { color: line, width: 1.5 }, objectName: name });
    s.addText([{ text: head, options: { fontSize: 18, bold: true, breakLine: true } }, { text: sub, options: { fontSize: 12 } }],
      { x: 1.3, y, w: 3.0, h: 0.8, fontFace: F.body, color: C.text, align: "center", valign: "middle", margin: 0.03, isTextBox: true });
  };
  const arrow = (y, text) => s.addText(text, { x: 0.4, y, w: 4.8, h: 0.5, fontFace: F.mono, fontSize: 12, bold: true, color: C.pink, align: "center", valign: "middle", margin: 0, isTextBox: true });
  card(2.55, C.greenDark, C.green, "실행 중", "Up", "상태실행");
  arrow(3.35, "▼ docker stop     ▲ docker start");
  card(3.85, C.purple, C.pink, "정지", "Exited", "상태정지");
  arrow(4.65, "▼ docker rm");
  card(5.15, C.term, C.edge, "삭제", "Removed", "상태삭제");
}

// 3) run
{
  const s = slide("run");
  const r = rd("01_run");
  L.terminal(s, { lines: [{ t: r[0], hl: true }, { t: L.trunc(r[1], 40) }], label: "컨테이너 실행: docker run", tone: "pink", fontSize: 11 });
}

// 4) ps (Up)
{
  const s = slide("ps", " (일부 열 생략)");
  L.terminal(s, { lines: [{ t: P + "docker ps" }, ...psUp.map((t, i) => ({ t, dim: i === 0, hl: i === 1 }))], label: "실행 중: STATUS = Up", ...TERM });
}

// 5) stop
{
  const s = slide("stop");
  const r = rd("03_stop");
  L.terminal(s, { lines: [{ t: r[0], hl: true }, { t: r[1] }], label: "컨테이너 정지: docker stop", tone: "pink", fontSize: 14 });
}

// 6) ps / ps -a
{
  const s = slide("psa", " (일부 열 생략)");
  L.terminal(s, {
    lines: [{ t: P + "docker ps" }, { t: psNone[0], dim: true }, { t: P + "docker ps -a", hl: true }, ...psA.map((t, i) => ({ t, dim: i === 0, hl: i === 1 }))],
    label: "정지된 컨테이너: docker ps -a", ...TERM,
  });
}

// 7) start + ps
{
  const s = slide("start", " (일부 열 생략)");
  const st = rd("06_start");
  L.terminal(s, {
    lines: [{ t: st[0], hl: true }, { t: st[1] }, { t: P + "docker ps" }, ...psUp2.map((t, i) => ({ t, dim: i === 0, hl: i === 1 }))],
    label: "다시 시작: docker start", tone: "pink", fontSize: 11,
  });
}

// 8) logs
{
  const s = slide("logs", " (긴 로그의 일부만 표시)");
  L.terminal(s, { lines: [{ t: P + "docker logs web", hl: true }, ...logView.map((t) => ({ t, dim: t === "..." }))], label: "로그 보기: docker logs", tone: "pink", fontSize: 10 });
}

// 9) stop -> rm -> ps -a
{
  const s = slide("rm", " (일부 열 생략)");
  const a = rd("09_stop"), b = rd("10_rm");
  L.terminal(s, {
    lines: [{ t: a[0] }, { t: a[1] }, { t: b[0], hl: true }, { t: b[1] }, { t: P + "docker ps -a" }, ...psA2.map((t) => ({ t, dim: true }))],
    label: "삭제: docker rm", tone: "pink", fontSize: 11,
  });
}

// 10) 요약
{
  const s = slide("sum");
  const rows = [["docker stop", "컨테이너 정지"], ["docker start", "정지된 컨테이너 시작"], ["docker logs", "로그 보기"], ["docker rm", "컨테이너 삭제"], ["docker ps -a", "전체 컨테이너 보기"]];
  rows.forEach(([cmd, desc], i) => {
    const y = 2.45 + i * 0.78;
    s.addShape("roundRect", { x: 0.45, y, w: 4.7, h: 0.66, rectRadius: 0.1, fill: { color: C.term }, line: { color: C.edge, width: 0.75 }, objectName: "요약행" + (i + 1) });
    s.addText(cmd, { x: 0.6, y, w: 2.1, h: 0.66, fontFace: F.mono, fontSize: 13, bold: true, color: C.pink, valign: "middle", margin: 0, isTextBox: true });
    s.addText(desc, { x: 2.65, y, w: 2.4, h: 0.66, fontFace: F.body, fontSize: 14, color: C.text, valign: "middle", margin: 0, isTextBox: true });
  });
}

// 11) 다음 회차 예고
{
  const s = slide("next");
  s.addShape("roundRect", { ...R.screen, rectRadius: 0.2, fill: { color: C.purple }, line: { color: C.pink, width: 1.5 }, objectName: "화면영역" });
  s.addText([{ text: "NEXT", options: { fontFace: F.mono, fontSize: 16, bold: true, color: C.pink, breakLine: true } },
    { text: "4회차", options: { fontSize: 20, breakLine: true } },
    { text: "웹서버 띄우기", options: { fontSize: 30 } }],
    { ...R.screen, fontFace: F.title, color: C.text, align: "center", valign: "middle", isTextBox: true, objectName: "다음회차" });
}

// 나레이션 대본: 영문은 한글 발음, 줄바꿈으로만 구분
fs.writeFileSync(path.join(__dirname, "script.txt"), narration.join("\n") + "\n", "utf8");
pres.writeFile({ fileName: path.join(__dirname, "ep03.pptx") }).then((f) => console.log("saved", f));
