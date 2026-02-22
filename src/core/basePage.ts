import { Page } from "@playwright/test";
import { env } from "./baseTest";

export class BasePage {
  protected page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto(pathname: string) {
    await this.page.goto(`${env.BASE_URL}${pathname}`);
  }
}