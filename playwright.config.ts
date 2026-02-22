import { defineConfig } from "@playwright/test";
import { env } from "./src/config/env";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  workers: env.PW_WORKERS,
  retries: env.PW_RETRIES,
  timeout: 30_000,

  use: {
    baseURL: env.BASE_URL,
    headless: env.HEADLESS,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },

  outputDir: "test-results",

  reporter: [
    ["list"],
    ["html", { open: "never", outputFolder: "playwright-report" }],
  ],
});