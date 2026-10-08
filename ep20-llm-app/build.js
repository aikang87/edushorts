// 20회차 PPT 생성: node build.js  (output/ 의 실제 실행 결과 사용, script.txt 도 함께 생성)
//
// 검증 범위: 화면의 모든 명령/출력은 제작 환경에서 실제 실행한 결과. 단 모델은 `ollama pull`(ollama.com 접속 불가)이 아니라
//            이미 가진 모델 파일(GGUF)을 `ollama create` 로 등록해서 사용 (19회차와 동일).
const path = require("path");
const fs = require("fs");
const L = require("../tools/shorts-lib.js");
const { C, F, R } = L;
const out = (n) => path.join(__dirname, "output", n);
const P = "user@PC:~$ ";
const PH = "user@PC:~/llmapp$ "; // ~/llmapp 폴더 안에서의 프롬프트
const TOPIC = "20회차\n내 앱에 LLM 연결";
const TOPIC_TITLE = "20회차 · 내 앱에 LLM 연결";

// caption = 슬라이드 자막(영문 그대로), narr = 나레이션 대본(영문은 한글 발음)
const T = {
  intro: { caption: "이번 시간에는 Compose로 Ollama와 내 파이썬 앱을 연결합니다.", narr: "이번 시간에는 컴포즈로 올라마와 내 파이썬 앱을 연결합니다." },
  why: { caption: "앱 컨테이너가 서비스 이름 ollama로 Ollama 컨테이너에 요청을 보내는 구조입니다.", narr: "앱 컨테이너가 서비스 이름 올라마로 올라마 컨테이너에 요청을 보내는 구조입니다." },
  yaml1: { caption: "ollama 서비스는 모델을 볼륨에 보관하고, 모델 파일 폴더를 연결합니다.", narr: "올라마 서비스는 모델을 볼륨에 보관하고, 모델 파일 폴더를 연결합니다." },
  yaml2: { caption: "chat 서비스는 환경변수로 Ollama 주소를 받습니다. 주소의 호스트 이름이 서비스 이름입니다.", narr: "챗 서비스는 환경변수로 올라마 주소를 받습니다. 주소의 호스트 이름이 서비스 이름입니다." },
  code: { caption: "파이썬 표준 라이브러리만으로 요청을 보내는 짧은 코드입니다. 외부 패키지는 필요 없습니다.", narr: "파이썬 표준 라이브러리만으로 요청을 보내는 짧은 코드입니다. 외부 패키지는 필요 없습니다." },
  up: { caption: "docker compose up -d로 Ollama 서버를 실행합니다.", narr: "도커 컴포즈 업 대시 디로 올라마 서버를 실행합니다." },
  create: { caption: "컨테이너 안에서 모델을 등록합니다. 모델은 볼륨에 저장되어, 컨테이너를 다시 만들어도 남습니다.", narr: "컨테이너 안에서 모델을 등록합니다. 모델은 볼륨에 저장되어, 컨테이너를 다시 만들어도 남습니다." },
  api: { caption: "Ollama는 API도 제공합니다. JSON으로 질문을 보내면 응답이 JSON으로 돌아옵니다.", narr: "올라마는 에이피아이도 제공합니다. 제이슨으로 질문을 보내면 응답이 제이슨으로 돌아옵니다." },
  chat: { caption: "이제 내 파이썬 앱에서 같은 질문을 보내 답을 받습니다.", narr: "이제 내 파이썬 앱에서 같은 질문을 보내 답을 받습니다." },
  sum: { caption: "서비스 이름으로 연결하고, 볼륨에 모델을 보관하면 나만의 LLM 앱을 만들 수 있습니다.", narr: "서비스 이름으로 연결하고, 볼륨에 모델을 보관하면 나만의 엘엘엠 앱을 만들 수 있습니다." },
  end: { caption: "지금까지 Docker의 기초부터 LLM 실행까지 배웠습니다. 수고하셨습니다.", narr: "지금까지 도커의 기초부터 엘엘엠 실행까지 배웠습니다. 수고하셨습니다." },
};

const pres = L.newDeck("Docker 20회차 내 앱에 LLM 연결");
const narration = [];
function slide(key, notesExtra = "") {
  narration.push(T[key].narr);
  return L.baseSlide(pres, { title: key === "intro" ? L.SERIES_TITLE : TOPIC_TITLE, caption: T[key].caption, notes: T[key].caption + notesExtra });
}
const norm = (s) => s.replace(/\\\s*\n/g, " ").replace(/\s+/g, "");
const same = (lines, file, name) => { const a = norm(lines.map((l) => l.replace(/ \\$/, "")).join(" ").replace(/user@PC:[^$]*\$/, "")), b = norm(file[0].replace(/user@PC:[^$]*\$/, "")); if (a !== b) throw new Error("명령 불일치: " + name + "\n" + a + "\n" + b); };

// ---- 실제 실행 결과 ----
const rd = (n) => L.readOut(out(n + ".txt"));
const yaml = L.readOut(out("compose.yaml")), chatPy = L.readOut(out("chat.py")).filter((l) => l.trim() !== "");
const up = rd("01_up"), create = rd("02_create"), curl = rd("03_curl"), chat = rd("04_chat");
const upCmd = P + "docker compose up -d";
const createCmd = [PH + "docker compose exec ollama \\", "  ollama create smol \\", "  -f /models/Modelfile"];
const curlCmd = [P + "curl localhost:11434/api/generate \\", `  -d '{"model": "smol", "prompt": "What is Docker?",`, `       "stream": false}'`];
const chatCmd = [PH + "docker compose run --rm chat \\", "  python chat.py \\", '  "What is Docker? Answer in one short sentence."'];
same(createCmd, create, "02_create"); same(curlCmd, curl, "03_curl"); same(chatCmd, chat, "04_chat");
const upKey = ["Network llmapp_default Created", "Volume llmapp_ollama Created", "Container llmapp-ollama-1 Started"].map((k) => { const l = up.find((x) => x.includes(k)); if (!l) throw new Error("up 로그에서 못 찾음: " + k); return l; });
const ex = (re) => { const l = create.find((x) => re.test(x)); if (!l) throw new Error("create 출력에서 못 찾음: " + re); return l; };
const createView = [ex(/^parsing GGUF$/), ex(/^using autodetected template chatml$/), ex(/^writing manifest$/), ex(/^success$/)];
const answer = chat.at(-1);
const json = curl[1];
if (!/^\{"model":"smol",/.test(json) || !json.includes('"response":"Docker is ') || !json.includes('"done":true') || !/^Docker is /.test(answer)) throw new Error("API/앱 응답이 예상과 다름");
const yIdx = (re) => { const i = yaml.findIndex((l) => re.test(l)); if (i < 0) throw new Error("compose.yaml 에서 못 찾음: " + re); return i; };
const iOllama = yIdx(/^  ollama:/), iChat = yIdx(/^  chat:/);

// 1) 타이틀
{
  const s = slide("intro");
  s.addShape("roundRect", { ...R.screen, rectRadius: 0.2, fill: { color: C.purple }, line: { color: C.pink, width: 1.5 }, objectName: "화면영역" });
  s.addText(TOPIC, { ...R.screen, fontFace: F.title, fontSize: 28, color: C.text, align: "center", valign: "middle", isTextBox: true, objectName: "회차주제" });
}
// 2) 구조
{
  const s = slide("why");
  const box = (y, fill, line, head, sub, name) => {
    s.addShape("roundRect", { x: 0.9, y, w: 3.8, h: 1.0, rectRadius: 0.12, fill: { color: fill }, line: { color: line, width: 1.5 }, objectName: name });
    s.addText([{ text: head, options: { fontSize: 17, bold: true, breakLine: true } }, { text: sub, options: { fontSize: 11 } }],
      { x: 0.9, y, w: 3.8, h: 1.0, fontFace: F.body, color: C.text, align: "center", valign: "middle", margin: 0.03, isTextBox: true });
  };
  box(2.6, C.purple, C.pink, "chat 컨테이너", "내 파이썬 앱", "chat");
  s.addText("▼  http://ollama:11434", { x: 0.9, y: 3.7, w: 3.8, h: 0.5, fontFace: F.mono, fontSize: 12, bold: true, color: C.pink, align: "center", valign: "middle", margin: 0, isTextBox: true });
  box(4.3, C.greenDark, C.green, "ollama 컨테이너", "언어모델 실행", "ollama");
  s.addText("▼  모델 저장 (볼륨)", { x: 0.9, y: 5.35, w: 3.8, h: 0.4, fontFace: F.mono, fontSize: 11, color: C.dim, align: "center", valign: "middle", margin: 0, isTextBox: true });
}
// 3) compose.yaml: ollama
{
  const s = slide("yaml1", " (compose.yaml 의 ollama 부분만 표시, 생략한 줄은 ... 로 표시)");
  const lines = [{ t: PH + "cat compose.yaml" }, { t: yaml[0] }, { t: yaml[iOllama] }, { t: yaml[iOllama + 1] }, ...yaml.slice(iOllama + 2, iOllama + 5).map((t, i) => ({ t, hl: /~\/models/.test(t) })), { t: "...", dim: true }];
  L.terminal(s, { lines: lines.map((l) => (typeof l.t === "string" ? l : l)), label: "ollama: 모델 보관 + 모델 폴더 연결", tone: "pink", fontSize: 10 });
}
// 4) compose.yaml: chat
{
  const s = slide("yaml2", " (compose.yaml 의 chat 부분만 표시, 생략한 줄은 ... 로 표시)");
  const env = yaml.findIndex((l) => /environment:/.test(l));
  L.terminal(s, { lines: [{ t: PH + "cat compose.yaml" }, { t: yaml[iChat] }, { t: yaml[iChat + 1] }, { t: "    ...", dim: true }, { t: yaml[env] }, { t: yaml[env + 1], hl: true }, { t: yaml[yIdx(/profiles:/)] }], label: "chat: 주소는 환경변수로", tone: "pink", fontSize: 10 });
}
// 5) chat.py
{
  const s = slide("code", " (빈 줄은 생략하고 표시)");
  L.terminal(s, { lines: [{ t: PH + "cat app/chat.py" }, ...chatPy.map((t) => ({ t, hl: /OLLAMA_HOST/.test(t) }))], label: "표준 라이브러리만 사용한 클라이언트", tone: "pink", fontSize: 9.5 });
}
// 6) up
{
  const s = slide("up", " (중간 단계는 생략하고 핵심 줄만 표시)");
  L.terminal(s, { lines: [{ t: upCmd }, ...upKey.map((t, i) => ({ t, hl: i === 2 }))], label: "Ollama 서버 실행", tone: "green", fontSize: 11 });
}
// 7) create
{
  const s = slide("create", " (긴 명령은 \\ 로 줄바꿈해 표시, 스크립트 실행용 -T 옵션은 화면에서 생략, 진행 표시는 생략하고 완료된 줄만 표시)");
  L.terminal(s, { lines: [...createCmd.map((t) => ({ t })), { t: "...", dim: true }, ...createView.map((t, i) => ({ t, hl: i === 3 }))], label: "컨테이너 안에서 모델 등록", tone: "green", fontSize: 10 });
}
// 8) API (curl)
{
  const s = slide("api", " (긴 명령은 \\ 로 줄바꿈해 표시, 응답 JSON 은 키 단위로 줄을 나누고 앞부분만 표시)");
  const parts = json.replace(/,"/g, ',\n"').split("\n"); // 키 단위로 줄 나눔
  const iResp = parts.findIndex((x) => x.startsWith('"response"'));
  const head = parts.slice(0, iResp).map((x) => ({ t: x }));
  const resp = L.wrapLine(L.trunc(parts[iResp], 100), 46).map((t) => ({ t, hl: true }));
  L.terminal(s, { lines: [...curlCmd.map((t) => ({ t })), ...head, ...resp], label: "API: JSON 으로 질문하고 응답받기", tone: "pink", fontSize: 10 });
}
// 9) 내 앱에서 호출
{
  const s = slide("chat", " (긴 명령은 \\ 로 줄바꿈해 표시, 스크립트 실행용 -T 옵션과 컨테이너 생성 로그는 화면에서 생략)");
  L.terminal(s, { lines: [...chatCmd.map((t) => ({ t })), ...L.wrapLine(answer, 50).map((t) => ({ t, hl: true }))], label: "내 앱이 LLM 에게 질문", tone: "green", fontSize: 10 });
}
// 10) 요약
{
  const s = slide("sum");
  const rows = [["http://ollama:11434", "서비스 이름으로 연결"], ["ollama:/root/.ollama", "모델은 볼륨에 보관"], ["/api/generate", "JSON 으로 질문"]];
  rows.forEach(([cmd, desc], i) => {
    const y = 2.7 + i * 1.05;
    s.addShape("roundRect", { x: 0.45, y, w: 4.7, h: 0.85, rectRadius: 0.1, fill: { color: C.term }, line: { color: C.edge, width: 0.75 }, objectName: "요약행" + (i + 1) });
    s.addText(cmd, { x: 0.55, y, w: 2.6, h: 0.85, fontFace: F.mono, fontSize: 10.5, bold: true, color: C.pink, valign: "middle", margin: 0, isTextBox: true });
    s.addText(desc, { x: 3.2, y, w: 1.9, h: 0.85, fontFace: F.body, fontSize: 12.5, color: C.text, valign: "middle", margin: 0, isTextBox: true });
  });
}
// 11) 마무리 (마지막 회차)
{
  const s = slide("end");
  s.addShape("roundRect", { ...R.screen, rectRadius: 0.2, fill: { color: C.purple }, line: { color: C.pink, width: 1.5 }, objectName: "화면영역" });
  s.addText([{ text: "수고하셨습니다", options: { fontFace: F.title, fontSize: 30, breakLine: true } },
    { text: " ", options: { fontSize: 12, breakLine: true } },
    { text: "Docker 기초  →  Compose  →  LLM", options: { fontFace: F.body, fontSize: 15, color: C.pink } }],
    { ...R.screen, color: C.text, align: "center", valign: "middle", isTextBox: true, objectName: "마무리" });
}

fs.writeFileSync(path.join(__dirname, "script.txt"), narration.join("\n") + "\n", "utf8");
pres.writeFile({ fileName: path.join(__dirname, "ep20.pptx") }).then((f) => console.log("saved", f));
