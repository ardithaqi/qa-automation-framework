import { test as base, expect } from "@playwright/test";
import { logger } from "../reporting/logger";
import { env } from "../config/env";
import "./testHooks";

type FrameworkFixtures = {
  logStep: (msg: string) => Promise<void>;
};

export const test = base.extend<FrameworkFixtures>({
  logStep: async ({}, use, testInfo) => {
    await use(async (msg: string) => {
      logger.info(`[${testInfo.title}] ${msg}`);
    });
  },
});

export { expect, env };