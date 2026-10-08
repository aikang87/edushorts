// 19회차 PPT 생성: node build.js  (output/ 의 실제 실행 결과 사용, script.txt 도 함께 생성)
//
// ※ 검증 범위: 6~8번 슬라이드(ollama pull / run / GPU)는 제작 환경에서 모델 다운로드가 막혀 실행해 보지 못한 "명령만 보여주는" 슬라이드.
//    실제 출력을 만들어 넣지 않았으며, 슬라이드 노트에 "[미검증]" 으로 표시함. 허용된 환경에서 `EXTRA=1 ./commands.sh` 로 검증 후 출력 슬라이드를 추가할 것.
const path = require("path");
const fs = require("fs");
const L = require("../tools/shorts-lib.js");
const { C, F, R } = L;
const out = (n) => path.join(__dirname, "output", n);
const P = "user@PC:~$ ";
const TOPIC = "19회차\nDocker + Ollama";
const TOPIC_TITLE = "19회차 · Docker + Ollama";
const UNVERIFIED = " [미검증: 제작 환경에서 실행하지 못함. 명령만 표시]";

// caption = 슬라이드 자막(영문 그대로), narr = 나레이션 대본(영문은 한글 발음)
const T = {
  intro: { caption: "이번 시간에는 Docker로 내 컴퓨터에서 대규모 언어모델을 실행하는 Ollama를 알아봅니다.", narr: "이번 시간에는 도커로 내 컴퓨터에서 대규모 언어모델을 실행하는 올라마를 알아봅니다." },
  what: { caption: "Ollama는 인공지능 언어모델을 내 컴퓨터에서 실행해 주는 프로그램입니다. 컨테이너로 실행하면 설치가 간단합니다.", narr: "올라마는 인공지능 언어모델을 내 컴퓨터에서 실행해 주는 프로그램입니다. 컨테이너로 실행하면 설치가 간단합니다." },
  run: { caption: "-v 옵션으로 모델 저장 폴더를 연결하면, 컨테이너를 지워도 모델이 남습니다. 이미지가 커서 처음에는 시간이 걸립니다.", narr: "브이 옵션으로 모델 저장 폴더를 연결하면, 컨테이너를 지워도 모델이 남습니다. 이미지가 커서 처음에는 시간이 걸립니다." },
  curl: { caption: "접속해 보면 Ollama가 실행 중이라고 응답합니다.", narr: "접속해 보면 올라마가 실행 중이라고 응답합니다." },
  list: { caption: "docker exec로 컨테이너 안의 ollama 명령을 실행합니다. 아직 내려받은 모델이 없어서 목록이 비어 있습니다.", narr: "도커 엑섹으로 컨테이너 안의 올라마 명령을 실행합니다. 아직 내려받은 모델이 없어서 목록이 비어 있습니다." },
  pull: { caption: "ollama pull로 모델을 내려받습니다. 작은 모델이라 GPU가 없어도 실행할 수 있습니다.", narr: "올라마 풀로 모델을 내려받습니다. 작은 모델이라 지피유가 없어도 실행할 수 있습니다." },
  chat: { caption: "ollama run으로 모델과 대화를 시작합니다. -it 옵션은 키보드 입력을 연결합니다.", narr: "올라마 런으로 모델과 대화를 시작합니다. 아이티 옵션은 키보드 입력을 연결합니다." },
  gpu: { caption: "GPU가 있다면 --gpus all 옵션을 더해 더 빠르게 실행할 수 있습니다.", narr: "지피유가 있다면 지피유스 올 옵션을 더해 더 빠르게 실행할 수 있습니다." },
  sum: { caption: "컨테이너로 실행하고, exec로 명령하고, 볼륨에 모델을 보관합니다.", narr: "컨테이너로 실행하고, 엑섹으로 명령하고, 볼륨에 모델을 보관합니다." },
  next: { caption: "다음 시간에는 Docker로 이미지를 만드는 ComfyUI를 알아봅니다.", narr: "다음 시간에는 도커로 이미지를 만드는 컴피유아이를 알아봅니다." },
};

const pres = L.newDeck("Docker 19회차 Docker + Ollama");
const narration = [];
function slide(key, notesExtra = "") {
  narration.push(T[key].narr);
  return L.baseSlide(pres, { title: key === "intro" ? L.SERIES_TITLE : TOPIC_TITLE, caption: T[key].caption, notes: T[key].caption + notesExtra });
}
const join = (ls_) => ls_.map((l) => l.replace(/ \\$/, "").trim()).join(" ").replace(P.trim(), "").trim();
const same = (lines, file, name) => { if (join(lines) !== file[0].replace(P.trim(), "").trim()) throw new Error("명령 불일치: " + name); };

// ---- 실제 실행 결과 (검증된 범위) ----
const rd = (n) => L.readOut(out(n + ".txt"));
const run = rd("01_run"), curl = rd("02_curl"), list = rd("03_list");
const runCmd = [P + "docker run -d \\", "  -v ollama:/root/.ollama \\", "  -p 11434:11434 \\", "  --name ollama ollama/ollama"];
same(runCmd, run, "01_run");
if (curl[1] !== "Ollama is running" || !/^NAME\s+ID\s+SIZE\s+MODIFIED/.test(list[1]) || list.length !== 2) throw new Error("실행 결과가 예상과 다름");
const listHead = L.pickColumns([list[1]], ["NAME", "ID", "SIZE", "MODIFIED"])[0];

// 1) 타이틀
{
  const s = slide("intro");
  s.addShape("roundRect", { ...R.screen, rectRadius: 0.2, fill: { color: C.purple }, line: { color: C.pink, width: 1.5 }, objectName: "화면영역" });
  s.addText(TOPIC, { ...R.screen, fontFace: F.title, fontSize: 30, color: C.text, align: "center", valign: "middle", isTextBox: true, objectName: "회차주제" });
}
// 2) 구조
{
  const s = slide("what");
  const box = (x, y, w, h, fill, line, head, sub, name) => {
    s.addShape("roundRect", { x, y, w, h, rectRadius: 0.12, fill: { color: fill }, line: { color: line, width: 1.5 }, objectName: name });
    s.addText([{ text: head, options: { fontSize: 16, bold: true, breakLine: !!sub } }, ...(sub ? [{ text: sub, options: { fontSize: 11 } }] : [])],
      { x, y, w, h, fontFace: F.body, color: C.text, align: "center", valign: "middle", margin: 0.03, isTextBox: true });
  };
  box(1.0, 2.55, 3.6, 0.8, C.term, C.edge, "터미널 / 브라우저", "", "클라이언트");
  s.addText("▼  localhost:11434", { x: 1.0, y: 3.4, w: 3.6, h: 0.45, fontFace: F.mono, fontSize: 12, bold: true, color: C.pink, align: "center", valign: "middle", margin: 0, isTextBox: true });
  box(1.0, 3.9, 3.6, 1.0, C.purple, C.pink, "Ollama 컨테이너", "언어모델 실행", "올라마");
  s.addText("▼  -v", { x: 1.0, y: 4.95, w: 3.6, h: 0.45, fontFace: F.mono, fontSize: 12, bold: true, color: C.pink, align: "center", valign: "middle", margin: 0, isTextBox: true });
  box(1.0, 5.45, 3.6, 0.75, C.greenDark, C.green, "볼륨: 모델 저장", "", "볼륨");
}
// 3) run (검증됨)
{
  const s = slide("run", " (긴 명령은 \\ 로 줄바꿈해 표시, 컨테이너 ID는 앞부분만 표시)");
  L.terminal(s, { lines: [...runCmd.map((t, i) => ({ t, hlCols: i === 1 ? [2, 25] : undefined })), { t: L.trunc(run[1], 30) }], label: "Ollama 서버 실행", tone: "pink", fontSize: 11 });
}
// 4) curl (검증됨)
{
  const s = slide("curl", " (터미널에서 curl 은 본문만 출력)");
  L.terminal(s, { lines: [{ t: P + "curl localhost:11434" }, { t: curl[1], hl: true }], label: "서버 응답 확인", tone: "green", fontSize: 12 });
}
// 5) exec ollama list (검증됨)
{
  const s = slide("list");
  L.terminal(s, { lines: [{ t: P + "docker exec ollama ollama list" }, { t: listHead, dim: true, hl: true }], label: "설치된 모델: 아직 없음", tone: "green", fontSize: 11 });
}
// 6) pull (미검증: 명령만)
{
  const s = slide("pull", UNVERIFIED);
  L.terminal(s, { lines: [{ t: P + "docker exec ollama \\", hl: false }, { t: "  ollama pull qwen2.5:0.5b", hl: true }], label: "모델 내려받기", tone: "pink", fontSize: 12 });
}
// 7) run model (미검증: 명령만)
{
  const s = slide("chat", UNVERIFIED);
  L.terminal(s, { lines: [{ t: P + "docker exec -it ollama \\" }, { t: "  ollama run qwen2.5:0.5b", hl: true }], label: "모델과 대화하기", tone: "pink", fontSize: 12 });
}
// 8) GPU 부록 (미검증: 안내)
{
  const s = slide("gpu", UNVERIFIED + " GPU 환경 추가 설명");
  s.addShape("roundRect", { x: 0.35, y: 2.6, w: 4.9, h: 2.9, rectRadius: 0.12, fill: { color: C.term }, line: { color: C.edge, width: 1 }, objectName: "GPU카드" });
  s.addText("GPU 가 있다면 (부록)", { x: 0.35, y: 2.7, w: 4.9, h: 0.5, fontFace: F.body, fontSize: 16, bold: true, color: C.text, align: "center", valign: "middle", margin: 0, isTextBox: true });
  s.addText([{ text: "docker run -d --gpus all \\", options: { breakLine: true } }, { text: "  -v ollama:/root/.ollama \\", options: { breakLine: true } }, { text: "  -p 11434:11434 \\", options: { breakLine: true } }, { text: "  --name ollama ollama/ollama" }],
    { x: 0.6, y: 3.3, w: 4.4, h: 1.4, fontFace: F.mono, fontSize: 12, color: C.text, valign: "top", margin: 0, isTextBox: true });
  s.addText("NVIDIA 드라이버 + Container Toolkit 필요", { x: 0.35, y: 4.85, w: 4.9, h: 0.45, fontFace: F.body, fontSize: 12, color: C.dim, align: "center", valign: "middle", margin: 0, isTextBox: true });
}
// 9) 요약
{
  const s = slide("sum");
  const rows = [["docker run", "서버 실행"], ["docker exec", "컨테이너 안 명령"], ["-v ollama:...", "모델 보관"]];
  rows.forEach(([cmd, desc], i) => {
    const y = 2.7 + i * 1.05;
    s.addShape("roundRect", { x: 0.45, y, w: 4.7, h: 0.85, rectRadius: 0.1, fill: { color: C.term }, line: { color: C.edge, width: 0.75 }, objectName: "요약행" + (i + 1) });
    s.addText(cmd, { x: 0.6, y, w: 2.4, h: 0.85, fontFace: F.mono, fontSize: 13, bold: true, color: C.pink, valign: "middle", margin: 0, isTextBox: true });
    s.addText(desc, { x: 3.1, y, w: 2.0, h: 0.85, fontFace: F.body, fontSize: 14, color: C.text, valign: "middle", margin: 0, isTextBox: true });
  });
}
// 10) 다음 회차 예고
{
  const s = slide("next");
  s.addShape("roundRect", { ...R.screen, rectRadius: 0.2, fill: { color: C.purple }, line: { color: C.pink, width: 1.5 }, objectName: "화면영역" });
  s.addText([{ text: "NEXT", options: { fontFace: F.mono, fontSize: 16, bold: true, color: C.pink, breakLine: true } },
    { text: "20회차", options: { fontSize: 20, breakLine: true } },
    { text: "Docker + ComfyUI", options: { fontSize: 28 } }],
    { ...R.screen, fontFace: F.title, color: C.text, align: "center", valign: "middle", isTextBox: true, objectName: "다음회차" });
}

fs.writeFileSync(path.join(__dirname, "script.txt"), narration.join("\n") + "\n", "utf8");
console.warn("[주의] 6~8번 슬라이드는 제작 환경에서 검증하지 못한 명령만 표시하는 슬라이드입니다.");
pres.writeFile({ fileName: path.join(__dirname, "ep19.pptx") }).then((f) => console.log("saved", f));
