import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const projectRoot = process.cwd();
const inputDir = path.join(projectRoot, "photo");
const outputDir = path.join(projectRoot, "photo", "optimized");

const configs = [
  { name: "header", source: "header.jpg", widths: [480, 768, 1200], quality: 74 },
  { name: "ph-1", source: "ph-1.jpg", widths: [640, 960, 1280], quality: 72 },
  { name: "ph-2", source: "ph-2.jpg", widths: [640, 960, 1280], quality: 72 },
  { name: "ph-3", source: "ph-3.jpg", widths: [640, 960, 1280], quality: 72 },
  { name: "ph-4", source: "ph-4.jpg", widths: [640, 960, 1280], quality: 72 },
  { name: "ph-5", source: "ph-5.jpg", widths: [640, 960, 1280], quality: 72 },
];

async function ensureDir(dirPath) {
  await fs.mkdir(dirPath, { recursive: true });
}

async function fileSize(filePath) {
  const stats = await fs.stat(filePath);
  return stats.size;
}

function toKB(bytes) {
  return `${(bytes / 1024).toFixed(1)} KB`;
}

async function generateOptimizedAssets() {
  await ensureDir(outputDir);

  let totalSourceBytes = 0;
  let totalOutputBytes = 0;

  for (const config of configs) {
    const inputPath = path.join(inputDir, config.source);
    const sourceBytes = await fileSize(inputPath);
    totalSourceBytes += sourceBytes;

    for (const width of config.widths) {
      const outputFileName = `${config.name}-${width}.webp`;
      const outputPath = path.join(outputDir, outputFileName);

      await sharp(inputPath)
        .resize({ width, withoutEnlargement: true })
        .webp({ quality: config.quality, effort: 5 })
        .toFile(outputPath);

      totalOutputBytes += await fileSize(outputPath);
    }
  }

  const reduction = ((1 - totalOutputBytes / totalSourceBytes) * 100).toFixed(1);

  console.log("Image optimization completed.");
  console.log(`Source total: ${toKB(totalSourceBytes)}`);
  console.log(`Output total: ${toKB(totalOutputBytes)}`);
  console.log(`Reduction: ${reduction}%`);
}

generateOptimizedAssets().catch((error) => {
  console.error(error);
  process.exit(1);
});
