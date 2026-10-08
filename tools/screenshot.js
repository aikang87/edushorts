// 사용법: node tools/screenshot.js <url> <out.png> [width height]  - 헤드리스 Chromium 으로 실제 브라우저 화면 캡처
const { chromium } = require("playwright");
const fs = require("fs");
const [url, out, w = "900", h = "560"] = process.argv.slice(2);
const exe = ["/opt/pw-browsers/chromium", ...fs.readdirSync("/opt/pw-browsers").filter((d) => /^chromium-\d+$/.test(d)).map((d) => `/opt/pw-browsers/${d}/chrome-linux/chrome`)].find((p) => fs.existsSync(p) && fs.statSync(p).isFile());
(async () => {
  const browser = await chromium.launch(exe ? { executablePath: exe } : {});
  const page = await browser.newPage({ viewport: { width: +w, height: +h } });
  await page.goto(url);
  await page.screenshot({ path: out });
  await browser.close();
  console.log("saved", out);
})();
