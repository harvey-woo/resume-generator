import fs from "fs";
import path from "path";

function showProjectStatus(): void {
  console.log("📋 简历生成器项目状态 (TypeScript版本)\n");

  const distDir = path.join(__dirname, "dist");

  if (!fs.existsSync(distDir)) {
    console.log("❌ dist目录不存在");
    return;
  }

  const files = fs.readdirSync(distDir);
  const htmlFiles = files.filter((f) => f.endsWith(".html"));
  const pdfFiles = files.filter((f) => f.endsWith(".pdf"));

  console.log("📁 生成的文件:");
  console.log(`   HTML文件: ${htmlFiles.length} 个`);
  htmlFiles.forEach((file) => console.log(`   ✓ ${file}`));

  console.log(`   PDF文件: ${pdfFiles.length} 个`);
  pdfFiles.forEach((file) => console.log(`   ✓ ${file}`));

  console.log("\n🔧 可用命令:");
  console.log("   npm run build      - 生成所有文件");
  console.log("   npm run build:html - 只生成HTML");
  console.log("   npm run build:pdf  - 只生成PDF");
  console.log("   npm run clean      - 清理PDF文件");
  console.log("   npm run type-check - TypeScript类型检查");
  console.log("   tsx status.ts      - 显示此状态");
}

showProjectStatus();
