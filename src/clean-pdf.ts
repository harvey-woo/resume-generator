import fs from "fs";
import path from "path";

// 清理output目录中的PDF文件
export function cleanPDFFiles(): void {
  const outputDir = path.join(process.cwd(), "output");

  if (!fs.existsSync(outputDir)) {
    console.log("output目录不存在");
    return;
  }

  const files = fs.readdirSync(outputDir);
  const pdfFiles = files.filter((file) => file.endsWith(".pdf"));

  if (pdfFiles.length === 0) {
    console.log("没有找到PDF文件");
    return;
  }

  let deletedCount = 0;
  let failedCount = 0;

  pdfFiles.forEach((pdfFile) => {
    const pdfPath = path.join(outputDir, pdfFile);
    try {
      fs.unlinkSync(pdfPath);
      console.log(`✓ 删除成功: ${pdfFile}`);
      deletedCount++;
    } catch (error) {
      console.log(`✗ 删除失败: ${pdfFile} (${(error as Error).message})`);
      failedCount++;
    }
  });

  console.log(
    `\n清理完成: 成功删除 ${deletedCount} 个文件，失败 ${failedCount} 个文件`
  );

  if (failedCount > 0) {
    console.log("\n提示: 如果删除失败，请确保没有程序正在使用这些PDF文件");
  }
}

// 如果直接运行此文件，执行清理
if (require.main === module) {
  cleanPDFFiles();
}
