// 9회차 PPT 생성: node build.js  (output/ 의 실제 실행 결과와 브라우저 캡처 사용, script.txt 도 함께 생성)
const path = require("path");
const fs = require("fs");
const L = require("../tools/shorts-lib.js");
const { C, F, R } = L;
const out = (n) => path.join(__dirname, "output", n);
const PH = "user@PC:~/myweb$ "; // ~/myweb 폴더 안에서의 프롬프트
const TOPIC = "9회차\nDocker Compose 입문";
const TOPIC_TITLE = "9회차 · Docker Compose 입문";

// caption = 슬라이드 자막(영문 그대로), narr = 나레이션 대본(영문은 한글 발음)
const T = {
  intro: { caption: "이번 시간에는 여러 설정을 파일 하나로 관리하는 Docker Compose를 알아봅니다.", narr: "이번 시간에는 여러 설정을 파일 하나로 관리하는 도커 컴포즈를 알아봅니다." },
  why: { caption: "컨테이너 옵션이 많아지면 명령이 길어지고 실수하기 쉽습니다. Compose는 이 설정을 파일에 적어 둡니다.", narr: "컨테이너 옵션이 많아지면 명령이 길어지고 실수하기 쉽습니다. 컴포즈는 이 설정을 파일에 적어 둡니다." },
  create: { caption: "compose.yaml 파일을 만듭니다. YAML은 들여쓰기로 구조를 나타내는 설정 파일 형식입니다.", narr: "컴포즈 야믈 파일을 만듭니다. 야믈은 들여쓰기로 구조를 나타내는 설정 파일 형식입니다." },
  services: { caption: "services 아래에 서비스 이름을 적습니다. 여기서는 web입니다.", narr: "서비시스 아래에 서비스 이름을 적습니다. 여기서는 웹입니다." },
  imagePorts: { caption: "image는 사용할 이미지, ports는 연결할 포트입니다. docker run의 옵션과 같습니다.", narr: "이미지는 사용할 이미지, 포츠는 연결할 포트입니다. 도커 런의 옵션과 같습니다." },
  up: { caption: "docker compose up -d로 실행하면, 네트워크와 컨테이너가 한 번에 만들어집니다.", narr: "도커 컴포즈 업 대시 디로 실행하면, 네트워크와 컨테이너가 한 번에 만들어집니다." },
  ps: { caption: "docker compose ps로 실행 중인 서비스를 확인합니다.", narr: "도커 컴포즈 피에스로 실행 중인 서비스를 확인합니다." },
  browser: { caption: "브라우저로 접속하면 웹서버가 응답합니다. docker run으로 실행한 것과 똑같은 결과입니다.", narr: "브라우저로 접속하면 웹서버가 응답합니다. 도커 런으로 실행한 것과 똑같은 결과입니다." },
  down: { caption: "docker compose down으로 한 번에 정리합니다. 컨테이너와 네트워크가 함께 삭제됩니다.", narr: "도커 컴포즈 다운으로 한 번에 정리합니다. 컨테이너와 네트워크가 함께 삭제됩니다." },
  sum: { caption: "up으로 켜고, ps로 확인하고, down으로 끕니다.", narr: "업으로 켜고, 피에스로 확인하고, 다운으로 끕니다." },
  next: { caption: "다음 시간에는 Compose로 웹서버와 데이터베이스를 함께 실행합니다.", narr: "다음 시간에는 컴포즈로 웹서버와 데이터베이스를 함께 실행합니다." },
};

const pres = L.newDeck("Docker 9회차 Compose 입문");
const narration = [];
function slide(key, notesExtra = "") {
  narration.push(T[key].narr);
  return L.baseSlide(pres, { title: key === "intro" ? L.SERIES_TITLE : TOPIC_TITLE, caption: T[key].caption, notes: T[key].caption + notesExtra });
}

// ---- 실제 실행 결과 ----
const rd = (n) => L.readOut(out(n + ".txt"));
const yaml = L.readOut(out("compose.yaml")); // 실제로 실행한 compose.yaml
const up = rd("01_up"), down = rd("03_down");
const ps = L.pickColumns(rd("02_ps").slice(1), ["NAME", "STATUS", "PORTS"]);
const idx = (re) => { const i = yaml.findIndex((l) => re.test(l)); if (i < 0) throw new Error("compose.yaml 에서 못 찾음: " + re); return i; };
const iServices = idx(/^services:/), iWeb = idx(/^\s+web:/), iImage = idx(/image:/), iPorts = idx(/ports:/), iPortVal = idx(/8080:80/);
if (!up.some((l) => /Container .* Started/.test(l)) || !down.some((l) => /Network .* Removed/.test(l))) throw new Error("실행 결과가 예상과 다름");
const catView = (hl) => [{ t: PH + "cat compose.yaml" }, ...yaml.map((t, i) => ({ t, hl: hl.includes(i) }))];

// 1) 타이틀
{
  const s = slide("intro");
  s.addShape("roundRect", { ...R.screen, rectRadius: 0.2, fill: { color: C.purple }, line: { color: C.pink, width: 1.5 }, objectName: "화면영역" });
  s.addText(TOPIC, { ...R.screen, fontFace: F.title, fontSize: 30, color: C.text, align: "center", valign: "middle", isTextBox: true, objectName: "회차주제" });
}

// 2) 긴 명령 -> 파일
{
  const s = slide("why");
  s.addShape("roundRect", { x: 0.45, y: 2.6, w: 4.7, h: 1.4, rectRadius: 0.12, fill: { color: C.term }, line: { color: "FF5555", width: 1.5 }, objectName: "긴명령" });
  s.addText([{ text: "매번 길게 입력", options: { fontFace: F.body, fontSize: 13, bold: true, color: C.text, breakLine: true } },
    { text: "docker run -d --name web \\", options: { fontFace: F.mono, fontSize: 11, color: C.text, breakLine: true } },
    { text: "  -p 8080:80 nginx:alpine", options: { fontFace: F.mono, fontSize: 11, color: C.text } }],
    { x: 0.45, y: 2.6, w: 4.7, h: 1.4, align: "center", valign: "middle", margin: 0.05, isTextBox: true });
  s.addText("▼", { x: 0.45, y: 4.1, w: 4.7, h: 0.5, fontFace: F.mono, fontSize: 18, bold: true, color: C.pink, align: "center", valign: "middle", margin: 0, isTextBox: true });
  s.addShape("roundRect", { x: 0.45, y: 4.7, w: 4.7, h: 1.4, rectRadius: 0.12, fill: { color: C.greenDark }, line: { color: C.green, width: 1.5 }, objectName: "파일로" });
  s.addText([{ text: "compose.yaml 에 적어 두기", options: { fontFace: F.body, fontSize: 14, bold: true, color: C.text, breakLine: true } },
    { text: "docker compose up -d", options: { fontFace: F.mono, fontSize: 12, bold: true, color: C.green } }],
    { x: 0.45, y: 4.7, w: 4.7, h: 1.4, align: "center", valign: "middle", margin: 0.05, isTextBox: true });
}

// 3) compose.yaml 만들기
{
  const s = slide("create", " (폴더 ~/myweb 안에서 실행. heredoc 은 입력한 내용을 파일로 저장하는 쉘 문법)");
  L.terminal(s, { lines: [{ t: PH + "cat > compose.yaml <<'EOF'", hl: true }, ...yaml.map((t) => ({ t })), { t: "EOF" }], label: "compose.yaml 만들기", tone: "pink", fontSize: 11 });
}

// 4a) services / web
{
  const s = slide("services");
  L.terminal(s, { lines: catView([iServices, iWeb]), label: "services: 서비스 목록", tone: "pink", fontSize: 11 });
}

// 4b) image / ports
{
  const s = slide("imagePorts");
  L.terminal(s, { lines: catView([iImage, iPorts, iPortVal]), label: "image, ports: docker run 옵션과 같음", tone: "pink", fontSize: 11 });
}

// 5) up (실제 출력 전체)
{
  const s = slide("up");
  L.terminal(s, {
    lines: [{ t: PH + "docker compose up -d" }, ...up.slice(1).map((t) => ({ t, hl: /Network .* Created|Container .* Started/.test(t) }))],
    label: "한 번에 실행: docker compose up -d", tone: "green", fontSize: 11,
  });
}

// 6) ps
{
  const s = slide("ps", " (일부 열 생략)");
  L.terminal(s, { lines: [{ t: PH + "docker compose ps" }, ...ps.map((t, i) => ({ t, dim: i === 0, hl: i === 1 }))], label: "서비스 상태: docker compose ps", tone: "green", fontSize: 11 });
}

// 7) 브라우저 (실제 캡처)
{
  const s = slide("browser");
  L.browserFrame(s, { path: out("browser.png"), url: "localhost:8080", aspect: 900 / 560, altText: "localhost:8080 에서 보이는 nginx 환영 페이지" });
}

// 8) down (실제 출력 전체)
{
  const s = slide("down");
  L.terminal(s, {
    lines: [{ t: PH + "docker compose down" }, ...down.slice(1).map((t) => ({ t, hl: /Removed/.test(t) }))],
    label: "한 번에 정리: docker compose down", tone: "pink", fontSize: 11,
  });
}

// 9) 요약
{
  const s = slide("sum");
  const rows = [["compose.yaml", "설정 파일"], ["up -d", "한 번에 실행"], ["ps", "상태 확인"], ["down", "한 번에 정리"]];
  rows.forEach(([cmd, desc], i) => {
    const y = 2.6 + i * 0.95;
    s.addShape("roundRect", { x: 0.45, y, w: 4.7, h: 0.8, rectRadius: 0.1, fill: { color: C.term }, line: { color: C.edge, width: 0.75 }, objectName: "요약행" + (i + 1) });
    s.addText(cmd, { x: 0.6, y, w: 2.3, h: 0.8, fontFace: F.mono, fontSize: 13, bold: true, color: C.pink, valign: "middle", margin: 0, isTextBox: true });
    s.addText(desc, { x: 2.95, y, w: 2.2, h: 0.8, fontFace: F.body, fontSize: 14, color: C.text, valign: "middle", margin: 0, isTextBox: true });
  });
}

// 10) 다음 회차 예고
{
  const s = slide("next");
  s.addShape("roundRect", { ...R.screen, rectRadius: 0.2, fill: { color: C.purple }, line: { color: C.pink, width: 1.5 }, objectName: "화면영역" });
  s.addText([{ text: "NEXT", options: { fontFace: F.mono, fontSize: 16, bold: true, color: C.pink, breakLine: true } },
    { text: "10회차", options: { fontSize: 20, breakLine: true } },
    { text: "Compose로 웹 + DB", options: { fontSize: 28 } }],
    { ...R.screen, fontFace: F.title, color: C.text, align: "center", valign: "middle", isTextBox: true, objectName: "다음회차" });
}

fs.writeFileSync(path.join(__dirname, "script.txt"), narration.join("\n") + "\n", "utf8");
pres.writeFile({ fileName: path.join(__dirname, "ep09.pptx") }).then((f) => console.log("saved", f));
