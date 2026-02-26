import fs from "fs";
import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function analyzeFailureFile(jsonFilePath: string): Promise<string | null> {
    const htmlPath = jsonFilePath.replace(".json", ".html");

    const meta = JSON.parse(fs.readFileSync(jsonFilePath, "utf-8"));
    const html = fs.existsSync(htmlPath)
        ? fs.readFileSync(htmlPath, "utf-8")
        : "";

    const prompt = `
  You are a senior QA automation engineer analyzing a failed Playwright test.
  
  Failure metadata:
  ${JSON.stringify(meta, null, 2)}
  
  The test failed due to this error:
  ${meta.errorMessage}
  
  DOM snapshot (first 4000 chars):
  ${html.substring(0, 4000)}
  
  Provide:
  1. Root cause explanation
  2. Failure type (logic or UI)
  3. Suggested next debugging step
  `;

    const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
    });

    return response.choices[0].message.content ?? null;
}