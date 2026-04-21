import fs from "node:fs/promises";
import path from "node:path";

const projectRoot = process.cwd();
const sourceFiles = [
  "index.html",
  "css/style.css",
  "js/script.js",
  "photo/optimized/header-1200.webp",
  "photo/optimized/ph-1-1280.webp",
  "photo/optimized/ph-2-1280.webp",
  "photo/optimized/ph-3-1280.webp",
  "photo/optimized/ph-4-1280.webp",
  "photo/optimized/ph-5-1280.webp",
];

async function getSize(filePath) {
  const absolute = path.join(projectRoot, filePath);
  const stats = await fs.stat(absolute);
  return stats.size;
}

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

function bytesToKB(value) {
  return `${(value / 1024).toFixed(1)} KB`;
}

async function writeReport() {
  const sourceMetrics = await Promise.all(
    sourceFiles.map(async (filePath) => ({ filePath, size: await getSize(filePath) })),
  );
  const sourceTotal = sourceMetrics.reduce((acc, item) => acc + item.size, 0);

  const optimizedDir = path.join(projectRoot, "photo", "optimized");
  const optimizedFiles = (await listFiles(optimizedDir))
    .filter((file) => file.endsWith(".webp"))
    .sort();
  const optimizedMetrics = await Promise.all(
    optimizedFiles.map(async (file) => ({
      filePath: path.relative(projectRoot, file),
      size: (await fs.stat(file)).size,
    })),
  );
  const optimizedTotal = optimizedMetrics.reduce((acc, item) => acc + item.size, 0);

  const reportLines = [
    "# Performance Metrics (After Optimization)",
    "",
    `Date: ${new Date().toISOString().slice(0, 10)}`,
    "",
    "## Source key files",
    ...sourceMetrics.map((entry) => `- \`${entry.filePath}\`: ${entry.size} bytes (${bytesToKB(entry.size)})`),
    `- Total: ${sourceTotal} bytes (${bytesToKB(sourceTotal)})`,
    "",
    "## Optimized gallery assets",
    ...optimizedMetrics.map((entry) => `- \`${entry.filePath}\`: ${entry.size} bytes (${bytesToKB(entry.size)})`),
    `- Total optimized assets: ${optimizedTotal} bytes (${bytesToKB(optimizedTotal)})`,
    "",
    `Current optimized image footprint (full responsive set): ${optimizedTotal} bytes (${bytesToKB(optimizedTotal)})`,
  ];

  await fs.writeFile(path.join(projectRoot, "performance-report.md"), `${reportLines.join("\n")}\n`, "utf8");
  console.log("Generated performance-report.md");
}

writeReport().catch((error) => {
  console.error(error);
  process.exit(1);
});
