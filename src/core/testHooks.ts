import { test as base } from "@playwright/test";
import fs from "fs";
import { getLogFilePath } from "../reporting/logger";

export const test = base;

test.afterEach(async ({ page }, testInfo) => {
  // Attach your run log file to Playwright report
  const logFile = getLogFilePath();
  if (fs.existsSync(logFile)) {
    await testInfo.attach("run.log", { path: logFile, contentType: "text/plain" });
  }

  // If the test failed, attach a screenshot to the report as well
  if (testInfo.status !== testInfo.expectedStatus) {
    const screenshot = await page.screenshot({ fullPage: true });
    await testInfo.attach("failure-screenshot", {
      body: screenshot,
      contentType: "image/png",
    });
  }
});