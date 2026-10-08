// 19회차 PPT 생성: node build.js  (output/ 의 실제 실행 결과 사용, script.txt 도 함께 생성)
//
// 검증 범위: 화면의 모든 명령/출력은 제작 환경에서 실제 실행한 결과. 단 모델은 `ollama pull`(ollama.com 접속 불가)이 아니라
//            이미 가진 모델 파일(GGUF)을 `ollama create` 로 등록해서 사용. `ollama pull` 은 실행하지 못해 슬라이드/대본에 넣지 않음.
const path = require("path");
const fs = require("fs");
const L = require("../tools/shorts-lib.js");
const { C, F, R } = L;
const out = (n) => path.join(__dirname, "output", n);
const P = "user@PC:~$ ";
const TOPIC = "19회차\nOllama 명령어";
const TOPIC_TITLE = "19회차 · Ollama 명령어";

// caption = 슬라이드 자막(영문 그대로), narr = 나레이션 대본(영문은 한글 발음)
const T = {
  intro: { caption: "이번 시간에는 Ollama로 언어모델을 다루는 핵심 명령어를 익힙니다.", narr: "이번 시간에는 올라마로 언어모델을 다루는 핵심 명령어를 익힙니다." },
  run: { caption: "먼저 Ollama 서버를 컨테이너로 실행합니다. 모델 파일이 있는 폴더도 함께 연결합니다.", narr: "먼저 올라마 서버를 컨테이너로 실행합니다. 모델 파일이 있는 폴더도 함께 연결합니다." },
  mf: { caption: "Modelfile은 모델을 등록하는 설명서입니다. FROM 뒤에 모델 파일의 경로를 적습니다. temperature 0은 같은 질문에 같은 답을 내도록 합니다.", narr: "모델파일은 모델을 등록하는 설명서입니다. 프롬 뒤에 모델 파일의 경로를 적습니다. 템퍼러처 영은 같은 질문에 같은 답을 내도록 합니다." },
  create: { caption: "ollama create로 모델을 등록합니다. 이름은 smol로 정했습니다.", narr: "올라마 크리에이트로 모델을 등록합니다. 이름은 스몰로 정했습니다." },
  list: { caption: "ollama list로 등록된 모델을 확인합니다.", narr: "올라마 리스트로 등록된 모델을 확인합니다." },
  chat: { caption: "ollama run 뒤에 질문을 적으면, 모델이 답을 만들어 줍니다.", narr: "올라마 런 뒤에 질문을 적으면, 모델이 답을 만들어 줍니다." },
  show: { caption: "ollama show로 모델의 구조와 설정을 자세히 볼 수 있습니다.", narr: "올라마 쇼로 모델의 구조와 설정을 자세히 볼 수 있습니다." },
  ps: { caption: "ollama ps는 지금 메모리에 올라가 있는 모델을 보여 줍니다. 일정 시간이 지나면 자동으로 내려갑니다.", narr: "올라마 피에스는 지금 메모리에 올라가 있는 모델을 보여 줍니다. 일정 시간이 지나면 자동으로 내려갑니다." },
  rm: { caption: "필요 없는 모델은 ollama rm으로 지웁니다.", narr: "필요 없는 모델은 올라마 알엠으로 지웁니다." },
  sum: { caption: "create로 등록하고, run으로 실행하고, list와 rm으로 관리합니다.", narr: "크리에이트로 등록하고, 런으로 실행하고, 리스트와 알엠으로 관리합니다." },
  next: { caption: "다음 시간에는 파이썬 앱에서 Ollama를 불러 쓰는 방법을 알아봅니다.", narr: "다음 시간에는 파이썬 앱에서 올라마를 불러 쓰는 방법을 알아봅니다." },
};

const pres = L.newDeck("Docker 19회차 Ollama 명령어");
const narration = [];
function slide(key, notesExtra = "") {
  narration.push(T[key].narr);
  return L.baseSlide(pres, { title: key === "intro" ? L.SERIES_TITLE : TOPIC_TITLE, caption: T[key].caption, notes: T[key].caption + notesExtra });
}
const join = (ls_) => ls_.map((l) => l.replace(/ \\$/, "").trim()).join(" ").replace(P.trim(), "").trim();
const same = (lines, file, name) => { if (join(lines) !== file[0].replace(P.trim(), "").trim()) throw new Error("명령 불일치: " + name); };

// ---- 실제 실행 결과 ----
const rd = (n) => L.readOut(out(n + ".txt"));
const run = rd("01_run"), mf = L.readOut(out("Modelfile")), create = rd("03_create"), list = rd("04_list"), chat = rd("05_run"), show = rd("06_show"), ps = rd("07_ps"), rm = rd("08_rm");
const runCmd = [P + "docker run -d \\", "  -v ollama:/root/.ollama \\", "  -v ~/models:/models \\", "  -p 11434:11434 \\", "  --name ollama ollama/ollama"];
const createCmd = [P + "docker exec ollama \\", "  ollama create smol \\", "  -f /models/Modelfile"];
const chatCmd = [P + "docker exec ollama \\", "  ollama run smol \\", '  "What is Docker? Answer in one short sentence."'];
same(runCmd, run, "01_run"); same(createCmd, create, "03_create"); same(chatCmd, chat, "05_run");
const exact = (re) => { const l = create.find((x) => re.test(x)); if (!l) throw new Error("create 출력에서 못 찾음: " + re); return l; };
const createView = [exact(/^parsing GGUF$/), exact(/^using autodetected template chatml$/), exact(/^writing manifest$/), exact(/^success$/)];
const listView = L.pickColumns(list.slice(1), ["NAME", "ID", "SIZE"]);
const psView = L.pickColumns(ps.slice(1), ["NAME", "SIZE", "UNTIL"]);
const answer = chat.slice(1).join(" ");
if (!/^deleted 'smol'$/.test(rm[1]) || !/^Docker is /.test(answer) || listView.length !== 2 || psView.length !== 2) throw new Error("실행 결과가 예상과 다름");
const pick = (re) => { const l = show.find((x) => re.test(x)); if (!l) throw new Error("show 출력에서 못 찾음: " + re); return l; };
const showView = [pick(/^\s+Model$/), pick(/architecture/), pick(/parameters/), pick(/context length/), pick(/quantization/)];

// 1) 타이틀
{
  const s = slide("intro");
  s.addShape("roundRect", { ...R.screen, rectRadius: 0.2, fill: { color: C.purple }, line: { color: C.pink, width: 1.5 }, objectName: "화면영역" });
  s.addText(TOPIC, { ...R.screen, fontFace: F.title, fontSize: 30, color: C.text, align: "center", valign: "middle", isTextBox: true, objectName: "회차주제" });
}
// 2) Ollama 서버 컨테이너
{
  const s = slide("run", " (긴 명령은 \\ 로 줄바꿈해 표시, 컨테이너 ID는 앞부분만 표시, 이미지(ollama/ollama)는 약 9GB)");
  L.terminal(s, { lines: [...runCmd.map((t, i) => ({ t, hlCols: i === 2 ? [2, 22] : undefined })), { t: L.trunc(run[1], 30) }], label: "서버 실행 + 모델 폴더 연결", tone: "pink", fontSize: 11 });
}
// 3) Modelfile
{
  const s = slide("mf");
  L.terminal(s, { lines: [{ t: P + "cat ~/models/Modelfile" }, ...mf.map((t) => ({ t, hl: /^FROM/.test(t) || /^PARAMETER/.test(t) }))], label: "Modelfile: 모델 등록 설명서", tone: "pink", fontSize: 10 });
}
// 4) create
{
  const s = slide("create", " (긴 명령은 \\ 로 줄바꿈해 표시, 진행 표시는 생략하고 완료된 줄만 표시)");
  L.terminal(s, { lines: [...createCmd.map((t) => ({ t })), { t: "...", dim: true }, ...createView.map((t, i) => ({ t, hl: i === 3 }))], label: "모델 등록: ollama create", tone: "green", fontSize: 10 });
}
// 5) list
{
  const s = slide("list", " (일부 열 생략)");
  L.terminal(s, { lines: [{ t: P + "docker exec ollama ollama list" }, { t: listView[0], dim: true }, { t: listView[1], hl: true }], label: "등록된 모델 목록", tone: "green", fontSize: 11 });
}
// 6) run
{
  const s = slide("chat", " (긴 명령은 \\ 로 줄바꿈해 표시, 캡처할 때만 --nowordwrap 사용: 터미널 줄바꿈 제어문자 제거 목적. 응답은 temperature 0 이라 같은 질문에 같은 답)");
  L.terminal(s, { lines: [...chatCmd.map((t) => ({ t })), ...L.wrapLine(answer, 50).map((t) => ({ t, hl: true }))], label: "질문하고 답 받기", tone: "pink", fontSize: 10 });
}
// 7) show
{
  const s = slide("show", " (출력 앞부분만 표시)");
  L.terminal(s, { lines: [{ t: P + "docker exec ollama ollama show smol" }, ...showView.map((t) => ({ t, hl: /parameters/.test(t) })), { t: "...", dim: true }], label: "모델 정보", tone: "green", fontSize: 10 });
}
// 8) ps
{
  const s = slide("ps", " (일부 열 생략. PROCESSOR 열은 제작 환경의 값이 PC마다 달라 생략)");
  L.terminal(s, { lines: [{ t: P + "docker exec ollama ollama ps" }, { t: psView[0], dim: true }, { t: psView[1], hl: true }], label: "메모리에 올라간 모델", tone: "green", fontSize: 11 });
}
// 9) rm
{
  const s = slide("rm");
  L.terminal(s, { lines: [{ t: P + "docker exec ollama ollama rm smol" }, { t: rm[1], hl: true }], label: "모델 삭제", tone: "pink", fontSize: 12 });
}
// 10) 요약
{
  const s = slide("sum");
  const rows = [["ollama create", "모델 등록"], ["ollama run", "질문하기"], ["ollama list / ps", "확인하기"], ["ollama rm", "삭제하기"]];
  rows.forEach(([cmd, desc], i) => {
    const y = 2.6 + i * 0.95;
    s.addShape("roundRect", { x: 0.45, y, w: 4.7, h: 0.8, rectRadius: 0.1, fill: { color: C.term }, line: { color: C.edge, width: 0.75 }, objectName: "요약행" + (i + 1) });
    s.addText(cmd, { x: 0.6, y, w: 2.6, h: 0.8, fontFace: F.mono, fontSize: 12.5, bold: true, color: C.pink, valign: "middle", margin: 0, isTextBox: true });
    s.addText(desc, { x: 3.3, y, w: 1.8, h: 0.8, fontFace: F.body, fontSize: 14, color: C.text, valign: "middle", margin: 0, isTextBox: true });
  });
}
// 11) 다음 회차 예고
{
  const s = slide("next");
  s.addShape("roundRect", { ...R.screen, rectRadius: 0.2, fill: { color: C.purple }, line: { color: C.pink, width: 1.5 }, objectName: "화면영역" });
  s.addText([{ text: "NEXT", options: { fontFace: F.mono, fontSize: 16, bold: true, color: C.pink, breakLine: true } },
    { text: "20회차", options: { fontSize: 20, breakLine: true } },
    { text: "내 앱에 LLM 연결", options: { fontSize: 28 } }],
    { ...R.screen, fontFace: F.title, color: C.text, align: "center", valign: "middle", isTextBox: true, objectName: "다음회차" });
}

fs.writeFileSync(path.join(__dirname, "script.txt"), narration.join("\n") + "\n", "utf8");
pres.writeFile({ fileName: path.join(__dirname, "ep19.pptx") }).then((f) => console.log("saved", f));
