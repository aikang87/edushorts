// 쇼츠 PPT 공통 양식 (5.625" x 10", 9:16). 기준 양식: 7슬라이드 샘플 pptx
const pptxgen = require("pptxgenjs");
const fs = require("fs");

const SERIES_TITLE = "VSCODE와 Docker로 만드는\n생성형AI";
const C = {
  bg: "1E1F29", text: "F5F6FA", term: "13141C", dim: "6B7280",
  pink: "FF79C6", green: "50FA7B", purple: "3B2F55", greenDark: "24473A", edge: "393B4A",
};
const F = { title: "HY견고딕", body: "맑은 고딕", mono: "Courier New" };
// 양식 좌표(인치)
const R = {
  title: { x: 0.229, y: 1.267, w: 5.1, h: 0.909 },
  screen: { x: 0.285, y: 2.409, w: 5.098, h: 3.889 },
  caption: { x: 0.285, y: 6.575, w: 5.098, h: 1.37 },
};

function newDeck(name) {
  const pres = new pptxgen();
  pres.defineLayout({ name: "SHORTS", width: 5.625, height: 10 });
  pres.layout = "SHORTS";
  pres.title = name;
  return pres;
}

// 공통 프레임: 배경 + 타이틀 + 자막. 노트에는 나레이션 대본.
function baseSlide(pres, { title, caption, notes }) {
  const s = pres.addSlide();
  s.background = { color: C.bg };
  s.addText(title, {
    ...R.title, fontFace: F.title, fontSize: 24, color: C.text, align: "left",
    valign: "middle", margin: 0, isTextBox: true, objectName: "타이틀",
  });
  s.addText(caption, {
    ...R.caption, fontFace: F.body, fontSize: 15, color: C.text, align: "center",
    valign: "middle", margin: 0.05, isTextBox: true, objectName: "자막영역",
  });
  if (notes) s.addNotes(notes);
  return s;
}

// 터미널: lines = [{t, hl?: true}] ; 프롬프트(user@PC:~$)는 초록색으로 표시
// fontSize(pt)에 비례한 고정 줄 간격. Courier New 글자폭 = fontSize*0.6/72 인치 -> 박스 안 약 4.67"
function terminal(s, { lines, label, tone = "pink", tab = "terminal", fontSize = 11 }) {
  const LINE_H = Math.round(fontSize * 1.6);
  const hlColor = tone === "green" ? C.green : C.pink;
  const stripColor = tone === "green" ? C.greenDark : C.purple;
  const bx = 0.433, by = 3.092, bw = 4.95, bh = 2.323;
  s.addShape("roundRect", { x: bx, y: 2.63, w: 1.687, h: 0.349, rectRadius: 0.06, fill: { color: C.term }, line: { color: C.edge, width: 0.75 }, objectName: "터미널탭" });
  s.addText(tab, { x: bx, y: 2.63, w: 1.687, h: 0.349, fontFace: F.mono, fontSize: 11.25, bold: true, color: C.text, align: "center", valign: "middle", margin: 0, isTextBox: true });
  s.addShape("roundRect", { x: bx, y: by, w: bw, h: bh, rectRadius: 0.08, fill: { color: C.term }, line: { color: C.edge, width: 0.75 }, objectName: "터미널박스" });
  const tx = bx + 0.14, ty = by + 0.14, tw = bw - 0.28;
  // 줄마다 텍스트 박스를 따로 두고 강조 박스를 같은 좌표에 겹침 -> 렌더러(PowerPoint/LibreOffice) 차이 없이 정렬됨
  const lh = LINE_H / 72;
  lines.forEach((ln, i) => {
    const y = ty + i * lh;
    const m = ln.t.match(/^(user@PC:[^$ ]*\$ )(.*)$/); // user@PC:~$ 또는 user@PC:~/폴더$
    const runs = m
      ? [{ text: m[1], options: { color: C.green, bold: true } }, { text: m[2], options: { color: C.text } }]
      : [{ text: ln.t, options: { color: ln.dim ? C.dim : C.text } }];
    s.addText(runs, { x: tx, y, w: tw, h: lh, fontFace: F.mono, fontSize, valign: "middle", margin: 0, wrap: false, isTextBox: true, objectName: "터미널줄" + (i + 1) });
    if (ln.hlCols) {
      const cw = (fontSize * 0.6) / 72; // Courier New 글자폭
      s.addShape("roundRect", { x: tx + ln.hlCols[0] * cw - 0.05, y: y - 0.01, w: (ln.hlCols[1] - ln.hlCols[0]) * cw + 0.1, h: lh + 0.02, rectRadius: 0.05, fill: { color: C.term, transparency: 100 }, line: { color: hlColor, width: 1.75 }, objectName: "강조열" });
    }
    if (ln.hl) s.addShape("roundRect", { x: bx + 0.07, y: y - 0.01, w: bw - 0.14, h: lh + 0.02, rectRadius: 0.05, fill: { color: C.term, transparency: 100 }, line: { color: hlColor, width: 1.75 }, objectName: "강조" });
  });
  s.addShape("roundRect", { x: bx, y: 5.64, w: bw, h: 0.42, rectRadius: 0.06, fill: { color: stripColor }, line: { color: stripColor, width: 0.5 }, objectName: "설명라벨" });
  s.addText(label, { x: bx, y: 5.64, w: bw, h: 0.42, fontFace: F.body, fontSize: 12, bold: true, color: C.text, align: "center", valign: "middle", margin: 0, isTextBox: true });
}

// output/*.txt 읽기 → 줄 배열
function readOut(file) { return fs.readFileSync(file, "utf8").replace(/\n$/, "").split("\n"); }

// 표 형태 출력에서 지정한 열만 남김 (헤더 위치 기준, 값은 원문 그대로, 열 간격 3칸)
function pickColumns(lines, keep) {
  const hdr = lines[0];
  const names = hdr.trim().split(/\s{2,}/);
  const pos = names.map((n) => hdr.indexOf(n));
  const idx = keep.map((k) => names.indexOf(k));
  const cell = (ln, i) => ln.slice(pos[i], i + 1 < pos.length ? pos[i + 1] : undefined).trim();
  const rows = lines.map((ln) => idx.map((i) => cell(ln, i)));
  const widths = idx.map((_, j) => Math.max(...rows.map((r) => r[j].length)));
  return rows.map((r) => r.map((v, j) => (j === r.length - 1 ? v : v.padEnd(widths[j] + 3))).join(""));
}


// 브라우저 프레임(주소창) + 실제 캡처 이미지. aspect = 캡처 가로/세로, y 기본값은 화면영역 세로 중앙
function browserFrame(s, { path, url, aspect, y, altText }) {
  const x = 0.35, w = 4.9, barH = 0.42, imgH = w / aspect;
  const top = y ?? R.screen.y + (R.screen.h - (barH + imgH)) / 2;
  s.addShape("roundRect", { x, y: top, w, h: barH + imgH, rectRadius: 0.08, fill: { color: "FFFFFF" }, line: { color: C.edge, width: 1 }, objectName: "브라우저프레임" });
  s.addShape("rect", { x: x + 0.02, y: top + 0.02, w: w - 0.04, h: barH - 0.02, fill: { color: "E8EAED" }, line: { color: "E8EAED", width: 0.25 }, objectName: "주소창영역" });
  s.addShape("roundRect", { x: x + 0.15, y: top + 0.07, w: w - 0.3, h: 0.28, rectRadius: 0.14, fill: { color: "FFFFFF" }, line: { color: "D0D3D8", width: 0.5 }, objectName: "주소창" });
  s.addText(url, { x: x + 0.3, y: top + 0.07, w: w - 0.6, h: 0.28, fontFace: "Arial", fontSize: 12, color: "202124", valign: "middle", margin: 0, isTextBox: true });
  s.addImage({ path, x: x + 0.02, y: top + barH, w: w - 0.04, h: imgH - 0.02, altText: altText || `${url} 브라우저 화면` });
}

// 터미널 폭에 맞춰 공백 기준으로 줄바꿈 (실제 터미널의 자동 줄바꿈처럼)
function wrapLine(t, n) {
  const out = []; let cur = "";
  for (const word of t.split(" ")) {
    if ((cur + " " + word).trim().length > n && cur) { out.push(cur); cur = word; } else cur = (cur ? cur + " " : "") + word;
  }
  if (cur) out.push(cur);
  return out;
}

const trunc = (t, n) => (t.length > n ? t.slice(0, n) + "…" : t);

module.exports = { newDeck, baseSlide, terminal, readOut, pickColumns, trunc, browserFrame, wrapLine, C, F, R, SERIES_TITLE };
