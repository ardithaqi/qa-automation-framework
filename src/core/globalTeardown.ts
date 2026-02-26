import fs from "fs";
import path from "path";
import { analyzeFailureFile } from "../ai/failureAnalyzer";

export default async function globalTeardown() {
    if (process.env.AI_ANALYSIS !== "true") return;

    const failureDir = path.join("artifacts", "failures");

    if (!fs.existsSync(failureDir)) return;

    const jsonFiles = fs
        .readdirSync(failureDir)
        .filter((f) => f.endsWith(".json"));

    if (jsonFiles.length === 0) return;

    console.log("\nRunning AI failure analysis per test...\n");

    for (const file of jsonFiles) {
        const jsonPath = path.join(failureDir, file);

        console.log(`Analyzing: ${file}`);

        const analysis = await analyzeFailureFile(jsonPath);

        if (!analysis) continue;

        const outputFile = jsonPath.replace(".json", ".ai.txt");

        fs.writeFileSync(outputFile, analysis);

        console.log(`Saved AI analysis: ${path.basename(outputFile)}\n`);
    }
}