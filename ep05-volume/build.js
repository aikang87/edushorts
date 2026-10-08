// 5회차 PPT 생성: node build.js  (output/ 의 실제 실행 결과와 브라우저 캡처 사용, script.txt 도 함께 생성)
const path = require("path");
const fs = require("fs");
const L = require("../tools/shorts-lib.js");
const { C, F, R } = L;
const out = (n) => path.join(__dirname, "output", n);
const P = "user@PC:~$ ";
const TOPIC = "5회차\n데이터 지키기: 볼륨";
const TOPIC_TITLE = "5회차 · 데이터 지키기: 볼륨";

// caption = 슬라이드 자막(영문 그대로), narr = 나레이션 대본(영문은 한글 발음)
const T = {
  intro: { caption: "이번 시간에는 컨테이너가 지워져도 데이터를 지키는 볼륨을 알아봅니다.", narr: "이번 시간에는 컨테이너가 지워져도 데이터를 지키는 볼륨을 알아봅니다." },
  why: { caption: "컨테이너를 삭제하면 데이터도 사라집니다. 그래서 데이터는 밖에 저장합니다.", narr: "컨테이너를 삭제하면 데이터도 사라집니다. 그래서 데이터는 밖에 저장합니다." },
  create: { caption: "docker volume create로 볼륨을 만들고, docker volume ls로 목록을 확인합니다.", narr: "도커 볼륨 크리에이트로 볼륨을 만들고, 도커 볼륨 엘에스로 목록을 확인합니다." },
  write: { caption: "-v 옵션으로 볼륨을 컨테이너의 data 폴더에 연결하고 파일을 만듭니다. 콜론 앞은 볼륨, 뒤는 컨테이너 경로입니다.", narr: "브이 옵션으로 볼륨을 컨테이너의 데이터 폴더에 연결하고 파일을 만듭니다. 콜론 앞은 볼륨, 뒤는 컨테이너 경로입니다." },
  read: { caption: "새 컨테이너에 같은 볼륨을 연결하면 파일이 그대로 남아 있습니다.", narr: "새 컨테이너에 같은 볼륨을 연결하면 파일이 그대로 남아 있습니다." },
  novol: { caption: "볼륨을 연결하지 않으면 파일은 컨테이너와 함께 사라집니다.", narr: "볼륨을 연결하지 않으면 파일은 컨테이너와 함께 사라집니다." },
  bindIntro: { caption: "내 컴퓨터의 폴더를 직접 연결할 수도 있습니다. 이것을 바인드 마운트라고 합니다.", narr: "내 컴퓨터의 폴더를 직접 연결할 수도 있습니다. 이것을 바인드 마운트라고 합니다." },
  bindRun: { caption: "-v 뒤에 내 폴더 경로를 적으면 컨테이너 안에 연결됩니다.", narr: "브이 뒤에 내 폴더 경로를 적으면 컨테이너 안에 연결됩니다." },
  page1: { caption: "브라우저에서 접속하면 방금 만든 웹페이지가 보입니다.", narr: "브라우저에서 접속하면 방금 만든 웹페이지가 보입니다." },
  edit: { caption: "파일을 수정합니다.", narr: "파일을 수정합니다." },
  page2: { caption: "컨테이너를 다시 만들지 않아도 화면에 바로 반영됩니다.", narr: "컨테이너를 다시 만들지 않아도 화면에 바로 반영됩니다." },
  sum: { caption: "오래 보관할 데이터는 볼륨,\n내 폴더를 연결할 때는 바인드 마운트입니다.", narr: "오래 보관할 데이터는 볼륨, 내 폴더를 연결할 때는 바인드 마운트입니다." },
  next: { caption: "다음 시간에는 나만의 이미지를 만드는 Dockerfile을 알아봅니다.", narr: "다음 시간에는 나만의 이미지를 만드는 도커파일을 알아봅니다." },
};

const pres = L.newDeck("Docker 5회차 데이터 지키기 볼륨");
const narration = [];
function slide(key, notesExtra = "") {
  narration.push(T[key].narr);
  return L.baseSlide(pres, { title: key === "intro" ? L.SERIES_TITLE : TOPIC_TITLE, caption: T[key].caption, notes: T[key].caption.replace(/\n/g, " ") + notesExtra });
}
const box = (s, x, y, w, h, fill, line, head, sub, name, hs = 16) => {
  s.addShape("roundRect", { x, y, w, h, rectRadius: 0.1, fill: { color: fill }, line: { color: line, width: 1.5 }, objectName: name });
  s.addText(sub ? [{ text: head, options: { fontSize: hs, bold: true, breakLine: true } }, { text: sub, options: { fontSize: 11 } }] : [{ text: head, options: { fontSize: hs, bold: true } }],
    { x, y, w, h, fontFace: F.body, color: C.text, align: "center", valign: "middle", margin: 0.03, isTextBox: true });
};
const label = (s, x, y, w, h, text, color = C.pink, size = 12) => s.addText(text, { x, y, w, h, fontFace: F.mono, fontSize: size, bold: true, color, align: "center", valign: "middle", margin: 0, isTextBox: true });

// ---- 실제 출력 ----
const rd = (n) => L.readOut(out(n + ".txt"));
const create = rd("01_vol_create"), ls = rd("02_vol_ls");
const read = rd("04_read"), novol = rd("05_read_novol");
const bind = rd("08_run_bind");
// 실제 실행한 한 줄 명령이 아래 표시용(\ 로 나눈 줄)과 같은지 확인
const join = (ls_) => ls_.map((l) => l.replace(/ \\$/, "").trim()).join(" ").replace(P.trim(), "").trim();
const TERM = { tone: "green", fontSize: 11 };

// 1) 타이틀
{
  const s = slide("intro");
  s.addShape("roundRect", { ...R.screen, rectRadius: 0.2, fill: { color: C.purple }, line: { color: C.pink, width: 1.5 }, objectName: "화면영역" });
  s.addText(TOPIC, { ...R.screen, fontFace: F.title, fontSize: 32, color: C.text, align: "center", valign: "middle", isTextBox: true, objectName: "회차주제" });
}

// 2) 볼륨 없이 vs 볼륨 연결
{
  const s = slide("why");
  const RED = "FF5555";
  label(s, 0.3, 2.5, 2.3, 0.4, "볼륨 없이", C.text, 14);
  box(s, 0.3, 3.0, 2.3, 1.1, C.greenDark, C.green, "컨테이너", "안에 데이터 저장", "컨테이너A");
  label(s, 0.3, 4.15, 2.3, 0.45, "▼ 삭제");
  box(s, 0.3, 4.7, 2.3, 0.9, C.term, RED, "데이터도 사라짐", "", "결과A", 14);
  label(s, 3.0, 2.5, 2.3, 0.4, "볼륨 연결", C.text, 14);
  box(s, 3.0, 3.0, 2.3, 0.5, C.greenDark, C.green, "컨테이너", "", "컨테이너B", 14);
  box(s, 3.0, 3.6, 2.3, 0.5, C.purple, C.pink, "볼륨 (데이터)", "", "볼륨", 14);
  label(s, 3.0, 4.15, 2.3, 0.45, "▼ 컨테이너 삭제");
  box(s, 3.0, 4.7, 2.3, 0.9, C.purple, C.green, "볼륨은 그대로", "데이터 유지", "결과B", 14);
}

// 3) volume create / ls
{
  const s = slide("create");
  L.terminal(s, { lines: [{ t: create[0], hl: true }, { t: create[1] }, { t: ls[0] }, { t: ls[1], dim: true }, { t: ls[2], hl: true }], label: "볼륨 만들기: docker volume create", tone: "pink", fontSize: 11 });
}

// 4) 볼륨 연결해서 파일 쓰기 (실제 한 줄 명령을 \ 로 나눠 표시)
{
  const s = slide("write", " (긴 명령은 \\ 로 줄바꿈해 표시)");
  const lines = [P + "docker run --rm \\", "  -v mydata:/data nginx:alpine \\", "  sh -c 'echo hello > /data/hello.txt'"];
  if (join(lines) !== rd("03_write")[0].replace(P.trim(), "").trim()) throw new Error("03_write 명령 불일치");
  L.terminal(s, { lines: [{ t: lines[0] }, { t: lines[1], hlCols: [2, 17] }, { t: lines[2] }], label: "볼륨 연결: -v 볼륨이름:경로", tone: "pink", fontSize: 11 });
}

// 5) 새 컨테이너에서 읽기 -> 데이터 유지
{
  const s = slide("read", " (긴 명령은 \\ 로 줄바꿈해 표시)");
  const lines = [P + "docker run --rm \\", "  -v mydata:/data nginx:alpine \\", "  cat /data/hello.txt"];
  if (join(lines) !== read[0].replace(P.trim(), "").trim()) throw new Error("04_read 명령 불일치");
  L.terminal(s, { lines: [{ t: lines[0] }, { t: lines[1], hlCols: [2, 17] }, { t: lines[2] }, { t: read[1], hl: true }], label: "새 컨테이너에서도 파일이 남아 있음", ...TERM });
}

// 6) 볼륨 없이 -> 파일 없음
{
  const s = slide("novol", " (긴 명령은 \\ 로 줄바꿈해 표시, 긴 오류 메시지는 줄바꿈해 표시)");
  const lines = [P + "docker run --rm nginx:alpine \\", "  cat /data/hello.txt"];
  if (join(lines) !== novol[0].replace(P.trim(), "").trim()) throw new Error("05_read_novol 명령 불일치");
  const err = L.wrapLine(novol[1], 44);
  L.terminal(s, { lines: [{ t: lines[0] }, { t: lines[1] }, ...err.map((t) => ({ t, hl: true }))], label: "볼륨 없이는 파일이 없음", tone: "pink", fontSize: 11 });
}

// 7) 바인드 마운트 준비: 폴더 + 파일
{
  const s = slide("bindIntro", " (긴 명령은 \\ 로 줄바꿈해 표시)");
  const echo = rd("07_echo")[0];
  const lines = [P + "mkdir ~/site", P + 'echo "<h1>Hi Docker</h1>" \\', "  > ~/site/index.html"];
  if (join(lines.slice(1)) !== echo.replace(P.trim(), "").trim()) throw new Error("07_echo 명령 불일치");
  L.terminal(s, { lines: lines.map((t) => ({ t })), label: "내 컴퓨터에 웹페이지 만들기", tone: "pink", fontSize: 11 });
}

// 8) 바인드 마운트 실행
{
  const s = slide("bindRun", " (긴 명령은 \\ 로 줄바꿈해 표시, 컨테이너 ID는 앞부분만 표시)");
  const lines = [P + "docker run -d --name web \\", "  -p 8080:80 \\", "  -v ~/site:/usr/share/nginx/html \\", "  nginx:alpine"];
  if (join(lines) !== bind[0].replace(P.trim(), "").trim()) throw new Error("08_run_bind 명령 불일치");
  L.terminal(s, { lines: [...lines.map((t, i) => ({ t, hlCols: i === 2 ? [2, 33] : undefined })), { t: L.trunc(bind[1], 40) }], label: "폴더 연결: -v 내폴더:컨테이너경로", tone: "pink", fontSize: 11 });
}

// 9) 브라우저: 처음 페이지
{
  const s = slide("page1");
  L.browserFrame(s, { path: out("browser1.png"), url: "localhost:8080", aspect: 900 / 360, altText: "localhost:8080 - Hi Docker 페이지" });
}

// 10) 파일 수정
{
  const s = slide("edit", " (긴 명령은 \\ 로 줄바꿈해 표시)");
  const echo = rd("09_edit")[0];
  const lines = [P + 'echo "<h1>Hello Volume</h1>" \\', "  > ~/site/index.html"];
  if (join(lines) !== echo.replace(P.trim(), "").trim()) throw new Error("09_edit 명령 불일치");
  L.terminal(s, { lines: lines.map((t, i) => ({ t, hl: i === 0 })), label: "파일 내용 바꾸기", tone: "pink", fontSize: 12 });
}

// 11) 브라우저: 바뀐 페이지
{
  const s = slide("page2");
  L.browserFrame(s, { path: out("browser2.png"), url: "localhost:8080", aspect: 900 / 360, altText: "localhost:8080 - Hello Volume 페이지" });
}

// 12) 요약
{
  const s = slide("sum");
  const rows = [["-v 볼륨:경로", "볼륨 (데이터 보관)"], ["-v 내폴더:경로", "바인드 마운트"], ["docker volume ls", "볼륨 목록 보기"]];
  rows.forEach(([cmd, desc], i) => {
    const y = 2.7 + i * 1.05;
    s.addShape("roundRect", { x: 0.45, y, w: 4.7, h: 0.85, rectRadius: 0.1, fill: { color: C.term }, line: { color: C.edge, width: 0.75 }, objectName: "요약행" + (i + 1) });
    s.addText(cmd, { x: 0.6, y, w: 2.5, h: 0.85, fontFace: F.mono, fontSize: 13, bold: true, color: C.pink, valign: "middle", margin: 0, isTextBox: true });
    s.addText(desc, { x: 3.0, y, w: 2.1, h: 0.85, fontFace: F.body, fontSize: 14, color: C.text, valign: "middle", margin: 0, isTextBox: true });
  });
}

// 13) 다음 회차 예고
{
  const s = slide("next");
  s.addShape("roundRect", { ...R.screen, rectRadius: 0.2, fill: { color: C.purple }, line: { color: C.pink, width: 1.5 }, objectName: "화면영역" });
  s.addText([{ text: "NEXT", options: { fontFace: F.mono, fontSize: 16, bold: true, color: C.pink, breakLine: true } },
    { text: "6회차", options: { fontSize: 20, breakLine: true } },
    { text: "내 첫 Dockerfile", options: { fontSize: 30 } }],
    { ...R.screen, fontFace: F.title, color: C.text, align: "center", valign: "middle", isTextBox: true, objectName: "다음회차" });
}

fs.writeFileSync(path.join(__dirname, "script.txt"), narration.join("\n") + "\n", "utf8");
pres.writeFile({ fileName: path.join(__dirname, "ep05.pptx") }).then((f) => console.log("saved", f));
