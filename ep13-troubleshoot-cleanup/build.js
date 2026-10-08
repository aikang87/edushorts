// 13회차 PPT 생성: node build.js  (output/ 의 실제 실행 결과 사용, script.txt 도 함께 생성)
const path = require("path");
const fs = require("fs");
const L = require("../tools/shorts-lib.js");
const { C, F, R } = L;
const out = (n) => path.join(__dirname, "output", n);
const P = "user@PC:~$ ";
const TOPIC = "13회차\n문제 해결과 청소";
const TOPIC_TITLE = "13회차 · 문제 해결과 청소";

// caption = 슬라이드 자막(영문 그대로), narr = 나레이션 대본(영문은 한글 발음)
const T = {
  intro: { caption: "이번 시간에는 컨테이너에 문제가 생겼을 때 원인을 찾고, 쓰지 않는 것을 정리하는 방법을 알아봅니다.", narr: "이번 시간에는 컨테이너에 문제가 생겼을 때 원인을 찾고, 쓰지 않는 것을 정리하는 방법을 알아봅니다." },
  broken: { caption: "일부러 오류가 나는 컨테이너를 실행합니다. docker ps에는 아무것도 보이지 않습니다.", narr: "일부러 오류가 나는 컨테이너를 실행합니다. 도커 피에스에는 아무것도 보이지 않습니다." },
  psa: { caption: "-a 옵션을 붙이면 종료된 컨테이너가 보이고, 상태는 Exited (1)입니다.", narr: "에이 옵션을 붙이면 종료된 컨테이너가 보이고, 상태는 엑시티드 일입니다." },
  logs: { caption: "docker logs로 보면 원인이 나옵니다. 없는 모듈을 불러오려다 종료됐습니다.", narr: "도커 로그스로 보면 원인이 나옵니다. 없는 모듈을 불러오려다 종료됐습니다." },
  inspect: { caption: "docker inspect로 종료 코드를 확인할 수 있습니다. 1은 오류로 끝났다는 뜻입니다.", narr: "도커 인스펙트로 종료 코드를 확인할 수 있습니다. 일은 오류로 끝났다는 뜻입니다." },
  df: { caption: "정리 전에 docker system df로 도커가 차지한 공간을 확인합니다.", narr: "정리 전에 도커 시스템 디에프로 도커가 차지한 공간을 확인합니다." },
  cprune: { caption: "docker container prune은 종료된 컨테이너를 한 번에 지웁니다. -f는 확인 없이 실행합니다.", narr: "도커 컨테이너 프룬은 종료된 컨테이너를 한 번에 지웁니다. 에프 옵션은 확인 없이 실행합니다." },
  rmi: { caption: "쓰지 않는 이미지는 docker rmi로 지웁니다.", narr: "쓰지 않는 이미지는 도커 알엠아이로 지웁니다." },
  df2: { caption: "다시 확인하면 줄어든 것을 볼 수 있습니다.", narr: "다시 확인하면 줄어든 것을 볼 수 있습니다." },
  sum: { caption: "ps -a, logs, inspect로 원인을 찾고, prune으로 정리합니다. prune은 꼭 확인 후 실행하세요.", narr: "피에스 에이, 로그스, 인스펙트로 원인을 찾고, 프룬으로 정리합니다. 프룬은 꼭 확인 후 실행하세요." },
  next: { caption: "다음 시간에는 내가 만든 이미지를 공유하는 방법을 알아봅니다.", narr: "다음 시간에는 내가 만든 이미지를 공유하는 방법을 알아봅니다." },
};

const pres = L.newDeck("Docker 13회차 문제 해결과 청소");
const narration = [];
function slide(key, notesExtra = "") {
  narration.push(T[key].narr);
  return L.baseSlide(pres, { title: key === "intro" ? L.SERIES_TITLE : TOPIC_TITLE, caption: T[key].caption, notes: T[key].caption + notesExtra });
}
const join = (ls_) => ls_.map((l) => l.replace(/ \\$/, "").trim()).join(" ").replace(P.trim(), "").trim();
const same = (lines, file, name) => { if (join(lines) !== file[0].replace(P.trim(), "").trim()) throw new Error("명령 불일치: " + name); };

// ---- 실제 실행 결과 ----
const rd = (n) => L.readOut(out(n + ".txt"));
const run1 = rd("01_run"), ps = rd("02_ps"), psa = rd("03_ps_a"), logs = rd("04_logs"), insp = rd("05_inspect");
const df1 = rd("06_df"), cprune = rd("07_cprune"), rmi = rd("08_rmi"), df2 = rd("09_df2");
const runCmd = [P + "docker run -d --name broken \\", "  python:3.12-alpine \\", '  python -c "import notamodule"'];
const inspCmd = [P + "docker inspect \\", "  -f '{{.State.ExitCode}}' broken"];
same(runCmd, run1, "01_run"); same(inspCmd, insp, "05_inspect");
const psView = L.pickColumns(ps.slice(1), ["CONTAINER ID", "IMAGE", "NAMES"]);
const psaView = L.pickColumns(psa.slice(1), ["NAMES", "STATUS"]);
const dfView = (d) => L.pickColumns(d.slice(1), ["TYPE", "TOTAL", "SIZE"]);
const dfNum = (d, row) => Number(d.find((l) => l.startsWith(row)).split(/\s+/)[1]);
if (!logs.at(-1).includes("ModuleNotFoundError") || insp[1] !== "1" || !psaView[1].includes("Exited (1)")) throw new Error("실행 결과가 예상과 다름");
if (!(dfNum(df1, "Containers") === 1 && dfNum(df2, "Containers") === 0 && dfNum(df1, "Images") === dfNum(df2, "Images") + 1)) throw new Error("정리 전후 숫자가 예상과 다름");
const dfLines = (cmd, d, hlRows) => [{ t: P + cmd }, ...dfView(d).map((t, i) => ({ t, dim: i === 0, hl: hlRows.some((r) => t.startsWith(r)) }))];

// 1) 타이틀
{
  const s = slide("intro");
  s.addShape("roundRect", { ...R.screen, rectRadius: 0.2, fill: { color: C.purple }, line: { color: C.pink, width: 1.5 }, objectName: "화면영역" });
  s.addText(TOPIC, { ...R.screen, fontFace: F.title, fontSize: 30, color: C.text, align: "center", valign: "middle", isTextBox: true, objectName: "회차주제" });
}
// 2) 오류 컨테이너 실행 + ps (비어 있음)
{
  const s = slide("broken", " (긴 명령은 \\ 로 줄바꿈해 표시, 컨테이너 ID는 앞부분만 표시, 일부 열 생략)");
  L.terminal(s, { lines: [...runCmd.map((t) => ({ t })), { t: L.trunc(run1[1], 30) }, { t: P + "docker ps" }, ...psView.map((t) => ({ t, dim: true }))], label: "docker ps: 보이지 않음", tone: "pink", fontSize: 11 });
}
// 3) ps -a
{
  const s = slide("psa", " (일부 열 생략)");
  L.terminal(s, { lines: [{ t: P + "docker ps -a" }, { t: psaView[0], dim: true }, { t: psaView[1], hl: true }], label: "종료된 컨테이너: Exited (1)", tone: "green", fontSize: 11 });
}
// 4) logs
{
  const s = slide("logs");
  L.terminal(s, { lines: [{ t: P + "docker logs broken" }, ...logs.slice(1).map((t, i, a) => ({ t, hl: i === a.length - 1 }))], label: "원인 찾기: docker logs", tone: "pink", fontSize: 11 });
}
// 5) inspect
{
  const s = slide("inspect", " (긴 명령은 \\ 로 줄바꿈해 표시)");
  L.terminal(s, { lines: [...inspCmd.map((t) => ({ t })), { t: insp[1], hl: true }], label: "종료 코드: 1 = 오류", tone: "pink", fontSize: 12 });
}
// 6) system df (정리 전)
{
  const s = slide("df", " (일부 열 생략, 용량 값은 PC마다 다름)");
  L.terminal(s, { lines: dfLines("docker system df", df1, ["Containers"]), label: "정리 전: 컨테이너 1개", tone: "green", fontSize: 11 });
}
// 7) container prune
{
  const s = slide("cprune");
  L.terminal(s, { lines: [{ t: P + "docker container prune -f" }, { t: cprune[1] }, { t: L.trunc(cprune[2], 30) }, { t: cprune.at(-1), hl: true }], label: "종료된 컨테이너 정리", tone: "pink", fontSize: 11 });
}
// 8) rmi
{
  const s = slide("rmi", " (이미지 ID는 앞부분만 표시)");
  L.terminal(s, { lines: [{ t: P + "docker rmi cache-demo" }, { t: rmi[1], hl: true }, { t: L.trunc(rmi[2], 36) }], label: "쓰지 않는 이미지 삭제", tone: "pink", fontSize: 11 });
}
// 9) system df (정리 후)
{
  const s = slide("df2", " (일부 열 생략, 용량 값은 PC마다 다름)");
  L.terminal(s, { lines: dfLines("docker system df", df2, ["Containers", "Images"]), label: "정리 후: 컨테이너 0, 이미지 -1", tone: "green", fontSize: 11 });
}
// 10) 요약 + 주의
{
  const s = slide("sum");
  const rows = [["docker ps -a", "종료된 것까지 보기"], ["docker logs", "원인 찾기"], ["docker inspect", "자세한 정보"], ["prune / rmi", "정리하기"]];
  rows.forEach(([cmd, desc], i) => {
    const y = 2.5 + i * 0.82;
    s.addShape("roundRect", { x: 0.45, y, w: 4.7, h: 0.7, rectRadius: 0.1, fill: { color: C.term }, line: { color: C.edge, width: 0.75 }, objectName: "요약행" + (i + 1) });
    s.addText(cmd, { x: 0.6, y, w: 2.3, h: 0.7, fontFace: F.mono, fontSize: 13, bold: true, color: C.pink, valign: "middle", margin: 0, isTextBox: true });
    s.addText(desc, { x: 2.95, y, w: 2.2, h: 0.7, fontFace: F.body, fontSize: 14, color: C.text, valign: "middle", margin: 0, isTextBox: true });
  });
  s.addText("※ prune 은 지우기 전에 꼭 확인", { x: 0.45, y: 5.85, w: 4.7, h: 0.4, fontFace: F.body, fontSize: 13, bold: true, color: "FF8888", align: "center", valign: "middle", margin: 0, isTextBox: true });
}
// 11) 다음 회차 예고
{
  const s = slide("next");
  s.addShape("roundRect", { ...R.screen, rectRadius: 0.2, fill: { color: C.purple }, line: { color: C.pink, width: 1.5 }, objectName: "화면영역" });
  s.addText([{ text: "NEXT", options: { fontFace: F.mono, fontSize: 16, bold: true, color: C.pink, breakLine: true } },
    { text: "14회차", options: { fontSize: 20, breakLine: true } },
    { text: "내 이미지 공유하기", options: { fontSize: 28 } }],
    { ...R.screen, fontFace: F.title, color: C.text, align: "center", valign: "middle", isTextBox: true, objectName: "다음회차" });
}

fs.writeFileSync(path.join(__dirname, "script.txt"), narration.join("\n") + "\n", "utf8");
pres.writeFile({ fileName: path.join(__dirname, "ep13.pptx") }).then((f) => console.log("saved", f));
