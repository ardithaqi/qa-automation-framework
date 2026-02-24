import { test as base } from "@playwright/test";
import fs from "fs";
import { getLogFilePath } from "../reporting/logger";
import path from "path";

export const test = base;

test.afterEach(async ({ page }, testInfo) => {
  const logFile = getLogFilePath();
  if (fs.existsSync(logFile)) {
    await testInfo.attach("run.log", {
      path: logFile,
      contentType: "text/plain",
    });
  }

  const isFailed = testInfo.status !== testInfo.expectedStatus;

  if (isFailed) {
    const screenshot = await page.screenshot({ fullPage: true });
    await testInfo.attach("failure-screenshot", {
      body: screenshot,
      contentType: "image/png",
    });
    const failureDir = path.join("artifacts", "failures");

    if (!fs.existsSync(failureDir)) {
      fs.mkdirSync(failureDir, { recursive: true });
    }

    const safeTitle = testInfo.title.replace(/[^\w\d]/g, "_");

    const html = await page.content();
    fs.writeFileSync(
      path.join(failureDir, `${safeTitle}.html`),
      html
    );

    const meta = {
      title: testInfo.title,
      status: testInfo.status,
      expectedStatus: testInfo.expectedStatus,
      errorMessage: testInfo.error?.message,
      stack: testInfo.error?.stack,
      url: page.url(),
      project: testInfo.project.name,
      duration: testInfo.duration,
    };

    fs.writeFileSync(
      path.join(failureDir, `${safeTitle}.json`),
      JSON.stringify(meta, null, 2)
    );
  }
});