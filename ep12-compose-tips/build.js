// 12회차 PPT 생성: node build.js  (output/ 의 실제 실행 결과 사용, script.txt 도 함께 생성)
const path = require("path");
const fs = require("fs");
const L = require("../tools/shorts-lib.js");
const { C, F, R } = L;
const out = (n) => path.join(__dirname, "output", n);
const PH = "user@PC:~/visits$ "; // 10~11회차와 같은 ~/visits 프로젝트 폴더
const TOPIC = "12회차\nCompose 실전 팁";
const TOPIC_TITLE = "12회차 · Compose 실전 팁";

// caption = 슬라이드 자막(영문 그대로), narr = 나레이션 대본(영문은 한글 발음)
const T = {
  intro: { caption: "이번 시간에는 Compose를 실전에서 쓸 때 유용한 설정 세 가지를 알아봅니다.", narr: "이번 시간에는 컴포즈를 실전에서 쓸 때 유용한 설정 세 가지를 알아봅니다." },
  three: { caption: "자동 재시작과 리소스 제한, 그리고 필요할 때만 실행하는 profiles입니다.", narr: "자동 재시작과 리소스 제한, 그리고 필요할 때만 실행하는 프로파일즈입니다." },
  restart: { caption: "restart: unless-stopped를 적으면, 앱이 비정상 종료돼도 자동으로 다시 시작합니다.", narr: "리스타트 언리스 스톱드를 적으면, 앱이 비정상 종료돼도 자동으로 다시 시작합니다." },
  crash: { caption: "일부러 앱을 종료시키는 주소로 접속해 봅니다. 연결이 끊기며 앱이 죽습니다.", narr: "일부러 앱을 종료시키는 주소로 접속해 봅니다. 연결이 끊기며 앱이 죽습니다." },
  after: { caption: "잠시 뒤 보면 web만 새로 시작되었고, 재시작 횟수는 1입니다.", narr: "잠시 뒤 보면 웹만 새로 시작되었고, 재시작 횟수는 일입니다." },
  limit: { caption: "mem_limit은 메모리, cpus는 쓸 수 있는 코어 수를 제한합니다.", narr: "멤 리밋은 메모리, 씨피유스는 쓸 수 있는 코어 수를 제한합니다." },
  stats: { caption: "docker stats로 보면 web의 메모리 한도가 128MiB로 표시됩니다.", narr: "도커 스탯츠로 보면 웹의 메모리 한도가 백이십팔 메가바이트로 표시됩니다." },
  profile: { caption: "profiles를 적은 서비스는 평소에는 시작되지 않고, 필요할 때만 실행됩니다.", narr: "프로파일즈를 적은 서비스는 평소에는 시작되지 않고, 필요할 때만 실행됩니다." },
  debug: { caption: "--profile 옵션을 붙여 실행하면 debug 서비스까지 함께 시작됩니다.", narr: "프로파일 옵션을 붙여 실행하면 디버그 서비스까지 함께 시작됩니다." },
  sum: { caption: "자동 재시작은 restart, 제한은 mem_limit, 선택 실행은 profiles입니다.", narr: "자동 재시작은 리스타트, 제한은 멤 리밋, 선택 실행은 프로파일즈입니다." },
  next: { caption: "다음 시간에는 문제가 생겼을 때 살펴보고 정리하는 방법을 알아봅니다.", narr: "다음 시간에는 문제가 생겼을 때 살펴보고 정리하는 방법을 알아봅니다." },
};

const pres = L.newDeck("Docker 12회차 Compose 실전 팁");
const narration = [];
function slide(key, notesExtra = "") {
  narration.push(T[key].narr);
  return L.baseSlide(pres, { title: key === "intro" ? L.SERIES_TITLE : TOPIC_TITLE, caption: T[key].caption, notes: T[key].caption + notesExtra });
}

// ---- 실제 실행 결과 ----
const rd = (n) => L.readOut(out(n + ".txt"));
const yaml = L.readOut(out("compose.yaml"));
const y = (re) => { const l = yaml.find((x) => re.test(x)); if (!l) throw new Error("compose.yaml 에서 못 찾음: " + re); return l; };
const grep = rd("03_grep")[1], crash = rd("04_crash")[1];
const psAfter = L.pickColumns(rd("05_ps_after").slice(1), ["NAME", "STATUS"]);
const restarts = rd("06_restarts")[1];
const stats = L.pickColumns(rd("07_stats").slice(1), ["NAME", "CPU %", "MEM USAGE / LIMIT"]);
const upDebug = rd("08_up_debug").find((l) => /visits-cli-1 Started/.test(l));
const psDebug = L.pickColumns(rd("09_ps_debug").slice(1), ["NAME", "STATUS"]);
if (!crash.includes("(52)") || restarts !== "1" || !stats.some((l) => l.includes("/ 128MiB")) || !upDebug || psDebug.length !== 4 || rd("02_ps_before").length !== 4 || rd("02_ps_before").some((l) => l.includes("visits-cli-1"))) throw new Error("실행 결과가 예상과 다름");
const webStatsIdx = stats.findIndex((l) => l.startsWith("visits-web-1"));
const limitCol = stats[webStatsIdx].indexOf("128MiB");

// 1) 타이틀
{
  const s = slide("intro");
  s.addShape("roundRect", { ...R.screen, rectRadius: 0.2, fill: { color: C.purple }, line: { color: C.pink, width: 1.5 }, objectName: "화면영역" });
  s.addText(TOPIC, { ...R.screen, fontFace: F.title, fontSize: 30, color: C.text, align: "center", valign: "middle", isTextBox: true, objectName: "회차주제" });
}

// 2) 세 가지
{
  const s = slide("three");
  const items = [["restart", "자동 재시작"], ["mem_limit, cpus", "리소스 제한"], ["profiles", "필요할 때만 실행"]];
  items.forEach(([head, sub], i) => {
    const yy = 2.6 + i * 1.25;
    s.addShape("roundRect", { x: 0.45, y: yy, w: 4.7, h: 1.05, rectRadius: 0.12, fill: { color: i === 0 ? C.purple : i === 1 ? C.greenDark : C.term }, line: { color: i === 0 ? C.pink : i === 1 ? C.green : C.edge, width: 1.5 }, objectName: "설정카드" + (i + 1) });
    s.addText([{ text: head, options: { fontFace: F.mono, fontSize: 17, bold: true, color: i === 2 ? C.pink : C.text, breakLine: true } }, { text: sub, options: { fontFace: F.body, fontSize: 13, color: C.text } }],
      { x: 0.45, y: yy, w: 4.7, h: 1.05, align: "center", valign: "middle", margin: 0.05, isTextBox: true });
  });
}

// 3) restart (compose.yaml 일부)
{
  const s = slide("restart", " (compose.yaml 의 web 부분만 표시, 생략한 줄은 ... 로 표시)");
  L.terminal(s, { lines: [{ t: PH + "cat compose.yaml" }, { t: y(/^  web:/) }, { t: y(/build:/) }, { t: y(/restart:/), hl: true }, { t: "    ...", dim: true }], label: "restart: 자동 재시작", tone: "pink", fontSize: 11 });
}

// 4) 일부러 종료
{
  const s = slide("crash");
  L.terminal(s, { lines: [{ t: PH + "grep -n _exit app.py" }, { t: grep }, { t: PH + "curl localhost:8000/crash" }, { t: crash, hl: true }], label: "앱을 일부러 종료시키기", tone: "pink", fontSize: 10 });
}

// 5) 재시작 확인
{
  const s = slide("after", " (일부 열 생략, 긴 명령은 \\ 로 줄바꿈해 표시)");
  // 긴 명령은 \\ 로 나눠 표시 (실제 실행한 한 줄 명령과 같은지 확인)
  const inspect = [PH + "docker inspect \\", "  -f '{{.RestartCount}}' visits-web-1"];
  if (inspect.map((l) => l.replace(/ \\$/, "").trim()).join(" ").replace(PH.trim(), "").trim() !== rd("06_restarts")[0].replace("user@PC:~$", "").trim()) throw new Error("06_restarts 명령 불일치");
  L.terminal(s, {
    lines: [{ t: PH + "docker compose ps" }, { t: psAfter[0], dim: true }, { t: psAfter[1] }, { t: psAfter[2], hl: true }, { t: inspect[0] }, { t: inspect[1] }, { t: restarts, hl: true }],
    label: "web 만 다시 시작됨", tone: "green", fontSize: 11,
  });
}

// 6) 리소스 제한 (compose.yaml 일부)
{
  const s = slide("limit", " (compose.yaml 의 web 부분만 표시, 생략한 줄은 ... 로 표시)");
  L.terminal(s, { lines: [{ t: PH + "cat compose.yaml" }, { t: y(/^  web:/) }, { t: "    ...", dim: true }, { t: y(/mem_limit:/), hl: true }, { t: y(/cpus:/), hl: true }, { t: "    ...", dim: true }], label: "리소스 제한: 메모리, CPU", tone: "pink", fontSize: 11 });
}

// 7) docker stats
{
  const s = slide("stats", " (일부 열 생략)");
  L.terminal(s, {
    lines: [{ t: PH + "docker stats --no-stream" }, { t: stats[0], dim: true }, ...stats.slice(1).map((t, i) => ({ t, hlCols: i + 1 === webStatsIdx ? [limitCol, limitCol + 6] : undefined }))],
    label: "web 의 메모리 한도: 128MiB", tone: "green", fontSize: 11,
  });
}

// 8) profiles (compose.yaml 일부)
{
  const s = slide("profile", " (compose.yaml 의 cli 부분만 표시)");
  L.terminal(s, { lines: [{ t: PH + "cat compose.yaml" }, { t: "...", dim: true }, { t: y(/^  cli:/) }, { t: yaml[yaml.findIndex((x) => /^  cli:/.test(x)) + 1] }, { t: y(/command:/) }, { t: y(/profiles:/), hl: true }], label: "profiles: 필요할 때만 실행", tone: "pink", fontSize: 10 });
}

// 9) --profile debug 로 실행
{
  const s = slide("debug", " (중간 단계는 생략하고 핵심 줄만 표시, 일부 열 생략)");
  L.terminal(s, {
    lines: [{ t: PH + "docker compose --profile debug up -d" }, { t: upDebug, hl: true }, { t: PH + "docker compose ps" }, { t: psDebug[0], dim: true }, ...psDebug.slice(1).map((t) => ({ t, hl: t.startsWith("visits-cli-1") }))],
    label: "--profile debug: cli 도 함께 실행", tone: "green", fontSize: 10,
  });
}

// 10) 요약
{
  const s = slide("sum");
  const rows = [["restart", "자동 재시작"], ["mem_limit", "메모리 제한"], ["profiles", "선택해서 실행"]];
  rows.forEach(([cmd, desc], i) => {
    const yy = 2.7 + i * 1.05;
    s.addShape("roundRect", { x: 0.45, y: yy, w: 4.7, h: 0.85, rectRadius: 0.1, fill: { color: C.term }, line: { color: C.edge, width: 0.75 }, objectName: "요약행" + (i + 1) });
    s.addText(cmd, { x: 0.6, y: yy, w: 2.4, h: 0.85, fontFace: F.mono, fontSize: 13, bold: true, color: C.pink, valign: "middle", margin: 0, isTextBox: true });
    s.addText(desc, { x: 3.1, y: yy, w: 2.0, h: 0.85, fontFace: F.body, fontSize: 14, color: C.text, valign: "middle", margin: 0, isTextBox: true });
  });
}

// 11) 다음 회차 예고
{
  const s = slide("next");
  s.addShape("roundRect", { ...R.screen, rectRadius: 0.2, fill: { color: C.purple }, line: { color: C.pink, width: 1.5 }, objectName: "화면영역" });
  s.addText([{ text: "NEXT", options: { fontFace: F.mono, fontSize: 16, bold: true, color: C.pink, breakLine: true } },
    { text: "13회차", options: { fontSize: 20, breakLine: true } },
    { text: "문제 해결과 청소", options: { fontSize: 28 } }],
    { ...R.screen, fontFace: F.title, color: C.text, align: "center", valign: "middle", isTextBox: true, objectName: "다음회차" });
}

fs.writeFileSync(path.join(__dirname, "script.txt"), narration.join("\n") + "\n", "utf8");
pres.writeFile({ fileName: path.join(__dirname, "ep12.pptx") }).then((f) => console.log("saved", f));
