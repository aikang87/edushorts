// 사용법: node tools/screenshot.js <url> <out.png> [width height scale]  (scale=2 면 해상도 2배: 같은 화면을 크게 보이게 하려면 뷰포트를 줄이고 scale 을 올림)  - 헤드리스 Chromium 으로 실제 브라우저 화면 캡처
const { chromium } = require("playwright");
const fs = require("fs");
const [url, out, w = "900", h = "560", scale = "1"] = process.argv.slice(2);
const exe = ["/opt/pw-browsers/chromium", ...fs.readdirSync("/opt/pw-browsers").filter((d) => /^chromium-\d+$/.test(d)).map((d) => `/opt/pw-browsers/${d}/chrome-linux/chrome`)].find((p) => fs.existsSync(p) && fs.statSync(p).isFile());
(async () => {
  const browser = await chromium.launch(exe ? { executablePath: exe } : {});
  const page = await browser.newPage({ viewport: { width: +w, height: +h }, deviceScaleFactor: +scale });
  await page.goto(url);
  if (process.env.SCREENSHOT_WAIT_MS) await page.waitForTimeout(+process.env.SCREENSHOT_WAIT_MS); // JupyterLab 같이 늦게 그려지는 화면용
  await page.screenshot({ path: out });
  await browser.close();
  console.log("saved", out);
})();
