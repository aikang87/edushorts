// 1회차 PPT 생성: node build.js  (output/ 의 실제 실행 결과 사용, script.txt 도 함께 생성)
//
// 검증 범위: 6~8번 슬라이드(docker --version, docker compose version, docker run hello-world)는 제작 환경에서 실제 실행한 결과.
//            3번(`wsl --install`)은 표준 사용법 표시(Windows 에서 실행하지 못함), 4·5번(Docker Desktop 설치/WSL 연동 화면)은 일러스트.
const path = require("path");
const fs = require("fs");
const L = require("../tools/shorts-lib.js");
const { C, F, R } = L;
const out = (n) => path.join(__dirname, "output", n);
const P = "user@PC:~$ ";
const TOPIC = "1회차\nDocker 설치와 첫 실행";
const TOPIC_TITLE = "1회차 · Docker 설치와 첫 실행";
const NOTE_ILLUST = " [일러스트: 제작 환경(Linux)에서 Windows 설치 화면을 캡처하지 못함. 실제 화면으로 교체 권장]";

// caption = 슬라이드 자막(영문 그대로), narr = 나레이션 대본(영문은 한글 발음)
const T = {
  intro: { caption: "이번 시간에는 Docker를 설치하고, 첫 컨테이너를 실행해 봅니다.", narr: "이번 시간에는 도커를 설치하고, 첫 컨테이너를 실행해 봅니다." },
  what: { caption: "Docker는 프로그램을 컨테이너라는 상자에 담아, 어디서든 똑같이 실행하게 해 줍니다.", narr: "도커는 프로그램을 컨테이너라는 상자에 담아, 어디서든 똑같이 실행하게 해 줍니다." },
  wsl: { caption: "Windows에서는 먼저 WSL을 설치합니다. PowerShell에서 한 줄이면 됩니다.", narr: "윈도우에서는 먼저 더블유에스엘을 설치합니다. 파워셸에서 한 줄이면 됩니다." },
  desktop: { caption: "그다음 Docker Desktop을 설치합니다. 설치 옵션에서 WSL 2 사용을 선택합니다.", narr: "그다음 도커 데스크톱을 설치합니다. 설치 옵션에서 더블유에스엘 투 사용을 선택합니다." },
  integ: { caption: "설정에서 WSL 연동을 켜면, Ubuntu 터미널에서도 docker를 쓸 수 있습니다.", narr: "설정에서 더블유에스엘 연동을 켜면, 우분투 터미널에서도 도커를 쓸 수 있습니다." },
  ver: { caption: "Ubuntu 터미널에서 docker --version으로 버전을 확인합니다.", narr: "우분투 터미널에서 도커 버전으로 버전을 확인합니다." },
  compose: { caption: "Docker Compose도 함께 설치되어 있습니다.", narr: "도커 컴포즈도 함께 설치되어 있습니다." },
  hello: { caption: "이제 docker run hello-world로 첫 컨테이너를 실행합니다. 처음에는 이미지를 먼저 내려받아서 시간이 조금 걸립니다. 환영 메시지가 나오면 성공입니다.", narr: "이제 도커 런 헬로 월드로 첫 컨테이너를 실행합니다. 처음에는 이미지를 먼저 내려받아서 시간이 조금 걸립니다. 환영 메시지가 나오면 성공입니다." },
  flow: { caption: "Docker는 이미지를 내려받아 컨테이너를 만들고, 그 결과를 화면에 보여 줍니다.", narr: "도커는 이미지를 내려받아 컨테이너를 만들고, 그 결과를 화면에 보여 줍니다." },
  sum: { caption: "버전 확인과 hello-world 실행, 이 두 가지로 설치를 확인합니다.", narr: "버전 확인과 헬로 월드 실행, 이 두 가지로 설치를 확인합니다." },
  next: { caption: "다음 시간에는 이미지와 컨테이너를 알아봅니다.", narr: "다음 시간에는 이미지와 컨테이너를 알아봅니다." },
};

const pres = L.newDeck("Docker 1회차 설치와 첫 실행");
const narration = [];
function slide(key, notesExtra = "") {
  narration.push(T[key].narr);
  return L.baseSlide(pres, { title: key === "intro" ? L.SERIES_TITLE : TOPIC_TITLE, caption: T[key].caption, notes: T[key].caption + notesExtra });
}
const rect = (s, x, y, w, h, fill, line, name) => s.addShape("rect", { x, y, w, h, fill: { color: fill }, line: { color: line || fill, width: 0.75 }, objectName: name });
const txt = (s, text, x, y, w, h, o = {}) => s.addText(text, { x, y, w, h, fontFace: o.mono ? F.mono : "Arial", fontSize: o.size || 11, bold: !!o.bold, color: o.color || "222222", align: o.align || "left", valign: "middle", margin: o.margin ?? 0.05, isTextBox: true });

// ---- 실제 실행 결과 ----
const rd = (n) => L.readOut(out(n + ".txt"));
const ver = rd("01_version"), comp = rd("02_compose"), hello = rd("03_hello");
if (!/^Docker version \d+\.\d+/.test(ver[1]) || !/^Docker Compose version v?\d+\.\d+/.test(comp[1])) throw new Error("버전 출력이 예상과 다름");
const verLine = ver[1].replace(/, build .*/, ""); // build 해시는 화면에서 생략
const helloKey = ["Unable to find image", "Pulling from library/hello-world", "Status: Downloaded newer image", "Hello from Docker!", "This message shows that your installation appears to be working correctly."];
const helloView = helloKey.map((k) => { const l = hello.find((x) => x.includes(k)); if (!l) throw new Error("hello-world 출력에서 못 찾음: " + k); return l; });

// 1) 타이틀
{
  const s = slide("intro");
  s.addShape("roundRect", { ...R.screen, rectRadius: 0.2, fill: { color: C.purple }, line: { color: C.pink, width: 1.5 }, objectName: "화면영역" });
  s.addText(TOPIC, { ...R.screen, fontFace: F.title, fontSize: 28, color: C.text, align: "center", valign: "middle", isTextBox: true, objectName: "회차주제" });
}
// 2) 컨테이너란 (VM 과 비교, 개념 도식)
{
  const s = slide("what");
  const stack = (x, title, layers, name) => {
    s.addText(title, { x, y: 2.5, w: 2.3, h: 0.4, fontFace: F.body, fontSize: 13, bold: true, color: C.text, align: "center", valign: "middle", margin: 0, isTextBox: true });
    layers.forEach(([label, fill, line], i) => {
      const y = 3.0 + i * 0.62;
      s.addShape("roundRect", { x, y, w: 2.3, h: 0.55, rectRadius: 0.06, fill: { color: fill }, line: { color: line, width: 1.2 }, objectName: name + (i + 1) });
      s.addText(label, { x, y, w: 2.3, h: 0.55, fontFace: F.body, fontSize: 11, color: C.text, align: "center", valign: "middle", margin: 0.03, isTextBox: true });
    });
  };
  stack(0.3, "가상머신", [["앱 + 게스트 OS", C.purple, C.pink], ["앱 + 게스트 OS", C.purple, C.pink], ["하이퍼바이저", C.term, C.edge], ["내 컴퓨터 (OS)", C.term, C.edge]], "VM");
  stack(3.0, "컨테이너", [["앱", C.greenDark, C.green], ["앱", C.greenDark, C.green], ["Docker", C.term, C.edge], ["내 컴퓨터 (OS)", C.term, C.edge]], "컨테이너");
  s.addText("컨테이너는 OS 를 공유해서 가볍다", { x: 0.3, y: 5.55, w: 5.0, h: 0.45, fontFace: F.body, fontSize: 12, color: C.dim, align: "center", valign: "middle", margin: 0, isTextBox: true });
}
// 3) wsl --install (표준 사용법)
{
  const s = slide("wsl", " [표준 사용법: 제작 환경(Linux)에서 Windows PowerShell 명령을 실행하지 못함. 관리자 권한 PowerShell 에서 실행, 설치 후 재부팅 필요]");
  L.terminal(s, { lines: [{ t: "PS C:\\> wsl --install", hl: true }], label: "PowerShell (관리자): WSL 설치", tone: "pink", tab: "PowerShell", fontSize: 12 });
}
// 4) Docker Desktop 설치 마법사 (일러스트)
{
  const s = slide("desktop", NOTE_ILLUST);
  rect(s, 0.35, 2.5, 4.9, 3.6, "F3F3F3", "BBBBBB", "설치창");
  rect(s, 0.35, 2.5, 4.9, 0.4, "FFFFFF", "BBBBBB", "설치창제목");
  txt(s, "Installing Docker Desktop", 0.4, 2.5, 4.8, 0.4, { size: 11 });
  txt(s, "Configuration", 0.5, 3.0, 4.6, 0.4, { size: 12, bold: true });
  const items = [["Use WSL 2 instead of Hyper-V (recommended)", true, true], ["Allow Windows Containers to be used with this installation", false, false], ["Add shortcut to desktop", true, false]];
  items.forEach(([label, on, hl], i) => {
    const y = 3.55 + i * 0.7;
    if (hl) s.addShape("roundRect", { x: 0.45, y: y - 0.08, w: 4.7, h: 0.6, rectRadius: 0.05, fill: { color: "F3F3F3", transparency: 100 }, line: { color: C.pink, width: 2 }, objectName: "WSL2강조" });
    rect(s, 0.6, y + 0.07, 0.25, 0.25, "FFFFFF", "555555", "체크박스" + (i + 1));
    if (on) txt(s, "✓", 0.6, y + 0.04, 0.25, 0.3, { color: "0B6BCB", size: 12, bold: true, align: "center", margin: 0 });
    txt(s, label, 0.95, y - 0.02, 4.2, 0.5, { size: 10 });
  });
}
// 5) Docker Desktop 설정: WSL integration (일러스트)
{
  const s = slide("integ", NOTE_ILLUST);
  const V = { bg: "1E1E1E", side: "252526", edge: "454545", text: "CCCCCC", dim: "858585", on: "2F9E44" };
  rect(s, 0.35, 2.5, 4.9, 3.6, V.bg, V.edge, "설정창");
  rect(s, 0.35, 2.5, 1.5, 3.6, V.side, V.edge, "설정메뉴");
  ["General", "Resources", "  WSL integration", "Docker Engine"].forEach((m, i) => txt(s, m, 0.4, 2.65 + i * 0.5, 1.4, 0.4, { color: i === 2 ? "FFFFFF" : V.text, size: 9.5, bold: i === 2 }));
  txt(s, "WSL integration", 2.0, 2.6, 3.2, 0.4, { color: "FFFFFF", size: 13, bold: true });
  const toggles = [["Enable integration with my default WSL distro", true, false], ["Ubuntu", true, true]];
  toggles.forEach(([label, on, hl], i) => {
    const y = 3.2 + i * 0.95;
    if (hl) s.addShape("roundRect", { x: 1.95, y: y - 0.05, w: 3.2, h: 0.6, rectRadius: 0.05, fill: { color: V.bg, transparency: 100 }, line: { color: C.pink, width: 2 }, objectName: "Ubuntu강조" });
    s.addShape("roundRect", { x: 2.05, y: y + 0.08, w: 0.5, h: 0.28, rectRadius: 0.14, fill: { color: on ? V.on : V.edge }, line: { color: on ? V.on : V.edge, width: 0.5 }, objectName: "토글" + (i + 1) });
    s.addShape("ellipse", { x: on ? 2.31 : 2.08, y: y + 0.1, w: 0.24, h: 0.24, fill: { color: "FFFFFF" }, line: { color: "FFFFFF", width: 0.25 }, objectName: "토글점" + (i + 1) });
    txt(s, label, 2.65, y, 2.5, 0.5, { color: V.text, size: 9.5 });
  });
  s.addShape("roundRect", { x: 3.5, y: 5.45, w: 1.65, h: 0.45, rectRadius: 0.05, fill: { color: "0E639C" }, line: { color: "0E639C", width: 0.5 }, objectName: "적용버튼" });
  txt(s, "Apply & restart", 3.5, 5.45, 1.65, 0.45, { color: "FFFFFF", size: 10, bold: true, align: "center", margin: 0 });
}
// 6) docker --version (실제 실행)
{
  const s = slide("ver", " (build 해시는 화면에서 생략, 버전은 설치 시점/PC마다 다름)");
  L.terminal(s, { lines: [{ t: P + "docker --version" }, { t: verLine, hl: true }], label: "Docker 버전 확인", tone: "green", fontSize: 12 });
}
// 7) docker compose version (실제 실행)
{
  const s = slide("compose", " (버전은 설치 시점/PC마다 다름)");
  L.terminal(s, { lines: [{ t: P + "docker compose version" }, { t: comp[1], hl: true }], label: "Docker Compose 버전 확인", tone: "green", fontSize: 12 });
}
// 8) hello-world (실제 실행, 핵심 줄)
{
  const s = slide("hello", " (긴 출력 중 핵심 줄만 표시, 내려받기 로그는 일부 생략)");
  L.terminal(s, { lines: [{ t: P + "docker run hello-world" }, { t: L.trunc(helloView[0], 52) }, { t: helloView[1] }, { t: L.trunc(helloView[2], 52) }, { t: helloView[3], hl: true }, ...L.wrapLine(helloView[4], 50).map((t) => ({ t }))], label: "첫 컨테이너 실행", tone: "pink", fontSize: 10 });
}
// 9) 무슨 일이 일어났나 (hello-world 가 설명하는 4단계)
{
  const s = slide("flow");
  const steps = [["1", "docker 명령이 Docker 에 요청"], ["2", "이미지를 Docker Hub 에서 내려받음"], ["3", "이미지로 컨테이너를 만들어 실행"], ["4", "결과를 터미널에 출력"]];
  steps.forEach(([n, label], i) => {
    const y = 2.6 + i * 0.9;
    s.addShape("roundRect", { x: 0.45, y, w: 4.7, h: 0.75, rectRadius: 0.1, fill: { color: C.term }, line: { color: C.edge, width: 0.75 }, objectName: "단계" + n });
    s.addShape("ellipse", { x: 0.6, y: y + 0.17, w: 0.4, h: 0.4, fill: { color: C.purple }, line: { color: C.pink, width: 1.2 }, objectName: "번호" + n });
    s.addText(n, { x: 0.6, y: y + 0.17, w: 0.4, h: 0.4, fontFace: F.mono, fontSize: 13, bold: true, color: C.text, align: "center", valign: "middle", margin: 0, isTextBox: true });
    s.addText(label, { x: 1.15, y, w: 3.95, h: 0.75, fontFace: F.body, fontSize: 13, color: C.text, valign: "middle", margin: 0, isTextBox: true });
  });
}
// 10) 요약
{
  const s = slide("sum");
  const rows = [["docker --version", "설치 확인"], ["docker compose version", "Compose 확인"], ["docker run hello-world", "첫 컨테이너"]];
  rows.forEach(([cmd, desc], i) => {
    const y = 2.7 + i * 1.05;
    s.addShape("roundRect", { x: 0.45, y, w: 4.7, h: 0.85, rectRadius: 0.1, fill: { color: C.term }, line: { color: C.edge, width: 0.75 }, objectName: "요약행" + (i + 1) });
    s.addText(cmd, { x: 0.55, y, w: 3.0, h: 0.85, fontFace: F.mono, fontSize: 10.5, bold: true, color: C.pink, valign: "middle", margin: 0, isTextBox: true });
    s.addText(desc, { x: 3.6, y, w: 1.55, h: 0.85, fontFace: F.body, fontSize: 12, color: C.text, valign: "middle", margin: 0, isTextBox: true });
  });
}
// 11) 다음 회차 예고
{
  const s = slide("next");
  s.addShape("roundRect", { ...R.screen, rectRadius: 0.2, fill: { color: C.purple }, line: { color: C.pink, width: 1.5 }, objectName: "화면영역" });
  s.addText([{ text: "NEXT", options: { fontFace: F.mono, fontSize: 16, bold: true, color: C.pink, breakLine: true } },
    { text: "2회차", options: { fontSize: 20, breakLine: true } },
    { text: "이미지와 컨테이너", options: { fontSize: 28 } }],
    { ...R.screen, fontFace: F.title, color: C.text, align: "center", valign: "middle", isTextBox: true, objectName: "다음회차" });
}

fs.writeFileSync(path.join(__dirname, "script.txt"), narration.join("\n") + "\n", "utf8");
pres.writeFile({ fileName: path.join(__dirname, "ep01.pptx") }).then((f) => console.log("saved", f));
