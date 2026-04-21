import fs from "node:fs/promises";
import path from "node:path";

const budgets = [
  { label: "max html", file: "dist/index.html", maxBytes: 35 * 1024 },
  { label: "max css asset", globDir: "dist/assets", extension: ".css", maxBytes: 80 * 1024 },
  { label: "max js asset", globDir: "dist/assets", extension: ".js", maxBytes: 40 * 1024 },
  { label: "max optimized image", globDir: "photo/optimized", extension: ".webp", maxBytes: 220 * 1024 },
];

const projectRoot = process.cwd();

async function listFiles(dirPath) {
  const entries = await fs.readdir(dirPath, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(dirPath, entry.name);
      if (entry.isDirectory()) {
        return listFiles(fullPath);
      }
      return [fullPath];
    }),
  );

  return files.flat();
}

async function assertBudget(budget) {
  if (budget.file) {
    const fullPath = path.join(projectRoot, budget.file);
    const stats = await fs.stat(fullPath);
    if (stats.size > budget.maxBytes) {
      throw new Error(
        `${budget.label} failed: ${budget.file} is ${stats.size} bytes (limit ${budget.maxBytes})`,
      );
    }
    return;
  }

  const targetDir = path.join(projectRoot, budget.globDir);
  const files = await listFiles(targetDir);
  const targetFiles = files.filter((file) => file.endsWith(budget.extension));

  for (const file of targetFiles) {
    const stats = await fs.stat(file);
    if (stats.size > budget.maxBytes) {
      throw new Error(
        `${budget.label} failed: ${path.relative(projectRoot, file)} is ${stats.size} bytes (limit ${budget.maxBytes})`,
      );
    }
  }
}

async function run() {
  for (const budget of budgets) {
    await assertBudget(budget);
  }
  console.log("All performance budgets passed.");
}

run().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
