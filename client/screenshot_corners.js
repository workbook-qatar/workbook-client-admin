import puppeteer from 'puppeteer';

(async () => {
  try {
    const browser = await puppeteer.launch({
      headless: "new"
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    await page.goto('http://localhost:3001/staff/1', { waitUntil: 'networkidle2' });
    await page.screenshot({ path: 'C:\\Users\\aldobi-001\\.gemini\\antigravity\\brain\\e3d8cd0d-b28a-417b-8e4c-b763aded7924\\verify_corners_retry.png', fullPage: true });
    await browser.close();
    console.log("Screenshot saved!");
  } catch (e) {
    console.error(e);
  }
})();
