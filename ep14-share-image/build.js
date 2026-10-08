// 14회차 PPT 생성: node build.js  (output/ 의 실제 실행 결과 사용, script.txt 도 함께 생성)
const path = require("path");
const fs = require("fs");
const L = require("../tools/shorts-lib.js");
const { C, F, R } = L;
const out = (n) => path.join(__dirname, "output", n);
const P = "user@PC:~$ ";
const TOPIC = "14회차\n내 이미지 공유하기";
const TOPIC_TITLE = "14회차 · 내 이미지 공유하기";

// caption = 슬라이드 자막(영문 그대로), narr = 나레이션 대본(영문은 한글 발음)
const T = {
  intro: { caption: "이번 시간에는 내가 만든 이미지를 레지스트리에 올려서 공유하는 방법을 알아봅니다.", narr: "이번 시간에는 내가 만든 이미지를 레지스트리에 올려서 공유하는 방법을 알아봅니다." },
  what: { caption: "레지스트리는 이미지를 보관하는 저장소입니다. Docker Hub가 가장 유명합니다. 올리면 다른 컴퓨터에서 내려받아 쓸 수 있습니다.", narr: "레지스트리는 이미지를 보관하는 저장소입니다. 도커 허브가 가장 유명합니다. 올리면 다른 컴퓨터에서 내려받아 쓸 수 있습니다." },
  registry: { caption: "연습을 위해 내 컴퓨터에서 작은 레지스트리를 실행합니다. Docker Hub와 같은 역할입니다.", narr: "연습을 위해 내 컴퓨터에서 작은 레지스트리를 실행합니다. 도커 허브와 같은 역할입니다." },
  tag: { caption: "docker tag로 이미지에 레지스트리 주소와 버전 이름을 붙입니다. 이미지 ID는 같습니다.", narr: "도커 태그로 이미지에 레지스트리 주소와 버전 이름을 붙입니다. 이미지 아이디는 같습니다." },
  push: { caption: "docker push로 올립니다. 레이어가 하나씩 올라가고, 마지막에 digest가 표시됩니다.", narr: "도커 푸시로 올립니다. 레이어가 하나씩 올라가고, 마지막에 다이제스트가 표시됩니다." },
  rmi: { caption: "내 컴퓨터의 이미지를 지워 보겠습니다.", narr: "내 컴퓨터의 이미지를 지워 보겠습니다." },
  pull: { caption: "다시 실행하면, 이미지를 레지스트리에서 내려받아 실행합니다.", narr: "다시 실행하면, 이미지를 레지스트리에서 내려받아 실행합니다." },
  hub: { caption: "Docker Hub에 올릴 때는 docker login을 하고, 이미지 이름 앞에 내 ID를 붙이면 됩니다.", narr: "도커 허브에 올릴 때는 도커 로그인을 하고, 이미지 이름 앞에 내 아이디를 붙이면 됩니다." },
  sum: { caption: "tag로 이름을 붙이고, push로 올리고, pull로 내려받습니다.", narr: "태그로 이름을 붙이고, 푸시로 올리고, 풀로 내려받습니다." },
  next: { caption: "다음 시간에는 이미지 크기를 줄이는 멀티스테이지 빌드를 알아봅니다.", narr: "다음 시간에는 이미지 크기를 줄이는 멀티스테이지 빌드를 알아봅니다." },
};

const pres = L.newDeck("Docker 14회차 내 이미지 공유하기");
const narration = [];
function slide(key, notesExtra = "") {
  narration.push(T[key].narr);
  return L.baseSlide(pres, { title: key === "intro" ? L.SERIES_TITLE : TOPIC_TITLE, caption: T[key].caption, notes: T[key].caption + notesExtra });
}
const join = (ls_) => ls_.map((l) => l.replace(/ \\$/, "").trim()).join(" ").replace(P.trim(), "").trim();
const same = (lines, file, name) => { if (join(lines) !== file[0].replace(P.trim(), "").trim()) throw new Error("명령 불일치: " + name); };

// ---- 실제 실행 결과 ----
const rd = (n) => L.readOut(out(n + ".txt"));
const reg = rd("01_registry"), tag = rd("02_tag"), imgs = rd("03_images"), push = rd("04_push"), rmi = rd("05_rmi"), run = rd("06_run");
const regCmd = [P + "docker run -d -p 5000:5000 \\", "  --name registry registry:2"];
same(regCmd, reg, "01_registry");
const imgRows = L.pickColumns(imgs.slice(1), ["IMAGE", "ID"]);
const helloRows = [imgRows[0], ...imgRows.slice(1).filter((l) => l.includes("hello"))];
const ids = helloRows.slice(1).map((l) => l.trim().split(/\s+/).at(-1));
const pushed = push.filter((l) => /: Pushed$/.test(l));
if (helloRows.length !== 3 || ids[0] !== ids[1] || pushed.length < 3 || !push.at(-1).includes("digest: sha256:") || run.at(-1) !== "Hello Dockerfile" || !run.some((l) => l.includes("Pulling from hello")) || !rmi[1].startsWith("Untagged")) throw new Error("실행 결과가 예상과 다름");

// 1) 타이틀
{
  const s = slide("intro");
  s.addShape("roundRect", { ...R.screen, rectRadius: 0.2, fill: { color: C.purple }, line: { color: C.pink, width: 1.5 }, objectName: "화면영역" });
  s.addText(TOPIC, { ...R.screen, fontFace: F.title, fontSize: 30, color: C.text, align: "center", valign: "middle", isTextBox: true, objectName: "회차주제" });
}
// 2) 내 PC -> 레지스트리 -> 다른 PC
{
  const s = slide("what");
  const card = (x, y, w, h, fill, line, head, sub, name) => {
    s.addShape("roundRect", { x, y, w, h, rectRadius: 0.12, fill: { color: fill }, line: { color: line, width: 1.5 }, objectName: name });
    s.addText([{ text: head, options: { fontSize: 16, bold: true, breakLine: !!sub } }, ...(sub ? [{ text: sub, options: { fontSize: 11 } }] : [])],
      { x, y, w, h, fontFace: F.body, color: C.text, align: "center", valign: "middle", margin: 0.03, isTextBox: true });
  };
  card(0.35, 2.7, 1.5, 1.2, C.purple, C.pink, "내 PC", "이미지 보유", "내PC");
  card(1.95, 2.7, 1.7, 1.2, C.term, C.pink, "레지스트리", "Docker Hub", "레지스트리");
  card(3.75, 2.7, 1.5, 1.2, C.greenDark, C.green, "다른 PC", "", "다른PC");
  const lab = (x, text) => s.addText(text, { x, y: 4.05, w: 1.6, h: 0.45, fontFace: F.mono, fontSize: 13, bold: true, color: C.pink, align: "center", valign: "middle", margin: 0, isTextBox: true });
  lab(0.3, "push →"); lab(3.4, "← pull");
  s.addText("한 번 올리면, 어디서든 내려받아 실행", { x: 0.35, y: 4.8, w: 4.9, h: 0.5, fontFace: F.body, fontSize: 13, color: C.dim, align: "center", valign: "middle", margin: 0, isTextBox: true });
}
// 3) 로컬 레지스트리 실행
{
  const s = slide("registry", " (긴 명령은 \\ 로 줄바꿈해 표시, 컨테이너 ID는 앞부분만 표시)");
  L.terminal(s, { lines: [...regCmd.map((t) => ({ t })), { t: L.trunc(reg[1], 30) }], label: "연습용 레지스트리 실행", tone: "pink", fontSize: 11 });
}
// 4) tag + 이미지 목록
{
  const s = slide("tag", " (hello 관련 행과 일부 열만 표시)");
  L.terminal(s, {
    lines: [{ t: P + "docker tag hello localhost:5000/hello:1.0" }, { t: P + "docker images" }, { t: helloRows[0], dim: true }, ...helloRows.slice(1).map((t) => ({ t, hl: true }))],
    label: "같은 이미지에 이름이 하나 더", tone: "pink", fontSize: 10,
  });
}
// 5) push
{
  const s = slide("push", " (일부 레이어 줄 생략, digest 는 앞부분만 표시)");
  L.terminal(s, {
    lines: [{ t: P + "docker push localhost:5000/hello:1.0" }, { t: push[1] }, ...pushed.slice(0, 3).map((t, i) => ({ t, hl: i === 0 })), { t: L.trunc(push.at(-1), 52), hl: true }],
    label: "레지스트리에 올리기", tone: "green", fontSize: 10,
  });
}
// 6) 로컬 이미지 삭제
{
  const s = slide("rmi", " (이미지 ID는 앞부분만 표시)");
  L.terminal(s, { lines: [{ t: P + "docker rmi hello localhost:5000/hello:1.0" }, { t: rmi[1] }, { t: rmi[2] }, { t: L.trunc(rmi[3], 36) }], label: "내 컴퓨터에서 삭제", tone: "pink", fontSize: 10 });
}
// 7) 레지스트리에서 내려받아 실행
{
  const s = slide("pull", " (긴 진행 로그 중 일부만 표시)");
  const unable = run.find((l) => l.startsWith("Unable to find image")), pulling = run.find((l) => l.includes("Pulling from hello")), status = run.find((l) => l.startsWith("Status:"));
  L.terminal(s, {
    lines: [{ t: P + "docker run --rm localhost:5000/hello:1.0" }, { t: unable }, { t: pulling, hl: true }, { t: "...", dim: true }, { t: L.trunc(status, 52) }, { t: run.at(-1), hl: true }],
    label: "레지스트리에서 내려받아 실행", tone: "green", fontSize: 10,
  });
}
// 8) Docker Hub 에서는 (실행하지 않은 안내)
{
  const s = slide("hub", " (Docker Hub 계정이 필요해 영상 제작 환경에서는 실행하지 않은 안내 화면)");
  s.addShape("roundRect", { x: 0.35, y: 2.6, w: 4.9, h: 2.9, rectRadius: 0.12, fill: { color: C.term }, line: { color: C.edge, width: 1 }, objectName: "허브카드" });
  s.addText("Docker Hub 에 올릴 때", { x: 0.35, y: 2.7, w: 4.9, h: 0.5, fontFace: F.body, fontSize: 16, bold: true, color: C.text, align: "center", valign: "middle", margin: 0, isTextBox: true });
  const cmds = ["docker login", "docker tag hello 내아이디/hello:1.0", "docker push 내아이디/hello:1.0"];
  cmds.forEach((c, i) => s.addText(c, { x: 0.6, y: 3.3 + i * 0.5, w: 4.4, h: 0.45, fontFace: F.mono, fontSize: 12, color: i === 0 ? C.pink : C.text, valign: "middle", margin: 0, isTextBox: true }));
  s.addText("주소(localhost:5000) 대신 내 아이디를 붙입니다", { x: 0.35, y: 4.95, w: 4.9, h: 0.45, fontFace: F.body, fontSize: 12, color: C.dim, align: "center", valign: "middle", margin: 0, isTextBox: true });
}
// 9) 요약
{
  const s = slide("sum");
  const rows = [["docker tag", "이름 붙이기"], ["docker push", "올리기"], ["docker pull", "내려받기"]];
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
    { text: "15회차", options: { fontSize: 20, breakLine: true } },
    { text: "이미지 다이어트", options: { fontSize: 28 } }],
    { ...R.screen, fontFace: F.title, color: C.text, align: "center", valign: "middle", isTextBox: true, objectName: "다음회차" });
}

fs.writeFileSync(path.join(__dirname, "script.txt"), narration.join("\n") + "\n", "utf8");
pres.writeFile({ fileName: path.join(__dirname, "ep14.pptx") }).then((f) => console.log("saved", f));
