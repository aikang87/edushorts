// 2회차 PPT 생성: node build.js  (output/*.txt 의 실제 실행 결과를 사용)
const path = require("path");
const L = require("../tools/shorts-lib.js");
const { C, F, R } = L;
const out = (n) => path.join(__dirname, "output", n + ".txt");
const P = "user@PC:~$ ";
const TOPIC = "2회차\n이미지와 컨테이너";
const TOPIC_TITLE = "2회차 · 이미지와 컨테이너";

const pres = L.newDeck("Docker 2회차 이미지와 컨테이너");

// ---- 실제 출력에서 화면용 줄 만들기 ----
const pull = L.readOut(out("01_pull"));
const pullView = [pull[0], pull[1], "...", L.trunc(pull.find((l) => l.startsWith("Digest")), 40), pull.filter((l) => l.startsWith("Status")).pop()];
const images = L.pickColumns(L.readOut(out("02_images")).slice(1), ["IMAGE", "ID", "DISK USAGE"]);
const run1 = L.readOut(out("03_run"));
const ps1 = L.pickColumns(L.readOut(out("04_ps")).slice(1), ["CONTAINER ID", "IMAGE", "STATUS", "NAMES"]);
const run2 = L.readOut(out("05_run2"));
const ps2 = L.pickColumns(L.readOut(out("06_ps2")).slice(1), ["CONTAINER ID", "IMAGE", "STATUS", "NAMES"]);

// 1) 타이틀 고정 + 화면영역에 회차 주제
{
  const s = L.baseSlide(pres, {
    title: L.SERIES_TITLE,
    caption: "이번 시간에는 Docker의 핵심, 이미지와 컨테이너를 알아봅니다.",
    notes: "[0:00-0:06] 이번 시간에는 Docker의 핵심, 이미지와 컨테이너를 알아봅니다.",
  });
  s.addShape("roundRect", { ...R.screen, rectRadius: 0.2, fill: { color: C.purple }, line: { color: C.pink, width: 1.5 }, objectName: "화면영역" });
  s.addText(TOPIC, { ...R.screen, fontFace: F.title, fontSize: 34, color: C.text, align: "center", valign: "middle", isTextBox: true, objectName: "회차주제" });
}

// 2) 개념: 이미지 → 컨테이너
{
  const s = L.baseSlide(pres, {
    title: TOPIC_TITLE,
    caption: "이미지는 실행에 필요한 모든 것을 담은 설계도, 컨테이너는 그 이미지를 실행한 것입니다.",
    notes: "[0:06-0:14] 이미지는 실행에 필요한 모든 것을 담은 설계도, 컨테이너는 그 이미지를 실행한 것입니다.",
  });
  const card = (y, fill, line, head, sub, name) => {
    s.addShape("roundRect", { x: 0.9, y, w: 3.8, h: 1.2, rectRadius: 0.15, fill: { color: fill }, line: { color: line, width: 1.5 }, objectName: name });
    s.addText([{ text: head, options: { fontSize: 20, bold: true, breakLine: true } }, { text: sub, options: { fontSize: 13 } }],
      { x: 0.9, y, w: 3.8, h: 1.2, fontFace: F.body, color: C.text, align: "center", valign: "middle", margin: 0.05, isTextBox: true });
  };
  card(2.6, C.purple, C.pink, "이미지 (Image)", "설계도 · 읽기 전용", "이미지카드");
  s.addText("▼  docker run", { x: 0.9, y: 3.95, w: 3.8, h: 0.5, fontFace: F.mono, fontSize: 14, bold: true, color: C.pink, align: "center", valign: "middle", margin: 0, isTextBox: true });
  card(4.65, C.greenDark, C.green, "컨테이너 (Container)", "실행 중인 앱", "컨테이너카드");
}

// 3) pull 명령
{
  const s = L.baseSlide(pres, {
    title: TOPIC_TITLE,
    caption: "docker pull 명령으로 Docker Hub에서 nginx 이미지를 내려받습니다.",
    notes: "[0:14-0:20] docker pull 명령으로 Docker Hub에서 nginx 이미지를 내려받습니다.",
  });
  L.terminal(s, { lines: [{ t: pull[0], hl: true }], label: "이미지 내려받기: docker pull", fontSize: 14 });
}

// 4) pull 결과
{
  const s = L.baseSlide(pres, {
    title: TOPIC_TITLE,
    caption: "마지막에 Downloaded 메시지가 나오면 내려받기가 끝난 것입니다.",
    notes: "[0:20-0:26] 마지막에 Downloaded 메시지가 나오면 내려받기가 끝난 것입니다. (화면은 긴 진행 출력의 일부만 표시)",
  });
  L.terminal(s, {
    lines: pullView.map((t, i) => ({ t, dim: t === "...", hl: i === pullView.length - 1 })),
    label: "pull 실행 결과", tone: "green", fontSize: 11,
  });
}

// 5) images
{
  const s = L.baseSlide(pres, {
    title: TOPIC_TITLE,
    caption: "docker images로 내려받은 이미지를 확인합니다.",
    notes: "[0:26-0:32] docker images로 내려받은 이미지를 확인합니다.",
  });
  L.terminal(s, {
    lines: [{ t: P + "docker images", hl: false }, ...images.map((t, i) => ({ t, dim: i === 0, hl: i === 1 }))],
    label: "이미지 목록: docker images", tone: "green", fontSize: 13,
  });
}

// 6) run
{
  const s = L.baseSlide(pres, {
    title: TOPIC_TITLE,
    caption: "docker run으로 이미지를 컨테이너로 실행합니다. -d는 백그라운드, --name은 이름입니다.",
    notes: "[0:32-0:40] docker run으로 이미지를 컨테이너로 실행합니다. -d는 백그라운드 실행, --name은 컨테이너 이름입니다. (컨테이너 ID는 앞부분만 표시)",
  });
  L.terminal(s, { lines: [{ t: run1[0], hl: true }, { t: L.trunc(run1[1], 40) }], label: "컨테이너 실행: docker run", fontSize: 11 });
}

// 7) ps
{
  const s = L.baseSlide(pres, {
    title: TOPIC_TITLE,
    caption: "docker ps로 실행 중인 컨테이너를 확인합니다. Up이면 실행 중입니다.",
    notes: "[0:40-0:46] docker ps로 실행 중인 컨테이너를 확인합니다. Up이면 실행 중입니다. (일부 열 생략)",
  });
  L.terminal(s, {
    lines: [{ t: P + "docker ps" }, ...ps1.map((t, i) => ({ t, dim: i === 0, hl: i === 1 }))],
    label: "실행 중인 컨테이너: docker ps", tone: "green", fontSize: 11,
  });
}

// 8) 같은 이미지, 컨테이너 2개
{
  const s = L.baseSlide(pres, {
    title: TOPIC_TITLE,
    caption: "같은 이미지로 컨테이너를 여러 개 실행할 수도 있습니다.",
    notes: "[0:46-0:52] 같은 이미지로 컨테이너를 여러 개 실행할 수도 있습니다. (일부 열 생략)",
  });
  L.terminal(s, {
    lines: [{ t: run2[0], hl: true }, { t: L.trunc(run2[1], 40) }, { t: P + "docker ps" },
      ...ps2.map((t, i) => ({ t, dim: i === 0, hl: i > 0 }))],
    label: "이미지 하나, 컨테이너 둘", tone: "green", fontSize: 11,
  });
}

// 9) 요약
{
  const s = L.baseSlide(pres, {
    title: TOPIC_TITLE,
    caption: "pull로 받고, images로 확인하고, run으로 실행하고, ps로 확인합니다.",
    notes: "[0:52-0:57] 정리합니다. pull로 받고, images로 확인하고, run으로 실행하고, ps로 확인합니다.",
  });
  const rows = [["docker pull", "이미지 내려받기"], ["docker images", "이미지 목록 보기"], ["docker run", "컨테이너 실행"], ["docker ps", "실행 중인 컨테이너 보기"]];
  rows.forEach(([cmd, desc], i) => {
    const y = 2.6 + i * 0.95;
    s.addShape("roundRect", { x: 0.45, y, w: 4.7, h: 0.8, rectRadius: 0.1, fill: { color: C.term }, line: { color: C.edge, width: 0.75 }, objectName: "요약행" + (i + 1) });
    s.addText(cmd, { x: 0.6, y, w: 2.1, h: 0.8, fontFace: F.mono, fontSize: 13, bold: true, color: C.pink, valign: "middle", margin: 0, isTextBox: true });
    s.addText(desc, { x: 2.65, y, w: 2.4, h: 0.8, fontFace: F.body, fontSize: 14, color: C.text, valign: "middle", margin: 0, isTextBox: true });
  });
}

// 10) 다음 회차 예고
{
  const s = L.baseSlide(pres, {
    title: TOPIC_TITLE,
    caption: "다음 시간에는 컨테이너를 켜고 끄는 방법을 알아봅니다.",
    notes: "[0:57-1:00] 다음 시간에는 컨테이너를 켜고 끄는 방법을 알아봅니다.",
  });
  s.addShape("roundRect", { ...R.screen, rectRadius: 0.2, fill: { color: C.purple }, line: { color: C.pink, width: 1.5 }, objectName: "화면영역" });
  s.addText([{ text: "NEXT", options: { fontFace: F.mono, fontSize: 16, bold: true, color: C.pink, breakLine: true } },
    { text: "3회차", options: { fontSize: 20, breakLine: true } },
    { text: "컨테이너 켜고 끄기", options: { fontSize: 30 } }],
    { ...R.screen, fontFace: F.title, color: C.text, align: "center", valign: "middle", isTextBox: true, objectName: "다음회차" });
}

pres.writeFile({ fileName: path.join(__dirname, "ep02.pptx") }).then((f) => console.log("saved", f));
