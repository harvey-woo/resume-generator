#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { execSync } from "child_process";

console.log("🧪 测试可执行文件功能...\n");

// 测试项目结构
console.log("1. 检查项目结构...");
const requiredPaths = ["input", "template/resume.hbs", "package.json"];
let structureOk = true;

for (const pathToCheck of requiredPaths) {
  if (fs.existsSync(pathToCheck)) {
    console.log(`   ✓ ${pathToCheck}`);
  } else {
    console.log(`   ❌ ${pathToCheck}`);
    structureOk = false;
  }
}

if (!structureOk) {
  console.log("\n❌ 项目结构不完整！");
  process.exit(1);
}

// 测试可执行文件是否存在
console.log("\n2. 检查可执行文件...");
const exePath = path.join("build", "resume-generator-win.exe");

if (fs.existsSync(exePath)) {
  console.log(`   ✓ ${exePath}`);
} else {
  console.log(`   ❌ ${exePath} 不存在`);
  console.log("   请先运行 'npm run package' 生成可执行文件");
  process.exit(1);
}

// 测试构建
console.log("\n3. 测试构建功能...");
try {
  console.log("   生成HTML文件...");
  execSync("npx tsx src/generator.ts", { stdio: "inherit" });
  
  console.log("   生成PDF文件...");
  execSync("npx tsx src/pdf-generator.ts", { stdio: "inherit" });
  
  console.log("   ✓ 构建功能正常");
} catch (error) {
  console.log("   ❌ 构建失败:", (error as Error).message);
  process.exit(1);
}

// 检查输出文件
console.log("\n4. 检查输出文件...");
const outputDir = "output";
if (fs.existsSync(outputDir)) {
  const files = fs.readdirSync(outputDir);
  const htmlFiles = files.filter(f => f.endsWith(".html"));
  const pdfFiles = files.filter(f => f.endsWith(".pdf"));
  
  console.log(`   HTML文件: ${htmlFiles.length} 个`);
  htmlFiles.forEach(file => console.log(`   ✓ ${file}`));
  
  console.log(`   PDF文件: ${pdfFiles.length} 个`);
  pdfFiles.forEach(file => console.log(`   ✓ ${file}`));
  
  if (htmlFiles.length > 0 && pdfFiles.length > 0) {
    console.log("   ✓ 输出文件检查通过");
  } else {
    console.log("   ❌ 缺少输出文件");
  }
} else {
  console.log("   ❌ output目录不存在");
}

console.log("\n🎉 测试完成！");
