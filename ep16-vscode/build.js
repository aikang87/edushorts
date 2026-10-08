// 16회차 PPT 생성: node build.js  (output/ 의 실제 실행 결과 사용, script.txt 도 함께 생성)
//
// ※ 검증 범위: 2·3·5·6·8번 슬라이드의 VSCode 화면은 일러스트(제작 환경에서 VSCode 다운로드/마켓플레이스 접속 불가).
//    4·7번의 `code .`, `cat .devcontainer/devcontainer.json` 터미널 표시는 표준 사용법을 보여주는 화면이며 `code` 명령 자체는 실행하지 못함.
//    실제 실행으로 검증한 것: devcontainer.json 의 JSON 유효성(01), Dev Containers 내부 동작을 재현한 docker run(02).
const path = require("path");
const fs = require("fs");
const L = require("../tools/shorts-lib.js");
const { C, F, R } = L;
const OUT = process.env.OUT_DIR || path.join(__dirname, "output"); // OUT_DIR 은 레이아웃 시험용
const out = (n) => path.join(OUT, n);
const P = "user@PC:~$ ";
const PD = "user@PC:~/dockerlab$ ";
const TOPIC = "16회차\nVSCode 설치와 확장";
const TOPIC_TITLE = "16회차 · VSCode 설치와 확장";
const NOTE_ILLUST = " [일러스트: 제작 환경에서 VSCode 실제 화면을 캡처하지 못함]";

// caption = 슬라이드 자막(영문 그대로), narr = 나레이션 대본(영문은 한글 발음)
const T = {
  intro: { caption: "이번 시간에는 VSCode를 설치하고 Docker용 필수 확장을 설정합니다.", narr: "이번 시간에는 브이에스코드를 설치하고 도커용 필수 확장을 설정합니다." },
  install: { caption: "Windows에 VSCode를 설치합니다. 설치 옵션에서 Add to PATH가 선택됐는지 확인합니다.", narr: "윈도우에 브이에스코드를 설치합니다. 설치 옵션에서 애드 투 패스가 선택됐는지 확인합니다." },
  wsl: { caption: "확장 탭에서 WSL 확장을 설치하면, WSL 안의 파일을 직접 열 수 있습니다.", narr: "확장 탭에서 더블유에스엘 확장을 설치하면, WSL 안의 파일을 직접 열 수 있습니다." },
  code: { caption: "WSL 터미널에서 code . 명령을 실행하면, 현재 폴더가 VSCode로 열립니다.", narr: "WSL 터미널에서 코드 점 명령을 실행하면, 현재 폴더가 브이에스코드로 열립니다." },
  ext: { caption: "필수 확장은 Docker, Dev Containers, YAML입니다. 확장 탭이나 code --install-extension 명령으로 설치합니다.", narr: "필수 확장은 도커, 데브 컨테이너스, 야믈입니다. 확장 탭이나 코드 인스톨 익스텐션 명령으로 설치합니다." },
  docker: { caption: "Docker 확장을 설치하면 컨테이너와 이미지를 볼 수 있는 화면이 생깁니다.", narr: "도커 확장을 설치하면 컨테이너와 이미지를 볼 수 있는 화면이 생깁니다." },
  json: { caption: "Dev Containers는 컨테이너 안에서 VSCode를 엽니다. 설정 파일에 사용할 이미지를 적습니다.", narr: "데브 컨테이너스는 컨테이너 안에서 브이에스코드를 엽니다. 설정 파일에 사용할 이미지를 적습니다." },
  reopen: { caption: "명령 팔레트에서 Reopen in Container를 선택하면, 컨테이너 안에서 열립니다.", narr: "명령 팔레트에서 리오픈 인 컨테이너를 선택하면, 컨테이너 안에서 열립니다." },
  under: { caption: "내부에서는 우리가 배운 볼륨 연결로 내 폴더를 컨테이너에 연결합니다.", narr: "내부에서는 우리가 배운 볼륨 연결로 내 폴더를 컨테이너에 연결합니다." },
  sum: { caption: "확장 설치, code . 로 열기, 컨테이너에서 다시 열기만 기억하세요.", narr: "확장 설치, 코드 점으로 열기, 컨테이너에서 다시 열기만 기억하세요." },
  next: { caption: "다음 시간에는 Docker로 머신러닝 개발환경을 만들어 봅니다.", narr: "다음 시간에는 도커로 머신러닝 개발환경을 만들어 봅니다." },
};

const pres = L.newDeck("Docker 16회차 VSCode 설치와 확장");
const narration = [];
function slide(key, notesExtra = "") {
  narration.push(T[key].narr);
  return L.baseSlide(pres, { title: key === "intro" ? L.SERIES_TITLE : TOPIC_TITLE, caption: T[key].caption, notes: T[key].caption + notesExtra });
}

// ---- VSCode 일러스트용 색/도형 ----
const V = { bg: "1E1E1E", side: "252526", bar: "333333", blue: "007ACC", btn: "0E639C", text: "CCCCCC", dim: "858585", edge: "454545" };
const rect = (s, x, y, w, h, fill, line, name) => s.addShape("rect", { x, y, w, h, fill: { color: fill }, line: { color: line || fill, width: 0.75 }, objectName: name });
const txt = (s, text, x, y, w, h, o = {}) => s.addText(text, { x, y, w, h, fontFace: o.mono ? F.mono : "Arial", fontSize: o.size || 11, bold: !!o.bold, color: o.color || V.text, align: o.align || "left", valign: "middle", margin: o.margin ?? 0.05, isTextBox: true });

// ---- 실제 실행 결과 ----
const rd = (n) => L.readOut(out(n));
const json = L.readOut(out("devcontainer.json")), hello = L.readOut(out("hello.py"));
const run = rd("02_run.txt");
if (rd("01_json_check.txt")[0] !== "devcontainer.json: valid JSON") throw new Error("JSON 검사 결과가 없음");
const runCmd = [PD + 'docker run --rm \\', '  -v "$PWD":/workspaces/dockerlab \\', "  -w /workspaces/dockerlab \\", "  python:3.12-slim python hello.py"];
const joined = runCmd.map((l) => l.replace(/ \\$/, "").trim()).join(" ").replace(PD.trim(), "").trim();
if (joined !== run[0].replace("user@PC:~/dockerlab$", "").trim()) throw new Error("02_run 명령 불일치");
if (run.at(-1) !== "Hello from Dev Container!") throw new Error("02_run 결과가 예상과 다름: " + run.at(-1));

// 1) 타이틀
{
  const s = slide("intro");
  s.addShape("roundRect", { ...R.screen, rectRadius: 0.2, fill: { color: C.purple }, line: { color: C.pink, width: 1.5 }, objectName: "화면영역" });
  s.addText(TOPIC, { ...R.screen, fontFace: F.title, fontSize: 30, color: C.text, align: "center", valign: "middle", isTextBox: true, objectName: "회차주제" });
}
// 2) 설치 마법사 (일러스트)
{
  const s = slide("install", NOTE_ILLUST);
  rect(s, 0.35, 2.5, 4.9, 3.6, "F3F3F3", "BBBBBB", "설치창");
  rect(s, 0.35, 2.5, 4.9, 0.4, "FFFFFF", "BBBBBB", "설치창제목");
  txt(s, "Setup - Microsoft Visual Studio Code", 0.4, 2.5, 4.8, 0.4, { color: "222222", size: 11 });
  txt(s, "Select Additional Tasks", 0.5, 3.0, 4.6, 0.4, { color: "222222", size: 12, bold: true });
  const items = [["Create a desktop icon", false], ['Add "Open with Code" to file context menu', true], ['Add "Open with Code" to folder context menu', true], ["Add to PATH (requires shell restart)", true]];
  items.forEach(([label, on], i) => {
    const y = 3.5 + i * 0.55;
    const hl = i === 3;
    if (hl) s.addShape("roundRect", { x: 0.45, y: y - 0.05, w: 4.7, h: 0.5, rectRadius: 0.05, fill: { color: "F3F3F3", transparency: 100 }, line: { color: C.pink, width: 2 }, objectName: "PATH강조" });
    rect(s, 0.6, y + 0.07, 0.25, 0.25, "FFFFFF", "555555", "체크박스" + (i + 1));
    if (on) txt(s, "✓", 0.6, y + 0.04, 0.25, 0.3, { color: "0B6BCB", size: 12, bold: true, align: "center", margin: 0 });
    txt(s, label, 0.95, y, 4.2, 0.4, { color: "222222", size: 10.5 });
  });
}
// 3) WSL 확장 (일러스트)
{
  const s = slide("wsl", NOTE_ILLUST);
  rect(s, 0.35, 2.5, 4.9, 3.6, V.side, V.edge, "확장패널");
  txt(s, "EXTENSIONS", 0.45, 2.55, 3, 0.4, { color: V.text, size: 11, bold: true });
  rect(s, 0.5, 3.0, 4.6, 0.42, V.bg, V.blue, "검색창");
  txt(s, "WSL", 0.6, 3.0, 4.4, 0.42, { color: V.text, size: 12 });
  rect(s, 0.5, 3.6, 4.6, 1.0, V.bar, V.edge, "확장카드");
  rect(s, 0.6, 3.7, 0.7, 0.7, V.blue, V.blue, "확장아이콘");
  txt(s, "WSL", 0.6, 3.7, 0.7, 0.7, { color: "FFFFFF", size: 12, bold: true, align: "center", margin: 0 });
  txt(s, "WSL", 1.45, 3.65, 2.2, 0.35, { color: "FFFFFF", size: 13, bold: true });
  txt(s, "Microsoft", 1.45, 3.98, 2.2, 0.3, { color: V.dim, size: 10 });
  s.addShape("roundRect", { x: 3.85, y: 4.05, w: 1.15, h: 0.4, rectRadius: 0.03, fill: { color: V.btn }, line: { color: C.pink, width: 2 }, objectName: "Install버튼" });
  txt(s, "Install", 3.85, 4.05, 1.15, 0.4, { color: "FFFFFF", size: 11, bold: true, align: "center", margin: 0 });
}
// 4) code .
{
  const s = slide("code", " [표준 사용법 화면: 제작 환경에서 code 명령을 실행하지 못함]");
  L.terminal(s, { lines: [{ t: P + "mkdir ~/dockerlab" }, { t: P + "cd ~/dockerlab" }, { t: PD + "code .", hl: true }], label: "현재 폴더를 VSCode 로 열기", tone: "pink", fontSize: 12 });
}
// 5) 필수 확장 3개
{
  const s = slide("ext", " [확장 이름/ID 안내: 제작 환경에서 마켓플레이스 접속 불가로 설치 실행은 하지 못함]");
  const items = [["Docker", "ms-azuretools.vscode-docker"], ["Dev Containers", "ms-vscode-remote.remote-containers"], ["YAML", "redhat.vscode-yaml"]];
  items.forEach(([name, id], i) => {
    const y = 2.55 + i * 1.15;
    s.addShape("roundRect", { x: 0.35, y, w: 4.9, h: 1.0, rectRadius: 0.1, fill: { color: C.term }, line: { color: C.edge, width: 1 }, objectName: "확장행" + (i + 1) });
    s.addText(name, { x: 0.5, y: y + 0.05, w: 4.6, h: 0.45, fontFace: F.body, fontSize: 16, bold: true, color: C.text, valign: "middle", margin: 0, isTextBox: true });
    s.addText(id, { x: 0.5, y: y + 0.5, w: 4.6, h: 0.4, fontFace: F.mono, fontSize: 11, color: C.pink, valign: "middle", margin: 0, isTextBox: true });
  });
}
// 6) Docker 사이드바 (일러스트)
{
  const s = slide("docker", NOTE_ILLUST);
  rect(s, 0.35, 2.5, 0.6, 3.6, V.bar, V.edge, "활동바");
  txt(s, "Docker", 0.35, 2.6, 0.6, 0.4, { color: "FFFFFF", size: 8, bold: true, align: "center", margin: 0 });
  rect(s, 0.95, 2.5, 4.3, 3.6, V.side, V.edge, "도커사이드바");
  txt(s, "DOCKER", 1.05, 2.55, 3, 0.4, { color: V.text, size: 11, bold: true });
  const sec = [["▸ CONTAINERS", "web   Up 2 minutes"], ["▸ IMAGES", "hello:latest, nginx:alpine"], ["▸ REGISTRIES", ""], ["▸ NETWORKS", ""], ["▸ VOLUMES", "ollama"]];
  sec.forEach(([h, sub], i) => {
    const y = 3.05 + i * 0.6;
    txt(s, h, 1.05, y, 4.1, 0.3, { color: V.text, size: 11, bold: true });
    if (sub) txt(s, sub, 1.4, y + 0.27, 3.7, 0.28, { color: V.dim, size: 10 });
  });
}
// 7) devcontainer.json (파일 내용은 실제 검증한 파일)
{
  const s = slide("json", " (.devcontainer/devcontainer.json 내용은 실제 JSON 유효성 검사를 통과한 파일, 일부 화면은 표준 사용법 표시)");
  L.terminal(s, { lines: [{ t: PD + "cat .devcontainer/devcontainer.json" }, ...json.map((t, i) => ({ t, hl: /"image"/.test(t) }))], label: "devcontainer.json: 사용할 이미지", tone: "pink", fontSize: 10 });
}
// 8) 명령 팔레트 (일러스트)
{
  const s = slide("reopen", NOTE_ILLUST);
  rect(s, 0.5, 2.7, 4.6, 3.0, V.side, V.edge, "팔레트");
  rect(s, 0.65, 2.85, 4.3, 0.45, V.bg, V.blue, "팔레트입력");
  txt(s, ">Dev Containers: Reopen", 0.75, 2.85, 4.1, 0.45, { color: V.text, size: 11, mono: true });
  const rows = ["Dev Containers: Reopen in Container", "Dev Containers: Rebuild Container", "Dev Containers: Open Folder in Container..."];
  rows.forEach((r, i) => {
    const y = 3.45 + i * 0.5;
    if (i === 0) s.addShape("rect", { x: 0.6, y, w: 4.4, h: 0.45, fill: { color: "04395E" }, line: { color: C.pink, width: 2 }, objectName: "선택항목" });
    txt(s, r, 0.7, y, 4.2, 0.45, { color: i === 0 ? "FFFFFF" : V.text, size: 10.5 });
  });
}
// 9) 내부 동작 재현 (실제 실행 결과)
{
  const s = slide("under", " (긴 명령은 \\ 로 줄바꿈해 표시. Dev Containers 가 내부에서 하는 일(폴더 연결 + 컨테이너 실행)을 docker run 으로 재현한 실제 실행 결과)");
  L.terminal(s, { lines: [...runCmd.map((t, i) => ({ t, hlCols: i === 1 ? [2, 36] : undefined })), { t: run.at(-1), hl: true }], label: "내 폴더를 컨테이너에 연결해 실행", tone: "green", fontSize: 10 });
}
// 10) 요약
{
  const s = slide("sum");
  const rows = [["확장 설치", "Docker, Dev Containers"], ["code .", "현재 폴더 열기"], ["Reopen in Container", "컨테이너에서 열기"]];
  rows.forEach(([cmd, desc], i) => {
    const y = 2.7 + i * 1.05;
    s.addShape("roundRect", { x: 0.45, y, w: 4.7, h: 0.85, rectRadius: 0.1, fill: { color: C.term }, line: { color: C.edge, width: 0.75 }, objectName: "요약행" + (i + 1) });
    s.addText(cmd, { x: 0.6, y, w: 2.5, h: 0.85, fontFace: i === 0 ? F.body : F.mono, fontSize: i === 2 ? 11 : 13, bold: true, color: C.pink, valign: "middle", margin: 0, isTextBox: true });
    s.addText(desc, { x: 3.15, y, w: 2.0, h: 0.85, fontFace: F.body, fontSize: 12, color: C.text, valign: "middle", margin: 0, isTextBox: true });
  });
}
// 11) 다음 회차 예고
{
  const s = slide("next");
  s.addShape("roundRect", { ...R.screen, rectRadius: 0.2, fill: { color: C.purple }, line: { color: C.pink, width: 1.5 }, objectName: "화면영역" });
  s.addText([{ text: "NEXT", options: { fontFace: F.mono, fontSize: 16, bold: true, color: C.pink, breakLine: true } },
    { text: "17회차", options: { fontSize: 20, breakLine: true } },
    { text: "Docker로 ML 개발환경 ①", options: { fontSize: 26 } }],
    { ...R.screen, fontFace: F.title, color: C.text, align: "center", valign: "middle", isTextBox: true, objectName: "다음회차" });
}

fs.writeFileSync(path.join(__dirname, "script.txt"), narration.join("\n") + "\n", "utf8");
pres.writeFile({ fileName: path.join(__dirname, "ep16.pptx") }).then((f) => console.log("saved", f));
